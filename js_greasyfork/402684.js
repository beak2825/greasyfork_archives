// ==UserScript==
// @name         Dossie Rodoviario
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Anexar Docs dossie Rodoviario WEST
// @author       Matheus Cristian Farias
// @include      https://portalunico.siscomex.gov.br/edocex/private/dossieAbrir.jsf
// @include      https://portalunico.siscomex.gov.br/edocex/private/dossieCriar.jsf
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/402684/Dossie%20Rodoviario.user.js
// @updateURL https://update.greasyfork.org/scripts/402684/Dossie%20Rodoviario.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    var li_li_sub_f = function(){
        //Licença de Importação
        document.querySelector("#formPrincipal\\:tpDocumento_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child(84)").click()
        setTimeout(function (){document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudo").value ="Licença de Importação"},1*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(20)").click()},2*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div.ui-picklist-buttons > div > button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-picklist-button-add").click()},2*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:btnIncluir > span").click()},3*tempo)
        //Licença de Importação Sub
        setTimeout(function (){document.querySelector("#formPrincipal\\:tpDocumento_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child(84)").click()},4*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudo").value ="Licença de Importação - SUB"},5*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(20)").click()},6*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div.ui-picklist-buttons > div > button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-picklist-button-add").click()},6*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:btnIncluir > span").click()},7*tempo)
        //DAT
        setTimeout(function (){document.querySelector("#formPrincipal\\:tpDocumento_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child(105)").click()},8*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudo").value ="Requerimento - DAT"},9*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(20)").click()},10*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div.ui-picklist-buttons > div > button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-picklist-button-add").click()},10*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:btnIncluir > span").click()},11*tempo)
    }
    var mapa_f = function(){
        //FATURA COMERCIAL
        document.querySelector("#formPrincipal\\:tpDocumento_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child(65)").click()
        setTimeout(function (){document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudo").value ="Fatura Comercial"},1*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(20)").click()},1*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div.ui-picklist-buttons > div > button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-picklist-button-add").click()},2*tempo)
        setTimeout(function (){document.getElementById("formPrincipal:btnIncluir").click()},3*tempo)
        //PACKING LIST
        setTimeout(function (){document.querySelector("#formPrincipal\\:tpDocumento_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child(107)").click()},4*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudo").value ="Packing List"},5*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(20)").click()},5*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div.ui-picklist-buttons > div > button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-picklist-button-add").click()},6*tempo)
        setTimeout(function (){document.getElementById("formPrincipal:btnIncluir").click()},7*tempo)
        //CRT
        setTimeout(function (){document.querySelector("#formPrincipal\\:tpDocumento_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child(39)").click()},8*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudo").value ="CRT"},9*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(20)").click()},9*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div.ui-picklist-buttons > div > button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-picklist-button-add").click()},10*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:btnIncluir > span").click()},11*tempo)
        //MIC-DTA
        setTimeout(function (){document.querySelector("#formPrincipal\\:tpDocumento_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child(89)").click()},12*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudo").value ="MIC/DTA"},13*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(20)").click()},13*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div.ui-picklist-buttons > div > button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-picklist-button-add").click()},14*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:btnIncluir > span").click()},15*tempo)
        //Fitossanitário
        setTimeout(function (){document.querySelector("#formPrincipal\\:tpDocumento_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child(32)").click()},16*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudo").value ="Fitossanitário"},17*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(20)").click()},17*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div.ui-picklist-buttons > div > button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-picklist-button-add").click()},18*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:btnIncluir > span").click()},19*tempo)
        //Certificado de Origem
        setTimeout(function (){document.querySelector("#formPrincipal\\:tpDocumento_panel > div.ui-selectonemenu-items-wrapper > ul > li:nth-child(25)").click()},20*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudo").value ="Certificado de Origem"},21*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div:nth-child(1) > ul > li:nth-child(20)").click()},21*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:pickListOrgaos > div.ui-picklist-buttons > div > button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-picklist-button-add").click()},22*tempo)
        setTimeout(function (){document.querySelector("#formPrincipal\\:btnIncluir > span").click()},23*tempo)
        
    }
    /*-----------TEMPO-------------*/
    var tempo = 650;
    /*-----------Function----------*/

    function myFunc_01() {
        document.getElementById("listaCompleta_01").classList.toggle("show");
    }
    function myFunc_02() {
        document.getElementById("listaCompleta_02").classList.toggle("show");
    }

    // Quando clicado fora da caixa de alguma das duas caixas elas são fechadas
    window.onclick = function(event) {
        if (!event.target.matches('.principal_01','principal_02')) {
            var dropdowns_01 = document.getElementsByClassName("lista-completa_01");
            var dropdowns_02 = document.getElementsByClassName("lista-completa_02");
            let i;
            for (i = 0; i < dropdowns_01.length; i++) {
                var openDropdown_01 = dropdowns_01[i];
                if (openDropdown_01.classList.contains('show')) {
                    openDropdown_01.classList.remove('show');
                }
            }
            for (i = 0; i < dropdowns_02.length; i++) {
                var openDropdown_02 = dropdowns_02[i];
                if (openDropdown_02.classList.contains('show')) {
                    openDropdown_02.classList.remove('show');
                }
            }
        }
    }
    /*-----------HTML--------------*/
    var addButtonHTML_01 = function(){
        var divprincipal_01 = document.createElement('div')
        divprincipal_01.setAttribute('class','principal_01')
        var btnprincipal_01 = document.createElement('button')
        btnprincipal_01.setAttribute('class','buttonPricipal_01')
        btnprincipal_01.innerHTML = 'Dossiê Completo'
        btnprincipal_01.onclick = function(){myFunc_01()}
        var divSecundaria_01 = document.createElement('div')
        divSecundaria_01.setAttribute('id','listaCompleta_01')
        divSecundaria_01.setAttribute('class','lista-completa_01')
        var mapa = document.createElement('a')
        mapa.innerHTML = 'Mapa'
        mapa.onclick = function(){mapa_f()}
        /*Aprendendo os elementos*/
        divSecundaria_01.appendChild(mapa)
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
        btnprincipal_02.onclick = function(){myFunc_02()}
        var divSecundaria_02 = document.createElement('div')
        divSecundaria_02.setAttribute('id','listaCompleta_02')
        divSecundaria_02.setAttribute('class','lista-completa_02')
        var li_li_sub = document.createElement('a')
        li_li_sub.innerHTML = 'LI, Sub & CO'
        li_li_sub.onclick = function(){li_li_sub_f()}
        /*Aprendendo os elementos*/
        divSecundaria_02.appendChild(li_li_sub)
        divprincipal_02.appendChild(btnprincipal_02)
        divprincipal_02.appendChild(divSecundaria_02)
        if(document.getElementById('formPrincipal:fieldDoc_content')){
            document.body.appendChild(divprincipal_02)}
    }
    addButtonHTML_02()
    addButtonHTML_01()
    //#3498DB
    GM_addStyle(`
.buttonPricipal_01 {
background-color: #000000;
color: white;
padding: 10px;
font-size: 14px;
border: none;
cursor: pointer;

}

.buttonPricipal_01:hover, .buttonPricipal_01:focus {
background-color: #CC33FF;
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
background-color: #000000;
color: white;
padding: 10px;
font-size: 14px;
border: none;
cursor: pointer;

}

.buttonPricipal_02:hover, .buttonPricipal_02:focus {
background-color: #CC33FF;
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