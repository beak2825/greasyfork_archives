// ==UserScript==
// @name         Siscomex Importação
// @namespace    http://tampermonkey.net/
// @version      1.5.6
// @description  Botões de Atalho para siscomexImpo
// @author       Leonardo Rigotti de Lima
// @match        https://www1c.siscomex.receita.fazenda.gov.br/*
// @match        www1c.siscomex.receita.fazenda.gov.br/*
// @exclude      https://www1c.siscomex.receita.fazenda.gov.br/importacaoweb-7/ConsultarDIAdicao.do?numAdicao=*
// @exclude      https://www1c.siscomex.receita.fazenda.gov.br/importacaoweb-7/ConsultarDIPorId.do?popupIcms*
// @exclude      https://www1c.siscomex.receita.fazenda.gov.br/impdespacho-web-7/ConsultarDetalheResumidoPopup.do?numero=*
// @exclude      https://www1c.siscomex.receita.fazenda.gov.br/impdespacho-web-7/AcompanharSituacaoDespachoMotivoInterrupcao.do?*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/389259/Siscomex%20Importa%C3%A7%C3%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/389259/Siscomex%20Importa%C3%A7%C3%A3o.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    /*-----------------------------------------Botôes de Atalhos-------------------------------------------------*/
    var consultaLi = function(){
        var btnConsultarLi = document.createElement('BUTTON')
        btnConsultarLi.innerHTML = "Consultar LI"
        btnConsultarLi.setAttribute('id','btnConsultarLi')//.setAttribute("style", "font-size:18px;position:absolute;top:100px;left:1100px;");
        btnConsultarLi.onclick = function(){
            window.location.href = "https://www1c.siscomex.receita.fazenda.gov.br/li_web-7/liweb_menu_consultar_filtro_li.do";
        }
        document.body.appendChild(btnConsultarLi);
    }
    var subLI = function(){
        var btnSubLi = document.createElement('BUTTON')
        btnSubLi.innerHTML = "LI Sub"
        btnSubLi.setAttribute('id','btnSubLi')
        btnSubLi.onclick = function() {
            window.location.href = "https://www1c.siscomex.receita.fazenda.gov.br/li_web-7/liweb_menu_li_substitutivo.do"
        }
        document.body.appendChild(btnSubLi)
    }
    var liXML = function(){
        var btnLiXML = document.createElement('BUTTON')
        btnLiXML.innerHTML = "XML - LI"
        btnLiXML.setAttribute('id','btnLiXML')
        btnLiXML.onclick = function(){
            window.location.href = "https://www1c.siscomex.receita.fazenda.gov.br/li_web-7/liweb_menu_imprimir_li_filtro.do"
        }
        document.body.appendChild(btnLiXML);
    }
    var btnConsultaDi = function(){
        var btn_ConsultaDi = document.createElement('button')
        btn_ConsultaDi.innerHTML ='Consultar DI'
        btn_ConsultaDi.setAttribute('id','btn_ConsultaDi')
        btn_ConsultaDi.onclick = function(){
            window.location.href ='https://www1c.siscomex.receita.fazenda.gov.br/importacaoweb-7/ConsultarDIMenu.do'
        }
        document.body.appendChild(btn_ConsultaDi)
    }
    var consultaRegistroDiXML = function(){
        var btnDiXML = document.createElement("button")
        btnDiXML.innerHTML ="Consulta Diagnóstico DI";
        btnDiXML.setAttribute('id','btnDiXML')//.setAttribute("style", "font-size:18px;position:absolute;top:128px;left:1100px;");
        btnDiXML.onclick = function(){
            window.location.href = "https://www1c.siscomex.receita.fazenda.gov.br/importacaoweb-7/ConsultarDiagnosticoMenu.do";
        }
        document.body.appendChild(btnDiXML);
    }
    var imprimeDi = function (){
        var btnImprimeDi = document.createElement("button")
        btnImprimeDi.innerHTML =" Imprimir DI"
        btnImprimeDi.setAttribute('id','btnImprimeDi')
        //btnImprimeDi.setAttribute("style","font-size:18px;position:absolute;top:156px;left:1100px;")
        btnImprimeDi.onclick = function(){
            window.location.href = "https://www1c.siscomex.receita.fazenda.gov.br/importacaoweb-7/ExtratoDIMenu.do"
        }
        document.body.appendChild(btnImprimeDi)
    }
    var verificaCanal = function(){
        var btnVerificaCanal = document.createElement("button")
        btnVerificaCanal.innerHTML ="Verificar Canal DI"
        btnVerificaCanal.setAttribute('id','btnVerificaCanal')//.setAttribute("style", "font-size:18px;position:absolute;top: 184px; left: 1100px;;")
        btnVerificaCanal.onclick = function(){
            window.location.href ="https://www1c.siscomex.receita.fazenda.gov.br/impdespacho-web-7/AcompanharSituacaoDespachoMenu.do"
        }
        document.body.appendChild(btnVerificaCanal)
    }
    var registraIcms = function(){
        var btnRegistraIcms = document.createElement("button")
        btnRegistraIcms.innerHTML ="Registrar ICMS"
        btnRegistraIcms.setAttribute('id','btnRegistraIcms')
        //btnRegistraIcms.setAttribute("style", "font-size:18px;position:absolute;top:212px;left:1100px;")
        btnRegistraIcms.onclick = function(){
            window.location.href = "https://www1c.siscomex.receita.fazenda.gov.br/importacaoweb-7/DeclararICMSMenu.do?i=0"
        }
        document.body.appendChild(btnRegistraIcms)
    }
    var imprimeCi = function(){
        var btnImprimeCi = document.createElement("button")
        btnImprimeCi.innerHTML = "Imprimir Ci"
        btnImprimeCi.setAttribute('id','btnImprimeCi')
        //.setAttribute("style", "font-size:18px;position:absolute;top:240px;left:1100px;")
        btnImprimeCi.onclick = function(){
            window.location.href = "https://www1c.siscomex.receita.fazenda.gov.br/impdespacho-web-7/RecuperarComprovanteMenu.do"
        }
        document.body.appendChild(btnImprimeCi)
    }
    var btnCima = function(){
        var btn_Cima = document.createElement("BUTTON")
        btn_Cima.innerHTML = 'Voltar ao Topo'
        btn_Cima.setAttribute("id","btn_Cima")
        btn_Cima.onclick = function(){
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        document.body.appendChild(btn_Cima)
    }
    var copiaLI = function(){
        var btn_CopiaLI = document.createElement('a')
        //btn_CopiaLI.type = 'button'
        btn_CopiaLI.setAttribute('id','copiaLi')
        btn_CopiaLI.setAttribute('href','#')
        btn_CopiaLI.innerHTML = "Copia N° Li"
        btn_CopiaLI.style ="font-size: 13"
        btn_CopiaLI.onclick = function(){
            GM_setClipboard(document.querySelector("#TABLE_2 > tbody > tr > td.tituloLI").innerText.replace("/",""))
        }
        let local = document.querySelector("#TABLE_2 > tbody > tr")
        local.insertBefore(btn_CopiaLI, local.childNodes[2]);
    }
    if(document.querySelector("#TABLE_2 > tbody > tr > td.tituloLI")){
        copiaLI()
    }
    /*-----------------------------------------Auxiliar Itens LI-------------------------------------------------*/
    /*<--FomataNumero-->*/
    function numberToReal(numero, casasDecimais) {
        casasDecimais = typeof casasDecimais !== 'undefined' ? casasDecimais : 6;
        numero = numero.toFixed(casasDecimais).split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }
    /*<----Formata Form----->*/
    var formaElem = function(Elem){
        Elem.setAttribute('onkeypress','return ValidaDigitacaoNumeros(event,this, 16, 5);')
        Elem.setAttribute('onblur','FormataValorParaOnblur(this, 5,true);')
        Elem.setAttribute('size','23','maxlength','16')
        Elem.type = "text"
    }
    /*<--------------------->*/
    var formLi = function(){
        var pesoUnitario = document.createElement("input")
        pesoUnitario.setAttribute('id','pesoUnitario')
        var pesoUnitarioLabel = document.createElement('label')
        pesoUnitarioLabel.innerHTML = "Peso Unitário:"
        pesoUnitarioLabel.setAttribute('id','pesoUnitarioLabel')
        formaElem(pesoUnitario)
        //var localPeso = document.querySelector("#TABLE_21 > tbody > tr:nth-child(4)")
        var te = document.querySelector("#TABLE_21 > tbody")
        var tr = document.createElement("tr")
        var th = document.createElement("th")
        th.appendChild(pesoUnitarioLabel)
        th.appendChild(pesoUnitario)
        tr.appendChild(th)
        //te.appendChild(tr)
        te.insertBefore(tr, te.childNodes[15]);

        var calculoPeso = function(){
            let val1 = document.getElementById('pesoUnitario').value
            let val2 = document.getElementById('qtdeUnidComercializada').value
            val1 = val1.replace(".", "")
            val1 = val1.replace(",", ".")
            val1 = parseFloat(val1)
            val1 = parseFloat(val1) || 0.0
            val2 = val2.replace(".", "")
            val2 = val2.replace(",", ".")
            val2 = parseFloat(val2)
            val2 = parseFloat(val2) || 0.0;
            let result = val1 * val2
            result = numberToReal(result)
            //result = result.toString().replace(".",",").toLocaleString('pt-BR')
            document.getElementById('numeroPesoLiquidoMerc').value = result;
            document.getElementById('quantidadeUnidEstatistica').value = result;

        }
        var calculoValor = function(){
            let val1 = document.getElementById('valorMercCondicaoVenda').value
            let val2 = document.getElementById('qtdeUnidComercializada').value
            val1 = val1.replace(".", "")
            val1 = val1.replace(",", ".")
            val1 = parseFloat(val1)
            val1 = parseFloat(val1) || 0.0
            val2 = val2.replace(".", "")
            val2 = val2.replace(",", ".")
            val2 = parseFloat(val2)
            val2 = parseFloat(val2) || 0.0
            let result =(val1 * val2)
            //result = result.toLocaleString('pt-BR')
            result = numberToReal(result)
            document.getElementById('valorMercLocalEmb').value = result;
        }
        /*
        var buttonPeso = document.createElement('input')
        var buttonValor = document.createElement('input')
        buttonValor.setAttribute('id','valorBtn')
        buttonPeso.setAttribute('id','pesoBtn')
        buttonPeso.type = "button"
        buttonValor.type = "button"
        buttonPeso.value = "Calcular Peso"
        buttonValor.value = "Calcular Valor"
        buttonPeso.onclick = function(){calculoPeso()}
        buttonValor.onclick = function(){calculoValor()}
        var localButton = document.querySelector("#TABLE_21 > tbody > tr:nth-child(8) > td")
        localButton.appendChild(buttonValor)
        localButton.appendChild(buttonPeso)
        buttonValor()
        buttonPeso()
        */
        }

    /*
left: 530;
top: 767;

left: 580;
top: 740;
*/
    GM_addStyle(`
#pesoUnitario{
border-collapse: separate;
border-spacing: 2px;
margin: 0;
padding: 0;
FONT: 11px verdana;
float: left;
margin-right: 5px;
font-size: 13px;
margin-bottom: 5px;
border: 1px solid #63A8B1;
left: 302;
position: relative;

}

#pesoUnitarioLabel{
border-collapse: separate;
border-spacing: 2px;
font-style: normal;
color: #1C3639;
font-family: verdana, Helvetica, sans-serif;
font-weight: normal;
text-indent: 0px;
text-align: left;
float: left;
margin-top: 3px;
margin-bottom: 10px;
margin-right: 8px;
font-size: 13px;
position: absolute;

}

#valorBtn{
border-collapse: separate;
border-spacing: 2px;
padding: 0;
FONT: 11px verdana;
float: left;
margin-right: 5px;
margin-bottom: 5px;
border: 1px solid #63A8B1;
BORDER-RIGHT: #000 1px solid;
BORDER-TOP: #FFF 1px solid;
FONT-SIZE: 11px;
BORDER-LEFT: #FFFFFF 1px solid;
COLOR: #FFFFFF;
BORDER-BOTTOM: #000 1px solid;
FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif;
BACKGROUND-COLOR: #488D95;
font-weight: bold;
height: 22px;
margin-left: 0px;
margin-top: -1px;
min-width: 80px;
padding-left: 3px;
padding-right: 3px;
}
#pesoBtn{
border-collapse: separate;
border-spacing: 2px;
padding: 0;
FONT: 11px verdana;
float: left;
margin-right: 5px;
margin-bottom: 5px;
border: 1px solid #63A8B1;
BORDER-RIGHT: #000 1px solid;
BORDER-TOP: #FFF 1px solid;
FONT-SIZE: 11px;
BORDER-LEFT: #FFFFFF 1px solid;
COLOR: #FFFFFF;
BORDER-BOTTOM: #000 1px solid;
FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif;
BACKGROUND-COLOR: #488D95;
font-weight: bold;
height: 22px;
margin-left: 0px;
margin-top: -1px;
min-width: 80px;
padding-left: 3px;
padding-right: 3px;
}`)

    /* if(document.getElementById('unidComercializada')){
        formLi()
    }*/
    /*-----------------------------------------Espandindo adições------------------------------------------------*/
    if(document.querySelector("#idTablePagamentos > tbody > tr:nth-child(1) > td:nth-child(9)")){
        var banco = []
        var sinal = []
        var cont = 0
        /*Verificando quantidade de adiçoes*/
        if(document.getElementById('linhaBanco1')!= null){
            banco[cont]='linhaBanco1';
            sinal[cont] = "#idTablePagamentos > tbody > tr:nth-child(2) > td:nth-child(9) > input[type=button]"
            cont++;
            if(document.getElementById('linhaBanco2')!= null){
                banco[cont]='linhaBanco2';
                sinal[cont] = "#idTablePagamentos > tbody > tr:nth-child(4) > td:nth-child(9) > input[type=button]"
                cont++;
                if(document.getElementById('linhaBanco3')!= null){
                    banco[cont]='linhaBanco3';
                    sinal[cont] = "#idTablePagamentos > tbody > tr:nth-child(6) > td:nth-child(9) > input[type=button]"
                    cont++;
                    if(document.getElementById('linhaBanco4')!= null){
                        banco[cont]='linhaBanco4';
                        sinal[cont] = "#idTablePagamentos > tbody > tr:nth-child(8) > td:nth-child(9) > input[type=button]"
                        cont++;
                        if(document.getElementById('linhaBanco5')!= null){
                            banco[cont]='linhaBanco5';
                            sinal[cont] = "#idTablePagamentos > tbody > tr:nth-child(10) > td:nth-child(9) > input[type=button]"
                            cont++;
                            if(document.getElementById('linhaBanco6')!= null){
                                banco[cont]='linhaBanco6';
                                sinal[cont] = "#idTablePagamentos > tbody > tr:nth-child(12) > td:nth-child(9) > input[type=button]"
                                cont++;
                                if(document.getElementById('linhaBanco7')!= null){
                                    banco[cont]='linhaBanco7';
                                    sinal[cont] = "#idTablePagamentos > tbody > tr:nth-child(14) > td:nth-child(9) > input[type=button]"
                                    cont++;
                                    if(document.getElementById('linhaBanco8')!= null){
                                        banco[cont]='linhaBanco8';
                                        sinal[cont] = "#idTablePagamentos > tbody > tr:nth-child(16) > td:nth-child(9) > input[type=button]"
                                        cont++;
                                        if(document.getElementById('linhaBanco9')!= null){
                                            banco[cont]='linhaBanco9';
                                            sinal[cont] = "#idTablePagamentos > tbody > tr:nth-child(18) > td:nth-child(9) > input[type=button]"
                                            cont++;
                                            if(document.getElementById('linhaBanco10')!= null){
                                                banco[cont]='linhaBanco10';
                                                sinal[cont] = "#idTablePagamentos > tbody > tr:nth-child(19) > td:nth-child(9) > input[type=button]"
                                                cont++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        /*mostra*/
        function mostrar(item){
            document.getElementById(item).style.display = ""
        }
        function esconder(item){
            document.getElementById(item).style.display = "none"
        }
        function mostrarS(item){
            document.querySelector(item).value ='-'
        }
        function esconderS(item){
            document.querySelector(item).value = '+'
        }
        /*esconde*/
        var func_esconder = function(){
            if(document.getElementById('btn_Expandir').textContent == '+'){
                banco.forEach(mostrar)
                sinal.forEach(mostrarS)
                document.getElementById('btn_Expandir').textContent ='-'
            }
            else{
                banco.forEach(esconder)
                sinal.forEach(esconderS)
                document.getElementById('btn_Expandir').textContent ='+'
            }
        }
        /*botão esconde*/
        var btn_ExpandirAdicao = document.createElement('button')
        btn_ExpandirAdicao.setAttribute('id','btn_Expandir')
        btn_ExpandirAdicao.innerHTML ='+'
        btn_ExpandirAdicao.onclick = function(){func_esconder()}
        /*Adição do Protocolo*/
        var protocolo = ["#box > div > fieldset:nth-child(8) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(10) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(12) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(14) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(16) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(18) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(20) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(22) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(24) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(26) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(28) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(30) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(32) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(34) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(36) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(38) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(40) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(42) > legend > input[type=button]",
                         "#box > div > fieldset:nth-child(44) > legend > input[type=button]"]


        function clica(item){
            document.querySelector(item).click()
        }
        var btn_Protocolo = document.createElement('a')
        btn_Protocolo.setAttribute('id','btn_Protocolo')
        btn_Protocolo.innerHTML ='Protocolo'
        btn_Protocolo.onclick = function(){
            func_esconder();
            protocolo.forEach(clica);
            if(document.getElementById("ICMS").style.display == ""){
                document.getElementById("ICMS").style.display = "none"
            }
            else{
                document.getElementById("ICMS").style.display = ""
            }
        }
        document.querySelector("#TABLE_2 > tbody > tr > td").appendChild(btn_Protocolo)
        document.querySelector("#idTablePagamentos > tbody > tr:nth-child(1) > td:nth-child(9)").appendChild(btn_ExpandirAdicao)}
    GM_addStyle(`
#btn_Expandir{
border: 1px solid #34656A;
background-color: #DEEDEF;
width: 16px;
text-align: center;
float: none;
margin-bottom: 0px;
padding: 0px;
}`)
    GM_addStyle(`
#btn_Protocolo{
font-family: Verdana, Arial, Helvetica, sans-serif;
font-size: 12px;
font-weight: bold;
color: #000000;
}`)
    /*-----------------------------------------------------------------------------------------------------------*/
    /*-----------------------------------------Estilo do botão do TOPO-------------------------------------------*/
    GM_addStyle(`
#btn_Cima {
position: fixed; /* Fixed/sticky position *//*Tradução: posição fixa/grudada */
display: none;
bottom: 20px; /* Place the button at the bottom of the page *//*botão na parte inferior*/
right: 30px; /* Place the button 30px from the right *//*botão no canto direito*/
z-index: 99; /* Make sure it does not overlap */
border: none; /* Remove borders */
outline: none; /* Remove outline */
background-color: red; /* Set a background color */
color: white; /* Text color */
cursor: pointer; /* Add a mouse pointer on hover */
padding: 15px; /* Some padding */
border-radius: 10px; /* Rounded corners */
font-size: 14px; /* Increase font size */
}
}
#btn_Cima:hover {
background-color: #555;
}
`)
    /*Estilo Outros botões*/
GM_addStyle(`
#btnConsultarLi,
#btnSubLi,
#btnLiXML,
#btn_ConsultaDi,
#btnDiXML,
#btnImprimeDi,
#btnVerificaCanal,
#btnRegistraIcms,
#btnImprimeCi {
    position: fixed;
    top: 0;
    right: 1em;
    margin-top: 1em; /* Espaçamento entre os botões */
    background: linear-gradient(to bottom, #7db7bf 5%, #7db7bf 100%);
    border-radius: 8px;
    border: 1px solid #566963;
    cursor: pointer;
    color: #ffffff;
    font-family: Trebuchet MS;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 10px;
    text-decoration: none;
}

#btnConsultarLi:hover,
#btnSubLi:hover,
#btnLiXML:hover,
#btn_ConsultaDi:hover,
#btnDiXML:hover,
#btnImprimeDi:hover,
#btnVerificaCanal:hover,
#btnRegistraIcms:hover,
#btnImprimeCi:hover {
    background: linear-gradient(to bottom, #6a9da5 5%, #6a9da5 100%);
}

#btnConsultarLi {
    margin-top: 2.5em; /* Ajuste conforme necessário para a posição vertical do primeiro botão */
}

#btnSubLi {
    margin-top: 5em; /* Ajuste conforme necessário para a posição vertical do segundo botão */
}

#btnLiXML {
    margin-top: 7.5em; /* Ajuste conforme necessário para a posição vertical do terceiro botão */
}

#btn_ConsultaDi {
    margin-top: 10em; /* Ajuste conforme necessário para a posição vertical do quarto botão */
}

#btnDiXML {
    margin-top: 12.5em; /* Ajuste conforme necessário para a posição vertical do quinto botão */
}

#btnImprimeDi {
    margin-top: 15em; /* Ajuste conforme necessário para a posição vertical do sexto botão */
}

#btnVerificaCanal {
    margin-top: 17.5em; /* Ajuste conforme necessário para a posição vertical do sétimo botão */
}

#btnRegistraIcms {
    margin-top: 20em; /* Ajuste conforme necessário para a posição vertical do oitavo botão */
}

#btnImprimeCi {
    margin-top: 22.5em; /* Ajuste conforme necessário para a posição vertical do nono botão */
}
@media print {
    #btnConsultarLi,
    #btnSubLi,
    #btnLiXML,
    #btn_ConsultaDi,
    #btnDiXML,
    #btnImprimeDi,
    #btnVerificaCanal,
    #btnRegistraIcms,
    #btnImprimeCi {
        display: none !important;
    }
}
`);

    GM_addStyle(`
#copiaLI
text-indent: 5px;
font-family: Arial, Helvetica, sans-serif;
border-collapse: separate;
border-spacing: 2px;
color: #326469;
text-decoration: NONE;
font-weight: bold;

`)

    //Carregar Botoes de atalho
    consultaLi()
    subLI()
    liXML()
    btnConsultaDi()
    consultaRegistroDiXML()
    imprimeDi()
    verificaCanal()
    registraIcms()
    imprimeCi()
    btnCima()

    if(document.querySelector("[vw]")) {
        document.querySelector("[vw]").parentNode.removeChild(document.querySelector("[vw]"))
    }
    //Botão Voltar para cima
    window.onscroll = function(){
        if( document.body.scrollTop > 300 ) {
            document.getElementById("btn_Cima").style.display="initial"
        }
        else{
            document.getElementById("btn_Cima").style.display="none"
        }
    }

    /*Tabela ICMS*/
    /*Pega dados do radar (calcula rada)*/
    var copia_radar = function(){
        let di = document.querySelector("#TABLE_1 > tbody > tr > td.tituloDI").innerHTML.replaceAll('\n','').replaceAll('\t','').replace('Consulta Declaração de Importação - DI N° ','');
        di = di.substring(0, di.length - 2);
        let data_Registro = document.querySelector("#idTableDadosDespacho > tbody > tr:nth-child(2) > td:nth-child(2) > label").innerText;
        let valor_Registro = document.querySelector("#idTableValorMercadoriaDescarga > tbody > tr > td:nth-child(2) > label").innerText.replaceAll(" ","");
        let fatura_Registro = document.querySelector("#idTableDocInstDes > tbody > tr:nth-child(2) > td.colunaBordaEsquerda > label").textContent.replaceAll("   ","");
        let result = fatura_Registro + "	" + data_Registro + "	" + di + "	" + valor_Registro;
        GM_setClipboard(result)
    }
    /*Continuação Tabela ICMS*/
    if(document.getElementById("idTablePagamentos")){
        var numero, total=0, soma;
        var pagamentos = document.getElementById("idTablePagamentos");
        var todosPagamento = pagamentos.querySelectorAll("td:nth-child(3) > label");
        var frete = parseFloat(document.querySelector("#idTableValoresFrete > tbody > tr:nth-child(3) > td:nth-child(4) > label").innerText.replace(".","").replace(".","").replace(",","."));
        var mercadoria =parseFloat(document.querySelector("#idTableValorMercadoriaEmbarque > tbody > tr > td:nth-child(4) > label").innerText.replace(".","").replace(".","").replace(",","."));
        var vlmd = frete + mercadoria; //parseFloat(document.querySelector("#idTableValorMercadoriaDescarga > tbody > tr > td:nth-child(4) > label").innerText.replace(".","").replace(".","").replace(",","."));
        var icms1, icms26, icms6 , icms7, icms12, icms17, icms18, icms19, icms195, icms20, icms205, icms21, icms22;

        /*Tansforma os numeros em Float e faz a soma dos impostos*/
        var somaImpostos = function(item){
            numero = parseFloat(item.innerHTML.replace(".","").replace(",","."));
            if(isNaN(numero)){

            }
            else{
                total += numero;
            }
        }

        /*Mantem a formatação de 2 casas decimais*/
        var arredonda = function(numero, casasDecimais) {
            casasDecimais = typeof casasDecimais !== 'undefined' ? casasDecimais : 2;
            return +(Math.floor(numero + ('e+' + casasDecimais)) + ('e-' + casasDecimais));
        };
        /*Soma dos impostos e arredondamento de valores*/
        todosPagamento.forEach(somaImpostos);
        //total = arredonda(total+0.005,2);
        total = arredonda(total,2);

        /*Faz o calculo dos ICMS*/
        var funcSoma = function(afrmm){
            soma = (afrmm + vlmd + total);
            icms1 = arredonda(((soma / 0.96) * 0.01) + 0.01)
            icms26 = arredonda(((soma / 0.96) * 0.026) + 0.01)
            icms6 = arredonda(((soma / 0.94) * 0.06) + 0.01)
            icms7 = arredonda(((soma / 0.93) * 0.07) + 0.01)
            icms12 = arredonda(((soma / 0.88) * 0.12) + 0.01)
            icms17 = arredonda(((soma / 0.83) * 0.17) + 0.01)
            icms18 = arredonda(((soma/0.82) * 0.18) + 0.01)
            icms19 = arredonda(((soma/0.81) * 0.19) + 0.01)
            icms195 = arredonda(((soma/0.805) * 0.195) + 0.01)
            icms20 = arredonda(((soma/0.80) * 0.20) + 0.01)
            icms205 = arredonda(((soma/0.795) * 0.205) + 0.01)
            icms21 = arredonda(((soma/0.79) * 0.21) + 0.01)
            icms22 = arredonda(((soma/0.78) * 0.22) + 0.01)
            var todosIcms = [icms1,icms26,icms6,icms7,icms12,icms17,icms18, icms19, icms195, icms20, icms205, icms21, icms22]
            for(var i=0;i < todosIcms.length;i++){
                todosIcms[i] = numberToReal(todosIcms[i],2)
            }
            return todosIcms
        }
        /*Pega o primeiro calculo dos ICMS para ter o start da tabela*/
        var todosIcms = funcSoma(0)
        var nomes = ["ICMS 1%","ICMS 2.6%","ICMS 6%","ICMS 7%","ICMS 12%","ICMS 17%","ICMS 18%", "ICMS 19%", "ICMS 19,5%", "ICMS 20%", "ICMS 20,5%", "ICMS 21%", "ICMS 22%"]
        /*Como diz o nome da função ela gera minha Tabela dos ICMS*/
        var criaTabela = function (todosIcms, nomes)
        {
            var ICMS = document.createElement("table");
            ICMS.setAttribute("id","ICMS");
            var tr = document.createElement("tr")
            var th = document.createElement("th")
            th.colSpan = "2"
            th.innerHTML = "Calculo ICMS"
            th.onclick = function(){copia_radar()}
            tr.appendChild(th)
            ICMS.appendChild(tr)
            var tbody = document.createElement("tbody")
            for (var i=0;i<nomes.length;i++){
                var trh = document.createElement("tr")
                var td1 = document.createElement("td")
                var td2 = document.createElement("td")
                var label = document.createElement("label")
                var label02 = document.createElement("label")
                label.innerHTML = nomes[i];
                label02.innerHTML = todosIcms[i];
                trh.appendChild(td1);
                trh.appendChild(td2)
                td1.appendChild(label);
                td2.appendChild(label02);
                tbody.appendChild(trh);
            }
            ICMS.appendChild(tbody)
            document.body.appendChild(ICMS)
        }
        /*Função força a recalcular o valor do ICMS toda vez que o valor da AFRMM muda*/

        var altera = function(){
            var afrmm = document.getElementById("AFRMM").value
            afrmm = parseFloat(afrmm.replace(".","").replace(".","").replace(",","."))
            var o = 0
            var todosIcms = funcSoma(afrmm)
            for(var i=1; i<= 13 ; i++){
                document.querySelector("#ICMS > tbody > tr:nth-child("+i+") > td:nth-child(2) > label").innerHTML = todosIcms[o];
                o++
            }

        }

        /*Cria e nomeia o campo onde será inserido o valor da AFRMM e a função de chamada da função "altera"*/
        var btnAfrmm = function(){
            var btn_Afrmm = document.createElement("input")
            btn_Afrmm.setAttribute("id","AFRMM")
            btn_Afrmm.value = 0
            btn_Afrmm.onchange = function(){
                altera()}
            var text_btn_Afrmm = document.createElement("tr")
            var text_btn_Afrmm2 = document.createElement("td")
            text_btn_Afrmm2.colSpan = "2"
            text_btn_Afrmm2.appendChild(btn_Afrmm)
            text_btn_Afrmm.appendChild(text_btn_Afrmm2)
            var textAfrmm = document.createElement("tr")
            var textAfrmm2 = document.createElement("td")
            textAfrmm2.colSpan = "2"
            textAfrmm2.innerHTML = "AFRMM"
            textAfrmm.appendChild(textAfrmm2)
            document.querySelector("#ICMS > tbody").appendChild(textAfrmm)
            document.querySelector("#ICMS > tbody").appendChild(text_btn_Afrmm)
        }
        /*chamando as funções*/
        criaTabela(todosIcms, nomes);
        btnAfrmm();

        /*CSS da tabela*/

        GM_addStyle(`
#ICMS {
  position: absolute;
  top: 140px;
  font-family: Arial, Helvetica, sans-serif;
  border: 1px solid #000000;
  width: 250px;
  text-align: left;
  border-collapse: collapse;
}
#ICMS td, #ICMS th {
  border: 1px solid #000000;
  padding: 2px 0px;
}
#ICMS tbody td {
  font-size: 14px;
  color: #1C3639;
}
#ICMS tr:nth-child(even) {
  background: #DEEDEF;
}
#ICMS th {
  background: #BCDADE;
  border-bottom: 1px solid #444444;
}
#ICMS  th {
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  text-align: center;
}
#ICMS > tbody > tr:nth-child(14) > td{
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  text-align: center;
}
#AFRMM{
	display: block;
    margin: 0 auto
       padding: 0px;
     font-size: 20px;
     border-width: 0px;
     border-color: #ffffff;
     background-color: #FFFFFF;
     color: #000000;
     border-style: solid;
     border-radius: 24px;
     box-shadow: 0px 0px 0px rgba(255,255,255,.0);
     text-shadow: 0px 0px 0px rgba(66,66,66,.100);
}`)
}
})();