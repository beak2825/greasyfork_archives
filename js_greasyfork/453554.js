

    // ==UserScript==
    // @name        Sugaroo Link Conversion
    // @namespace   https://github.com/earthplusthree/userscripts
    // @license     MIT
    // @match       *://www.reddit.com/r/FashionReps/*
    // @grant       none
    // @version     1.0
    // @author      earthplusthree
    // @description Converts Taobao and Weidan links on r/FashionReps to Sugaroo links, but Pandabuy best agent, ok? I pull up at the afterparty
// @downloadURL https://update.greasyfork.org/scripts/453554/Sugaroo%20Link%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/453554/Sugaroo%20Link%20Conversion.meta.js
    // ==/UserScript==
     
    window.onload = () => {
      Array.from(document.getElementsByTagName("a"))
        .filter((link) => link.href.includes("://item.taobao.com/item.htm") || link.href.includes("://weidian.com/item.html"))
        .forEach((link) => {
          link.href = "https://www.sugargoo.com/index/item/index.html?url=" + encodeURIComponent(link.href);
          link.innerText = link.innerText + " (SUGAROO)";
        });
    };

