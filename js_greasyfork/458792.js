// ==UserScript==
// @name         S42 CulturedAvatars
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces all blank avatars with random anime women
// @author       You
// @match        https://*.intra.42.fr/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw
// @require      https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458792/S42%20CulturedAvatars.user.js
// @updateURL https://update.greasyfork.org/scripts/458792/S42%20CulturedAvatars.meta.js
// ==/UserScript==

(async function() {
    'use strict'

    waitForKeyElements('.profile-image , .user-profile-picture , .bg-image-item', async (jNodes) => {
       const nodes = Array.of(jNodes);

        for (const node of nodes) {
            const avatarStyle = node.style;

            if (avatarStyle.backgroundImage.includes("://")) continue;

            const data = await fetch('https://nekos.life/api/v2/img/avatar').then(response => response.json());

            avatarStyle.backgroundImage = `url(${data.url})`;
        }
    });


})();