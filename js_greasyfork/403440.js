// ==UserScript==
// @name         Whatsapp Web dark theme enabler
// @namespace    http://web.whatsapp.com/
// @version      1.02
// @description  A JS file for Tampermonkey that allows you to enable dark theme on Whatsapp Web website.
// @author       Kenya-West
// @match        https://web.whatsapp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403440/Whatsapp%20Web%20dark%20theme%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/403440/Whatsapp%20Web%20dark%20theme%20enabler.meta.js
// ==/UserScript==

class WhatsappWebDarkThemeEnabler {
    constructor(htmlClass, addClass) {
        this.start(htmlClass, addClass);
    }

    start(htmlClass, addClass) {
        const element = this.findElement(htmlClass);
        console.info(`Found ${element}`);
        if (element && !this.doesElementHaveThemeEnabled(element, addClass)) {
            console.info(`It doesn't have "${addClass}" class`);
            this.enableTheme(element, addClass);
            console.log(`Dew it!`);
        } else if (!element) {
            console.error(`No element is found`)
        } else if (this.doesElementHaveThemeEnabled(element, addClass)) {
            console.warn(`It already has "${addClass}" class`);
        }
    }

    findElement(selector) {
        return document.querySelector(selector);
    }

    doesElementHaveThemeEnabled(element, addClass) {
        return element.classList.contains(addClass);
    }
    enableTheme(element, addClass) {
        element.classList.add(addClass);
    }
}

setTimeout(() => new WhatsappWebDarkThemeEnabler("body", "dark"), 5000);