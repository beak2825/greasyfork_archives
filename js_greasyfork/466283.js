// ==UserScript==
// @name         Better OpenMathBooks Styles
// @namespace    https://greasyfork.org/en/users/1019658-aayush-dutt
// @version      0.2
// @description  A user script to enchance OpenMathBooks page styles
// @author       aayushdutt
// @match        https://discrete.openmathbooks.org/*
// @grant        none
// @link         https://greasyfork.org/en/scripts/466283-better-openmathbooks-styles
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466283/Better%20OpenMathBooks%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/466283/Better%20OpenMathBooks%20Styles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `<style>
header#masthead {
    max-width: 100% !important;
}

div#content {
    margin: 24px auto !important;
    max-width: 900px !important;
}
p {
    line-height: 1.7 !important;
}
  </style>`

  document.head.insertAdjacentHTML("beforeend", styles)
})();