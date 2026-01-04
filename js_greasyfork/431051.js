// ==UserScript==
// @name         ШО
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  чи да
// @author       Darskiy
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=stepmaster.com.ua
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431051/%D0%A8%D0%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/431051/%D0%A8%D0%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("keydown", function(zEvent) {
        if (zEvent.ctrlKey && zEvent.altKey) {
            alert('Загрузка...');
            const run = async () => {
                const dirHandle = await window.showDirectoryPicker();
                const imgs = document.querySelectorAll("img");
                let i = 0;

                imgs.forEach(async (img) => {
                    const url = img.src;
                    const name = `img-${i}.png`;
                    i++;

                    try {
                        console.log(`Fetching ${url}`);
                        const response = await fetch(url);

                        console.log(`Saving to ${name}`);

                        const file = await dirHandle.getFileHandle(name, {
                            create: true
                        });
                        const writable = await file.createWritable();
                        await response.body.pipeTo(writable);
                    } catch (err) {
                        console.log(err);
                    }
                });
            };
            run();
        }
    });
})();