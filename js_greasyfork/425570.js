// ==UserScript==
// @name         Webinar I am here!
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Просто отмечаю на лекции. Разве это не законно?
// @match        https://events.webinar.ru/*
// @icon         https://img2.freepng.ru/20180404/vfw/kisspng-computer-icons-check-mark-symbol-checkbox-best-5ac56af594c163.5973256715228874136093.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425570/Webinar%20I%20am%20here%21.user.js
// @updateURL https://update.greasyfork.org/scripts/425570/Webinar%20I%20am%20here%21.meta.js
// ==/UserScript==


(function () {
    'use strict';
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function press() {
        let btn = getElementByXpath("/html/body/div[2]/div/div/div[3]/button/span/span");
        let btnClose = getElementByXpath("/html/body/div[2]/div/div/div[2]/button/span");
        if (btn != null) {
            btn.click();
            console.log("I am here!-> 😎 I am pressed on button!");
            if (btnClose != null) {
                setTimeout(() => {
                    btnClose.click();
                    console.log("I am here!-> 😎 I am pressed to close button!");
                }, 1000);
            }
        }
        setTimeout(() => {
            press();
        }, 2000);
    }
    press()
})();
