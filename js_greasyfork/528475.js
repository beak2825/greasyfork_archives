// ==UserScript==
// @name                Gofile bypass high traffic files
// @namespace           https://greasyfork.org/users/821661
// @match               https://gofile.io/*
// @grant               none
// @version             1.1
// @run-at              document-start
// @author              hdyzen
// @description         bypass high traffic alert
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/528475/Gofile%20bypass%20high%20traffic%20files.user.js
// @updateURL https://update.greasyfork.org/scripts/528475/Gofile%20bypass%20high%20traffic%20files.meta.js
// ==/UserScript==

Response.prototype.json = async function () {
    const resText = await this.text();
    const modRes = resText.replaceAll('"overloaded":true', '"overloaded":false');

    return JSON.parse(modRes);
};
