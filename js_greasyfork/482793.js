// ==UserScript==
// @name         Always Hi-Res c.ai Avatars
// @namespace    logan.usw
// @version      1.0.1
// @description  Always request high-res (400px) user/character avatars all the time instead of mixing in low-res (80px) avatars in some places.
// @author       astrov0id
// @match        https://beta.character.ai/*
// @match        https://old.character.ai/*
// @match        https://plus.character.ai/*
// @icon         https://characterai.io/static/favicon_v2.ico
// @run-at       document-idle
// @license      Unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482793/Always%20Hi-Res%20cai%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/482793/Always%20Hi-Res%20cai%20Avatars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(mList => { // set up a mutationobserver to process every new element
        mList.forEach(m => {
            const allimgs = m.target.querySelectorAll("img[src^=\"https://characterai.io/i/80\"]"); // retrieve every low-res avatar image in a new element
            allimgs.forEach(i => { // make every low-res avatar high-res by replacing /i/80 in the img's src with /i/400
                i.src = "https://characterai.io/i/400/" + i.src.slice(28);
                // console.debug(window.location.pathname + ": https://characterai.io/i/80/" + i.src.slice(29) + ' => ' + i.src); // debugging code, disabled in production
            });
        });
    });

    observer.observe(document.body, {attributes: false, childList: true, characterData: false, subtree: true}); // start the mutationobserver
})();