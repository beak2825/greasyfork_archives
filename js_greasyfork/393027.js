// ==UserScript==
// @name         Open Eruda Console
// @namespace    1147055827
// @version      0.1
// @description  为当前页面增加Eruda调试
// @author       hzCat
// @include      *
// @match        *
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393027/Open%20Eruda%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/393027/Open%20Eruda%20Console.meta.js
// ==/UserScript==

(function() {
    var s = document.createElement("script");
    s.src = "https://cdn.staticfile.org/eruda/1.5.8/eruda.min.js";
    s.addEventListener(
        "load",
        function() {
            eruda.init();
        },
        false
    );
    document.body.appendChild(s);
})();
