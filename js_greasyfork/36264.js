// ==UserScript==
// @name         NotaParaná
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Solução para doação de notas Nota Paraná
// @author       Lin
// @match        https://notaparana.pr.gov.br/nfprweb/DoacaoDocumentoFiscalCadastrar
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36264/NotaParan%C3%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/36264/NotaParan%C3%A1.meta.js
// ==/UserScript==


//Adquira a solução pelo e-mail linchiyu1994@gmail.com
//Autorizado para:
var entidade = 'Cáritas Diocesana de Ponta Grossa';
var cnpj = '09.013.770/0001-43';
var cnpjLimpo = '09013770000143';


var chaves;
var i;

function go() {
    console.log("Enviando nota");
    document.getElementById('btnDoarDocumento').click();
    document.getElementById("btnDoarDocumento").disabled = false;
    document.getElementById('chaveAcesso').focus();
}

function insereNovo(){
    if (document.getElementById('cnpjEntidade').value == ""){
        document.getElementById('cnpjEntidade').value = cnpj;
    }
    console.log("Iniciando Script Nota Paraná - Produzido por Lin");
    var caixa = document.createElement("INPUT");
    caixa.setAttribute("type", "text");
    caixa.setAttribute("tag", "text");
    caixa.setAttribute("id", "caixaTexto");
    document.getElementById("fdsCadastroDocumentoFiscal").appendChild(caixa);

    var aceitaArquivo = document.createElement("button");
    aceitaArquivo.setAttribute("type", "button");
    aceitaArquivo.setAttribute("tag", "button");
    aceitaArquivo.setAttribute("id", "btnAceitar");
    aceitaArquivo.appendChild(document.createTextNode('Aceitar'));
    document.getElementById("fdsCadastroDocumentoFiscal").appendChild(aceitaArquivo);

    document.getElementById('chaveAcesso').focus();
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

function salvarChaves (){
    console.log('Lendo chaves...');
    chaves = document.getElementById('caixaTexto').value;
    console.log('Lista de chaves='+chaves);
    var temp;
    var cont = 0;
    for (i=0; i<chaves.length;i++){
        temp = chaves.substring(i,i+44);
        console.log('Chave atual= '+temp);
        document.getElementById('chaveAcesso').value = temp;
        i=i+44;
        wait (500);
        go();
        cont++;
    }
    window.alert(cont+" notas enviadas!");
}

function verificaCnpj (){
    var testeCnpj = document.getElementById('cnpjEntidade').value;
    if ( testeCnpj != cnpj && testeCnpj != cnpjLimpo){
        window.alert("Sistema autorizado para a entidade "+entidade);
        window.alert("Caso desejar adquirir o programa para sua entidade, entre em contato com Lin pelo e-mail linchiyu1994@gmail.com");
    }
    document.getElementById('cnpjEntidade').value = cnpj;
}

window.onload = insereNovo();
document.getElementById('chaveAcesso').addEventListener("change", go);
document.getElementById('btnAceitar').addEventListener("click", salvarChaves);
document.getElementById('cnpjEntidade').addEventListener("change", verificaCnpj);