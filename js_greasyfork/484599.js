// ==UserScript==
// @name         Copiar Certificado Inmetro
// @version      0.2
// @description  Copia itens
// @author       Leonardo Rigotti
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=1&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=2&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=3&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=4&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=5&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=6&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=7&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=8&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=9&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=10&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=11&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=12&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=13&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=14&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=15&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=16&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=17&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=18&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=19&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=20&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=21&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=22&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=23&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=24&NumeroRegistro*
// @match        https://registro.inmetro.gov.br/consulta/detalhe.aspx?pag=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/331474
// @downloadURL https://update.greasyfork.org/scripts/484599/Copiar%20Certificado%20Inmetro.user.js
// @updateURL https://update.greasyfork.org/scripts/484599/Copiar%20Certificado%20Inmetro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var extrair_dados = function(){
        var tabela = document.querySelector("#ctl00_MainContent_panel1 > table");
        var tabela_count = tabela.rows.length;
        var cert = document.querySelector("#ctl00_MainContent_dvPrint > div.panel-body > div.row > div.col-xs-12.col-sm-10 > dl > div:nth-child(5) > dd").innerText;
        var n_Registro = document.querySelector("#ctl00_MainContent_dvPrint > div.panel-heading > h2 > strong").innerText.replace("Detalhes do Registro ","");
        var index_Marca = 2;
        var index_Modelo = 3;
        var index_Desc = 4;
        var index_CodBarras = 5;
        var index_linha = 1; //Começa na Linha 1, pois a linha 0 é o cabeçario;
        var excel_table = new Array(tabela_count - 1);
        var resultado = "";
        var i = 0;
        while (index_linha < tabela_count){
            excel_table[index_linha - 1] = new Array(5);
            excel_table[index_linha - 1][0] = tabela.rows[index_linha].cells[index_Modelo].innerText;
            excel_table[index_linha - 1][1] = tabela.rows[index_linha].cells[index_Desc].innerText;
            excel_table[index_linha - 1][2] = tabela.rows[index_linha].cells[index_CodBarras].innerText;
            excel_table[index_linha - 1][3] = cert;
            excel_table[index_linha - 1][4] = tabela.rows[index_linha].cells[index_Marca].innerText;
            excel_table[index_linha - 1][5] = n_Registro;
            index_linha++;
        }
        while ( i < index_linha -1){
            resultado = resultado + excel_table[i][0] + "	" + excel_table[i][1] + "	" + excel_table[i][2] + "	" + excel_table[i][3] + "	" + excel_table[i][4] + "	" + excel_table[i][5] + "\n";
            i++;
        }
        GM_setClipboard(resultado)
    }

    var btn_copy = function(){
        var btnCopy = document.createElement('span');
        btnCopy.setAttribute('id','copy_btn');
        btnCopy.innerText = "Copiar";
        btnCopy.onclick = function(){extrair_dados()};
        document.querySelector("#ctl00_MainContent_dvPrint > div.panel-heading > h2").appendChild(btnCopy)
    }
    if(document.querySelector("#ctl00_MainContent_dvPrint > div.panel-heading > h2")){
        btn_copy();
    }
})();