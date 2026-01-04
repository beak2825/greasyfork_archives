// ==UserScript==
// @name         Auto Click Allow Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto‑click "Allow" buttons on your extension permissions page
// @match        chrome-extension://ojnbohmppadfgpejeebfnmnknjdlckgj/permissions.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541071/Auto%20Click%20Allow%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/541071/Auto%20Click%20Allow%20Button.meta.js
// ==/UserScript==

(function () {
    setInterval(() => {
        const btn = document.querySelector("button, input[type='submit']");
        if (btn) btn.click();
    }, 500);
})();