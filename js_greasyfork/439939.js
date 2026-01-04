// ==UserScript==
// @name         Pegaxy Auto Play
// @namespace    https://greasyfork.org/users/871230-linkzera
// @version      0.1
// @description  Bot para jogar sozinho
// @author       Linkzera
// @match        https://play.pegaxy.io/racing/finish*
// @match        https://play.pegaxy.io/racing/pick-pega*
// @icon         https://www.google.com/s2/favicons?domain=pegaxy.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439939/Pegaxy%20Auto%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/439939/Pegaxy%20Auto%20Play.meta.js
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
            var botao = $(".button-game.pinks");
            var botao2 = $(".viewButton");
 
            if(botao && (botao.innerText == "NEXT MATCH" || botao.innerText == "Find another match")){
				pegaId = 0;
                botao.click();
			}
            else if(botao2 && botao2.innerText == "START")
                botao2.click();
        }
        else {
			var botao = $(".button-game.pinks");
            if(botao)
				botao.click();
 
            botao = $(".button-game.primary");
            if(botao && botao.innerText == "I understand"){
                botao.click();
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