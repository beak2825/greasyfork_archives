// ==UserScript==
// @name         S21 CulturedAvatars
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces all blank avatars with random anime women
// @author       You
// @match        https://edu.21-school.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw
// @require      https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458785/S21%20CulturedAvatars.user.js
// @updateURL https://update.greasyfork.org/scripts/458785/S21%20CulturedAvatars.meta.js
// ==/UserScript==

function generateUUID() { // Public Domain/MIT
    let d = new Date().getTime();//Timestamp
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function waitForUniqueElements(selector, callback) {
    const elements = new Set();

    waitForKeyElements(selector, (jNodes) => {
        const nodeArray = Array.of(jNodes);

        for (const node of nodeArray) {

            const id = node.uuid;

            if (id && elements.has(id)) continue;

            const newId = generateUUID();

            node.uuid = newId;

            elements.add(newId);

            callback(node);
        }
    }, false);
}

(async function() {
    'use strict'

    waitForUniqueElements('.MuiAvatar-img', async (node) => {
        const data = await fetch('https://nekos.life/api/v2/img/avatar').then(response => response.json());

        node.src = data.url;
    });

    waitForKeyElements('[data-testid="personalInfo.avatar.text"]', async (node) => {
        const parentNode = node.parentNode;

        if (Array.of(node.children).some(e => e.tagName == "IMG")) return;

        const avatarNode = document.querySelector('.MuiAvatar-img');

        if (!avatarNode) return;

        const newNode = avatarNode.cloneNode();

        parentNode.replaceChild(newNode, node);
    });

})();