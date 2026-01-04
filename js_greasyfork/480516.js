// ==UserScript==
// @name         Auto Reload Every X Seconds
// @namespace    https://udun.mordorintelligence.com
// @version      0.2
// @description  Perform auto reload on nocodb table
// @author       Rishabh Nishad
// @match        https://udun.mordorintelligence.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480516/Auto%20Reload%20Every%20X%20Seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/480516/Auto%20Reload%20Every%20X%20Seconds.meta.js
// ==/UserScript==

const delayToAutoReloadInMilliseconds = 60*1000;
const reloadCSSSelector = 'div.ml-1:nth-child(6) > svg.nc-icon';

setInterval(performReloadClick, delayToAutoReloadInMilliseconds);

async function performReloadClick() {

      if(!/https:\/\/udun\.mordorintelligence\.com\/dashboard\/.*\/.*\/.*\/.*/igm.test(window.location.href)) return;

      await waitForElement(reloadCSSSelector);
      //console.log('Reload icon is ready');

      var divElement = document.querySelector(reloadCSSSelector);

      if(!divElement) return;
      //console.log("divElement",divElement);


        var clickEvent = new Event('click');
        divElement.dispatchEvent(clickEvent);
        //console.log("Clicked Reload");

}




function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}