// ==UserScript==
// @name                Gofile bypass frozen links
// @namespace           https://greasyfork.org/users/821661
// @match               https://gofile.io/*
// @grant               none
// @version             1.0
// @run-at              document-start
// @author              hdyzen
// @description         bypass frozen files in gofile
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/528475/Gofile%20bypass%20frozen%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/528475/Gofile%20bypass%20frozen%20links.meta.js
// ==/UserScript==

function patchResponseJSON() {
    try {
        Response.prototype.json = async function () {
            const resText = await this.text();
            const modRes = resText.replaceAll('"isFrozen":true', '"isFrozen":false');

            return JSON.parse(modRes);
        };
    } catch (error) {
        console.error("Error in replace Response.json(): ", error);
    }
}
patchResponseJSON();
