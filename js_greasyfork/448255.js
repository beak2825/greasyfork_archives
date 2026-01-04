// ==UserScript==
// @name                Noronhas avoid LER 
// @namespace           http://greasemonkey.chizzum.com
// @description         Economiza alguns clicks
// @match             	http://www.campineirautilidades.com.br/produto.php*
// @match             	http://www.campineira.com.br/produto.php*
// @match             	https://sellercentral.amazon.com/product-search/*
// @version             0.081
// @icon			    data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/448255/Noronhas%20avoid%20LER.user.js
// @updateURL https://update.greasyfork.org/scripts/448255/Noronhas%20avoid%20LER.meta.js
// ==/UserScript==

function DefinirSiteEscopo()
{
    if (window.location.host.indexOf("campineirautilidades.com.br") != -1 ||
		window.location.host.indexOf("campineira.com.br") != -1) {
        InjetarCampineira();
    }else if (window.location.host.indexOf("amazon.com") != -1) {
		InjetarAmazonPesquisa();
    }
}

function InjetarCampineira()
{
    var selectorEAN = $('strong').filter(":contains('EAN')");
    if (selectorEAN.length > 0)
    {
        var EAN = selectorEAN[0].nextSibling;

        var botaoPesquisa = document.createElement('a');
        botaoPesquisa.textContent = "Pesquisar na Amazon";
        botaoPesquisa.style = "-webkit-appearance: button;-moz-appearance: button;appearance: button;text-decoration: none;color: initial;";
        botaoPesquisa.href = "https://sellercentral.amazon.com/product-search/search/?q=" + EAN.textContent.trim() + "&psqAuRodEr=1";
        botaoPesquisa.target = "_blank";

        selectorEAN[0].parentElement.appendChild(botaoPesquisa);
    }
    else
    {
        console.log("Não encontrei EAN nessa página");
    }
}

function InjetarAmazonPesquisa()
{
	console.log('Injeção OK');
	
    var pesquisaAutomatizada = genericGetQueryString(window.location.href, "psqAuRodEr");
    if (pesquisaAutomatizada == 1)
    {
		
		if (document.getElementById("katal-id-0").value == "")
		{
			//Não pegou o texto.
			console.log('Não pegou o texto.');
			
			window.location.reload();
			return;
		}		
		
		window.setTimeout(function(){
			document.getElementsByName("search")[0].click();
		}, 1500);
				
		window.setTimeout(function(){
			document.getElementsByClassName("kat-link")[0].click();
		}, 5000);
        
    }
}

function genericGetQueryString(link, name) {
	var pos = link.indexOf(name + '=') + name.length + 1;
	var len = link.substr(pos).indexOf('&');
	if (-1 == len) len = link.substr(pos).length;
	return link.substr(pos, len);
}

window.onload = function()
    {
        window.setTimeout(function()
		{
			DefinirSiteEscopo();
		},1500);		

        return true;
    };