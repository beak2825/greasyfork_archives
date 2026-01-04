// ==UserScript==
// @name         Data Point (DP) list extractor for Tuya IoT platform
// @namespace    https://etcho.github.io/
// @version      2.1
// @description  Script that helps to get DPs for your tuya devices
// @author       Everton Leite
// @match        *.iot.tuya.com/cloud/device/detail/*
// @match        *.platform.tuya.com/cloud/device/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tuya.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487479/Data%20Point%20%28DP%29%20list%20extractor%20for%20Tuya%20IoT%20platform.user.js
// @updateURL https://update.greasyfork.org/scripts/487479/Data%20Point%20%28DP%29%20list%20extractor%20for%20Tuya%20IoT%20platform.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dp_list = document.createElement('ul');
    let codes = {};

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) return resolve(document.querySelector(selector));

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {childList: true, subtree: true});
        });
    }

    function createListElement() {
        waitForElm('#rc-tabs-0-panel-deviceLogs').then((elm) => {
            dp_list.id = 'extracted_dp_list';
            dp_list.style.position = 'absolute';
            dp_list.style.width = '200px';
            dp_list.style.top = '46px';
            dp_list.style.right = '15px';
            dp_list.style.background = '#FF4800';
            dp_list.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.1)';
            dp_list.style.color = '#FFF';
            dp_list.style.border = '2px solid #cc3a00';
            dp_list.style.fontSize = '12px';
            dp_list.style.zIndex = 1;

            document.getElementById('rc-tabs-0-panel-deviceLogs').appendChild(dp_list);

            waitForElm('[aria-controls="code_list"]').then((elm) => {
                checkNewDPs();
            });
        });
    }

    function simulateHovers() {
        if (document.querySelector('.ant-spin-blur') === null) {
            setTimeout(function() {
                let select = document.querySelector('[aria-controls="code_list"]').parentNode.parentNode;
                let clickEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent('mousedown', true, true);
                select.dispatchEvent(clickEvent);

                function emulateMouseOver(elm) {
                    let clickEvent = document.createEvent('MouseEvents');
                    clickEvent.initEvent('mousemove', true, true);
                    elm.dispatchEvent(clickEvent);
                }

                let options = document.querySelectorAll('.rc-virtual-list .ant-select-item-option');
                for (let i = 0; i < options.length; i++) {
                    setTimeout(emulateMouseOver, i * 10, options[i]);
                }

                select.dispatchEvent(clickEvent);
            }, 500);
        }
    }

    function idOfSelectedDevice() {
        return [...document.querySelector('[class*=detail_active]').innerHTML.matchAll(/\(([^)]+)\)[^)]*$/gm)][0][1];
    }

    function renderList() {
        dp_list.replaceChildren();
        let header = document.createElement('li');
        header.id = 'dp_list_header';
        header.style.background = 'rgb(207, 58, 0)';
        header.style.textAlign = 'center';
        header.style.fontWeight = 'bold';
        header.innerHTML = 'DP List <a href="#" onclick="event.preventDefault(); document.querySelector(\'#extracted_dp_list\').remove();" style="float: right; color: #FFF; margin: -3px 3px 0px 0px;">x</a>';
        dp_list.appendChild(header);
        for (const dp in codes[idOfSelectedDevice()]) {
            let item = document.createElement('li');
            item.innerHTML = '<b>' + dp + '</b>&nbsp; &#8594; &nbsp;' + codes[idOfSelectedDevice()][dp];
            item.style.padding = '1px 4px';
            if (Object.keys(codes[idOfSelectedDevice()]).pop() != dp) {
                item.style.borderBottom = '1px solid rgb(229, 65, 0)';
            }
            dp_list.appendChild(item);
        }
    }

    function createListener() {
        waitForElm('#code_list').then((elm) => {
            var observer = new MutationObserver(mutations => {
                let code_items = document.getElementById('code_list').getElementsByTagName('div');
                if (codes[idOfSelectedDevice()] === undefined) {
                    codes[idOfSelectedDevice()] = {};
                }
                for (const code_item of code_items) {
                    codes[idOfSelectedDevice()][code_item.textContent] = code_item.getAttribute('aria-label');
                }
            });
            observer.observe(document.querySelector('#code_list'), {childList: true});
        });
    }

    function checkNewDPs() {
        if (codes[idOfSelectedDevice()] === undefined) {
            simulateHovers();
        } else {
            renderList();
        }
        setTimeout(checkNewDPs, 1000);
    }

    createListElement();
    createListener();
})();