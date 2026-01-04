// ==UserScript==
// @name         vConsole
// @version      0.3
// @description  为当前页面增加vConsole调试
// @author       YieldRay
// @include      *
// @grant        none
// @namespace    https://greasyfork.org/users/467455
// @downloadURL https://update.greasyfork.org/scripts/399039/vConsole.user.js
// @updateURL https://update.greasyfork.org/scripts/399039/vConsole.meta.js
// ==/UserScript==

(function () {
    var script = document.createElement("script");
    script.src = "//cdn.jsdelivr.net/npm/vconsole";
    document.body.appendChild(script);
    script.onload = function () {
        new VConsole();
    };
})();