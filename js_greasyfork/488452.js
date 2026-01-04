// ==UserScript==
// @name         Confirmador de diario GED
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Confirma as presenças dos alunos no sistema GED-Sigeduca
// @author       Lucas de Souza Monteiro
// @match        http://sigeduca.seduc.mt.gov.br/ged/hwmfinalizaperiodofrequencia.aspx?HWGedLancarAvaliacao.aspx*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488452/Confirmador%20de%20diario%20GED.user.js
// @updateURL https://update.greasyfork.org/scripts/488452/Confirmador%20de%20diario%20GED.meta.js
// ==/UserScript==
//estilo dos botões
var styleSCT = document.createElement('style');
styleSCT.type = 'text/css';
styleSCT.innerHTML = 'span.button-like{display:inline-block;padding:12px 24px;margin:10px;background-color:#065195;color:#fff;font-weight:bold;border:1px solid #065195;border-radius:4px;cursor:pointer;text-align:center;text-decoration:none}span.button-like:hover{background-color:#0056b3;border-color:#0056b3}';
document.getElementsByTagName('head')[0].appendChild(styleSCT);

// funções necessárias
function selectElement(id, valueToSelect) {
    let element = document.getElementById(id);
    element.value = valueToSelect;
}
function getTableData(tableElement) {
      var tableData = [];
      var rows = tableElement.rows;

      for (var i = 1; i < rows.length; i++) {
        var rowData = [];
        var cells = rows[i].cells;

        for (var j = 0; j < cells.length; j++) {
          rowData.push(cells[j].innerText);
        }

        tableData.push(rowData);
      }

      return tableData;
    }
function getSelectedValues(selectElement) {
      var selectedValues = [];
      var options = selectElement.options;

      for (var i = 0; i < options.length; i++) {
        if (i == 0) {

        }else{selectedValues.push(options[i].value);}
      }

      return selectedValues;
    }
function arrayToHtmlTable(dataArray) {
      // Abrir uma nova janela
      var novaJanela = window.open('', '_blank');

      // Criar o conteúdo HTML para a tabela
      var tabelaHTML = '<head><title>Erros de confirmação de presença</title></head><body><table border="1"><thead><tr>';

      // Adicionar cabeçalho da tabela
      if (dataArray.length > 1) {
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

        tabelaHTML += '</tbody></table></body>';

        // Adicionar tabela ao conteúdo da nova janela
        novaJanela.document.write(tabelaHTML);
      } else {
        // Se a array estiver vazia, exibir uma mensagem na nova janela
        novaJanela.document.write('<p>Nenhum erro encontrado pelo script!</p>');
      }
    }


(function() {
    'use strict';
function addCopyBtn(ele,v) {
    //console.log('as');
        let btn = document.createElement("span");
        btn.innerHTML = "Confirmar "+v+" bim";
        btn.className = "button-like";
        btn.onclick = () => {
            const eek = document.getElementById("vAREADISCIPLINATELA");
            var selectedValues = getSelectedValues(eek);

            waitForNotificationHidden(v);

        }

        ele.insertBefore(btn, ele.firstChild);
    }

    // Função para verificar se o elemento gx_ajax_notification está oculto
    function isNotificationHidden() {
        var notification = document.getElementById('gx_ajax_notification');
        if (notification) {
            var displayStyle = window.getComputedStyle(notification).getPropertyValue('display');
            return displayStyle === 'none';
        }
        return false; // Retorna falso se o elemento não existir
    }

    // Função de pausa com Promessa
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



    // Loop com pausas para aguardar a propriedade display do elemento gx_ajax_notification ser 'none'
    async function waitForNotificationHidden(v) {
        var output = [['Nome','cod','turma','disciplina','erro']];
        var bb = v;
        const bim = document.getElementById("vGEDMATDISCAVAREF");
        var bimes = getSelectedValues(bim);
        if(bimes.length == 1){bb = bimes[0];console.log(bimes[0]);}

        let element = document.getElementById('vGEDMATDISCAVAREF');
        element.value = bb;
        const eek = document.getElementById("vAREADISCIPLINATELA");

        var options = eek.options;

        var selectedValues = [];

        for (var k = 0; k < options.length; k++) {
             selectedValues.push(options[k].value);
        }


        //var selectedValues = getSelectedValues(eek);
//console.log(selectedValues);
        var iterations = selectedValues.length;
        for (var i = 0; i < iterations; i++) {
            console.log("Iteração", i );

            selectElement('vAREADISCIPLINATELA', selectedValues[i]);
            eek.onchange();

            await sleep(500);
            // Primeira pausa aguardando que o elemento gx_ajax_notification esteja oculto
            while (!isNotificationHidden()) {
                //console.log("Aguardando ocultar...");
                await sleep(1000); // Pausa por 1 segundo
            }

           //console.log("Elemento gx_ajax_notification está oculto.");

            // Executa as ações após a primeira pausa -----------------------

            var precisa = 0;

           


            (function (){
                   document.getElementsByClassName("btnConfirmar")[0].click();
            })();
            await sleep(500);

            // -----------------------------------------------------------------

            // Segunda pausa aguardando que o elemento gx_ajax_notification esteja oculto
            while (!isNotificationHidden()) {
                //console.log("Segunda pausa - Aguardando ocultar...");
                await sleep(1000); // Pausa por 2 segundos antes de avançar para a próxima iteração
            }
            //console.log("Segunda pausa - Elemento gx_ajax_notification está oculto.");

             // Executa as ações após a segunda pausa -----------------------

            let num = 0;
            let tamanhoTabela = parent.frames[0].document.getElementById('GriddetalhesContainerTbl').rows.length;

            for (var n = 1; n < tamanhoTabela; n++){
                let num = ("0000" + n).slice(-4);

                var realizar = document.getElementById('span_vREALIZA_'+num).textContent.trim();
                var noconf = parseInt(document.getElementById('span_vQTDFALTASN_'+num).textContent.trim())+parseInt(document.getElementById('span_vQTDPRESENCASN_'+num).textContent.trim());
                var confs = parseInt(document.getElementById('span_vQTDFALTAS_'+num).textContent.trim())+parseInt(document.getElementById('span_vQTDPRESENCAS_'+num).textContent.trim());
                //console.log(confs,noconf);
                //possuiLanFreq = document.getElementById('span_vALUNOPOSSUILANCFREQ_0001').textContent.trim();

                if (realizar == "Sim" && noconf == 0){
                    //erros = erros +eek.options[eek.selectedIndex].text+" - Sem presença lançada no "+bimestre+"º bimestre;<br>  ";
                    output.push([document.getElementById('span_vGEDALUNOM_'+num).textContent.trim(),
                                 document.getElementById('span_vGEDALUCOD_'+num).textContent.trim(),
                                 document.getElementById("span_vGERTURSAL").textContent.trim(),
                                 eek.options[eek.selectedIndex].text,
                                 "Sem presença lançada no "+bb+"º bimestre"]);
                }

                if (realizar == "Sim" && confs == 0 && noconf > 0){
                    //erros = erros +eek.options[eek.selectedIndex].text+" - Nota não lançada no "+bimestre+"º bimestre;<br>  ";
                    output.push([document.getElementById('span_vGEDALUNOM_'+num).textContent.trim(),
                                 document.getElementById('span_vGEDALUCOD_'+num).textContent.trim(),
                                 document.getElementById("span_vGERTURSAL").textContent.trim(),
                                 eek.options[eek.selectedIndex].text,
                                 "Nota/conceito não lançado no "+bb+"º bimestre"]);
                }
            }


            // -----------------------------------------------------------------
        }

        //console.log("Fim do loop");
        arrayToHtmlTable(output);

    }



     //------------------------


    const bim = document.getElementById("vGEDMATDISCAVAREF");
    var bimes = getSelectedValues(bim);

    for (var i = 0; i < bimes.length; i++) {
        addCopyBtn(document.getElementById("TABELASELECAO"),bimes[i]);
    }



})();