// ==UserScript==
// @name         Connexus Restyled
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Restyle the Connexus home page
// @author       Ocawesome101
// @match        https://www.connexus.com/*
// @icon         https://www.connexus.com/favicon.ico
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450099/Connexus%20Restyled.user.js
// @updateURL https://update.greasyfork.org/scripts/450099/Connexus%20Restyled.meta.js
// ==/UserScript==

let Gray1 = "rgb(200, 200, 200)";
let Gray2 = "rgb(150, 150, 150)";
let Gray3 = "rgb(100, 100, 100)";
let Gray4 = "rgb(50, 50, 50)";

let Red1 = "rgb(200, 0, 0)";
let Red2 = "rgb(255, 100, 100)"; // dangit JS, Lua does this too

let changes = {
    "pvs-header": {
        ".pvs-header-wrapper": { borderBottomColor: Gray1 },
        ".pvs-header-account-menu-wrapper": { backgroundColor: Gray4 },
        ".pvs-header-major-content-wrapper": { backgroundColor: Gray3 },
        ".pvs-header-main-menu-container": { backgroundColor: Gray3 },
        ".pvs-header-update-menu-container": { backgroundColor: Gray3 },

        subElements: {
            "pvs-header-menu": {
                ".main-menu.main": { backgroundColor: Gray3 },
                ".main-menu.account": { backgroundColor: Gray4 }
            },

            "pvs-header-item": {
                ".main.header-menu-item::before": { background: Gray1 },
                ".main.header-menu-item:hover .header-menu-item-link": { backgroundColor: Gray2 },
                ".main.is-active.header-menu-item .header-menu-item-link": { backgroundColor: Gray2 },
                ".main.header-menu-item .header-menu-item-notification": { backgroundColor: Red1 },
            },

            "pvs-header-item-with-dd": {
                ".main.header-menu-item::before": { background: Gray1 },
                ".main.header-menu-item:hover .header-menu-item-link": { backgroundColor: Gray2 },
                ".main.is-active.header-menu-item .header-menu-item-link": { backgroundColor: Gray2 },
                ".main.header-menu-item .header-menu-item-notification": { backgroundColor: Red1 },
            }
        }
    }
};

function findRule(sheet, name) {
    for (let r=0; r < sheet.cssRules.length; r++) {
        if (sheet.cssRules[r].selectorText === name) {
            return sheet.cssRules[r].style;
        }
    }
}

function applyChanges(chg) {
    for (let [key, value] of Object.entries(chg)) {
        if (key != "subElements") {
            let element = document.getElementsByTagName(key)[0];

            if (element) {
                let style = element.shadowRoot.adoptedStyleSheets[0];

                for (let [cssClass, cssOverride] of Object.entries(value)) {
                    if (cssClass == "subElements") {
                        applyChanges(cssOverride)
                    } else {
                        let rule = findRule(style, cssClass);

                        for (let [cssKey, cssValue] of Object.entries(cssOverride)) {
                            console.log(`connexus-restyled: apply ${cssClass}.${cssKey}=${cssValue} to ${key}`);
                            rule[cssKey] = cssValue;
                        }
                    }
                }
            }
        }
    }
}

(function() {
    'use strict';

    applyChanges(changes);/*
    let host = document.getElementsByTagName("pvs-header")[0];
    if (host) {
        let sheet = host.shadowRoot.adoptedStyleSheets[0];
        findRule(sheet, ".pvs-header-wrapper").borderBottomColor = Gray1;
        findRule(sheet, ".pvs-header-account-menu-wrapper").backgroundColor = Gray4;
        findRule(sheet, ".pvs-header-major-content-wrapper").backgroundColor = Gray3;
        findRule(sheet, ".pvs-header-main-menu-container").backgroundColor = Gray3;
        findRule(sheet, ".pvs-header-update-menu-container").backgroundColor = Gray3;

        let menus = document.getElementsByTagName("pvs-header-menu");
        for (let m=0; m < menus.length; m++) {
            let rules = menus[m].shadowRoot.adoptedStyleSheets[0];
            findRule(rules, ".main-menu.main").backgroundColor = Gray3;
            findRule(rules, ".main-menu.account").backgroundColor = Gray4;
        }

        let items = document.getElementsByTagName("pvs-header-item")//("header-menu-item main-item");
        for (let i=0; i < items.length; i++) {
            let rules = items[i].shadowRoot.adoptedStyleSheets[0];
            processPVSHeaderItemRules(rules);
        }

        let aside = document.getElementsByTagName("aside");
        if (aside.length > 0) {
            let h3s = aside[0].getElementsByTagName("h3");
            h3s[0].style.backgroundColor = Red2;
            h3s[1].style.backgroundColor = Red2;
        }
    }*/
})();