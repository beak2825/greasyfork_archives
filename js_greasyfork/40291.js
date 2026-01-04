// ==UserScript==
// @name         List Bundle Keys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Maboroshi
// @match        *://www.fanatical.com/en/orders/*
// @match        *://www.humblebundle.com/downloads?key=*
// @downloadURL https://update.greasyfork.org/scripts/40291/List%20Bundle%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/40291/List%20Bundle%20Keys.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let config = {
        //提取key的間隔
        RevealKeyInterval: 256,
        //檢查key狀態間隔
        CheckKeyInterval: 256
    };
    class NameKeyPair {
        constructor(name, key) {
            this.Name = name.trim();
            this.Key = key.trim();
        }
    }
    class Utility {
        static Sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        static AddPairToMap(map, pair) {
            let trimedName = pair.Name;
            if (map.has(trimedName) == false) {
                map.set(trimedName, []);
            }
            map.get(trimedName).push(pair.Key);
        }
        static MapToStringForSG(map) {
            let content = '';
            for (let item of map) {
                let piece = item[0];
                for (let key of item[1]) {
                    piece += `\n${key}`;
                }
                content += `${piece}\n\n`;
            }
            return content.substring(0, content.length - 2);
        }
        static MapToStringForASF(map) {
            let content = '';
            for (let item of map) {
                let piece = '';
                for (let key of item[1]) {
                    piece += `${key},`;
                }
                content += piece;
            }
            return content.substring(0, content.length - 1);
        }
        static GetFirstTextNodeValue(item) {
            for (var i = 0; i < item.childNodes.length; i++) {
                if (item.childNodes[i].nodeType == Node.TEXT_NODE && item.childNodes[i].nodeValue.trim() != '') {
                    return item.childNodes[i].nodeValue;
                }
            }
        }
    }
    class CommonSiteHelper {
        static TryGetPairFromItem(item, nameSelector, keySelector, nameElementFunc, keyElementFunc) {
            let nameElement = item.querySelector(nameSelector);
            let keyElement = item.querySelector(keySelector);
            if (nameElement != null && keyElement != null) {
                return new NameKeyPair(nameElementFunc(nameElement), keyElementFunc(keyElement));
            }
            else {
                return null;
            }
        }
    }
    class FanaticalHelper {
        *ListRevealed() {
            let items = document.querySelectorAll('.order-item');
            for (var i = 0; i < items.length; i++) {
                let nameKeyPair = this.TryGetPairFromItem(items[i]);
                if (nameKeyPair != null) {
                    yield nameKeyPair;
                }
            }
        }
        *GetUnrevealedKeys() {
            let items = document.querySelectorAll('.order-item');
            for (var i = 0; i < items.length; i++) {
                let textRight = items[i].querySelector('.text-right');
                let revealButton = textRight.querySelector('button');
                if (revealButton != null) {
                    revealButton.click();
                    yield items[i];
                }
            }
        }
        TryGetPairFromItem(item) {
            return CommonSiteHelper.TryGetPairFromItem(item, '.flex-column', '.text-right input', (elem) => elem.textContent, (elem) => elem.value);
        }
        IsAllBeenRevealed() {
            let revealButton = document.querySelector('.order-item .text-right button');
            return revealButton == null;
        }
    }
    class HumbleBundleHelper {
        *ListRevealed() {
            let items = document.querySelectorAll('.key-redeemer');
            for (var i = 0; i < items.length; i++) {
                let nameKeyPair = this.TryGetPairFromItem(items[i]);
                if (nameKeyPair != null) {
                    yield nameKeyPair;
                }
            }
        }
        *GetUnrevealedKeys() {
            let items = document.querySelectorAll('.key-redeemer');
            for (var i = 0; i < items.length; i++) {
                let revealButton = items[i].querySelector('div[title="Reveal your Steam key"]');
                if (revealButton != null) {
                    revealButton.click();
                    yield items[i];
                }
            }
        }
        TryGetPairFromItem(item) {
            return CommonSiteHelper.TryGetPairFromItem(item, '.heading-text h4', '.redeemed .keyfield-value', (elem) => Utility.GetFirstTextNodeValue(elem), (elem) => Utility.GetFirstTextNodeValue(elem));
        }
        IsAllBeenRevealed() {
            let items = document.querySelectorAll('.order-item');
            for (var i = 0; i < items.length; i++) {
                if (this.TryGetPairFromItem(items[i]) == null) {
                    return false;
                }
            }
            return true;
        }
    }
    class MainWindow {
        constructor(siteName) {
            this.blocks = [];
            this.buttons = [];
            this.radios = [];
            this.siteName = siteName;
            this.mainWindow = document.createElement('div');
            this.AddTitleBar();
            this.AddBlocks();
            this.AddRadios();
            this.AddButtons();
            this.AddTextArea();
            this.AddCommonStyle();
            this.AddSiteStyle();
            this.AddButtonEvents();
        }
        AddToPage() {
            switch (this.siteName) {
                case 0 /* Fanatical */:
                    this.InsertAfter('.mb-4');
                    break;
                case 1 /* HumbleBundle */:
                    this.InsertAfter('.js-subproduct-whitebox-holder');
                    break;
            }
        }
        AddTitleBar() {
            this.titleBar = document.createElement('div');
            this.titleBar.textContent = 'List Bundle Keys';
            this.mainWindow.appendChild(this.titleBar);
        }
        AddBlocks() {
            this.blocks.push(document.createElement('div'));
            this.blocks.push(document.createElement('div'));
            this.mainWindow.appendChild(this.blocks[0 /* RadioGroup */]);
            this.mainWindow.appendChild(this.blocks[1 /* ButtonGroup */]);
        }
        AddRadios() {
            let Label_SG = document.createElement('label');
            Label_SG.htmlFor = 'SGFormat';
            Label_SG.textContent = 'SG格式';
            let Label_ASF = document.createElement('label');
            Label_ASF.htmlFor = 'ASFFormat';
            Label_ASF.textContent = 'ASF格式';
            let RadioTemplate = document.createElement('input');
            RadioTemplate.type = 'radio';
            RadioTemplate.name = 'format';
            this.radios.push(RadioTemplate.cloneNode());
            this.radios.push(RadioTemplate.cloneNode());
            this.radios[0 /* SGFormat */].id = 'SGFormat';
            this.radios[0 /* SGFormat */].checked = true;
            this.radios[1 /* ASFFormat */].id = 'ASFFormat';
            this.blocks[0 /* RadioGroup */].appendChild(this.radios[0 /* SGFormat */]);
            this.blocks[0 /* RadioGroup */].appendChild(Label_SG);
            this.blocks[0 /* RadioGroup */].appendChild(this.radios[1 /* ASFFormat */]);
            this.blocks[0 /* RadioGroup */].appendChild(Label_ASF);
        }
        AddButtons() {
            this.buttons.push(document.createElement('div'));
            this.buttons.push(document.createElement('div'));
            this.buttons.push(document.createElement('div'));
            this.buttons[0 /* ListAll */].textContent = '列出全部';
            this.buttons[1 /* ListRevealed */].textContent = '列出已領取';
            this.buttons[2 /* ListUnrevealed */].textContent = '列出未領取';
            this.blocks[1 /* ButtonGroup */].appendChild(this.buttons[0 /* ListAll */]);
            this.blocks[1 /* ButtonGroup */].appendChild(this.buttons[1 /* ListRevealed */]);
            this.blocks[1 /* ButtonGroup */].appendChild(this.buttons[2 /* ListUnrevealed */]);
        }
        AddTextArea() {
            this.textArea = document.createElement('textarea');
            this.mainWindow.appendChild(this.textArea);
        }
        AddCommonStyle() {
            this.mainWindow.style.width = '100%';
            this.mainWindow.style.display = 'flex';
            this.mainWindow.style.flexDirection = 'column';
            this.mainWindow.style.marginBottom = '1em';
            this.titleBar.style.lineHeight = '1.5em';
            this.titleBar.style.height = '1.5em';
            this.titleBar.style.textAlign = 'center';
            for (let block of this.blocks) {
                block.style.display = 'flex';
                block.style.justifyContent = 'center';
            }
            for (let radio of this.radios) {
                radio.style.margin = '0.3em 0.25em auto 1em';
            }
            for (let button of this.buttons) {
                button.style.margin = '0.5em 1em';
                button.style.cursor = 'pointer';
            }
            this.textArea.style.height = '16em';
        }
        AddSiteStyle() {
            switch (this.siteName) {
                case 0 /* Fanatical */:
                    this.mainWindow.classList.add('order-details');
                    this.titleBar.classList.add('bg-inverse');
                    for (let button of this.buttons) {
                        button.classList.add('btn');
                        button.classList.add('btn-secondary');
                    }
                    this.textArea.classList.add('form-control');
                    break;
                case 1 /* HumbleBundle */:
                    this.mainWindow.classList.add('whitebox-redux');
                    for (let button of this.buttons) {
                        button.style.background = '#F1F3F6';
                        button.style.border = '1px solid #C9CCD3';
                        button.style.borderRadius = '3px';
                        button.style.padding = '10px';
                    }
                    break;
            }
        }
        AddButtonEvents() {
            let siteHelper;
            switch (this.siteName) {
                case 0 /* Fanatical */:
                    siteHelper = new FanaticalHelper();
                    break;
                case 1 /* HumbleBundle */:
                    siteHelper = new HumbleBundleHelper();
                    break;
            }
            this.buttons[0 /* ListAll */].addEventListener('click', async () => {
                this.buttons[2 /* ListUnrevealed */].click();
                while (siteHelper.IsAllBeenRevealed() == false) {
                    await Utility.Sleep(config.CheckKeyInterval * 2);
                }
                this.buttons[1 /* ListRevealed */].click();
            });
            this.buttons[1 /* ListRevealed */].addEventListener('click', () => {
                let map = new Map();
                for (let item of siteHelper.ListRevealed()) {
                    Utility.AddPairToMap(map, item);
                }
                this.textArea.value = this.radios[0 /* SGFormat */].checked ? Utility.MapToStringForSG(map) : Utility.MapToStringForASF(map);
            });
            this.buttons[2 /* ListUnrevealed */].addEventListener('click', async () => {
                let map = new Map();
                for (let element of siteHelper.GetUnrevealedKeys()) {
                    new Promise(async (resolve) => {
                        let pair;
                        do {
                            await Utility.Sleep(config.CheckKeyInterval);
                            pair = siteHelper.TryGetPairFromItem(element);
                        } while (pair == null);
                        Utility.AddPairToMap(map, pair);
                        resolve();
                    }).then(() => {
                        if (siteHelper.IsAllBeenRevealed() == true) {
                            this.textArea.value = this.radios[0 /* SGFormat */].checked ? Utility.MapToStringForSG(map) : Utility.MapToStringForASF(map);
                        }
                    });
                    await Utility.Sleep(config.RevealKeyInterval);
                }
            });
        }
        InsertAfter(selectors) {
            this.Insert(selectors, false);
        }
        InsertBefore(selectors) {
            this.Insert(selectors, true);
        }
        Insert(selectors, insertBefor) {
            let intervalHandler = setInterval(() => {
                let insertPosition = document.querySelector(selectors);
                if (insertPosition != null) {
                    insertPosition.parentElement.insertBefore(this.mainWindow, insertBefor ? insertPosition : insertPosition.nextSibling);
                    clearInterval(intervalHandler);
                }
            }, 512);
        }
    }
    let mainWindow;
    if (document.URL.includes('fanatical.com')) {
        mainWindow = new MainWindow(0 /* Fanatical */);
    }
    else if (document.URL.includes('humblebundle.com/downloads')) {
        mainWindow = new MainWindow(1 /* HumbleBundle */);
    }
    mainWindow.AddToPage();
})();
