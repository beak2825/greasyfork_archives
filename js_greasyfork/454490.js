// ==UserScript==
// @name         I don't want your stupid inspiration
// @namespace    https://github.com/new
// @version      0.1
// @description  I don't want your stupid inspiration!
// @author       You
// @match        https://github.com/new
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454490/I%20don%27t%20want%20your%20stupid%20inspiration.user.js
// @updateURL https://update.greasyfork.org/scripts/454490/I%20don%27t%20want%20your%20stupid%20inspiration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("#repo-name-suggestion").remove();
})();