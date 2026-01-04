// ==UserScript==
// @name         Youtube Recently Upload
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change from All to Recently uploaded videos on YouTube homepage.
// @author       vanlong441
// @license MIT
// @match        *://*.youtube.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @downloadURL https://update.greasyfork.org/scripts/436834/Youtube%20Recently%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/436834/Youtube%20Recently%20Upload.meta.js
// ==/UserScript==
/* globals waitForElems */

(function() {
    'use strict';
        waitForElems({ sel: "#text[title='Recently uploaded']", onmatch: elem => {setTimeout(() => elem.click(), 0) } })
})();