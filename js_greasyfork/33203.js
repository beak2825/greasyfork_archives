// ==UserScript==
// @name         GBF Raidfinder | Highlight new raids
// @namespace    http://fabulous.cupcake.jp.net
// @version      0.1
// @description  Highlight new raids
// @author       FabulousCupcake
// @include      /https?:\/\/.+-raidfinder\.herokuapp\.com.*/
// @match        http://gbf-raidfinder.aikats.us
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/33203/GBF%20Raidfinder%20%7C%20Highlight%20new%20raids.user.js
// @updateURL https://update.greasyfork.org/scripts/33203/GBF%20Raidfinder%20%7C%20Highlight%20new%20raids.meta.js
// ==/UserScript==

const css = `
.gbfrf-tweet {
  box-shadow: 0 60px 0 rgba(64,128,64,0) inset;
  animation: fade 20s;
}

@keyframes fade {
  0% { box-shadow: 0 60px 0 rgba(64,128,64,1) inset; }
  25% { box-shadow: 0 60px 0 rgba(128,128,64,0.5) inset; }
  90% { box-shadow: 0 60px 0 rgba(128,128,64,0.25) inset; }
  100% { box-shadow: 0 60px 0 rgba(64,128,64,0) inset; }
}`;

function injectStylesheet(css) {
    var stylesheetEl = document.createElement('style');
    stylesheetEl.innerHTML = css;
    document.body.appendChild(stylesheetEl);
}

injectStylesheet(css);