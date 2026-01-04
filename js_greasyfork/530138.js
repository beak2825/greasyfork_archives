// ==UserScript==
// @name         Adblocker for fly.pieter
// @namespace    http://tampermonkey.net/
// @version      2025-03-13
// @description  Block banner ads in fly.pieter game
// @author       You
// @match        https://fly.pieter.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pieter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530138/Adblocker%20for%20flypieter.user.js
// @updateURL https://update.greasyfork.org/scripts/530138/Adblocker%20for%20flypieter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let uuidList = []; // initializing the uuidList as an empty array
    const removeObject = (uuid) => {
        // function to remove object by uuid
        const object = scene.getObjectByProperty("uuid", uuid); // getting object by property uuid and x is uuid of an object that we want to delete and clicked on before
        object.removeFromParent(); // removing object from its parent
        scene.remove(object); // removing object from the scene
    };

    const adElements = scene.children.slice(-40);
    adElements.forEach((o) => {
        if (o.type === "Mesh" || o.type === "Group") {
            uuidList.push(o.uuid);
        }
    });

    const makeObjectTransparent = (uuid) => {
        // function to make object transparent by uuid
        const object = scene.getObjectByProperty("uuid", uuid); // getting object by property uuid
        object.traverse((node) => {
            if (node.isMesh) {
                node.material.transparent = true; // making material of the object transparent
                node.material.opacity = 0.1; // setting opacity of the object
            }
        });
    }

    uuidList.forEach((uuid) => {
        // iterating over the uuidList
        try {
            removeObject(uuid); // making object transparent by uuid
        } catch (e) {
            console.log(e);
        }
    });
})();