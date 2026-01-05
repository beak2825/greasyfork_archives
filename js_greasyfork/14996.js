// ==UserScript==
// @author       Dione Ramos
// @name         CRF 2
// @version      0.5
// @description  Automatiza a consulta de Regularidade do Empregador
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match        https://www.sifge.caixa.gov.br/*
// @grant        none
// @namespace https://greasyfork.org/users/23504
// @downloadURL https://update.greasyfork.org/scripts/14996/CRF%202.user.js
// @updateURL https://update.greasyfork.org/scripts/14996/CRF%202.meta.js
// ==/UserScript==
/* jshint -W097 */

var url = window.location.href;

 if(url == "https://www.sifge.caixa.gov.br/Cidadao/Crf/Crf/FgeCfSConsultaRegularidade.asp"){
    
    Redirect('FgeCfSPesquisaMotivo.asp'); 
	 
 }else if(url == "https://www.sifge.caixa.gov.br/Cidadao/Crf/Crf/FgeCfSPesquisaMotivo.asp"){
    
    $("input[value='99']").prop('checked', true);
    ValidarSelecao();
	 
 }else if(url == "https://www.sifge.caixa.gov.br/Cidadao/Crf/Crf/FgeCfSImprimirCrf.asp"){
     
     Imprime();
	 
 }else if(window.location.pathname == "/Empresa/Crf/Crf/FgeCFSImprimirPapel.asp"){
    
     window.print();
 }
 
 