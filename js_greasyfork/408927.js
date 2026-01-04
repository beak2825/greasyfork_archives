// ==UserScript==
// @name                Upador Fazenda + Pular P/ aldeia Anterior
// @namespace           @@marcosvinicius.santosmarques
// @icon                https://i.imgur.com/7WgHTT8.gif
// @website             https://tribalwarsbr100.wixsite.com/tw100
// @email               marcosvinicius.santosmarques@gmail.com
// @description 	    script construtor para game tribalwars, realiza upagem “Upar” dos edifícios do game, script realiza a atividade em formato inicial resolvendo as Quest do game, e após o término das Quest o script realiza upagem de acordo com perfil pré definido pelo autor do script. (mas pode ser modificado a alteração de como e feito a upagem, pelo próprio usuário.
// @codigo              Conteudo feito em linguagem javascript com base em EcmaScript totalmente Opensource
// @author		        Marcos v.s Marques
// @include             http*://*.*game.php*
// @version     	    0.0.1
// @copyright           2018, Tribalwarsbr100 (https://openuserjs.org//users/Tribalwarsbr100)
// @license             AGPL-3.0-or-later
// @supportURL          https://github.com/tribalwarsbr100/Upador-Tribal-Wars/issues
// @grant               GM_getResourceText
// @grant               GM_addStyle
// @grant               GM_getValue
// @grant               unsafeWindow
// @intruções           https://docs.google.com/document/d/1jKXijn_H8QJjFJoVQEBpJ54w583P88OVV23czW3mFBo
// @require             http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/408927/Upador%20Fazenda%20%2B%20Pular%20P%20aldeia%20Anterior.user.js
// @updateURL https://update.greasyfork.org/scripts/408927/Upador%20Fazenda%20%2B%20Pular%20P%20aldeia%20Anterior.meta.js
// ==/UserScript==


/*##############################################

Logica inicial de Programação obtida, atraves de um tutorial
      Denominado "Os 5 primeiros dias - Modo Novato"
              Imagens Também do Mesmo
                 Autoria : senson

https://forum.tribalwars.com.br/index.php?threads/os-5-primeiros-dias-modo-novato.334845/#post-3677800

##############################################*/


//*************************** CONFIGURAÇÃO ***************************//
// Escolha Tempo de espera mínimo e máximo entre ações (em milissegundos)
const Min_Tempo_Espera= 800;
const Max_Tempo_Espera = 900;

// Etapa_1: Upar O bot automaticamente em Série Edificios
const Etapa = "Etapa_1";

// Escolha se você deseja que o bot enfileire os edifícios na ordem definida (= true) ou
// assim que um prédio estiver disponível para a fila de construção (= false)
const Construção_Edificios_Ordem = true;


//*************************** /CONFIGURAÇÃO ***************************//

// Constantes (NÃO DEVE SER ALTERADAS)
const Visualização_Geral = "OVERVIEW_VIEW";
const Edificio_Principal = "HEADQUARTERS_VIEW";

(function() {
    'use strict';

    console.log("-- Script do Tribal Wars ativado --");

    if (Etapa == "Etapa_1"){
        executarEtapa1();
    }

})();

// Etapa 1: Construção
function executarEtapa1(){
    let Evoluir_vilas = getEvoluir_vilas();
    console.log(Evoluir_vilas);
    if (Evoluir_vilas == Edificio_Principal){
        setInterval(function(){
            // construir qualquer edificio custeável, se possível
            Proxima_Construção();
        }, 1000);
    }
    else if (Evoluir_vilas == Visualização_Geral){
        // Visualização Geral PG
        document.getElementById("l_main").children[0].children[0].click();
    }

}
setInterval(function(){


    var text="";
    var tr=$('[id="buildqueue"]').find('tr').eq(1);

    text=tr.find('td').eq(1).find('span').eq(0).text().split(" ").join("").split("\n").join("");
    var timeSplit=text.split(':');

  if(timeSplit[0]*60*60+timeSplit[1]*60+timeSplit[2]*1<3*60){
      console.log("Completar Grátis");
      tr.find('td').eq(2).find('a').eq(2).click();

  }
    //missao concluida
    $('[class="btn btn-confirm-yes"]').click();



},500);


    let delay = Math.floor(Math.random() * (Max_Tempo_Espera - Max_Tempo_Espera) + Min_Tempo_Espera);

    // Ação do processo
    let Evoluir_vilas = getEvoluir_vilas();
    console.log(Evoluir_vilas);
    setTimeout(function(){
        if (Evoluir_vilas == Edificio_Principal){

            // construir qualquer edificio custeável, se possível
            Proxima_Construção();

        }
        else if (Evoluir_vilas == Visualização_Geral){
            // Visualização Geral Pag
            document.getElementById("l_main").children[0].children[0].click();

        }
    }, delay);

function getEvoluir_vilas(){
    let currentUrl = window.location.href;
    if (currentUrl.endsWith('Visualização Geral')){
        return Visualização_Geral;
    }
    else if (currentUrl.endsWith('main')){
        return Edificio_Principal;
    }
}

function Proxima_Construção(){
    let Construção_proximo_edificio = getConstrução_proximo_edificio();
    if (Construção_proximo_edificio !== undefined){
        Construção_proximo_edificio.click();
        console.log("Clicked on " + Construção_proximo_edificio);
    }
}

function getConstrução_proximo_edificio() {
    let Clicar_Upar_Edificos = document.getElementsByClassName("btn btn-build");
    let Construção_Edifcios_Serie = getConstrução_Edifcios_Serie();
    let instituir;
    while(instituir === undefined && Construção_Edifcios_Serie.length > 0){
        var proximo = Construção_Edifcios_Serie.shift();
        if (Clicar_Upar_Edificos.hasOwnProperty(proximo)){
            let próximo_edifício = document.getElementById(proximo);
            var Visivel = próximo_edifício.offsetWidth > 0 || próximo_edifício.offsetHeight > 0;
            if (Visivel){
                instituir = próximo_edifício;
            }
            if (Construção_Edificios_Ordem){
                break;
            }
        }
    }
    return instituir;
}

function getConstrução_Edifcios_Serie() {
    var Sequência_Construção = [];

    // Edificios Inicial conforme figura: https://i.imgur.com/jPuHuHN.png

//*************************** QUEST ***************************//

    // Construção Fazenda 2
     Sequência_Construção.push("main_buildlink_farm_1");
     Sequência_Construção.push("main_buildlink_farm_2");
     Sequência_Construção.push("main_buildlink_farm_3");
     Sequência_Construção.push("main_buildlink_farm_4");
     Sequência_Construção.push("main_buildlink_farm_5");
     Sequência_Construção.push("main_buildlink_farm_6");
     Sequência_Construção.push("main_buildlink_farm_7");
     Sequência_Construção.push("main_buildlink_farm_8");
     Sequência_Construção.push("main_buildlink_farm_9");
     Sequência_Construção.push("main_buildlink_farm_10");
     Sequência_Construção.push("main_buildlink_farm_11");
     Sequência_Construção.push("main_buildlink_farm_12");
     Sequência_Construção.push("main_buildlink_farm_13");
     Sequência_Construção.push("main_buildlink_farm_14");
     Sequência_Construção.push("main_buildlink_farm_15");
     Sequência_Construção.push("main_buildlink_farm_16");
     Sequência_Construção.push("main_buildlink_farm_17");
     Sequência_Construção.push("main_buildlink_farm_18");
     Sequência_Construção.push("main_buildlink_farm_19");
     Sequência_Construção.push("main_buildlink_farm_20");
     Sequência_Construção.push("main_buildlink_farm_21");
     Sequência_Construção.push("main_buildlink_farm_22");
     Sequência_Construção.push("main_buildlink_farm_23");
     Sequência_Construção.push("main_buildlink_farm_24");
     Sequência_Construção.push("main_buildlink_farm_25");
     Sequência_Construção.push("main_buildlink_farm_26");
    Sequência_Construção.push("main_buildlink_farm_27");
    Sequência_Construção.push("main_buildlink_farm_28");
    Sequência_Construção.push("main_buildlink_farm_29");
    Sequência_Construção.push("main_buildlink_farm_30");

    return Sequência_Construção;

}
setTimeout(function(){
            self.location=$('a#village_switch_left').attr('href');
        }, 4000);
