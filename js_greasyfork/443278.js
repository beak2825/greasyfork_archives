// ==UserScript==
// @name         PJO - Get Anki Sentences Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script simples para fazer o download de um arquivo CSV na plataforma do Programa Japonês Online que conterá sentenças para importação no programa Anki.
// @author       Marcelo Silva
// @match        https://portal.programajaponesonline.com.br/cp/t*
// @match        https://portal.programajaponesonline.com.br/jm/jm/*
// @match        https://portal.programajaponesonline.com.br/vt/vt/*
// @match        https://portal.programajaponesonline.com.br/lh/lh/*
// @match        https://portal.programajaponesonline.com.br/ct/ct/*
// @match        https://portal.programajaponesonline.com.br/jx/t*
// @match        https://portal.programajaponesonline.com.br/on/on/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=programajaponesonline.com.br
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443278/PJO%20-%20Get%20Anki%20Sentences%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/443278/PJO%20-%20Get%20Anki%20Sentences%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var modulo = document.getElementsByClassName('title-single')[0].getElementsByClassName('item-parent')[0].textContent;
    console.log(modulo);
    var topico = document.getElementsByClassName('title-single')[0].getElementsByClassName('item-parent')[1].textContent;
    console.log(topico);
    var licao = document.getElementsByClassName('title-single')[0].getElementsByTagName('h1')[0].textContent;
    console.log(licao);
    var NomeCompletoDaLicao = modulo + " - " + topico + " - " + licao;
    var SentencasDaPagina = document.getElementsByClassName("sentence");
    var Frentes = [];
    var Versos = [];
    var Tags = [];

    for(var index=0;index < SentencasDaPagina.length;index++){
        var card = SentencasDaPagina[index].getElementsByClassName("card")[0];
        var frente = card.getElementsByClassName("card-front")[0].innerHTML;
        var verso = card.getElementsByClassName("card-back")[0].innerHTML;
        // Com o replace eu garanto que não haverá nenhum ponto e virgula nos cartões, para a correta sepação no CSV a ser gerado.
        Frentes.push(frente.replace(";",","));
        Versos.push(verso.replace(";",","));
        Tags.push(NomeCompletoDaLicao.replace(";",","));
    }

    function exportToCsv(filename, rows) {
        var processRow = function (row) {
            var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null ? '' : row[j].toString();
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString();
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0){
                    result = '"' + result + '"';
                }
                if (j > 0){
                    finalVal += ';';
                }
                finalVal += result;
            }
            return finalVal + '\n';
        };

        var csvFile = '';
        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }

        var blob = new Blob(["\ufeff", csvFile], { type: 'text/csv;charset=shift_jis;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    if(Frentes.length > 0){
        //console.log(Frentes);
        //console.log(Versos);
        var VetorDoisD = [];
        var vetorInicial = [];
        for(var pos=0;pos < Frentes.length;pos++){
            var vetorAtual = [];
            vetorAtual.push(Frentes[pos]);
            vetorAtual.push(Versos[pos].replace(/\n/g, "<br />"));
            vetorAtual.push(Tags[pos]);
            VetorDoisD.push(vetorAtual);
        }

        //console.log(VetorDoisD);

        var strFileName = "";
        if(modulo != topico){
            if(topico.match(/(\d+)/).length > 0 && licao.match(/(\d+)/).length > 0){
                strFileName = modulo + " - " + topico.match(/(\d+)/)[0] + " - " + licao.match(/(\d+)/)[0];
            }
            else if(licao.match(/(\d+)/).length > 0){
                strFileName = modulo + " - " + topico + " - " + licao.match(/(\d+)/)[0];
            }
            else strFileName = modulo + " - " + topico + " - " + licao;
        }
        else{
            if(licao.match(/(\d+)/).length > 0){
                strFileName = topico + " - " + licao.match(/(\d+)/)[0];
            }
            else strFileName = topico + " - " + licao;
        }

        var div1 = document.getElementsByClassName('print-page')[0].closest('div');
        var div2 = document.getElementsByClassName('print-page')[1].closest('div');

        let btn = document.createElement("a");
        btn.innerHTML = '<img src="https://user-images.githubusercontent.com/5547518/48252504-392cb200-e405-11e8-90a6-7f3dd83f22c7.png" height="47" width="47" alt="image_print" title="Download Vocabulario pro Anki" style="display: inline-block !important;vertical-align: middle;padding: 5px;-webkit-box-shadow: none !important;box-shadow: none !important;border-radius: 9px;">'

        btn.addEventListener("click", function () {
            exportToCsv(strFileName, VetorDoisD)
        });
        let btn2 = document.createElement("a");
        btn2.innerHTML = '<img src="https://user-images.githubusercontent.com/5547518/48252504-392cb200-e405-11e8-90a6-7f3dd83f22c7.png" height="47" width="47" alt="image_print" title="Download Vocabulario pro Anki" style="display: inline-block !important;vertical-align: middle;padding: 5px;-webkit-box-shadow: none !important;box-shadow: none !important;border-radius: 9px;">'

        btn2.addEventListener("click", function () {
            exportToCsv(strFileName, VetorDoisD)
        });
        div1.appendChild(btn);
        div2.appendChild(btn2);
    }
})();