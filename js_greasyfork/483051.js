// ==UserScript==
// @name         武汉大学研究生评教
// @namespace    http://yjs.whu.edu.cn/ssfw/index.do
// @version      2023-12-25
// @description  武汉大学研究生评教系统，自动好评
// @author       OccDeser
// @match        http://yjs.whu.edu.cn/ssfw/index.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whu.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483051/%E6%AD%A6%E6%B1%89%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/483051/%E6%AD%A6%E6%B1%89%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

function click_all(iframe) {
    if (iframe) {
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        let choose = false;

        for (let i = 0; i < 20; i++) {
            let xpath = `//input[@name="PG_CHECK${i}"]`;
            let element = iframeDocument.evaluate(xpath, iframeDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element && element.checked == false) {
                element.click();
                console.log(`Checked: PG_CHECK${i} checked`);
                choose = true;
            }
        }

        if (choose) {
            setTimeout(() => {
                // submit
                let xpath = '//a[@id="submitButton"]';
                let element = iframeDocument.evaluate(xpath, iframeDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                element.click();
            }, 100)
        }
    }
}

(function () {
    'use strict';

    const iframeXPath = '//iframe[@id="952A04C26A64BF76E0538701640A43FE"]';

    setInterval(() => {
        let iframe = document.evaluate(iframeXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (iframe && iframe.src.includes('952A04C26A64BF76E0538701640A43FE')) {
            click_all(iframe);
        }
    }, 1000);
})();
