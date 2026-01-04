// ==UserScript==
// @name         Show overlapping groups in Confluence's space permisisons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  what the name says
// @author       Dennis Stengele
// @match        https://*.atlassian.net/wiki/spaces/spacepermissions.action*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469010/Show%20overlapping%20groups%20in%20Confluence%27s%20space%20permisisons.user.js
// @updateURL https://update.greasyfork.org/scripts/469010/Show%20overlapping%20groups%20in%20Confluence%27s%20space%20permisisons.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(async function () {
    'use strict';

    const baseUrl = location.origin;

    const permissionGroups = Array.from(document.querySelectorAll("table#gPermissionsTable tr.space-permission-row > th")).map((node) => node.innerText);

    const userRows = Array.from(document.querySelectorAll("table#uPermissionsTable tr.space-permission-row"));

    for (const userRow of userRows) {
        const userKey = userRow.dataset.key;

        const userGroups = await fetch(`${baseUrl}/wiki/rest/api/user/memberof?${new URLSearchParams({ accountId: userKey })}`).then(
            response => { return response.json(); }
        ).then(
            json => { return json.results.map((groupObject) => { return groupObject.name; }); }
        );

        const intersect = permissionGroups.filter((x) => { return userGroups.includes(x); });

        if (0 == intersect.length) { continue; }

        const usernameCell = userRow.querySelector("th");

        const userNameValue = usernameCell.innerText;

        console.log(`User ${userNameValue} (Key: ${userKey}) has groups [${userGroups.join(", ")}], intersected to [${intersect.join(", ")}]`);

        const newUsernameValue = `${userNameValue} (${intersect.join(", ")})`;

        usernameCell.innerText = newUsernameValue;
    }
})();