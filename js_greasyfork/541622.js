// ==UserScript==
// @name         Remove Google Search Auto Translate
// @name:tr      Google Arama Otomatik Çeviriyi Kaldır
// @namespace    http://tampermonkey.net/
// @version      2025-07-04
// @description  Reverts the auto translated items back to their original state
// @description:tr Aramalarda otomatik çevrilen elemanları asıl hallerine çevirir
// @author       creeperkafasi
// @match        https://www.google.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541622/Remove%20Google%20Search%20Auto%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/541622/Remove%20Google%20Search%20Auto%20Translate.meta.js
// ==/UserScript==



(async function() {
    'use strict';
    const qNeedsSwap = [
        ".zReHs",//   Title anchor
        ".Pa9Ggf",//  Description
    ]

    await new Promise(resolve => setTimeout(resolve, 1000));
    let searchItems = document.querySelectorAll(".A6K0A").values();
    let translated = searchItems.filter((el)=>el.querySelector(".E5P3gc"));
    translated.forEach((el) => {
        qNeedsSwap.forEach((query) => {
            let anchors = el.querySelectorAll(query);
            if (anchors.length != 2) {
                console.error(`[Remove Google Search Auto Translate]: query ${query} dis not result in a pair!`);
                console.error(el);
                console.error(anchors)
                return;
            }

            anchors[0].style.setProperty("display", "none")
            anchors[1].style.removeProperty("display")
        })
        el.querySelector(".E5P3gc").textContent = "Reverted to original.";
    })

})();






