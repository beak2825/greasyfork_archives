// ==UserScript==
// @name         Censored-No-More
// @version      0.1
// @author       A3+++#6673
// @description  Disables the chat filter and allows you to see messages that typically get blocked
// @match        *://shellshock.io/*
// @namespace    https://greasyfork.org/users/815159
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468020/Censored-No-More.user.js
// @updateURL https://update.greasyfork.org/scripts/468020/Censored-No-More.meta.js
// ==/UserScript==

window.XMLHttpRequest = class extends window.XMLHttpRequest {
    constructor() {
        super(...arguments)
    }
    open() {
        if (arguments[1] && arguments[1].includes("shellshock.js")) {
            this.scriptMatch = true;
        }

        super.open(...arguments)
    }
    get response() {
        if (this.scriptMatch) {
            const responseText = super.response;

            const [, isBadWord] = responseText.match(/\|\|(\w\w)\(\w.normalName/);
            const [_, elm, str] = responseText.match(/.remove\(\),(\w).innerHTML=(\w)/);

            return responseText
                .replace(/.length>0&&!\w\w\(\w\)/, ".length>0")
                .replace(_, _ + `,${isBadWord}(${str})&&!arguments[2]&&(${elm}.style.color="red")`);

        }
        return super.response;
    }
};
