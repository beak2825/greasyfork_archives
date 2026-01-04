// ==UserScript==
// @name         Gats Pack
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  The Ultimate gats.io game changer
// @author       bati (Akumu) 
// @match        https://gats.io/
// @icon         https://www.gats.io/
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/449502/Gats%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/449502/Gats%20Pack.meta.js
// ==/UserScript==

// Shows landmines & silencers
(() => {
    setTimeout(() => {
        /* eslint-disable no-undef */
        landMine[0].forEach((a, i) => landMine[0][i][1][3] = "#000000"); // eslint-disable-line no-return-assign

        setInterval(() => Object.keys(RD.pool).forEach((a, i) => { if (RD.pool[i].ghillie) RD.poll[i] = { ...RD.pool[i], ghillie: 0, invincible: 0 }; }), 30);

        setInterval(() => Object.keys(RC.pool).forEach((a, i) => { if (RC.pool[i].silenced) RC.pool[i].silenced = 0; }), 30);
        /* eslint-enable no-undef */
    }, 3000);
})();

// Zoom
(() => {
    window.addEventListener("wheel", (event) => {
        const num = Math.sign(event.deltaY);
        let zoom = 1;

        /* eslint-disable no-undef */
        switch (num) {
            case -1:
                j7 *= 1.1; j8 *= 1.1;
                a1();
                zoom *= 1.1;
                break;

            case 1:
                j7 *= 0.95; j8 *= 0.95;
                a1();
                zoom *= 0.95;
                break;
        }
        /* eslint-enable no-undef */
    });
})();