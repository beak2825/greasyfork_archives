// ==UserScript==
// @name         Pegaxy Auto Play
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Joga com os cavalin automatico
// @author       Zimbardo
// @match        https://play.pegaxy.io/racing/finish*
// @match        https://play.pegaxy.io/racing/pick-pega*
// @icon         https://www.google.com/s2/favicons?domain=pegaxy.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449225/Pegaxy%20Auto%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/449225/Pegaxy%20Auto%20Play.meta.js
// ==/UserScript==

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const $ = (elem) => {
	return document.querySelector(elem);
};

const $a = (elem) => {
	return document.querySelectorAll(elem);
};

(async function() {
    var pegaId = 0;
    while(true){
        if(!$(".viewAlert")){
            var botan = $(".button-game.pinks");
            var botan2 = $(".title");

            if(botan && (botan.innerText == "NEXT MATCH" || botan.innerText == "Find another match")){
				pegaId = 0;
                botan.click();
			}
            else if(botan2 && botan2.innerText == "FIND MATCH")
                botan2.click();
        }
        else {
			var botan = $(".button-game.pinks");
            if(botan)
				botan.click();

            botan = $(".button-game.primary");
            if(botan && botan.innerText == "I understand"){
                botan.click();
				pegaId++;
				var pegaxy = $a(".item-pega")[pegaId];
				if(pegaxy)
                	pegaxy.click()
				else {
					console.log("Recarregamento da página agendado para daqui 5 minutos!");
					setTimeout(() => {
						window.location.reload();
					}, 300000);
					break;
				}
            }
        }
        await sleep(1000);
    }
})();