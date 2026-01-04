// ==UserScript==
// @name         MRC Bot
// @namespace   My Racing Career
// @version      1.1
// @description  My Racing Career Comprador
// @author       Biroliro
// @include	https://*.myracingcareer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443707/MRC%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/443707/MRC%20Bot.meta.js
// ==/UserScript==

var MRCBot_inject = () => {
    if (document.getElementById('MRCBot_js')) document.getElementById('MRCBot_js').remove();
    var MRCBotjs = document.createElement('script');
    MRCBotjs.setAttribute('type', 'text/javascript');
    MRCBotjs.setAttribute('language', 'javascript');
    MRCBotjs.setAttribute('id', 'MRCBot_js');
    MRCBotjs.innerHTML = "setTimeout(" + (() => {
        MRCBot = {// Escopo do código
            ajuda: () => {
                console.log("Esse MRCBot consiste de 4 ferramentas úteis para melhorar sua experiência no jogo. São elas:");
                console.log("1) MRCBot.buscaNego(id, semanas): Essa função é utilizada para buscar um empregado específico no mercado. Você precisa selecionar o id do empregado (número que aparece no link dele) e a quantidade de semanas que quer contratá-lo. O bot fica buscando ele repetidamente e contrata assim que ele ficar disponível no mercado.");
                console.log("2) MRCBot.olheiro(): Essa função olha o mercado de empregados repetidamente à procura de jovens talentos com habilidades para trabalhar na F1. Quando achar algum promissor, ela imediatamente contrata e encerra a busca.");
                console.log("3) MRCBot.pulaQualy(): Função usada para obter os resultados de um Qualy sem precisar esperar o tempo do broadcast. É necessário estar com a página do broadcast aberta para ativá-la.");
                console.log("4) MRCBot.pulaRace(volta): Pula o broadcast de uma corrida para o início de uma volta específica. É necessário estar na página do broadcast para ativá-la. AVISO: Ao ativá-la no momento de uma ultrapassagem, pode acontecer do jogo trocar esses pilotos durante o resto do broadcast e deixar os resultados confusos.")
            },

            buscaNego: (id, semanas = 5) => {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", "https://www.myracingcareer.com/pb/employee/" + id + "/", true);
                xmlhttp.send();
                xmlhttp.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        var parser = new DOMParser;
                        var find = parser.parseFromString(xmlhttp.responseText, "text/html");
                        if (find.querySelector("#submit_hire") != null){
                            var strRequest = find.querySelectorAll("form")[0].action;
                            if (strRequest.search(/action_request\.php\?action=hire_employee/) >= 0){
                                var token = strRequest.substr(strRequest.search(/token=/)+6,strRequest.length);
                                var wage = find.querySelector("#weekly_wage").textContent;
                                MRCBot.tools.compraNego(id, semanas, token, wage);
                            }
                        }
                        else console.log("Nego de id " + id + " indisponível em " + document.querySelector("#curtime").textContent);
                        setTimeout(MRCBot.buscaNego, MRCBot.tools.getRandomArbitrary(3*60*1000, 5*60*1000), id, semanas);
                    };
                };
            },

           olheiro: () => {
               console.log("Olhando mercado às " + document.querySelector("#curtime").textContent)
               setTimeout(MRCBot.olheiro, MRCBot.tools.getRandomArbitrary(3*60*1000, 5*60*1000));
               setTimeout(MRCBot.tools.man, MRCBot.tools.getRandomArbitrary(1*1000, 10*1000));
               setTimeout(MRCBot.tools.des, MRCBot.tools.getRandomArbitrary(11*1000, 20*1000));
               setTimeout(MRCBot.tools.eng, MRCBot.tools.getRandomArbitrary(21*1000, 30*1000));
               setTimeout(MRCBot.tools.prjdes, MRCBot.tools.getRandomArbitrary(31*1000, 40*1000));
           },

           pulaQualy: () => {
               if ((location.href.indexOf("broadcast") != -1) && document.querySelector("#broacast_order").attributes.length == 2){
                   var try1 = [];
                   var try2 = [];
                   var try3 = [];
                   if (attempt_max_pos.length > 0){
                       for(var i = 0; i < this.q_buffer.length; i++){
                           if(this.q_buffer[i].attempt == "1"){try1.push(this.q_buffer[i])};
                           if(this.q_buffer[i].attempt == "2"){try2.push(this.q_buffer[i])};
                           if(this.q_buffer[i].attempt == "3"){try3.push(this.q_buffer[i])};
                       };
                       try1.sort(function (x, y){return x.result - y.result;});
                       try2.sort(function (x, y){return x.result - y.result;});
                       try3.sort(function (x, y){return x.result - y.result;});
                       if (try3.length != 0){console.log("Q3")}
                       for(var l = 0; l < try3.length; l++){
                           console.log((l+1) + ". " + this.lib_driver[try3[l].id_driver].lastname + " " + try3[l].result + " " + try3[l].errors)
                       };
                       if (try2.length != 0){console.log("Q2")}
                       for(var k = try3.length; k < try2.length; k++){
                           console.log((k+1) + ". " + this.lib_driver[try2[k].id_driver].lastname + " " + try2[k].result + " " + try2[k].errors)
                       };
                       if (try1.length != 0){console.log("Q1")}
                       for(var j = try2.length; j < try1.length; j++){
                           console.log((j+1) + ". " + this.lib_driver[try1[j].id_driver].lastname + " " + try1[j].result + " " + try1[j].errors)
                       };
                   } else {
                       var bestTimes = [];
                       var x = 0,
                           y = 0,
                           endx = q_buffer.length,
                           endy = q_buffer.length;
                       for (; x < endx; x++) {
                           for (y = 0; y < endy; y++) {
                               if((q_buffer[x].id_driver == q_buffer[y].id_driver) && (q_buffer[x].result < q_buffer[y].result)){
                                   bestTimes.push(q_buffer[x])
                               }
                           }
                       }
                       bestTimes.sort(function (x, y){return x.result - y.result})
                       for(var j = 0; j < bestTimes.length; j++){
                           console.log((j+1) + ". " + this.lib_driver[bestTimes[j].id_driver].lastname + " " + bestTimes[j].result + " " + bestTimes[j].errors)
                       };
                   };
               } else {console.log("ERRO! Não é página de broadcast de Qualy")};
           },

           pulaRace: (volta = total_laps) => {
               if ((location.href.indexOf("broadcast") != -1) && document.querySelector("#broacast_order").attributes.length == 3){
                   if(volta >= total_laps){
                       cur_lap = total_laps;
                       cur_sector = total_sectors - 1;
                       console.log("AVISO: Ao pular voltas durante uma ultrapassagem, os pilotos envolvidos podem ficar trocados na classificação durante o restante da corrida")
                   } else if(volta <= cur_lap){
                       console.log("ERRO! Não é possível voltar no tempo!")
                   } else {
                       cur_lap = volta - 1;
                       cur_sector = total_sectors - 1;
                       console.log("AVISO: Ao pular voltas durante uma ultrapassagem, os pilotos envolvidos podem ficar trocados na classificação durante o restante da corrida")
                   }
               } else {console.log("ERRO! Não é página de broadcast de Race")};
           },

           tools: {
               compraNego: (id, semanas = 5, token, wage) => {
                   console.log("Tentando comprar nego de id " + id);
                   var xmlhttp = new XMLHttpRequest();
                   try {
                       xmlhttp.onreadystatechange = function() {
                           if (this.readyState == 4 && this.status == 200) {
                               setTimeout(console.log("Compra efetuada do nego de id " + id + " com sucesso!"),0);
                               location.reload()
                           }
                       };
                   } catch(e){
                       console.log(e);
                   };
                   xmlhttp.open("POST", "https://www.myracingcareer.com/action/action_request.php?action=hire_employee&token=" + token, true);
                   var formdata = new FormData();
                   formdata.append("contract_length", semanas);
                   formdata.append("wage", wage);
                   formdata.append("id_employee", id);
                   xmlhttp.send(formdata);
               },

               getRandomArbitrary: (min, max) => {
                   return Math.random() * (max - min) + min;
               },

               prjdes: (minimo_des = 40, minimo_prj = 70) => {
                   console.log("Olhando Chefes de Design");
                   var xmlhttp = new XMLHttpRequest();
                   xmlhttp.open("GET",  "https://www.myracingcareer.com/pb/employees/market-prj-1/")
                   xmlhttp.send();
                   xmlhttp.onreadystatechange = function() {
                       if (this.readyState == 4) {
                           var parser = new DOMParser;
                           var find = parser.parseFromString(xmlhttp.responseText, "text/html");
                           var table = find.getElementsByClassName("list_table")[0]
                           for (var i = 1; i < 31; i++){
                               var des_value = parseInt(table.rows[i].cells[12].innerText);
                               var prj_value = parseInt(table.rows[i].cells[15].innerText);
                               var age_value = parseInt(table.rows[i].cells[3].innerText);
                               if (des_value > minimo_des && prj_value > minimo_prj && prj_value > 90 - 2 * Math.max(50 - age_value, 0) && des_value > 60 - 2 * Math.max(50 - age_value, 0)){
                                   var id = parseInt(table.rows[i].cells[1].innerHTML.substr(table.rows[i].cells[1].innerHTML.search("employee")+9,table.rows[i].cells[1].innerHTML.search("/\">")-table.rows[i].cells[1].innerHTML.search("employee")-9));
                                   if (age_value > 59){
                                       var semanas = 22
                                   } else var semanas = Math.trunc((77-parseInt(find.getElementsByClassName("top_panel_day_data")[0].innerText.substr(0,find.getElementsByClassName("top_panel_day_data")[0].innerText.length-3)))/7)+12;
                                   var request = new XMLHttpRequest();
                                   request.open("GET", "https://www.myracingcareer.com/pb/employee/" + id + "/", true);
                                   request.send();
                                   request.onreadystatechange = function() {
                                       if (this.readyState == 4) {
                                           var parserx = new DOMParser;
                                           var findx = parser.parseFromString(this.responseText, "text/html");
                                           if (findx.querySelector("#submit_hire") != null){
                                               var strRequest = findx.querySelectorAll("form")[0].action;
                                               if (strRequest.search(/action_request\.php\?action=hire_employee/) >= 0);
                                               var token = strRequest.substr(strRequest.search(/token=/)+6,strRequest.length);
                                               var wage = findx.querySelector("#weekly_wage").textContent;
                                               MRCBot.tools.compraNego(id, semanas, token, wage);
                                           }
                                       }
                                   }
                               }
                           }
                       }
                   }
               },

               man: (minimo = 70) => {
                   console.log("Olhando Assessores Comerciais");
                   var xmlhttp = new XMLHttpRequest();
                   xmlhttp.open("GET",  "https://www.myracingcareer.com/pb/employees/market-man-1/")
                   xmlhttp.send();
                   xmlhttp.onreadystatechange = function() {
                       if (this.readyState == 4) {
                           var parser = new DOMParser;
                           var find = parser.parseFromString(xmlhttp.responseText, "text/html");
                           var table = find.getElementsByClassName("list_table")[0]
                           for (var i = 1; i < 31; i++){
                               var man_value = parseInt(table.rows[i].cells[14].innerText);
                               var age_value = parseInt(table.rows[i].cells[3].innerText);
                               if (man_value > minimo && man_value > 95 - Math.max(50 - age_value, 0) - Math.max(45 - age_value, 0)){
                                   var id = parseInt(table.rows[i].cells[1].innerHTML.substr(table.rows[i].cells[1].innerHTML.search("employee")+9,table.rows[i].cells[1].innerHTML.search("/\">")-table.rows[i].cells[1].innerHTML.search("employee")-9));
                                   if (age_value > 59){
                                       var semanas = 22
                                   } else var semanas = Math.trunc((77-parseInt(find.getElementsByClassName("top_panel_day_data")[0].innerText.substr(0,find.getElementsByClassName("top_panel_day_data")[0].innerText.length-3)))/7)+12;
                                   var request = new XMLHttpRequest();
                                   request.open("GET", "https://www.myracingcareer.com/pb/employee/" + id + "/", true);
                                   request.send();
                                   request.onreadystatechange = function() {
                                       if (this.readyState == 4) {
                                           var parserx = new DOMParser;
                                           var findx = parser.parseFromString(this.responseText, "text/html");
                                           if (findx.querySelector("#submit_hire") != null){
                                               var strRequest = findx.querySelectorAll("form")[0].action;
                                               if (strRequest.search(/action_request\.php\?action=hire_employee/) >= 0);
                                               var token = strRequest.substr(strRequest.search(/token=/)+6,strRequest.length);
                                               var wage = findx.querySelector("#weekly_wage").textContent;
                                               MRCBot.tools.compraNego(id, semanas, token, wage);
                                           }
                                       }
                                   }
                               }
                           }
                       }
                   }
               },

               des: (minimo = 75) => {
                   console.log("Olhando Designers")
                   var xmlhttp = new XMLHttpRequest();
                   xmlhttp.open("GET",  "https://www.myracingcareer.com/pb/employees/market-des-1/")
                   xmlhttp.send();
                   xmlhttp.onreadystatechange = function() {
                       if (this.readyState == 4) {
                           var parser = new DOMParser;
                           var find = parser.parseFromString(xmlhttp.responseText, "text/html");
                           var table = find.getElementsByClassName("list_table")[0]
                           for (var i = 1; i < 31; i++){
                               var des_value = parseInt(table.rows[i].cells[12].innerText);
                               var age_value = parseInt(table.rows[i].cells[3].innerText);
                               if (des_value > minimo && des_value > 95 - Math.max(50 - age_value, 0) - Math.max(40 - age_value, 0)){
                                   var id = parseInt(table.rows[i].cells[1].innerHTML.substr(table.rows[i].cells[1].innerHTML.search("employee")+9,table.rows[i].cells[1].innerHTML.search("/\">")-table.rows[i].cells[1].innerHTML.search("employee")-9));
                                   if (age_value > 59){
                                       var semanas = 22
                                   } else var semanas = Math.trunc((77-parseInt(find.getElementsByClassName("top_panel_day_data")[0].innerText.substr(0,find.getElementsByClassName("top_panel_day_data")[0].innerText.length-3)))/7)+12;
                                   var request = new XMLHttpRequest();
                                   request.open("GET", "https://www.myracingcareer.com/pb/employee/" + id + "/", true);
                                   request.send();
                                   request.onreadystatechange = function() {
                                       if (this.readyState == 4) {
                                           var parserx = new DOMParser;
                                           var findx = parser.parseFromString(this.responseText, "text/html");
                                           if (findx.querySelector("#submit_hire") != null){
                                               var strRequest = findx.querySelectorAll("form")[0].action;
                                               if (strRequest.search(/action_request\.php\?action=hire_employee/) >= 0);
                                               var token = strRequest.substr(strRequest.search(/token=/)+6,strRequest.length);
                                               var wage = findx.querySelector("#weekly_wage").textContent;
                                               MRCBot.tools.compraNego(id, semanas, token, wage);
                                           }
                                       }
                                   }
                               }
                           }
                       }
                   }
               },

               eng: (minimo = 70) => {
                   console.log("Olhando Engenheiros")
                   var xmlhttp = new XMLHttpRequest();
                   xmlhttp.open("GET",  "https://www.myracingcareer.com/pb/employees/market-eng-1/")
                   xmlhttp.send();
                   xmlhttp.onreadystatechange = function() {
                       if (this.readyState == 4) {
                           var parser = new DOMParser;
                           var find = parser.parseFromString(xmlhttp.responseText, "text/html");
                           var table = find.getElementsByClassName("list_table")[0]
                           for (var i = 1; i < 31; i++){
                               var eng_value = parseInt(table.rows[i].cells[13].innerText);
                               var des_value = parseInt(table.rows[i].cells[12].innerText);
                               var mec_value = parseInt(table.rows[i].cells[11].innerText);
                               var age_value = parseInt(table.rows[i].cells[3].innerText);
                               if (eng_value > minimo && ((eng_value > 90 - Math.max(50 - age_value, 0) - Math.max(40 - age_value, 0) && des_value > 80 - 2 * Math.max(55 - age_value, 0)) || (eng_value + des_value + mec_value > 240 - 4 * Math.max(55 - age_value, 0) - Math.max(45 - age_value, 0)))){
                                   var id = parseInt(table.rows[i].cells[1].innerHTML.substr(table.rows[i].cells[1].innerHTML.search("employee")+9,table.rows[i].cells[1].innerHTML.search("/\">")-table.rows[i].cells[1].innerHTML.search("employee")-9));
                                   if (age_value > 59){
                                       var semanas = 22
                                   } else var semanas = Math.trunc((77-parseInt(find.getElementsByClassName("top_panel_day_data")[0].innerText.substr(0,find.getElementsByClassName("top_panel_day_data")[0].innerText.length-3)))/7)+12;
                                   var request = new XMLHttpRequest();
                                   request.open("GET", "https://www.myracingcareer.com/pb/employee/" + id + "/", true);
                                   request.send();
                                   request.onreadystatechange = function() {
                                       if (this.readyState == 4) {
                                           var parserx = new DOMParser;
                                           var findx = parser.parseFromString(this.responseText, "text/html");
                                           if (findx.querySelector("#submit_hire") != null){
                                               var strRequest = findx.querySelectorAll("form")[0].action;
                                               if (strRequest.search(/action_request\.php\?action=hire_employee/) >= 0);
                                               var token = strRequest.substr(strRequest.search(/token=/)+6,strRequest.length);
                                               var wage = findx.querySelector("#weekly_wage").textContent;
                                               MRCBot.tools.compraNego(id, semanas, token, wage);
                                           }
                                       }
                                   }
                               }
                           }
                       }
                   }
               },
           },
        }
    }).toString() + ", 1000); ";
    document.getElementsByTagName('body')[0].appendChild(MRCBotjs);
};
if (location.href.indexOf("myracingcareer") != -1) MRCBot_inject();