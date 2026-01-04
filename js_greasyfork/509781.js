// ==UserScript==
// @name         log
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  快点儿查看日志
// @author       You
// @match        https://jump.meiyunji.net/luna/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meiyunji.net
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/509781/log.user.js
// @updateURL https://update.greasyfork.org/scripts/509781/log.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const customEle = document.createElement('li')
    customEle.innerHTML = '<a>快速点击</a>'
    const attribute = document.querySelector("body > app-root > pages-main > elements-nav > div > ul > li").attributes[0].name
    customEle.setAttribute(attribute, '')
    customEle.className = 'dropdown'
    const customEleA = customEle.querySelector('a')
    customEleA.setAttribute(attribute, '')
    customEleA.style = 'color:pink'

    setTimeout(() => {
        document.querySelector("elements-nav > div > ul").appendChild(customEle)
    }, 1000);

    customEleA.onmousedown = async function log() {
        async function clickDom(dom) {
            if (typeof dom === 'string') {
                dom = document.querySelector(dom);
            }
            if (dom) {
                dom.click();
                await new Promise(resolve => setTimeout(resolve, 150));
            }
        };
        await clickDom("#contact-form > div:nth-child(6) > button"); const sellfoxLogEnvPath = ["#myAssets_3_span", "#myAssets_4_span", "#myAssets_7_span", "#myAssets_9_span", "#myAssets_12_span","#myAssets_13_span"];
        for (const path of sellfoxLogEnvPath) {
            let isClick = document.querySelector(path).parentElement.parentElement.querySelector('ul');
            if (isClick) continue;
            document.querySelector(path).click();
            await new Promise(resolve => setTimeout(resolve, 100 * (sellfoxLogEnvPath.indexOf(path) + 1)));
        }
    }

})();