// ==UserScript==
// @name         Auto Replace Color with CSS Variable
// @namespace    linghao.su
// @version      0.7
// @description  try to take over the world
// @author       slh001@live.cn
// @match        https://www.figma.com/file/*/DCE-5-Prototype?*
// @match        https://www.figma.com/file/*/DCE-5_New?*
// @match        https://www.figma.com/file/*/%E9%A6%96%E9%A1%B5-Dashboar-%26-Login?*
// @match        https://www.sketch.com/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figma.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449411/Auto%20Replace%20Color%20with%20CSS%20Variable.user.js
// @updateURL https://update.greasyfork.org/scripts/449411/Auto%20Replace%20Color%20with%20CSS%20Variable.meta.js
// ==/UserScript==

const aliasUrl = 'https://cdn.jsdelivr.net/npm/@dao-style/core@0.7.1/dist/styles/color/alias.css';
const varUrl = 'https://cdn.jsdelivr.net/npm/@dao-style/core@0.7.1/dist/styles/color/var.css';
const DELAY_MS = 500;


const DAO_REPLACE_ATTR_KEY = 'DAO_REPLACE_ATTR_KEY';
let lastLastTimeoutId = -1;

let colorFactory;
const cssMap = new Map();

async function init() {
    cssMap.clear();
    const handler = await fetch(varUrl);
    const cssStr = await handler.text();

    const aliasHandler = await fetch(aliasUrl);
    const aliasStr = await aliasHandler.text();

    const cssArr = cssStr.split('\n').map(item=>item.split(':').map(iitem => iitem.trim())).slice(1, -1).map(item => [item[1].slice(0, -1), item[0]]).filter(item => item[0].startsWith('#'));
    const aliasArr = aliasStr.split('\n').map(item=>item.split(':').map(iitem => iitem.trim())).slice(1, -1).map(item => [item[1].slice(0, -1), item[0]]).filter(item => item[0].startsWith('#'));

    cssArr.forEach(item => cssMap.set(item[0].toUpperCase(), item[1]));
    aliasArr.forEach(item => cssMap.set(item[0].toUpperCase(), item[1]));
}

function getSuitableTag(item) {
    while(item) {
        item = item.parentNode;
        if (!item.className || item.className.includes('selection_colors_panel--styleRow')) {
            return item;
        }
    }
}

function getTargetList() {
    const originalList = Array.from(document.querySelectorAll('[aria-label*="rgba"]'));

    const originalColorList = originalList.map(item => colorFactory(item.getAttribute('aria-label')).hex());
    const originalTextList = originalList.map(item => item.nextSibling);

    const targetList = [
        ...originalTextList,
    ]

    targetList.forEach((item, index) => {
        const attr = item.getAttribute(DAO_REPLACE_ATTR_KEY);
        if (attr) {
            return;
        }
        const innerText = item.innerText;

        const cssVariable = cssMap.get(originalColorList[index].toUpperCase());
        if (cssVariable) {
            item.innerHTML = `<div><div>${cssVariable}</div><div>${innerText}</div><div>`;
            item.setAttribute(DAO_REPLACE_ATTR_KEY, innerText);
            const eventBindingDom = getSuitableTag(item);
            if (eventBindingDom) {
                let fn = (e) => {
                    setTimeout(() => {
                        navigator.clipboard.writeText(e?.target?.getAttribute(DAO_REPLACE_ATTR_KEY) ?? cssVariable);
                    }, DELAY_MS)
                }
                eventBindingDom.addEventListener('click', fn);
            }
        }
    })
    lastLastTimeoutId = -1;
}

(async function() {
    'use strict';

    await init();
    const colorModule = await import('https://cdn.jsdelivr.net/npm/color@5.0.0/+esm');
    colorFactory = colorModule.default;
    document.body.addEventListener('click', () => {
        if (lastLastTimeoutId !== -1) {
            clearTimeout(lastLastTimeoutId);
            lastLastTimeoutId = -1;
        }
        lastLastTimeoutId = setTimeout(getTargetList, DELAY_MS);
    })
})();