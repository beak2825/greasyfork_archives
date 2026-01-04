// ==UserScript==
// @license MIT
// @name         Figma-Font
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  Fuck Figma Dev Mode!
// @author       Mirrorhye
// @match        https://www.figma.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figma.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487711/Figma-Font.user.js
// @updateURL https://update.greasyfork.org/scripts/487711/Figma-Font.meta.js
// ==/UserScript==

/*
    v0.0.5: fix query selector
*/

(function() {
    'use strict';

    const weightmap = {
        100: 'Thin',
        200: 'ExtraLight',
        300: 'Light',
        400: 'Regular',
        500: 'Medium',
        600: 'SemiBold',
        700: 'Bold',
        800: 'ExtraBold',
        900: 'Black',
    }

    function walkDom(dom, callback, walkParent) {
        if (!dom) { return; }
        if (callback(dom)) { return; }
        if (walkParent) {
            if (dom.parentNode) {
                walkDom(dom.parentNode, callback, walkParent);
            }
        } else {
            for (let i = 0; i < dom.childNodes.length; i++) {
                let node = dom.childNodes[i];
                if (node) {
                    walkDom(dom.childNodes[i], callback, walkParent);
                }
            }
        }
    }

    function findDom(dom, callback, walkParent) {
        let ret = null;
        walkDom(dom, (node) => {
            if (callback(node)) {
                ret = node;
                return true;
            }
            return false;
        }, walkParent);
        return ret;
    }

    function findDomContainsClassName(dom, className, walkParent) {
        return findDom(dom, (node) => {
            if (!node) { return false; }
            let r = node.className;
            if (typeof(r) !== "string") {
                return false;
            }
            return r.includes(className);
        }, walkParent);
    }

    function findDomEqualInnerText(dom, innerText, walkParent) {
        return findDom(dom, (node) => {
            if (!node) { return false; }
            let r = node.innerText;
            if (typeof(r) !== "string") {
                return false;
            }
            return r === innerText;
        }, walkParent);
    }

    // 创建一个新的 MutationObserver 对象
    const observer = new MutationObserver((mutationsList) => {
        let panel = findDomContainsClassName(document.body, "typographyPanel");
        if (!panel) { return; }
        console.log(`step panel1: ${panel}`)
        let fontWeightElem = findDomEqualInnerText(panel, "Weight");
        fontWeightElem = findDomContainsClassName(fontWeightElem, "copyableRow", true);
        if (!fontWeightElem) { return }
        console.log(`step fontWeightElem: ${fontWeightElem}`)
        panel = fontWeightElem.parentElement;
        if (!panel) { return; }
        console.log(`step panel2: ${panel}`)

        const fontWeight = fontWeightElem.querySelector('div > span:nth-child(2)').innerText
        console.log(`step fontWeight: ${fontWeight}`)

        const newText = `${weightmap[fontWeight]}`
        console.log(`step newText: ${newText}`)
        let copyRow = panel.querySelector('#mir-font')
        if (!copyRow) {
            copyRow = panel.querySelector('div:nth-child(1)').cloneNode(true)
            copyRow.setAttribute('id', 'mir-font')
            findDomContainsClassName(copyRow, "propertyName").innerText = "字重"
            console.log(`step copyRow: ${copyRow}`)
            panel.insertBefore(copyRow, fontWeightElem)
        }

        const area = findDomContainsClassName(copyRow, "propertyValue")
        if (area.innerText != newText) {
            area.innerText = newText;
        }
    });

    const config = { attributes: true, childList: true, subtree: true };

    observer.observe(document, config);
})();