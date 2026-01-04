// ==UserScript==
// @name         Kirka Wallhack 2025
// @author       Kirka Central
// @match        *://kirka.io/*
// @version      1.0.3
// @description  Free Working Kirka Wallhack 2025
// @run-at       document-start
// @namespace    KirkaCentral
// @downloadURL https://update.greasyfork.org/scripts/525781/Kirka%20Wallhack%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/525781/Kirka%20Wallhack%202025.meta.js
// ==/UserScript==

Array.isArray = new Proxy(Array.isArray, {
    apply(obj, context, args) {
        const material = args[0];
        if (material?.map?.image && material.map.image.width === 64 && material.map.image.height === 64) {
            for (let materialKey in material) {
                if (material[materialKey] === 3) {
                    material[materialKey] = 1;
                    break;
                }
            }
        }
        return Reflect.apply(obj, context, args);
    }
});