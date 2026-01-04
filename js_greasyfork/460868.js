// ==UserScript==
// @name         Auto Dossie West
// @namespace    https://greasyfork.org/pt-BR/scripts/460868-auto-dossie-west
// @version      0.3.3
// @description  Auto Dossie
// @author       Leonardo Rigotti
// @match        https://portalunico.siscomex.gov.br/edocex/private/dossieAbrirDocumentos.jsf
// @match        https://portalunico.siscomex.gov.br/edocex/private/dossieAbrir.jsf
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460868/Auto%20Dossie%20West.user.js
// @updateURL https://update.greasyfork.org/scripts/460868/Auto%20Dossie%20West.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*------------Variaveis portal unico LPCO----------------*/
    var fatura = ["Fatura Comercial","Fatura Comercial","Fatura Comercial"];
    var packing = ["Romaneio de Carga (packing list)", "Packing List","Romaneio de Carga (packing list)"];
    var mic = ["Manifesto Internacional de Carga, MIC/DTA ou TIF/DTA", "MIC/DTA","Manifesto Internacional de Carga, MIC/DTA ou TIF/DTA"];
    var crt = ["Conhecimento de Embarque", "CRT","Conhecimento de Embarque"];
    var fito = ["Certificado Fitossanitário", "Certificado Fitossanitário","Certificado Fitossanitário"];
    var li = ["Licença de Importação","Licença de Importação","Licença de Importação"];
    var bl = ["Conhecimento de Embarque", "Bill of Lading","Conhecimento de Embarque"];
    var dlote = ["Declaração de Lotes ","Declaração de Lotes","Declaração de Lotes "];
    var origem = ["Certificado de Origem","Certificado de Origem","Certificado de Origem"];
    var alvara = ["Licença de Funcionamento (Alvará)","Alvará","Licença de Funcionamento (Alvará)"];
    var doc = ["Documentos - Outros","Documentos - Outros","Documentos - Outros"];
    var di = ["Declaração de Importação","Declaração de Importação","Declaração de Importação"];
    var ci = ["Comprovante - Outros","COMPROVANTE DE IMPORTAÇÃO","Comprovante - Outros"];
    var contratro = ["Contrato - Outros","Contrato - Outros","Contrato - Outros"];
    var glme = ["Comprovante ICMS (recolhimento ou exoneração)","GLME","Comprovante ICMS (recolhimento ou exoneração)"];
    /*-------------------------------------------------------*/
    /*------------Variaveis Tipos de processos LPCO----------*/
    var mapa_rodo_animal = [li,[li[0], "Licença de Importação - SUB","Licença de Importação"], fatura, packing, mic, crt, fito];
    var mapa_maritimo_animal = [li,[li[0], "Licença de Importação - SUB","Licença de Importação"], fatura, packing, bl, fito, dlote, origem];
    var anvisa_maritimo_nt = [li, fatura, packing, bl, alvara, alvara, [doc[0],"1-Peticionamento-8938332021-Everyday","Documentos - Outros"], [doc[0],"2-Peticionamento-8938682021-Teddy","Documentos - Outros"], [doc[0],"4-Peticionamento-8938732021-Care+","Documentos - Outros"], [doc[0],"22-Peticao-CLEAR FRESH ESCOVA DENTAL CERDA DURA","Documentos - Outros"]];
    var glme_ro = [ci,di,fatura,crt,[contratro[0],"CONTRATO SOCIAL",contratro[2]],[doc[0],"PROCURAÇÃO",doc[2]],[doc[0],"DOC. REPRESENTANTE",doc[2]],[doc[0],"DOC. REPRESENTANTE - PROCURADOR",doc[2]],[contratro[0],"CONTRATO DE SERVIÇO",contratro[2]],[doc[0],"TERMO DE ACORDO",doc[2]],[doc[0],"CARTÃO CNPJ",doc[2]],[doc[0],"INSCRIÇÃO ESTADUAL",doc[2]],[doc[0],"CERTIDÃO NEGATIVA DE DEBITO",doc[2]],glme];
    /*-------------------------------------------------------*/
    /*-------------Funçoes para inclusão de itens no LPCO----*/
    //Função que vai selecionar o tipo do documento
    var seleciona_documento = function(item, local){
        document.querySelector("#formPrincipal\\:tpDocumento > div.ui-selectonemenu-trigger.ui-state-default.ui-corner-right").click()
        //De pois eu penso em como explicar para mim no futuro - Basicamente seleciona dentro do futuro vetor, onde o "local" é o item e o "[0]" será sempre a posição onde vai estar o codigo do documento.
        document.querySelector('[data-label="'+item[local][0]+'"]').click();
        //Necessário sempre cofirmação se o documento selecionado foi o correto.
        setTimeout(() => { seleciona_documento_confima(item, local);}, 200);
    };
    //Função que vai confirmar se o documento foi selecionado certo
    var seleciona_documento_confima = function(item, local){
        //Faz a confirmação se o texto bate com o do item informado, se sim pra proxima fase, se não moio
        if(document.querySelector("#formPrincipal\\:tpDocumento_label").innerHTML == item[local][2]){
            //Vamos chamar a proxima função, bora proxima etapa!
            palavra_chave(item, local);
        }
        else{
            setTimeout( ()=> { seleciona_documento(item, local);}, 200);
        }
    };
    //Função que escreve a palavra chave *descrição
    var palavra_chave = function(item, local){
        document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudoSemMascara").value = item[local][1];
        //Nova confirmação se faz necessária para ver se oque está escrito ou se realmente foi escrito está correto.
        setTimeout( ()=> { palavra_chave_confirma(item, local)}, 200);
    };
    //Função que confirma se foi escrito a palavra_chave
    var palavra_chave_confirma = function(item, local){
        if( document.querySelector("#formPrincipal\\:tbPlvChv\\:0\\:plvConteudoSemMascara").value == item[local][1]){
            //Como está certo, vamos adicionar o item
            add_confirma(item, local);
        }
        else{
            //Caso estiver errado novamente faz a tentativa de escrever
            setTimeout( () => { palavra_chave(item, local)}, 200);
        }
    };
    //Função que adiciona/confirma e faz a continuação do processo se julgar necessário.
    var add_confirma = function(item, local){
        var cont = item.length;
        document.querySelector("#formPrincipal\\:btnIncluir").click();
        //Verificar se deve continuar ou se irá terminar
        if(local == cont-1){
            alert("Só anexar os docs!, desenvolvido por Leonardo R.");
        }
        //Vai continuar em quanto o local não ser igual a cont -1, local vai ser o lugar que o vetor estará percorrendo.
        else{
            var x = local + 1;
            setTimeout(() => {
                //Nesta caso X, será o próximo local/item a ser percorrido/adicionado ao dossiê
                seleciona_documento(item, x);
            }, 200);
        }
    };
    /*-------------------------------------------------------*/
    /*-------------Função que se dá inicio ao processo-------*/
    var auto_dossie = function(item){
        seleciona_documento(item, 0);
    };
    /*-------------------------------------------------------*/
    /*-------------Criação dos botões------------------------*/
    var add_HTML = function(){
        var primario_btn_div = document.createElement('div');
        primario_btn_div.setAttribute('class','dropdown_33');

        var primario_btn = document.createElement('a');
        primario_btn.setAttribute('class','dropbtn_33');
        primario_btn.innerHTML = 'Selecionar Processo';

        var primario_btn_i = document.createElement('i');
        primario_btn_i.setAttribute('class','fa fa-caret-down');
        primario_btn.append(primario_btn_i)

        var primario_btn_div_2 = document.createElement('div');;
        primario_btn_div_2.setAttribute('class','dropdown_33-content');

        //Caso necessitar de novos botões adiconar a baixo
        //Mapa Rodoviário Animal
        var btn_a_0 = document.createElement('a');
        btn_a_0.innerHTML = "Mapa Animal (Rodoviário)";
        btn_a_0.onclick = function(){auto_dossie(mapa_rodo_animal);}
        //Mapa Marítimo Animal
        var btn_a_1 = document.createElement('a');
        btn_a_1.innerHTML = "Mapa Animal (Marítimo)";
        btn_a_1.onclick = function(){auto_dossie(mapa_maritimo_animal);}
        //Anvisa NT
        var btn_a_2 = document.createElement('a');
        btn_a_2.innerHTML = "Anvisa NT Escovas";
        btn_a_2.onclick = function(){auto_dossie(anvisa_maritimo_nt)};
        //GLME_RO
        var btn_a_3 = document.createElement('a');
        btn_a_3.innerHTML = "GLME RO";
        btn_a_3.onclick = function(){auto_dossie(glme_ro)};

        //Unicamente adicionar nesta div_2 os btns novos.
        primario_btn_div_2.appendChild(btn_a_0);
        primario_btn_div_2.appendChild(btn_a_1);
        primario_btn_div_2.appendChild(btn_a_2);

        //A Cima adiconar os botões novos.
        // Ajuste para GLME somente no site correto
        if( window.location.href === 'https://portalunico.siscomex.gov.br/edocex/private/dossieAbrir.jsf'){
            primario_btn_div_2.appendChild(btn_a_3);
        }


        primario_btn_div.appendChild(primario_btn);
        primario_btn_div.appendChild(primario_btn_div_2);
        if(document.querySelector("#formPrincipal\\:exception")){
            document.querySelector("body").appendChild(primario_btn_div);
        };
    }
    /*-------------------------------------------------------*/
    /*-------------------------CSS---------------------------*/
    GM_addStyle(`
.dropbtn_33 {
    background-color: #aaa;
    border-radius: 0;
    border: none;
    color: #455d7a;
    padding: 3px 25px 0;
    height: inherit;
    text-align: center;
    text-decoration: none;
    font-size: 14px;
}

.dropdown_33 {
    position: absolute;
    left: 80%;
    display: inline-block;
}

.dropdown_33-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 180px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}

.dropdown_33-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

.dropdown_33-content a:hover {background-color: #f1f1f1}

.dropdown_33:hover .dropdown_33-content {
    color: #fff;
    display: block;
}

.dropdown_33:hover .dropbtn_33 {
    background-color: #017cb1;
    color: #fff;
    border: none;
}`)
    /*-------------------------------------------------------*/
    add_HTML();
})();