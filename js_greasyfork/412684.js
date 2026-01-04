// ==UserScript==
// @name         Disable Ctrl+S on fastidea
// @namespace    https://fazerog02.dev
// @version      0.1
// @description  try to take over the world!
// @author       fazerog02
// @match        https://fastidea.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412684/Disable%20Ctrl%2BS%20on%20fastidea.user.js
// @updateURL https://update.greasyfork.org/scripts/412684/Disable%20Ctrl%2BS%20on%20fastidea.meta.js
// ==/UserScript==

(function() {
    document.body.addEventListener("keydown", e => {
        if(e.ctrlKey && e.which == 83){
            console.log(12);
            e.preventDefault();
            return false;
        }
    });
})();