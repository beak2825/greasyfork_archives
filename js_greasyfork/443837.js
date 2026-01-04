// ==UserScript==
// @name         AutoDossie-VPM
// @namespace
// @version      1.06
// @description  Cria automaticamente o Dossie!
// @author       Leonardo Rigotti
// @match        https://portalunico.siscomex.gov.br/*
// @match        https://portalunico.siscomex.gov.br/edocex/private/dossieAbrir.jsf
// @match        https://portalunico.siscomex.gov.br/edocex/private/dossieCriar.jsf
// @grant        GM_addStyle
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/443837/AutoDossie-VPM.user.js
// @updateURL https://update.greasyfork.org/scripts/443837/AutoDossie-VPM.meta.js
// ==/UserScript==
(function() {
    'use strict';
    /* Ex....*/
    var pAnvisa_f = function(){
        //Licença de Importação
        document.querySelector("#formPrincipal\\:tpDocumento_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child(84)").click()
        setTimeout(function (){document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudo").value ="Licença de Importação"},1*500)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(8)").click()},2*500)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div.ui-picklist-buttons > div > button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-picklist-button-add").click()},2*500)
        setTimeout(function (){document.querySelector("#formPrincipal\\:btnIncluir > span").click()},3*500)
        //Peticionamento Eletronico
        setTimeout(function (){document.querySelector("#formPrincipal\\:tpDocumento_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child(96)").click()},4*500)
        setTimeout(function (){document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:caixaCombinacao_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child(34)").click()},5*500)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(8)").click()},5*500)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div.ui-picklist-buttons > div > button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-picklist-button-add").click()},6*500)
        setTimeout(function (){document.querySelector("#formPrincipal\\:btnIncluir > span").click()},7*500)
    }


    //Função que Seleciona o Tipo do documento
    var select_document = function(item, position, org){
        //Click in item_document[position][0]
        document.querySelector("#formPrincipal\\:tpDocumento_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child("+item[position][0]+")").click();
        //Após o click preciso verificar se ocorreu tudo bem vamos aguardar 200ms
        setTimeout(() => { select_document_check(item, position, org);
                         }, 200);
    };

    //Function confirm select_document
    var select_document_check = function(item, position, org){
        //Check a select document is the correct
        if(document.querySelector("#formPrincipal\\:tpDocumento_label").textContent == item[position][2]){
            write(item, position, org);
        }
        else{
            setTimeout(() => { select_document_check(item, position, org);
                             }, 300);
        }
    };

    //Function Write
    var write = function(item, position, org){
        //Write item[position][1] in box
        document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudo").value = item[position][1];

        //Call check_write function to check the write
        setTimeout(() => {
            write_check(item, position, org);
        }, 200);
    };

    //Function Check_write
    var write_check = function(item, position, org){
        //Check to confirm write in the box
        if(document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudo").value == item[position][1]){
            //Verify have a org selected or not
            org_check(item, position, org);
        }
        else{
            setTimeout(()=> {
                write(item, position, org);
            }, 200);
        }
    };

    //Function isLPCO / have org?
    var org_check = function(item, position, org){
        if(!document.querySelector("#formPrincipal\\:pickListOrgaos > div:nth-child(3) > ul > li")){
            select_org(item, position, org);
        }
        else{
            setTimeout(() =>{
                add_confirm(item, position, org);
            }, 200);
        }
    };

    //Function select_org
    var select_org = function(item, position, org){
        document.querySelector(org).click();
        document.querySelector("#formPrincipal\\:pickListOrgaos > div.ui-picklist-buttons > div > button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-picklist-button-add").click()
        setTimeout(() => {
            org_check(item, position, org);
        }, 200);
    };

    //Function Confirm
    var add_confirm = function(item, position, org){
        var cont = item.length;
        document.querySelector("#formPrincipal\\:btnIncluir").click();

        if(position == cont - 1){
            alert("Só anexar os docs!, desenvolvido por Leonardo R.");
        }
        else{
            var x = position + 1;
            setTimeout(() => {
                select_document(item, x, org);
            }, 200);
        }
    };

    var auto_dossie = function(item, org){
        select_document(item, 0, org);
    }

    /*Variaveis de orgãos */
    var org_anvisa = "#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(8)";
    var org_mapa = "#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(21)";
    var org_rfb = "#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(2)";
    /*Variaveis do Portal Unico*/
    var fatura = ["65", "Fatura Comercial","Fatura Comercial"];
    var packing = ["115","Packing List","Romaneio de Carga (packing list)"];
    if(!document.querySelector("#formPrincipal\\:pickListOrgaos_target > option")){
        packing = ["108","Packing List","Romaneio de Carga (packing list)"];
    }
    var mic = ["89","MIC/DTA","Manifesto Internacional de Carga, MIC/DTA ou TIF/DTA"];
    var crt = ["39","CRT","Conhecimento de Embarque"];
    var planilha_umi = ["62" ,"Planilha de UMI","Documentos - Outros"];
    var fito = ["32","Fitossanitário","Certificado Fitossanitário"];
    var origem = ["25","Certificado de Origem","Certificado de Origem"];
    var alvara = ["83","Alvará","Licença de Funcionamento (Alvará)"];
    var dec_lote = ["51","Declaração de Lote","Declaração de Lotes "];
    var gru = ["68","GRU","GRU - Guia de Recolhimento da União"];
    var comp_gru = ["36","Comprovante de pagamento GRU","Comprovante - Outros"];
    var li = ["84","Licença de Importação","Licença de Importação"];
    var cert_analise = ["19","Certificado de Analise","Certificado - Outros"];
    var doc_outros = "62";
    /*Variaveis dos tipo de anexos*/
    /* Completo */
    var mapa = [fatura, mic, crt, packing, fito, origem];
    var anvisa = [fatura, mic, crt, packing, dec_lote, cert_analise, alvara, alvara, alvara];
    var receita = [fatura, origem, mic, crt, packing];
    /* Inicial */
    var li_gru = [li, gru, comp_gru];
    var rotulo = [[doc_outros,"Registro do produto + Rotulo","Documentos - Outros"]];
    var jbs = [[doc_outros, "Habilitação DIPOA","Documentos - Outros"], [doc_outros, "Registro do Produto","Documentos - Outros"], [doc_outros, "Rotulo","Documentos - Outros"]];
    var li_form = [li, [doc_outros, "Forulário"]];
    var li_sub = [li, ["84", "Licença de Importação - SUB","Licença de Importação"], origem]

    /*-----------Function----------*/
    function myFunc_01() {
        document.getElementById("listaCompleta_01").classList.toggle("show");
    }
    function myFunc_01o() {
        document.getElementById("listaCompleta_01").classList.remove("show");
    }
    function myFunc_02() {
        document.getElementById("listaCompleta_02").classList.toggle("show");
    }
     function myFunc_02o() {
        document.getElementById("listaCompleta_02").classList.remove("show");
    }

    /*-----------HTML--------------*/
    var addButtonHTML_01 = function(){
        var divprincipal_01 = document.createElement('div')
        divprincipal_01.setAttribute('class','principal_01')
        var btnprincipal_01 = document.createElement('button')
        btnprincipal_01.setAttribute('class','buttonPricipal_01')
        btnprincipal_01.innerHTML = 'Docs. Completos'
        divprincipal_01.onmouseover = function(){myFunc_01()}
        divprincipal_01.onmouseout = function(){myFunc_01o()}
        var divSecundaria_01 = document.createElement('div')
        divSecundaria_01.setAttribute('id','listaCompleta_01')
        divSecundaria_01.setAttribute('class','lista-completa_01')
        var mapa_anexo = document.createElement('a')
        mapa_anexo.innerHTML = 'Mapa'
        mapa_anexo.onclick = function(){myFunc_01o(); auto_dossie(mapa, org_mapa)}
        var anvisa_anexo = document.createElement('a')
        anvisa_anexo.innerHTML = 'Anvisa'
        anvisa_anexo.onclick = function(){myFunc_01o(); auto_dossie(anvisa, org_anvisa)}
        var rfb_anexo = document.createElement('a')
        rfb_anexo.innerHTML = 'RFB'
        rfb_anexo.onclick = function(){myFunc_01o(); auto_dossie(receita, org_rfb)}
        /*Aprendendo os elementos*/
        divSecundaria_01.appendChild(rfb_anexo)
        divSecundaria_01.appendChild(anvisa_anexo)
        divSecundaria_01.appendChild(mapa_anexo)
        divprincipal_01.appendChild(btnprincipal_01)
        divprincipal_01.appendChild(divSecundaria_01)
        if(document.getElementById('formPrincipal:fieldDoc_content')){
            document.body.appendChild(divprincipal_01)}
    }
    var addButtonHTML_02 = function(){
        var divprincipal_02 = document.createElement('div')
        divprincipal_02.setAttribute('class','principal_02')
        var btnprincipal_02 = document.createElement('button')
        btnprincipal_02.setAttribute('class','buttonPricipal_02')
        btnprincipal_02.innerHTML = 'Processo Inicial'
        divprincipal_02.onmouseover = function(){myFunc_02()}
        divprincipal_02.onmouseout = function(){myFunc_02o()}
        var divSecundaria_02 = document.createElement('div')
        divSecundaria_02.setAttribute('id','listaCompleta_02')
        divSecundaria_02.setAttribute('class','lista-completa_02')
        var liGru = document.createElement('a')
        liGru.innerHTML = 'Li & Gru'
        liGru.onclick = function(){myFunc_02o(); auto_dossie(li_gru, org_mapa)}
        var pAnvisa = document.createElement('a')
        pAnvisa.innerHTML = 'P. Anvisa'
        pAnvisa.onclick = function(){myFunc_02o(); pAnvisa_f()}
        var rotulo_anexo = document.createElement('a')
        rotulo_anexo.innerHTML ='Rotulo'
        rotulo_anexo.onclick = function(){myFunc_02o(); auto_dossie(rotulo, org_mapa)}
        var jbs_anexo = document.createElement('a')
        jbs_anexo.innerHTML = 'JBS'
        jbs_anexo.onclick = function(){myFunc_02o(); auto_dossie(jbs, org_mapa)}
        var liFormulario = document.createElement('a')
        liFormulario.innerHTML = 'Li & Formulário'
        liFormulario.onclick = function(){myFunc_02o(); auto_dossie(li_form, org_mapa)}
        var li_li_sub = document.createElement('a')
        li_li_sub.innerHTML = 'LI, Sub & CO'
        li_li_sub.onclick = function(){myFunc_02o(); auto_dossie(li_sub, org_mapa)}
        /*Aprendendo os elementos*/
        divSecundaria_02.appendChild(liGru)
        divSecundaria_02.appendChild(pAnvisa)
        divSecundaria_02.appendChild(rotulo_anexo)
        divSecundaria_02.appendChild(jbs_anexo)
        divSecundaria_02.appendChild(liFormulario)
        divSecundaria_02.appendChild(li_li_sub)
        divprincipal_02.appendChild(btnprincipal_02)
        divprincipal_02.appendChild(divSecundaria_02)
        if(document.getElementById('formPrincipal:fieldDoc_content')){
            document.body.appendChild(divprincipal_02)}
    }

    addButtonHTML_02()
    addButtonHTML_01()
    GM_addStyle(`
.buttonPricipal_01 {
background-color: #3498DB;
color: white;
padding: 10px;
font-size: 14px;
border: none;
cursor: pointer;

}

.buttonPricipal_01:hover, .buttonPricipal_01:focus {
background-color: #2980B9;
}

.principal_01 {
left: 650px;
top: 220px;
position: absolute;
display: inline-block;
}

.lista-completa_01 {
display: none;
position: absolute;
min-width: 126px;
overflow: auto;
-webkit-box-shadow: 8px 8px 14px 0px rgba(0,0,0,0.85);
box-shadow: 8px 8px 14px 0px rgba(0,0,0,0.85);
background: #EDEDED;
z-index: 1;
}

.lista-completa_01 a {
color: black;
padding: 12px 16px;
text-decoration: none;
font-family: "Lucida Console", Courier, monospace;
display: block;
}

.principal_01 a:hover {background-color: #ddd;}

.show {display: block;}`)
    GM_addStyle(`
.buttonPricipal_02 {
background-color: #3498DB;
color: white;
padding: 10px;
font-size: 14px;
border: none;
cursor: pointer;

}

.buttonPricipal_02:hover, .buttonPricipal_02:focus {
background-color: #2980B9;
}

.principal_02 {
left: 776.61px;
top: 220px;
position: absolute;
display: inline-block;
}

.lista-completa_02 {
display: none;
position: absolute;
min-width: 119px;
overflow: auto;
-webkit-box-shadow: 8px 8px 14px 0px rgba(0,0,0,0.85);
box-shadow: 8px 8px 14px 0px rgba(0,0,0,0.85);
background: #EDEDED;
z-index: 1;
}

.lista-completa_02 a {
color: black;
padding: 12px 16px;
text-decoration: none;
font-family: "Lucida Console", Courier, monospace;
display: block;
}

.principal_02 a:hover {background-color: #ddd;}

.show {display: block;}`)

})();