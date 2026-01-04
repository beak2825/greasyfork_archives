    // ==UserScript==
    // @name         Auto Approve Metamask
    // @namespace    http://tampermonkey.net/
    // @version      0.11
    // @description  Aprova a metamask automaticamente pro pegaxy :)
    // @author       LuqDragon
    // @match        metamask
    // @icon         https://www.google.com/s2/favicons?domain=pegaxy.io
    // @grant        none
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439842/Auto%20Approve%20Metamask.user.js
// @updateURL https://update.greasyfork.org/scripts/439842/Auto%20Approve%20Metamask.meta.js
    // ==/UserScript==
    
    (async function() {
    	function sleep(ms) {
    		return new Promise(resolve => setTimeout(resolve, ms));
    	}
    	
    	const $ = (elem) => {
    		return document.querySelector(elem);
    	};
    	
    	function atividadeAtiva(tabs){
    		return tabs.children[1].className.includes("active");
    	}
    	
    	function abrirAtividades(tabs){
    		tabs.children[1].click();
    	}
    	
    	function assinaturaSegura(){
    		return $(".request-signature__origin")?.innerText == "https://play.pegaxy.io"
    	}
    	
    	var aguardandoAssinatura = false;
    	while(true) {
    	    var tabs = $(".tabs__list.home__tabs");
    		if(tabs && !atividadeAtiva(tabs))
    			abrirAtividades(tabs)
    		else {
    			var pendente = $(".transaction-list__pending-transactions > .list-item");
    			if(pendente){
    				pendente.click();
    				aguardandoAssinatura = true;
    			}
    			if(aguardandoAssinatura && assinaturaSegura()) {
    				var botao = $(".request-signature__footer__sign-button");
    				if(botao){
    					aguardandoAssinatura = false;
    					botao.click();
    				}
    			}
    		}
    		await sleep(500);
    	}
    })();