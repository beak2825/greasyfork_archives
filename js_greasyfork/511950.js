// ==UserScript==
// @name         fitten code ui modify
// @namespace    https://code.fittentech.com/try
// @version      2025-1-1
// @description  try to take over the world!
// @author       You
// @match        https://code.fittentech.com/try
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fittentech.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511950/fitten%20code%20ui%20modify.user.js
// @updateURL https://update.greasyfork.org/scripts/511950/fitten%20code%20ui%20modify.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    window.onload = function () {
        setTimeout(
            () => { myFunction(); },
            1000
        );
        console.log("所有内容都已加载完毕");

    };

    function myFunction() {
        document.querySelector(".site-header").style.display = "none";
        document.querySelector(".iframe-intro-text").style.display = "none";
        let e = document.querySelector(".iframes-container");
        e.style.display = "initial";
        document.querySelector("html").style.background = "#1e1e1e";

        let m = e.querySelector("iframe:nth-of-type(1)");
        m.style.position = " fixed";
        m.style.height = " 100vh";
        m.style.top = "0";
        m.style.right = " 0";
        m.style.left = " 0";
        m.style.width = " 100%";
        m.style.zIndex = "99999";


        let ed = e.querySelector("iframe:nth-of-type(2)");
        ed.style.position = " fixed";
        ed.style.height = "100vh";
        ed.style.top = "0";
        ed.style.right = " 0";
        ed.style.left = " 0";
        ed.style.width = " 100%";

        ed.contentDocument.querySelector("#tabs").style.display = "none";
        ed.contentDocument.querySelector("body").style.margin = "0";
        ed.contentDocument.querySelector("#editor").style.height = "100%";
    }
})();