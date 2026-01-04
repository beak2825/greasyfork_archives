// ==UserScript==
// @name                Plurk 討論串置中對齊
// @version             0.0.2
// @description         討論串置中對齊
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/NobhW0E.png
// @match               https://www.plurk.com/p/*
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/477660/Plurk%20%E8%A8%8E%E8%AB%96%E4%B8%B2%E7%BD%AE%E4%B8%AD%E5%B0%8D%E9%BD%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/477660/Plurk%20%E8%A8%8E%E8%AB%96%E4%B8%B2%E7%BD%AE%E4%B8%AD%E5%B0%8D%E9%BD%8A.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    "use strict"

    function centerArticle() {
        const article = document.querySelector("#permanent-holder")
        if (!article) return
        article.style.padding = "50px 185px 20px 185px"
    }

    function main() {
        centerArticle()
    }

    main()

})();
