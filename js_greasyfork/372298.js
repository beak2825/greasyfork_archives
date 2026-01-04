// ==UserScript==
// @name         Correios - Preenchimento do formulário de Cotação de frete
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Preenche formulário de cotação de frete.
// @author       Fernando Mendes Fonseca
// @match        http://www2.correios.com.br/sistemas/precosPrazos/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372298/Correios%20-%20Preenchimento%20do%20formul%C3%A1rio%20de%20Cota%C3%A7%C3%A3o%20de%20frete.user.js
// @updateURL https://update.greasyfork.org/scripts/372298/Correios%20-%20Preenchimento%20do%20formul%C3%A1rio%20de%20Cota%C3%A7%C3%A3o%20de%20frete.meta.js
// ==/UserScript==

/*
    Changelog:
    0.1 Prefill all inputs

*/
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

document.getElementsByName("cepDestino")[0].onclick = function(){preenche();};

function preenche() {
    document.getElementsByName("cepOrigem")[0].value = "71070-724";
    document.getElementsByName("servico")[0].value = "41106";

    VerificaServico(document.formulario);
    MostraValorDeclarado(document.formulario);
    VerificaEmbalagemCaixa(document.formulario);

    document.getElementsByName("compararServico")[0].checked = true;
    EnviaFormato(1);
sleep(1000);
    EnviaFormato(1);

    document.formulario.Formato.value=1;
	document.formulario.Selecao.value="caixa selected";
	document.all.spanComprimento.style.display="none";
	document.formulario.Formato.focus();


    document.getElementsByName("embalagem1")[0].value = "outraEmbalagem1";
    document.getElementsByName("Altura")[0].value = "20";
    document.getElementsByName("Largura")[0].value = "20";
    document.getElementsByName("Comprimento")[0].value = "20";
    document.getElementsByName("peso")[0].value = "1";
}