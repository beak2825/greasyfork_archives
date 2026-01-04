// ==UserScript==
// @name         wallhaven
// @namespace    http://wallhaven.cc/
// @version      211106.15
// @description  修复wallhaven预览图无法显示及部分功能失效的问题。进入网站后等两三秒即可
// @author       L-JH
// @namespace    https://gist.github.com/L-JH/fca6df4d7c2c9dca18e2b9400dfabd1c/
// @match        https://wallhaven.cc/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/435086/wallhaven.user.js
// @updateURL https://update.greasyfork.org/scripts/435086/wallhaven.meta.js
// ==/UserScript==
//

(function () {
    "use strict";

    let t = 1;
    let ss = $("script");
    ss.each(function () {
        if (this.src) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = this.src;
            document.getElementsByTagName("head")[0].appendChild(script);
        } else {
            let ih = this.innerHTML;
            setTimeout(function () {
                eval(ih);
            }, t * 1000);
            t = t + 1;
        }
    });
})();