// ==UserScript==
// @name         minter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  made by @mizqe(telegram)
// @author       MsLolita
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447507/minter.user.js
// @updateURL https://update.greasyfork.org/scripts/447507/minter.meta.js
// ==/UserScript==

window.onload = (async function() {
    'use strict';

    function takeBtnByText(innerBtnText){
        innerBtnText = [...arguments]
        const siteBtns = takeAllSiteBtns()
        for (const siteBtn of siteBtns){
            let btnName = siteBtn.innerText
            if (checkArrayInText(btnName.toLowerCase(), innerBtnText)) {
                return siteBtn
            }
        }
    }

    function clickClaim() {
        const mintBtn = takeBtnByText("mint", "minting", "claim", "claiming")
        if(mintBtn)
            mintBtn.click()

        setTimeout(clickClaim.bind(), 5);
    }

    function takeAllSiteBtns() {
        return [...document.querySelectorAll("button")]
    }

    function checkArrayInText(str, words) {
        let regex = new RegExp("\\b(" + words.join('|') + ")\\b", "g");
        return regex.test(str);
    }
    clickClaim()
})();