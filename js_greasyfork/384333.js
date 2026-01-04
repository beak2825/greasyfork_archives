// ==UserScript==
// @name         Blacklist for bemaniso emoji
// @namespace    https://bemaniso.ws/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://bemaniso.ws/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384333/Blacklist%20for%20bemaniso%20emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/384333/Blacklist%20for%20bemaniso%20emoji.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const blacklist = ['emot-gizz', 'emot-ccb', 'emot-dong', 'emot-sdong', 'emot-sonia', 'emot-spincock'];

    document.querySelectorAll('img').forEach(function(e) {
        for (let keyword of blacklist) {
            if (e.src.indexOf(keyword) !== -1) {
                e.remove()
                break;
            }
        }
    });
})();