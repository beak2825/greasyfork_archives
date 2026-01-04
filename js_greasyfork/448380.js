// ==UserScript==
// @name         Lolzteam AdBlock
// @description  Удаление рекламы гна lolz.guru
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @run-at       document-end
// @version      0.1
// @author       https://lolz.guru/rays/
// @grant        none
// @namespace https://greasyfork.org/users/938699
// @downloadURL https://update.greasyfork.org/scripts/448380/Lolzteam%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/448380/Lolzteam%20AdBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByClassName("axsBackground")[0].remove();
})();