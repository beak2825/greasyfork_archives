// ==UserScript==
// @name         wonder site auto click login
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  wonder site auto click login, only support QA, UAT
// @author       felix
// @match        https://*.foodtruck-qa.com/*
// @match        https://*.foodtruck-uat.com/*
// @match        https://login.microsoftonline.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442069/wonder%20site%20auto%20click%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/442069/wonder%20site%20auto%20click%20login.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // please input your microsoft account ！！！！！！！！！
    // please input your microsoft account ！！！！！！！！！
    // please input your microsoft account ！！！！！！！！！
    const yourLoginAccount = "felixli@xm.wonder.com";

    // please input your site name, you can look it from https://portal.foodtruck-qa.com/
    const siteName = "Recipe System"


    const microsoftLoginPrefix = /https:\/\/login.microsoftonline.com\/.*http.+\.foodtruck-.*.com.*/;
    const wonderUrlReg = /https:\/\/.+\.foodtruck-.*.com/

    console.log("url", window.location.href)

    if (window.location.href.search(microsoftLoginPrefix) == 0) {
        console.log("microsoft login page")
        waitElementsLoaded("div.table-row > div.table-cell.text-left.content > div", 10, function (elements) {
            if (elements.length == 1) {
                elements[0].click();
            } else {
                elements.forEach(element => {
                    if (yourLoginAccount === element.textContent) {
                        element.click()
                    }
                })
            }
        })
        return
    }
    if (window.location.href.search(wonderUrlReg) == 0) {
        console.log("wonder page")

        waitElementLoaded(".ms-Stack-inner.css-133", 5, function (element) {
            var children = element.children;
            for (let index = 0; index < children.length; index++) {
                const element = children[index];
                var text = element.children[1].children[0].textContent;
                if (text == siteName) {
                    element.click();
                }
            }
        })
        waitElementLoaded("div.ant-modal-confirm-btns > button", 5, function (element) {
            element.click();
        })
        waitElementLoaded("div.log-out-modal button.ms-Button", 5, function (element) {
            element.click();
        })

        return
    }

    function waitElementLoaded(selector, timeOut, func) {
        let maxTimeOutCount = timeOut ? timeOut : 20;
        let alreadyFindCount = 0;
        let timer = setInterval(() => {
            alreadyFindCount++;
            let element = document.querySelector(selector);
            if (element != null) {
                clearInterval(timer);
                func(element);
                return
            }
            if (alreadyFindCount > maxTimeOutCount) {
                clearInterval(timer);
                console.log("selector not found, clear interval.")
            }
        }, 500);
    }

    function waitElementsLoaded(selector, timeOut, func) {
        let maxTimeOutCount = timeOut ? timeOut : 20;
        let alreadyFindCount = 0;
        let timer = setInterval(() => {
            alreadyFindCount++;
            let element = document.querySelectorAll(selector);
            if (element != null) {
                clearInterval(timer);
                func(element);
                return
            }
            if (alreadyFindCount > maxTimeOutCount) {
                clearInterval(timer);
                console.log("selector not found, clear interval.")
            }
        }, 500);
    }
})();