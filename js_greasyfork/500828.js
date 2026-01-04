// ==UserScript==
// @name         Ficha Individual Analítica
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ferramentas para analisar a ficha individual do GPE/Sigeduca
// @author       Lucas S Monteiro
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @match        http://sigeduca.seduc.mt.gov.br/ged/hwgedteladocumento.aspx?0,25
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500828/Ficha%20Individual%20Anal%C3%ADtica.user.js
// @updateURL https://update.greasyfork.org/scripts/500828/Ficha%20Individual%20Anal%C3%ADtica.meta.js
// ==/UserScript==


function parseTable(htmlCode) {
  // Cria um elemento temporário para armazenar o código HTML
     htmlCode = htmlCode.replaceAll('<span style="font-size: 10px">', "");
    htmlCode = htmlCode.replaceAll('<span style="font-family: Arial">', "");
    htmlCode = htmlCode.replaceAll('</span>', "");
    //console.log(htmlCode);
   var tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlCode;

  // Obtém a tabela dentro do elemento temporário
  var table = tempDiv.querySelector('table');

  // Inicializa a matriz de saída
  var outputMatrix = [];

  // Obtém todas as linhas da tabela
  var rows = table.querySelectorAll('tr');

  // Itera sobre cada linha
  rows.forEach(function (row) {
    // Inicializa uma array para armazenar os valores da linha
    var rowValues = [];

    // Obtém todas as células da linha
    var cells = row.querySelectorAll('td');

    // Itera sobre cada célula
    cells.forEach(function (cell) {
      // Adiciona o valor da célula à array de valores da linha
      rowValues.push(cell.textContent.trim());
    });

    // Adiciona a array de valores da linha à matriz de saída
    outputMatrix.push(rowValues);
  });

  return outputMatrix;


}
function pegaCabecalho(dados){

    var cabecalho = []; var calcBimes = 1;
    //var dadosCabec = document.getElementById("content").getElementsByTagName("table")[4].getElementsByTagName("tr");
    var dadosCabec = dados;
        for (let u = 0; u < dadosCabec[0].getElementsByTagName("td").length; u++) {

            if(dadosCabec[0].getElementsByTagName("td")[u].rowSpan == 2){
                cabecalho.push(dadosCabec[0].getElementsByTagName("td")[u].getElementsByTagName("span")[0].textContent.trim());
            }

            if(dadosCabec[0].getElementsByTagName("td")[u].rowSpan == 1){
                if(dadosCabec[1].getElementsByTagName("td").length % 2 === 0){
                    cabecalho.push("N"+calcBimes,"F"+calcBimes);
                }else{
                    cabecalho.push("N"+calcBimes);
                }
                calcBimes++;
            }


            //console.log(dadosCabec[0].getElementsByTagName("td")[u].getElementsByTagName("span")[0].textContent.trim());

        }
    return cabecalho;
}
function coletarDados(){
    var infoCabecalho = pegaCabecalho(document.getElementById("content").getElementsByTagName("table")[4].getElementsByTagName("tr"));
    infoCabecalho.shift();
    //console.log(infoCabecalho);


    var output = {'dadosTurma':{},'alunos':{},'materias':[]};
    var tabelas =$('[id=content]');
    var escola = tabelas[0].getElementsByTagName("table")[2].getElementsByTagName("span")[2].textContent;

    var dadosTurma = document.getElementById("content").getElementsByTagName("p")[5].textContent;

    var aluno = document.getElementById("content").getElementsByTagName("table")[3].getElementsByTagName("span")[2].textContent.trim();
    var codigo = document.getElementById("content").getElementsByTagName("table")[3].getElementsByTagName("span")[26].textContent.trim();
    var matricula = document.getElementById("content").getElementsByTagName("table")[3].getElementsByTagName("span")[37].textContent.trim();
    var faltJust = document.getElementById("content").getElementsByTagName("table")[5].getElementsByTagName("span")[10].textContent.trim();
    var nascimento = document.getElementById("content").getElementsByTagName("table")[3].getElementsByTagName("span")[22].textContent.trim();


    output['alunos'][codigo] = {'notas':{},'resultado':'','dadosAluno':{'nome':aluno,'matricula':matricula,'faltasJust':faltJust,'nascimento':nascimento}};


    var infos = dadosTurma.split("\n");
    var serie = infos[0].split(">");
    var temp = infos[1].split("TURMA:");
    var turno = temp[0];
    turno = turno.replace("TURNO: ", "");
    temp = temp[1].split("ANO LETIVO:");
    var turma = temp[0];
    var ano = temp[1];

    serie = serie[serie.length - 1];
    turno = turno.trim();
    turma = turma.trim();
    ano = ano.trim();
    serie = serie.trim();
    //var codigo = document.getElementById("content").getElementsByTagName("table")[3].getElementsByTagName("span")[26].textContent;
    //console.log(turno);console.log(turma);console.log(serie);

    output["dadosTurma"]["serie"] = serie;
    output["dadosTurma"]["turma"] = turma;
    output["dadosTurma"]["turno"] = turno;
    output["dadosTurma"]["ano"] = ano;
    output["dadosTurma"]["escola"] = escola.split(" - ")[0].trim();
    output['alunos'][codigo]['resultado'] = document.getElementById("content").getElementsByTagName("table")[5].getElementsByTagName("span")[17].textContent.trim();


    let result = parseTable(document.getElementById("content").getElementsByTagName("table")[4].outerHTML);
    //console.log(result);



    var compara = 0;
    for (let i = 0; i < result.length; i++) {
        compara= result[0].length + (result[1].length / 2);
        compara = Math.floor(compara);

        if(i==0 || i==1){
            continue;
        }
        //console.log(result[i].length,compara);

        if(result[i].length == compara){
            result[i].shift();
        }



        // ---- [result[i][0] é a materia de cada linha --------
        output.alunos[codigo].notas[result[i][0]] = {};
        if (!output['materias'].includes(result[i][0])) {
            output['materias'].push(result[i][0]);
        }


        //console.log(result[i]);console.log(infoCabecalho);
        for (let j = 1; j < result[i].length; j++) {
            output.alunos[codigo].notas[result[i][0]][infoCabecalho[j]] = result[i][j];
        }

        //output['alunos'][codigo]['notas'].push(result[i]);
    }
    //---------------------------------- roda os demais -------------------------------------
    for (let k = 1; k < tabelas.length; k++) {
        result = parseTable(tabelas[k].getElementsByTagName("table")[4].outerHTML);


        infoCabecalho = pegaCabecalho(tabelas[k].getElementsByTagName("table")[4].getElementsByTagName("tr"));
        infoCabecalho.shift();

        //console.log(result);
        //console.log(tabelas[k]);
        codigo = tabelas[k].getElementsByTagName("table")[3].getElementsByTagName("span")[26].textContent.trim();
        aluno = tabelas[k].getElementsByTagName("table")[3].getElementsByTagName("span")[2].textContent.trim();
        matricula = tabelas[k].getElementsByTagName("table")[3].getElementsByTagName("span")[37].textContent.trim();
        faltJust = tabelas[k].getElementsByTagName("table")[5].getElementsByTagName("span")[10].textContent.trim();
        nascimento = tabelas[k].getElementsByTagName("table")[3].getElementsByTagName("span")[22].textContent.trim();
        //console.log(codigo);
        if( output['alunos'][codigo] ){}else{
            output['alunos'][codigo] = {'notas':{},'resultado':'','dadosAluno':{'nome':aluno,'matricula':matricula,'faltasJust':faltJust,'nascimento':nascimento}};
        }
        compara = 0;
        for (let i = 0; i < result.length; i++) {
            compara= result[0].length + (result[1].length / 2);

            if(i==0 || i==1){
                continue;
            }
            compara = Math.floor(compara); //console.log(result[i].length,compara);
            if(result[i].length == compara){//console.log('foi');
                result[i].shift();
            }
            output['alunos'][codigo]['resultado'] = tabelas[k].getElementsByTagName("table")[5].getElementsByTagName("span")[17].textContent.trim();


            output.alunos[codigo].notas[result[i][0]] = {};
            if (!output['materias'].includes(result[i][0])) {
                output['materias'].push(result[i][0]);
            }
            //console.log(result[i]);console.log(infoCabecalho);
            for (let j = 1; j < result[i].length; j++) {
                output.alunos[codigo].notas[result[i][0]][infoCabecalho[j]] = result[i][j];
            }


            //output['alunos'][codigo]['notas'].push(result[i]);
        }
    }

    return output;
}
function MapaDeNotas(dataArray,item,titulo) {
    // Abrir uma nova janela
    var windowFeatures = 'width=1000,height=800';
    var novaJanela = window.open('', '_blank',windowFeatures);


    var stringas = ['AVC','INT','BAS','-'];
    var corStringas={'AVC':'#baf235','INT':'#f2a735','BAS':'#f72525','-':'#919bab'};
    var corNotas=['#f72525','#f72525','#f72525','#f73e25','#f73e25','#f73e25','#f2a735','#b3f538','#b3f538','#baf235','#94f51d'];


    var tabelaHTML = `
  <style type="text/css">
    th.rotate { height: 280px; white-space: nowrap; }
    th.rotate > div { transform: translate(0px, 120px) rotate(270deg); width: 20px; }
    thead { display: table-header-group; }
  </style>
`;


    tabelaHTML += '<h3 style="text-align:center;">'+titulo+' - '+dataArray.dadosTurma.turma+' '+dataArray.dadosTurma.turno+'</h3>';

    tabelaHTML += '<table border="1"><thead><tr>';
    tabelaHTML += '<th>Codigo</th><th>nome</th><th>Situa.</th>';
 




    for (var i = 0; i < dataArray.materias.length; i++) {
        var t = '';
        if (dataArray.materias[i].length > 21) {
            t = dataArray.materias[i].substring(0, 21) + '...';
        } else {
            t = dataArray.materias[i];
        }

        tabelaHTML += '<th class="rotate"><div><span>' + t + '</span></div></th>';



    }
    tabelaHTML += '<th class="rotate"><div><span>Total Faltas confimadas</span></div></th>';
    tabelaHTML += '</tr></thead><tbody>';



    Object.keys(dataArray.alunos)
        .forEach(function eachKey(cod) {//console.log(dataArray.alunos[cod]);
        var faltaTotal = 0;
        tabelaHTML += '<tr>';
        tabelaHTML += '<td>' + cod + '</td>';
        tabelaHTML += '<td>' + dataArray.alunos[cod].dadosAluno.nome + '</td>';
         tabelaHTML += '<td>' + dataArray.alunos[cod].resultado + '</td>';
        var not = 0; var cor = '';
         for (var i = 0; i < dataArray.materias.length; i++) {
              var Valor = '';//console.log(dataArray.alunos[cod].notas[dataArray.materias[i]]);
             if(dataArray.alunos[cod].notas[dataArray.materias[i]] == undefined){
                 Valor = '-';
             }else{
                 faltaTotal += Number(dataArray.alunos[cod].notas[dataArray.materias[i]].TF);
                  if(dataArray.alunos[cod].notas[dataArray.materias[i]][item] == undefined){
                      Valor = '-';
                  }else{
                      Valor = dataArray.alunos[cod].notas[dataArray.materias[i]][item];
                  }
                 //console.log(item,  dataArray.alunos[cod].notas[dataArray.materias[i]]['N1']   );
             }
             

             if (stringas.includes(Valor)) {
                 cor = corStringas[Valor];
                 not = Valor;
             } else {
                 var cc = parseFloat(Valor);
                 not = cc.toFixed(1);
                 cc = Math.round(cc);
                 cor = corNotas[cc];
             }


             tabelaHTML += '<td style="text-align:center;background-color: '+cor+'">' + Valor + '</td>';
         }
        tabelaHTML += '<td style="text-align:center;background-color: '+'white'+'">' +( faltaTotal - Number(dataArray.alunos[cod].dadosAluno.faltasJust) )+ '</td>';
        tabelaHTML += '</tr>';
    });




        tabelaHTML += '</tbody></table>';

        // Adicionar tabela ao conteúdo da nova janela
        novaJanela.document.write(tabelaHTML);







}
function MapaDeTodasNotas(dataArray) {
    // Abrir uma nova janela
    var windowFeatures = 'width=1000,height=800';
    var novaJanela = window.open('', '_blank',windowFeatures);


    var stringas = ['AVC','INT','BAS','-'];
    var corStringas={'AVC':'#baf235','INT':'#f2a735','BAS':'#f72525','-':'#919bab'};
    var corNotas=['#f72525','#f72525','#f72525','#f73e25','#f73e25','#f73e25','#f2a735','#b3f538','#b3f538','#baf235','#94f51d'];


    var tabelaHTML = `
  <style type="text/css">
    th.rotate { height: 280px; white-space: nowrap; }
    th.rotate > div { transform: translate(0px, 120px) rotate(270deg); width: 20px; }
    thead { display: table-header-group; }
  </style>
`;


    tabelaHTML += '<h3 style="text-align:center;"> Notas de todos os bimestres - '+dataArray.dadosTurma.turma+' '+dataArray.dadosTurma.turno+'</h3>';

    tabelaHTML += '<table border="1"><thead><tr>';
    tabelaHTML += '<th>Codigo</th><th>nome</th><th>Situa.</th><th>Bim.</th>';





    for (var i = 0; i < dataArray.materias.length; i++) {
        var t = '';
        if (dataArray.materias[i].length > 21) {
            t = dataArray.materias[i].substring(0, 21) + '...';
        } else {
            t = dataArray.materias[i];
        }

        tabelaHTML += '<th class="rotate"><div><span>' + t + '</span></div></th>';



    }
    tabelaHTML += '<th class="rotate"><div><span>Total Faltas confimadas</span></div></th>';
    tabelaHTML += '</tr></thead><tbody>';



    Object.keys(dataArray.alunos)
        .forEach(function eachKey(cod) {//console.log(dataArray.alunos[cod]);
        var faltaTotal = 0;var spawn;
        for (var k = 1; k <= 4; k++) {
            tabelaHTML += '<tr>';
            if(k==1){
                spawn = 'rowspan="4"';

                tabelaHTML += '<td '+spawn+' >' + cod + '</td>';
                tabelaHTML += '<td '+spawn+'>' + dataArray.alunos[cod].dadosAluno.nome + '</td>';
                tabelaHTML += '<td '+spawn+'>' + dataArray.alunos[cod].resultado + '</td>';


             }else{spawn=''}


            tabelaHTML += '<td >' + k + 'ºbim</td>';
            var not = 0; var cor = '';
            for (var i = 0; i < dataArray.materias.length; i++) {
                var Valor = '';//console.log(dataArray.alunos[cod].notas[dataArray.materias[i]]);
                if(dataArray.alunos[cod].notas[dataArray.materias[i]] == undefined){
                    Valor = '-';
                }else{
                    faltaTotal += Number(dataArray.alunos[cod].notas[dataArray.materias[i]].TF);
                    if(dataArray.alunos[cod].notas[dataArray.materias[i]]['N'+k] == undefined){
                        Valor = '-';
                    }else{
                        Valor = dataArray.alunos[cod].notas[dataArray.materias[i]]['N'+k];
                    }
                    //console.log(item,  dataArray.alunos[cod].notas[dataArray.materias[i]]['N1']   );
                }


                if (stringas.includes(Valor)) {
                    cor = corStringas[Valor];
                    not = Valor;
                } else {
                    var cc = parseFloat(Valor);
                    not = cc.toFixed(1);
                    cc = Math.round(cc);
                    cor = corNotas[cc];
                }


                tabelaHTML += '<td style="text-align:center;background-color: '+cor+'">' + Valor + '</td>';
            }

            if(k==1){
                tabelaHTML += '<td '+spawn+' style="text-align:center;background-color: white">' +( faltaTotal - Number(dataArray.alunos[cod].dadosAluno.faltasJust) )+ '</td>';
            }

            tabelaHTML += '</tr>';
            }

    });




        tabelaHTML += '</tbody></table>';

        // Adicionar tabela ao conteúdo da nova janela
        novaJanela.document.write(tabelaHTML);







}



(function() {

    'use strict';
    var infos = coletarDados();
    console.log(infos);

    //criarMenu(infos);
    //MapaDeNotas(infos);

    // Cria o botão do menu
    var menuButton = document.createElement('div');
    menuButton.id = 'floatingMenuButton';
    menuButton.innerHTML = 'Analisar';
    document.body.appendChild(menuButton);

    // Cria o container do menu
    var menuContainer = document.createElement('div');
    menuContainer.id = 'floatingMenuContainer';
    menuContainer.style.display = 'none'; // Inicia escondido
    var subButton;

    var opcaos;var variva;

    //----------- cria opções

    // Mapa de notas -------------------------
    opcaos = [ "Mapa de notas 1º Bimestre", "Mapa de notas 2º Bimestre", "Mapa de notas 3º Bimestre", "Mapa de notas 4º Bimestre", "Mapa de notas finais"];
     variva = [ "N1", "N2", "N3", "N4", "MF"];
    for (var i = 0; i < opcaos.length; i++) {
        (function(nome) {
            nome = opcaos[i];var vvv = variva[i];
        subButton = document.createElement('div');
        subButton.className = "menu-item";
        subButton.textContent = nome;
        subButton.addEventListener('click', function() {
            MapaDeNotas(infos,vvv,nome);
        });
        menuContainer.appendChild(subButton);
    })(i);
    }


    // Mapa de todas as notas ----
    subButton = document.createElement('div');
        subButton.className = "menu-item";
        subButton.textContent = 'Mapa de todas as notas';
        subButton.addEventListener('click', function() {
            MapaDeTodasNotas(infos);
        });
        menuContainer.appendChild(subButton);



    document.body.appendChild(menuContainer);

    // Estilos CSS
    var styles = `
        #floatingMenuButton {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #3498db;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        }
        #floatingMenuContainer {
            position: fixed;
            top: 40px;
            right: 10px;
            background-color: #ecf0f1;
            border: 1px solid #3498db;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            padding: 10px;
        }
        .menu-item {
            padding: 5px 0;
            color: #3498db;
            cursor: pointer;
        }
        .menu-item:hover {
            background-color: #3498db;
            color: white;
            cursor: pointer;
        }
    `;

    var styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Adiciona evento de clique no botão do menu
    menuButton.addEventListener('click', function() {
        if (menuContainer.style.display === 'none') {
            menuContainer.style.display = 'block';
        } else {
            menuContainer.style.display = 'none';
        }
    });





})();