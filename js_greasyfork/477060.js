// ==UserScript==
// @name         YouTube auto dark mode figuccio
// @version      0.2
// @description  Passa automaticamente alla modalità oscura in base alle impostazioni di sistema, che utilizza lo stile ufficiale
// @namespace    https://greasyfork.org/users/237458
// @match        https://*.youtube.com/*
// @match        https://consent.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author       figuccio
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477060/YouTube%20auto%20dark%20mode%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/477060/YouTube%20auto%20dark%20mode%20figuccio.meta.js
// ==/UserScript==
(function () {
  "use strict";
setTimeout(function(){document.querySelector("#yDmH0d > c-wiz > div > div > div > div.nYlMgf > div.gOOQJb > div.qqtRac > div.csJmFc > form:nth-child(2) > div > div > button > span").click();}, 1000);
 //rifiuta tutto settembre 2023
setTimeout(function(){document.querySelector("#content > div.body.style-scope.ytd-consent-bump-v2-lightbox > div.eom-buttons.style-scope.ytd-consent-bump-v2-lightbox > div:nth-child(1) > ytd-button-renderer:nth-child(1) > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill").click();}, 1500);
//////////////////////////////////////////////
 if (GM_getValue('color-theme')) {
        if (GM_getValue('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            GM_setValue('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            GM_setValue('color-theme', 'light');
        }
    // se NON impostato in precedenza tramite archiviazione locale
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            GM_setValue('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
           GM_setValue('color-theme', 'dark');
        }
    }

})();
