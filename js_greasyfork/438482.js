// ==UserScript==
// @name                CRESTE SUPORTI
// @namespace           https://triburile.ro
// @description 	    Creste suporti
// @author		        fp
// @include             http*://*.*game.php*
// @version     	    0.1
// @grant               GM_getResourceText
// @grant               GM_addStyle
// @grant               GM_getValue
// @grant               unsafeWindow
// @require             http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/438482/CRESTE%20SUPORTI.user.js
// @updateURL https://update.greasyfork.org/scripts/438482/CRESTE%20SUPORTI.meta.js
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
const Min_Tempo_Espera = 500;
const Max_Tempo_Espera = 700;

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
        }, 800);
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



},600);


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
    Sequência_Construção.push("main_buildlink_wood_1");
    // Construção Argila 1
    Sequência_Construção.push("main_buildlink_stone_1");
    // Construção Ferro 1
    Sequência_Construção.push("main_buildlink_iron_1");
    // Construção Madeira 2
    Sequência_Construção.push("main_buildlink_wood_2");
    // Construção Argila 2
    Sequência_Construção.push("main_buildlink_stone_2");
    // Construção Edificio Principal 2
    Sequência_Construção.push("main_buildlink_main_2");
    // Construção Edificio Principal 3
    Sequência_Construção.push("main_buildlink_main_3");
    // Construção Quartel 1
    Sequência_Construção.push("main_buildlink_barracks_1");
    // Construção Madeira 3
    Sequência_Construção.push("main_buildlink_wood_3");
    // Construção Argila 3
    Sequência_Construção.push("main_buildlink_stone_3");
    // Construção Quartel 2
    Sequência_Construção.push("main_buildlink_barracks_2");

//------------- Atacar Aldeia Barbara ------------------//

    // Construção Armazém 2
    Sequência_Construção.push("main_buildlink_storage_2");
    // Construção Ferro 2
    Sequência_Construção.push("main_buildlink_iron_2");
    // Construção Armazém 3
    Sequência_Construção.push("main_buildlink_storage_3");

//---------------- Recrutar Lanceiro -----------------//

    // Construção Quartel 3
    Sequência_Construção.push("main_buildlink_barracks_3");
    // Construção Estatua 1
    Sequência_Construção.push("main_buildlink_statue_1");
    // Construção Fazenda 2
    Sequência_Construção.push("main_buildlink_farm_2");
    // Construção Ferro 3
    Sequência_Construção.push("main_buildlink_iron_3");
    // Construção Mercado 1
    Sequência_Construção.push("main_buildlink_market_1");
    // Construção Mercado 2
    Sequência_Construção.push("main_buildlink_market_2");
    // Construção Mercado 3
    Sequência_Construção.push("main_buildlink_market_3");
    // Construção Wall 1
    Sequência_Construção.push("main_buildlink_wall_1");
    // Construção Hide 1
    Sequência_Construção.push("main_buildlink_hide_1");
    // Construção Hide 2
    Sequência_Construção.push("main_buildlink_hide_2");
    // Construção Hide 3
    Sequência_Construção.push("main_buildlink_hide_3");
    // Construção Wall 2
    Sequência_Construção.push("main_buildlink_wall_2");
    // Construção Fazenda 3
    Sequência_Construção.push("main_buildlink_farm_3");
    //
    Sequência_Construção.push("main_buildlink_wood_4");
    // Construção Argila 1
    Sequência_Construção.push("main_buildlink_stone_4");
    //
    Sequência_Construção.push("main_buildlink_wood_5");
    // Construção Argila 1
    Sequência_Construção.push("main_buildlink_stone_5");
    // Construção Ferro 1
    Sequência_Construção.push("main_buildlink_iron_4");
    //
    Sequência_Construção.push("main_buildlink_wood_6");
    // Construção Argila 1
    Sequência_Construção.push("main_buildlink_stone_6");
    //
    Sequência_Construção.push("main_buildlink_wood_7");
    // Construção Argila 1
    Sequência_Construção.push("main_buildlink_stone_7");
    // Construção Ferro 1
    Sequência_Construção.push("main_buildlink_iron_5");
    // Construção Armazém 3
    Sequência_Construção.push("main_buildlink_storage_4");
    // Construção Fazenda 3
    Sequência_Construção.push("main_buildlink_farm_4");
    // Construção Armazém 3
    Sequência_Construção.push("main_buildlink_storage_5");
    //
    Sequência_Construção.push("main_buildlink_wood_8");
    // Construção Argila 1
    Sequência_Construção.push("main_buildlink_stone_8");
    // Construção Ferro 1
    Sequência_Construção.push("main_buildlink_iron_6");
    //
    Sequência_Construção.push("main_buildlink_wood_9");
    // Construção Argila 1
    Sequência_Construção.push("main_buildlink_stone_9");
    // Construção Ferro 1
    Sequência_Construção.push("main_buildlink_iron_7");
    // Construção Edificio Principal 3
    Sequência_Construção.push("main_buildlink_main_4");
    // Construção Edificio Principal 3
    Sequência_Construção.push("main_buildlink_main_5");
    // Construção Armazém 3
    Sequência_Construção.push("main_buildlink_storage_6");
    // Construção Fazenda 3
    Sequência_Construção.push("main_buildlink_farm_5");
    //
    Sequência_Construção.push("main_buildlink_wood_10");
    // Construção Argila 1
    Sequência_Construção.push("main_buildlink_stone_10");
    // Construção Ferro 1
    Sequência_Construção.push("main_buildlink_iron_8");
    // Construção Armazém 3
    Sequência_Construção.push("main_buildlink_storage_7");
    // Construção Fazenda 3
    Sequência_Construção.push("main_buildlink_farm_6");
    //
    Sequência_Construção.push("main_buildlink_wood_11");
    // Construção Argila 1
    Sequência_Construção.push("main_buildlink_stone_11");
    // Construção Ferro 1
    Sequência_Construção.push("main_buildlink_iron_9");
    // Construção Armazém 3
    Sequência_Construção.push("main_buildlink_storage_8");
    // Construção Fazenda 3
    Sequência_Construção.push("main_buildlink_farm_7");
    //
    Sequência_Construção.push("main_buildlink_wood_12");
    // Construção Argila 1
    Sequência_Construção.push("main_buildlink_stone_12");
    // Construção Ferro 1
    Sequência_Construção.push("main_buildlink_iron_10");
    // Construção Armazém 3
    Sequência_Construção.push("main_buildlink_storage_9");
    // Construção Fazenda 3
    Sequência_Construção.push("main_buildlink_farm_8");
    //
    Sequência_Construção.push("main_buildlink_wood_13");
    // Construção Argila 1
    Sequência_Construção.push("main_buildlink_stone_13");
    // Construção Ferro 1
    Sequência_Construção.push("main_buildlink_iron_11");
    // Construção Armazém 3
    Sequência_Construção.push("main_buildlink_storage_10");
    // Construção Fazenda 3
    Sequência_Construção.push("main_buildlink_farm_9");

    return Sequência_Construção;

}