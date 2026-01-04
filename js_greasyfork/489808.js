// ==UserScript==
// @name         Double Click Open GoldenDict
// @namespace    http://tampermonkey.net/
// @version      2024-03-22
// @description double click to query selected word in goldendict
// @note  only support English 
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goldendict.org
// @author       Leon406
// @license      AGPL-3.0-or-later
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/489808/Double%20Click%20Open%20GoldenDict.user.js
// @updateURL https://update.greasyfork.org/scripts/489808/Double%20Click%20Open%20GoldenDict.meta.js
// ==/UserScript==

(function () {
    'use strict';
	// 支持全选，改为 true
	const selectAll = false
    const getSelectionText = () => {
        let text = getSelection().toString().trim();

        if (!!text && ( selectAll|| /^[a-z']+$/i.test(text))) {
            return text;
        } else {
            return null;
        }
    };
    document.addEventListener("dblclick", e => {
        let text = getSelectionText()
            if (text) {
                window.open("goldendict://" + text)
            }
    })
})();