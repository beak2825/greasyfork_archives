// ==UserScript==
// @name        Don't translate Android Developers
// @name:it     Non tradurre Android Developers
// @namespace   StephenP
// @match       https://developer.android.com/*?hl=*
// @grant       none
// @version     1.0
// @author      StephenP
// @license     copyleft
// @run-at      document-start
// @description Loads the original page instead of the autotranslated version that the search engines link to.
// @description:it Carica la pagina originale invece della versione autotradotta a cui i motori di ricerca rimandano.
// @downloadURL https://update.greasyfork.org/scripts/533765/Don%27t%20translate%20Android%20Developers.user.js
// @updateURL https://update.greasyfork.org/scripts/533765/Don%27t%20translate%20Android%20Developers.meta.js
// ==/UserScript==
window.stop();
window.location.replace(window.location.href.split("?")[0]);