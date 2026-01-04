// ==UserScript==
// @name        Don't translate Reddit
// @name:it     Non tradurre Reddit
// @namespace   StephenP
// @match       https://www.reddit.com/*/?tl=*
// @grant       none
// @version     1.0
// @author      StephenP
// @license     copyleft
// @run-at      document-start
// @description Loads the original post instead of the autotranslated version that the search engines link to.
// @description:it Carica il post originale invece della versione autotradotta a cui i motori di ricerca rimandano
// @downloadURL https://update.greasyfork.org/scripts/530285/Don%27t%20translate%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/530285/Don%27t%20translate%20Reddit.meta.js
// ==/UserScript==
window.stop();
window.location.replace(window.location.href.split("?")[0]);