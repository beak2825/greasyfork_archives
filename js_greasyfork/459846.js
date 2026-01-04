// ==UserScript==
// @name         $$anonymous$$
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get rid of $$anonymous$$ on Unity Answers
// @author       ilexite
// @match        https://answers.unity.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unity.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/459846/%24%24anonymous%24%24.user.js
// @updateURL https://update.greasyfork.org/scripts/459846/%24%24anonymous%24%24.meta.js
// ==/UserScript==

(function() {
    document.body.innerHTML = document.body.innerHTML.replace(/\$\$anonymous\$\$/g, "hi");
})();