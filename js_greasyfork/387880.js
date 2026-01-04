// ==UserScript==
// @name         Palimas.tv fixed
// @namespace    https://palimas.tv/
// @version      1.0
// @description  Fix links on Palimas.tv
// @author       whatever
// @match        https://palimas.tv/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387880/Palimastv%20fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/387880/Palimastv%20fixed.meta.js
// ==/UserScript==

(function() {
  const links = document.querySelectorAll("a");
  for (let link of links.entries()) {
    if (link[1].onclick) {
      const url = link[1]
        .getAttribute("onclick")
        .replace("window.open('", "https://palimas.tv/")
        .replace("');", "");
      link[1].setAttribute("href", url);
    }
  }
})();

