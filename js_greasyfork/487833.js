// ==UserScript==
// @name         Extrator de atribuições GPE
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Planilha as atribuições do sistema GPE
// @license      MIT
// @author       Lucas de Souza Monteiro
// @match        http://sigeduca.seduc.mt.gov.br/grh/hwmgrhpreatribuicao.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487833/Extrator%20de%20atribui%C3%A7%C3%B5es%20GPE.user.js
// @updateURL https://update.greasyfork.org/scripts/487833/Extrator%20de%20atribui%C3%A7%C3%B5es%20GPE.meta.js
// ==/UserScript==

// ----- stylesheet
var styleSCT = document.createElement('style');
styleSCT.type = 'text/css';
styleSCT.innerHTML = '.menu {      display: none;      position: fixed;      top: 80%;      right: 0;      transform: translate(0, -50%);      background-color: #f0f0f0;      padding: 20px;      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);      z-index: 999;    }    .open-menu-btn {      position: fixed;      top: 90%;      right: 10px;      transform: translate(0, -50%);      background-color: #007bff;      color: #fff;      padding: 10px;      border: none;      cursor: pointer;    } .loading-menu {display: none;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background-color: #fff;padding: 20px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);z-index: 999;} .loading-content {      text-align: center;    } ';
document.getElementsByTagName('head')[0].appendChild(styleSCT);

function arrayToHtmlTable(dataArray) {
      // Abrir uma nova janela
      var novaJanela = window.open('', '_blank');

      // Criar o conteúdo HTML para a tabela
      var tabelaHTML = '<table border="1"><thead><tr>';

      // Adicionar cabeçalho da tabela
      if (dataArray.length > 0) {
        dataArray[0].forEach(function (coluna) {
          tabelaHTML += '<th>' + coluna + '</th>';
        });
        tabelaHTML += '</tr></thead><tbody>';

        // Adicionar linhas da tabela
        for (var i = 1; i < dataArray.length; i++) {
          tabelaHTML += '<tr>';
          dataArray[i].forEach(function (valor) {
            tabelaHTML += '<td>' + valor + '</td>';
          });
          tabelaHTML += '</tr>';
        }

        tabelaHTML += '</tbody></table>';

        // Adicionar tabela ao conteúdo da nova janela
        novaJanela.document.write(tabelaHTML);
      } else {
        // Se a array estiver vazia, exibir uma mensagem na nova janela
        novaJanela.document.write('<p>Nenhum dado disponível para exibir.</p>');
      }
    }


//CARREGA libJquery
var libJquery = document.createElement('script');
libJquery.src = 'https://code.jquery.com/jquery-3.4.0.min.js';
libJquery.language='javascript';
libJquery.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(libJquery);

//Iframe
var divCorpo = document.createElement('div');
document.getElementsByTagName('body')[0].appendChild(divCorpo);
    var ifrIframe1 = document.createElement("iframe");
    ifrIframe1.setAttribute("id","iframe1");
    ifrIframe1.setAttribute("src","about:blank");
    ifrIframe1.setAttribute("style","height: 100px; width: 355px;display:none");
divCorpo.appendChild(ifrIframe1);
parent.frames.document.getElementById('MAINFORM').removeAttribute("action");

// variaveis ------------------
var output = [];
output.push(['cpf','nome','matricula','codigo','sala','turno','disciplina','matriz','turma','CH','situação','habilitacao','tipo','funcao','subst','ini','fim']);
var j = 1;
var qtdeAtrib = 0;
    //var nome = parent.frames.document.getElementById('Grid1ContainerRow_0001').getElementsByTagName('span')[9].innerText.trim();
var habilita = '';
var tipo = '';
var funcao = '';
var subst = '';
var ini = '';
var fim = '';

function downloadCSV(data, filename) {
  // Converter array de arrays para formato CSV
  const csvContent = "data:text/csv;charset=utf-8," +
                     data.map(row => row.join(",")).join("\n");

  // Criar um elemento de link para download
  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = filename || "data.csv";

  // Simular um clique no link para iniciar o download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function addCopyBtn() {
    //console.log('as');
    var botao = document.createElement("input");
    botao.innerHTML = "Meu Botão";
    botao.className = "copyBtn";
    botao.onclick = () => {
        //parent.frames.document.getElementById('MAINFORM').removeAttribute("action");
        cataDados();
    //console.log('foi');
    }
    var tabela = document.getElementById("TABLE1");
    tabela.parentNode.insertBefore(botao, tabela.nextSibling);
}

function cataDados(){
    var urlFichaServIni = "http://sigeduca.seduc.mt.gov.br/grh/hwmgrhclasprevis.aspx?";
    var urlFichaServFim = "LOT,HWMGrhPreAtribuicao,gxPopupLevel%3D0%3B";

    qtdeAtrib = document.getElementById('Grid1ContainerTbl').rows.length;

    if (qtdeAtrib <=1){
        alert('Carregue a lista de servidores para exportar');
        return;
    }
    //for (var j = 1; j < qtdeAtrib; j++){
    let nserv = ("0000" + j).slice(-4);
    var escola = parent.frames.document.getElementById('Grid1ContainerRow_'+nserv).getElementsByTagName('span')[1].innerText.trim();
    var codigo = parent.frames.document.getElementById('Grid1ContainerRow_'+nserv).getElementsByTagName('span')[2].innerText.trim();
    var tipoID = parent.frames.document.getElementById('Grid1ContainerRow_'+nserv).getElementsByTagName('span')[4].innerText.trim();
    var matricula = parent.frames.document.getElementById('Grid1ContainerRow_'+nserv).getElementsByTagName('span')[8].innerText.trim();
    var ordem = parent.frames.document.getElementById('span_GRHATRCOD_'+nserv).innerText.trim();

    habilita = parent.frames.document.getElementById('Grid1ContainerRow_'+nserv).getElementsByTagName('span')[10].innerText.trim();
    tipo = parent.frames.document.getElementById('Grid1ContainerRow_'+nserv).getElementsByTagName('span')[12].innerText.trim();
    funcao = parent.frames.document.getElementById('Grid1ContainerRow_'+nserv).getElementsByTagName('span')[13].innerText.trim();
    subst = parent.frames.document.getElementById('Grid1ContainerRow_'+nserv).getElementsByTagName('span')[15].innerText.trim();
    ini = parent.frames.document.getElementById('Grid1ContainerRow_'+nserv).getElementsByTagName('span')[18].innerText.trim();
    fim = parent.frames.document.getElementById('Grid1ContainerRow_'+nserv).getElementsByTagName('span')[19].innerText.trim();

    var caminho = urlFichaServIni+'510760,'+escola+','+codigo+','+ordem+','+matricula+','+urlFichaServFim;

    ifrIframe1.src = caminho;
    ifrIframe1.addEventListener("load", cataAtrib);
    //console.log(caminho);
    //}

    //console.log(output);
    //var temp = parent.frames.document.getElementById('Grid1ContainerRow_0001').getElementsByTagName('span');
    //var arr = [];

    //var nome = parent.frames.document.getElementById('Grid1ContainerRow_0001').getElementsByTagName('span')[9].innerText.trim();
    //var habilita = parent.frames.document.getElementById('Grid1ContainerRow_0001').getElementsByTagName('span')[10].innerText.trim();
    //var tipo = parent.frames.document.getElementById('Grid1ContainerRow_0001').getElementsByTagName('span')[12].innerText.trim();
    //var funcao = parent.frames.document.getElementById('Grid1ContainerRow_0001').getElementsByTagName('span')[13].innerText.trim();
    //var subst = parent.frames.document.getElementById('Grid1ContainerRow_0001').getElementsByTagName('span')[15].innerText.trim();
   // var ini = parent.frames.document.getElementById('Grid1ContainerRow_0001').getElementsByTagName('span')[18].innerText.trim();
    //var fim = parent.frames.document.getElementById('Grid1ContainerRow_0001').getElementsByTagName('span')[19].innerText.trim();


}

function cataAtrib(){
    ifrIframe1.removeEventListener("load", cataAtrib);
    let num = 0;



    let tamanhoTabela = parent.frames[0].document.getElementById('GriddetalhesContainerTbl').rows.length;
//console.log(cpf);console.log('foi?');

    if( tamanhoTabela>1){
     for (var i = 1; i < tamanhoTabela; i++){
         let num = ("0000" + i).slice(-4);
//console.log(num,parent.frames[0].document.getElementById('span_GRHSRVCOD_'+num));

         let temp = [
             parent.frames[0].document.getElementById('span_vGERPESCPF').innerText.trim(),
             parent.frames[0].document.getElementById('span_vGRHPESNOM').innerText.trim(),
             parent.frames[0].document.getElementById('span_vGRHSRVVNCMAT').innerText.trim(),
             //parent.frames[0].document.getElementById('span_vGRHATRDTAINI').innerText.trim(),
             //parent.frames[0].document.getElementById('span_vGRHATRDTAFIM').innerText.trim(),
             //parent.frames[0].document.getElementById('span_vGRHFUNDSC').innerText.trim(),
             parent.frames[0].document.getElementById('span_GRHSRVCOD_'+num).innerText.trim(),
             parent.frames[0].document.getElementById('span_GRHATRDISCAMBCOD_'+num).innerText.trim(),
             parent.frames[0].document.getElementById('span_vGERTRNDSC_'+num).innerText.trim(),
             parent.frames[0].document.getElementById('span_vGRHDISDSC_'+num).innerText.trim(),
             parent.frames[0].document.getElementById('span_vGERDSCMATRIZ_'+num).innerText.trim(),
             parent.frames[0].document.getElementById('span_vGERTURSAL_'+num).innerText.trim(),
             parent.frames[0].document.getElementById('span_GRHATRDISCNMRAUL_'+num).innerText.trim(),
             parent.frames[0].document.getElementById('span_GRHATRDISCTPOSITATV_'+num).innerText.trim(),
             habilita,
             tipo,
             funcao,
             subst,
             ini,
             fim
         ];

         output.push(temp);
     }
    }else{
        let temp = [
             parent.frames[0].document.getElementById('span_vGERPESCPF').innerText.trim(),
             parent.frames[0].document.getElementById('span_vGRHPESNOM').innerText.trim(),
             parent.frames[0].document.getElementById('span_vGRHSRVVNCMAT').innerText.trim(),
             //parent.frames[0].document.getElementById('span_vGRHATRDTAINI').innerText.trim(),
             //parent.frames[0].document.getElementById('span_vGRHATRDTAFIM').innerText.trim(),
            //parent.frames[0].document.getElementById('span_vGRHFUNDSC').innerText.trim(),
             '-',
             '-',
             '-',
             '-',
             '-',
             '-',
             '-',
             '-',
             habilita,
             tipo,
             funcao,
             subst,
             ini,
             fim
         ];

         output.push(temp);
    }
    j++;
    qtdeAtrib = document.getElementById('Grid1ContainerTbl').rows.length;
    if(j == qtdeAtrib){
    //console.log(output);
        criarLoadingMenu(j, qtdeAtrib);
        //downloadCSV(output, tipo+".csv");
        arrayToHtmlTable(output);
        j = 1;
        output = [];
        output.push(['cpf','nome','matricula','codigo','sala','turno','disciplina','matriz','turma','CH','situação','habilitacao','tipo','funcao','subst','ini','fim']);


    }else{
        criarLoadingMenu(j, qtdeAtrib);
        cataDados();
    }
    //return output;
    //console.log(output);
}

// ---- cria os menus  -----
    // Função para abrir o menu
    function abrirMenu() {
      document.getElementById("menu").style.display = "block";
    }

    // Função para fechar o menu
    function fecharMenu() {
      document.getElementById("menu").style.display = "none";
    }



   function criarMenu() {
      // Criar a div do menu
       console.log('foi');
      var menuDiv = document.createElement("div");
      menuDiv.id = "menu";
      menuDiv.style.textAlign  = "center";
      menuDiv.className = "menu";
      menuDiv.innerHTML = "<button id='exportar'>Exportar!</button><br><br><div id='acomp'></div><br><br><button id='fecha'>Fechar</button>";

       document.body.appendChild(menuDiv);
       document.getElementById('fecha').addEventListener("click", fecharMenu);
       document.getElementById('exportar').addEventListener("click",  cataDados);

      // Criar o botão para abrir o menu
      var openMenuBtn = document.createElement("button");
      openMenuBtn.id = "openMenuBtn";
      openMenuBtn.className = "open-menu-btn";
      openMenuBtn.innerHTML = "Planilhar";
      openMenuBtn.addEventListener("click", abrirMenu);
      document.body.appendChild(openMenuBtn);
    }

function criarLoadingMenu(valorAtual, valorMaximo) {
    var loadingDiv = document.getElementById("acomp");
    var loadingContent = document.getElementById("acomp");

    if(valorAtual == valorMaximo){ loadingDiv.style.display = "none";}else{
        // Criar a div do menu de loading
        loadingDiv = document.getElementById("acomp");
        //loadingDiv.id = "loadingMenu";
        loadingDiv.className = "loading-menu";

        // Calcular a porcentagem concluída
        var percentConcluido = (valorAtual / valorMaximo) * 100;
        percentConcluido = Math.min(100, Math.max(0, percentConcluido)); // Garantir que a porcentagem esteja entre 0 e 100

        // Criar o conteúdo do menu de loading
         loadingContent = document.getElementById("acomp");
        loadingContent.className = "loading-content";
        loadingContent.innerHTML = `
        <p>Carregando...</p>
        <progress value="${percentConcluido}" max="100"></progress>
        <p>${valorAtual} de ${valorMaximo}</p>
      `;

        loadingDiv.style.display = "block";
    }
}


(function() {
    'use strict';
    //window.onload = criarMenu;
    criarMenu();
    //window.addEventListener("load", addCopyBtn);



})();