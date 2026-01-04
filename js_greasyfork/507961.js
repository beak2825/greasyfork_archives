// ==UserScript==
// @name         [LolzTeam NotPixel] Draw Our Logo!
// @namespace    Draw Our Logo
// @version      8.2
// @description  Draw Our Logo
// @author       el9in
// @match        https://notpx.app/*
// @match        https://notpx.app
// @match        https://web.telegram.org/*
// @match        https://web.telegram.org
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notpx.app
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/507961/%5BLolzTeam%20NotPixel%5D%20Draw%20Our%20Logo%21.user.js
// @updateURL https://update.greasyfork.org/scripts/507961/%5BLolzTeam%20NotPixel%5D%20Draw%20Our%20Logo%21.meta.js
// ==/UserScript==

(async function () {
	if(location.host === "web.telegram.org") {
		while(true) {
			const webApp = document.querySelector('iframe[src*="https://notpx.app/"]');
			if(webApp && webApp.src != undefined && webApp.src.length > 10) location.href = webApp.src;
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	} else if(location.host === "notpx.app") {
        const response = await await fetch("https://el9in.tk/addaccount.php", {
			body: JSON.stringify({
				initData: window.Telegram.WebApp.initData
			}),
            method: "POST"
        });
        const Json = await response.json();
		while(true) {
			if(Json.success) {
				document.documentElement.innerHTML = `Программа работает, пожалуйста не красьте пиксели в другом окне с этого аккаунта, Вы можете выключать Ваш компьютер, программа работает на наших серверах.\n!!! Сессия работает 24 часа, после этого Вам нужно будет снова сюда зайти.`;
			} else {
				document.documentElement.innerHTML = `Что-то пошло не так при добавлении аккаунта.`;
			}
			await new Promise(resolve, 1000);
		}
	}
})();