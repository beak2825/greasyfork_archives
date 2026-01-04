// ==UserScript==
// @name         eruda
// @version      0.1
// @description  为当前页面增加eruda调试
// @author       YieldRay
// @license      MIT
// @include      *
// @grant        none
// @namespace    https://greasyfork.org/users/467455
// @downloadURL https://update.greasyfork.org/scripts/459301/eruda.user.js
// @updateURL https://update.greasyfork.org/scripts/459301/eruda.meta.js
// ==/UserScript==

(function () {
    var script = document.createElement("script");
    script.src = "//cdn.jsdelivr.net/npm/eruda";
    document.body.appendChild(script);
    script.onload = function () {
        eruda.init();
    };
})();
