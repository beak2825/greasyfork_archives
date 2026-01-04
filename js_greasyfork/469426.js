// ==UserScript==
// @name            CurseForge Direct Download
// @namespace       FaustVXCurseForge
// @version         1.2.2
// @description     Provide a direct download link for files in CurseForge
// @author          FaustVX
// @match           https://legacy.curseforge.com/*
// @match           https://www.curseforge.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=curseforge.com
// @grant           none
// @supportURL      https://gist.github.com/FaustVX/e5320dff2648abe3809403160628fa26#comments
// @contributionURL https://www.paypal.com/donate/?cmd=_donations&business=jonathan-035@hotmail.fr&item_name=TamperMonkey+CurseForge+DDL
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/469426/CurseForge%20Direct%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/469426/CurseForge%20Direct%20Download.meta.js
// ==/UserScript==

const run = function() {
    'use strict';

    function createURL(fileId, fileName) {
        return "https://mediafilez.forgecdn.net/files/" + Number(fileId.slice(0, 4)) + "/" + Number(fileId.slice(4)) + "/" + encodeURIComponent(fileName);
    }

    function changeTag(node, tag) {
        const clone = createElement(tag)
        for (const attr of node.attributes) {
            clone.setAttributeNS(null, attr.name, attr.value)
        }
        while (node.firstChild) {
            clone.appendChild(node.firstChild)
        }
        node.replaceWith(clone)
        return clone
    }

    function createElement(tag) {
        return document.createElementNS(tag === 'svg' ? 'http://www.w3.org/2000/svg' : 'http://www.w3.org/1999/xhtml', tag)
    }

    var fileId = window.location.href.split('/')[7];
    if (window.location.href.split('/')[2].startsWith("legacy")) {
        const column = document.getElementsByTagName("article")[0].children[1].firstElementChild;
        changeTag(column.lastElementChild, "a").href = createURL(fileId, column.lastElementChild.innerText);
    } else {
        const section = document.getElementsByClassName("section-file-name")[0];
        const a = changeTag(section.lastElementChild, "a");
        a.href = createURL(fileId, section.lastElementChild.innerText);
    }
};

// Convenience function to execute your callback only after an element matching readySelector has been added to the page.
// based on https://github.com/Tampermonkey/tampermonkey/issues/1279#issuecomment-875386821
function runWhenReady(readySelector, callback) {
    let lastLocation = "";
    const tryNow = function() {
        if (lastLocation !== window.location.href && document.querySelector(readySelector)) {
            lastLocation = window.location.href;
            try {
                callback();
            } catch { }
        }
        setTimeout(tryNow, 250);
    };
    tryNow();
}

runWhenReady(".section-file-name,article", run);
