// ==UserScript==
// @name         Red MAGCATS
// @namespace    http://fallenlondon.com/
// @version      2025-05-22
// @description  Replaces the new icons with the red icons for advanced skills.
// @author       Hannah~
// @match        https://www.fallenlondon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fallenlondon.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.7.1.min.js
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/536896/Red%20MAGCATS.user.js
// @updateURL https://update.greasyfork.org/scripts/536896/Red%20MAGCATS.meta.js
// ==/UserScript==

(function() {
    let imgCheck = /\/\/images\.fallenlondon\.com\/icons\/(?<name>.*?)(?<sidebar>_sidebar)(?<small>small)?\.png/gi
    let adjustList = new Set([
        "kataleptictoxicology",
        "monstrousanatomy",
        "playerofchess",
        "glasswork",
        "shapelingarts",
        "artisanredscience",
        "mithridacy",
        "stewardofdiscordance",
        "zeefaring",
        "chthonosophy"
    ])

    new MutationObserver(function (mutations) {
        let elms = document.querySelectorAll("img");
        for (let i = 0; i < elms.length; i++) {
            let elm = elms[i];
            let test = imgCheck.exec(elm.src);
            if (test) {
                let name = test.groups.name
                let sidebar = test.groups.sidebar
                let small = test.groups.small
                if (adjustList.has(name)) {
                    elm.oldSrc = elm.src
                    elm.src = `//images.fallenlondon.com/icons/` + name + small + `.png`
                }
            }
        }
    }).observe(document, {childList: true, subtree: true});

    console.log("[Red MAGCATS] Mutation Observer Observin'")
})();