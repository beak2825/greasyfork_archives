// ==UserScript==
// @name         Long nick names for wr made by Coldness
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  LONGER NICKNAME
// @author       ૮σℓ∂ɳεรร:P...
// @match        ://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436435/Long%20nick%20names%20for%20wr%20made%20by%20Coldness.user.js
// @updateURL https://update.greasyfork.org/scripts/436435/Long%20nick%20names%20for%20wr%20made%20by%20Coldness.meta.js
// ==/UserScript==

document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 40);