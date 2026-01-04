// ==UserScript==
// @name                Upador Automatico Tribal Wars
// @namespace           --
// @icon                https://i.imgur.com/7WgHTT8.gif
// @website             --
// @email               --
// @email_2             --
// @description 	    Esse Script serve para upar automaticamente as construções do Game Tribal Wars, o script realiza a atividade em formato inicial resolvendo as Quest do game, e após o término das Quest o script realiza upagem de acordo com perfil pré definido pelo autor do script. (mas pode ser modificado a alteração de como é feito a upagem, pelo próprio usuário.
// @codigo              Conteudo feito em linguagem javascript com base em EcmaScript totalmente Opensource
// @author		        Marcos v.s Marques
// @Collaboration       Fernando Gomes
// @Collaboration_2     readaptado por Bruno Silva    
// @include             http*://*.*game.php*
// @version     	    0.2.0
// @copyright           2018, Tribalwarsbr100 (https://openuserjs.org//users/Tribalwarsbr100)
// @license             AGPL-3.0-or-later
// @supportURL          https://github.com/tribalwarsbr100/Upador-Tribal-Wars/issues
// @grant               GM_getResourceText
// @grant               GM_addStyle
// @grant               GM_getValue
// @grant               unsafeWindow
// @intruções           https://docs.google.com/document/d/1jKXijn_H8QJjFJoVQEBpJ54w583P88OVV23czW3mFBo
// @require             http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/522329/Upador%20Automatico%20Tribal%20Wars.user.js
// @updateURL https://update.greasyfork.org/scripts/522329/Upador%20Automatico%20Tribal%20Wars.meta.js
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
const Min_Tempo_Espera= 800000;
const Max_Tempo_Espera = 900000;

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
    // Construção Madeira 1
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
    // Construção Edificio Principal 4
    Sequência_Construção.push("main_buildlink_main_4");
    // Construção Edificio Principal 5
    Sequência_Construção.push("main_buildlink_main_5");
    // Construção Ferreiro 1
    Sequência_Construção.push("main_buildlink_smith_1");
    // Construção Madeira 4
    Sequência_Construção.push("main_buildlink_wood_4");
    // Construção Argila 4
    Sequência_Construção.push("main_buildlink_stone_4");

    //---------------- Recrutar Paladino - Escolher Bandeira -  -----------------//

    // Construção Muralha 1
    Sequência_Construção.push("main_buildlink_wall_1");
    // Construção Esconderijo 2
    Sequência_Construção.push("main_buildlink_hide_2");
    // Construção Esconderijo 3
    Sequência_Construção.push("main_buildlink_hide_3");
    // Construção Madeira 5
    Sequência_Construção.push("main_buildlink_wood_5");
    // Construção Argila 5
    Sequência_Construção.push("main_buildlink_stone_5");
    // Construção Mercado 1
    Sequência_Construção.push("main_buildlink_market_1");
    // Construção Madeira 6
    Sequência_Construção.push("main_buildlink_wood_6");
    // Construção Argila 6
    Sequência_Construção.push("main_buildlink_stone_6");
    // Construção Edificio Principal 6
    Sequência_Construção.push("main_buildlink_main_6");
    // Construção Madeira 7
    Sequência_Construção.push("main_buildlink_wood_7");
    // Construção Argila 7
    Sequência_Construção.push("main_buildlink_stone_7");
    // Construção Ferro 4
    Sequência_Construção.push("main_buildlink_iron_4");
    // Construção Ferro 5
    Sequência_Construção.push("main_buildlink_iron_5");
    // Construção Ferro 6
    Sequência_Construção.push("main_buildlink_iron_6");
    // Construção Edificio Principal 7
    Sequência_Construção.push("main_buildlink_main_7");
    // Construção Madeira 8
    Sequência_Construção.push("main_buildlink_wood_8");
    // Construção Argila 8
    Sequência_Construção.push("main_buildlink_stone_8");
    // Construção Ferro 7
    Sequência_Construção.push("main_buildlink_iron_7");
    // Construção Madeira 9
    Sequência_Construção.push("main_buildlink_wood_9");
    // Construção Argila 9
    Sequência_Construção.push("main_buildlink_stone_9");
    // Construção Madeira 10
    Sequência_Construção.push("main_buildlink_wood_10");
    // Construção Argila 10
    Sequência_Construção.push("main_buildlink_stone_10");
    // Construção Armazém 4
    Sequência_Construção.push("main_buildlink_storage_4");
    // Construção Armazém 5
    Sequência_Construção.push("main_buildlink_storage_5");
    // Construção Armazém 6
    Sequência_Construção.push("main_buildlink_storage_6");
    // Construção Armazém 7
    Sequência_Construção.push("main_buildlink_storage_7");
    // Construção Armazém 8
    Sequência_Construção.push("main_buildlink_storage_8");
    // Construção Armazém 9
    Sequência_Construção.push("main_buildlink_storage_9");


//---------------- https://image.prntscr.com/image/oMwaEPpCR2_1XaHzlMaobg.png -  -----------------//

    // Construção Mercado 2
    Sequência_Construção.push("main_buildlink_market_2");
    // Construção Mercado 3
    Sequência_Construção.push("main_buildlink_market_3");
    // Construção Mercado 4
    Sequência_Construção.push("main_buildlink_market_4");
    // Construção Edificio Principal 8
    Sequência_Construção.push("main_buildlink_main_8");
    // Construção Edificio Principal 9
    Sequência_Construção.push("main_buildlink_main_9");
    // Construção Edificio Principal 10
    Sequência_Construção.push("main_buildlink_main_10");
    // Construção Madeira 11
    Sequência_Construção.push("main_buildlink_wood_11");
    // Construção Argila 11
    Sequência_Construção.push("main_buildlink_stone_11");
     // Construção Madeira 12
    Sequência_Construção.push("main_buildlink_wood_12");
    // Construção Argila 12
    Sequência_Construção.push("main_buildlink_stone_12");
    // Construção Armazém 10
    Sequência_Construção.push("main_buildlink_storage_10");
    // Construção Ferro 8
    Sequência_Construção.push("main_buildlink_iron_8");
    // Construção Armazém 11
    Sequência_Construção.push("main_buildlink_storage_11");
    // Construção Ferro 9
    Sequência_Construção.push("main_buildlink_iron_9");
    // Construção Ferro 10
    Sequência_Construção.push("main_buildlink_iron_10");

//---------------- https://image.prntscr.com/image/n6tBlPGORAq9RmqSVccTKg.png -  -----------------//

    // Construção Edificio Principal 11
    Sequência_Construção.push("main_buildlink_main_11");
    // Construção Madeira 13
    Sequência_Construção.push("main_buildlink_wood_13");
    // Construção Argila 13
    Sequência_Construção.push("main_buildlink_stone_13");
    // Construção Ferro 11
    Sequência_Construção.push("main_buildlink_iron_11");
    // Construção Fazenda 3
    Sequência_Construção.push("main_buildlink_farm_3");
    // Construção Fazenda 4
    Sequência_Construção.push("main_buildlink_farm_4");
    // Construção Fazenda 5
    Sequência_Construção.push("main_buildlink_farm_5");
    // Construção Ferro 12
    Sequência_Construção.push("main_buildlink_iron_12");

//---------------- https://image.prntscr.com/image/ERCLrS5cT32ntSv1IevLUg.png -  -----------------//

    // Construção Fazenda 6
    Sequência_Construção.push("main_buildlink_farm_6");
    // Construção Fazenda 7
    Sequência_Construção.push("main_buildlink_farm_7");
    // Construção Muralha 2
    Sequência_Construção.push("main_buildlink_wall_2");
    // Construção Muralha 3
    Sequência_Construção.push("main_buildlink_wall_3");
    // Construção Muralha 4
    Sequência_Construção.push("main_buildlink_wall_4");
    // Construção Muralha 5
    Sequência_Construção.push("main_buildlink_wall_5");
    // Construção Ferro 13
    Sequência_Construção.push("main_buildlink_iron_13");
    // Construção Ferro 14
    Sequência_Construção.push("main_buildlink_iron_14");

//---------------- https://image.prntscr.com/image/V15bxH7KSFa5gu3d02yYIQ.png -  -----------------//

    // Construção Fazenda 8
    Sequência_Construção.push("main_buildlink_farm_8");
    // Construção Fazenda 9
    Sequência_Construção.push("main_buildlink_farm_9");

//---------------- https://image.prntscr.com/image/3pioalUXRK6AH9wNYnRxyQ.png -  -----------------//


// Construção Quartel 4
    Sequência_Construção.push("main_buildlink_barracks_4");
    // Construção Quartel 5
    Sequência_Construção.push("main_buildlink_barracks_5");
    // Construção Quartel 6
    Sequência_Construção.push("main_buildlink_barracks_6");
    // Construção Ferreiro 2
    Sequência_Construção.push("main_buildlink_smith_2");
    // Construção Ferreiro 3
    Sequência_Construção.push("main_buildlink_smith_3");
    // Construção Ferreiro 4
    Sequência_Construção.push("main_buildlink_smith_4");
    // Construção Ferreiro 5
    Sequência_Construção.push("main_buildlink_smith_5");
    // Construção Estábulo 1
    Sequência_Construção.push("main_buildlink_stable_1");
    // Construção Estábulo 2
    Sequência_Construção.push("main_buildlink_stable_2");
    // Construção Estábulo 3
    Sequência_Construção.push("main_buildlink_stable_3");
    // Construção Armazém 11
    Sequência_Construção.push("main_buildlink_storage_11");
    // Construção Fazenda 10
    Sequência_Construção.push("main_buildlink_farm_10");
    // Construção Fazenda 11
    Sequência_Construção.push("main_buildlink_farm_11");
    // Construção Fazenda 12
    Sequência_Construção.push("main_buildlink_farm_12");
    // Construção Armazém 12
    Sequência_Construção.push("main_buildlink_storage_12");
    // Construção Madeira 14
    Sequência_Construção.push("main_buildlink_wood_14");
    // Construção Argila 14
    Sequência_Construção.push("main_buildlink_stone_14");
    // Construção Madeira 15
    Sequência_Construção.push("main_buildlink_wood_15");
    // Construção Argila 15
    Sequência_Construção.push("main_buildlink_stone_15");
    // Construção Armazém 13
    Sequência_Construção.push("main_buildlink_storage_13");
    // Construção Muralha 6
    Sequência_Construção.push("main_buildlink_wall_6");
    // Construção Muralha 7
    Sequência_Construção.push("main_buildlink_wall_7");
    // Construção Muralha 8
    Sequência_Construção.push("main_buildlink_wall_8");
    // Construção Muralha 9
    Sequência_Construção.push("main_buildlink_wall_9");
    // Construção Muralha 10
    Sequência_Construção.push("main_buildlink_wall_10");
    // Construção Mercado 5
    Sequência_Construção.push("main_buildlink_market_5");
    // Construção Mercado 6
    Sequência_Construção.push("main_buildlink_market_6");
    // Construção Armazém 14
    Sequência_Construção.push("main_buildlink_storage_14");
    // Construção Quartel 7
    Sequência_Construção.push("main_buildlink_barracks_7");
    // Construção Quartel 8
    Sequência_Construção.push("main_buildlink_barracks_8");
    // Construção Quartel 9
    Sequência_Construção.push("main_buildlink_barracks_9");
    // Construção Edificio Principal 12
    Sequência_Construção.push("main_buildlink_main_12");
    // Construção Armazém 15
    Sequência_Construção.push("main_buildlink_storage_15");
    // Construção Edificio Principal 13
    Sequência_Construção.push("main_buildlink_main_13");
    // Construção Fazenda 13
    Sequência_Construção.push("main_buildlink_farm_13");
    // Construção Edificio Principal 14
    Sequência_Construção.push("main_buildlink_main_14");
    // Construção Madeira 16
    Sequência_Construção.push("main_buildlink_wood_16");
    // Construção Argila 16
    Sequência_Construção.push("main_buildlink_stone_16");
    // Construção Madeira 17
    Sequência_Construção.push("main_buildlink_wood_17");
    // Construção Argila 17
    Sequência_Construção.push("main_buildlink_stone_17");
    // Construção Edificio Principal 15
    Sequência_Construção.push("main_buildlink_main_15");
    // Construção Edificio Principal 16
    Sequência_Construção.push("main_buildlink_main_16");
    // Construção Armazém 16
    Sequência_Construção.push("main_buildlink_storage_16");
    // Construção Armazém 17
    Sequência_Construção.push("main_buildlink_storage_17");
    // Construção Quartel 10
    equência_Construção.push("main_buildlink_barracks_10");
    // Construção Quartel 11
    equência_Construção.push("main_buildlink_barracks_11");
    // Construção Quartel 12
    Sequência_Construção.push("main_buildlink_barracks_12");
    // Construção Ferro 15
    Sequência_Construção.push("main_buildlink_iron_15");
    // Construção Ferro 16
    Sequência_Construção.push("main_buildlink_iron_16");
    // Construção Fazenda 14
    Sequência_Construção.push("main_buildlink_farm_14");
    // Construção Fazenda 15
    Sequência_Construção.push("main_buildlink_farm_15");
    // Construção Fazenda 16
    Sequência_Construção.push("main_buildlink_farm_16");
    // Construção Fazenda 17
    Sequência_Construção.push("main_buildlink_farm_17");
    // Construção Muralha 11
    Sequência_Construção.push("main_buildlink_wall_11");
    // Construção Muralha 12
    Sequência_Construção.push("main_buildlink_wall_12");
    // Construção Mercado 7
    Sequência_Construção.push("main_buildlink_market_7");
    // Construção Mercado 8
    Sequência_Construção.push("main_buildlink_market_8");
    // Construção Mercado 9
    Sequência_Construção.push("main_buildlink_market_9");
    // Construção Ferreiro 6
    Sequência_Construção.push("main_buildlink_smith_6");
    // Construção Ferreiro 7
    Sequência_Construção.push("main_buildlink_smith_7");
    // Construção Ferreiro 8
    Sequência_Construção.push("main_buildlink_smith_8");
    // Construção Ferreiro 9
    Sequência_Construção.push("main_buildlink_smith_9");
    // Construção Ferreiro 10
    Sequência_Construção.push("main_buildlink_smith_10");
    // Construção Mercado 10
    Sequência_Construção.push("main_buildlink_market_10");
     // Construção Madeira 18
    Sequência_Construção.push("main_buildlink_wood_18");
    // Construção Argila 18
    Sequência_Construção.push("main_buildlink_stone_13");
    // Construção Ferro 17
    Sequência_Construção.push("main_buildlink_iron_17");
    // Construção Fazenda 18
    Sequência_Construção.push("main_buildlink_farm_18");
    // Construção Fazenda 19
    Sequência_Construção.push("main_buildlink_farm_19");
    // Construção Madeira 19
    Sequência_Construção.push("main_buildlink_wood_19");
    // Construção Argila 19
    Sequência_Construção.push("main_buildlink_stone_19");
    // Construção Oficina 1
    Sequência_Construção.push("main_buildlink_garage_1");
    // Construção Oficina 2
    Sequência_Construção.push("main_buildlink_garage_2");
    // Construção Ferreiro 11
    Sequência_Construção.push("main_buildlink_smith_11");
    // Construção Ferreiro 12
    Sequência_Construção.push("main_buildlink_smith_12");
    // Construção Muralha 13
    Sequência_Construção.push("main_buildlink_wall_13");
    // Construção Edificio Principal 17
    Sequência_Construção.push("main_buildlink_main_17");
    // Construção Edificio Principal 18
    Sequência_Construção.push("main_buildlink_main_18");
    // Construção Edificio Principal 19
    Sequência_Construção.push("main_buildlink_main_19");
    // Construção Edificio Principal 20
    Sequência_Construção.push("main_buildlink_main_20");
    // Construção Armazém 18
     Sequência_Construção.push("main_buildlink_storage_18");
    // Construção Armazém 19
    Sequência_Construção.push("main_buildlink_storage_19");
    // Construção Armazém 20
    Sequência_Construção.push("main_buildlink_storage_20");
    // Construção Armazém 21
    Sequência_Construção.push("main_buildlink_storage_21");
    // Construção Madeira 20
    Sequência_Construção.push("main_buildlink_wood_20");
    // Construção Argila 20
    Sequência_Construção.push("main_buildlink_stone_20");
    // Construção Estábulo 4
    Sequência_Construção.push("main_buildlink_stable_4");
    // Construção Estábulo 5
    Sequência_Construção.push("main_buildlink_stable_5");
    // Construção Estábulo 6
    Sequência_Construção.push("main_buildlink_stable_6");
    // Construção Estábulo 7
    Sequência_Construção.push("main_buildlink_stable_7");
    // Construção Estábulo 8
    Sequência_Construção.push("main_buildlink_stable_8");
    // Construção Oficina 3
    Sequência_Construção.push("main_buildlink_garage_3");
    // Construção Oficina 4
    Sequência_Construção.push("main_buildlink_garage_4");
    // Construção Oficina 5
    Sequência_Construção.push("main_buildlink_garage_5");
    // Construção Ferreiro 13
    Sequência_Construção.push("main_buildlink_smith_13");
    // Construção Ferreiro 14
    Sequência_Construção.push("main_buildlink_smith_14");
    // Construção Ferro 18
    Sequência_Construção.push("main_buildlink_iron_18");
     // Construção Madeira 21
    Sequência_Construção.push("main_buildlink_wood_21");
    // Construção Estábulo 9
    Sequência_Construção.push("main_buildlink_stable_9");
    // Construção Fazenda 20
    Sequência_Construção.push("main_buildlink_farm_20");
    // Construção Muralha 14
    Sequência_Construção.push("main_buildlink_wall_14");
    // Construção Muralha 15
    Sequência_Construção.push("main_buildlink_wall_15");
    // Construção Fazenda 21
    Sequência_Construção.push("main_buildlink_farm_21");
    // Construção Armazém 22
    Sequência_Construção.push("main_buildlink_storage_22");
    // Construção Ferro 19
    Sequência_Construção.push("main_buildlink_iron_19");
    // Construção Muralha 16
    Sequência_Construção.push("main_buildlink_wall_16");
    // Construção Muralha 17
    Sequência_Construção.push("main_buildlink_wall_17");
    // Construção Argila 21
    Sequência_Construção.push("main_buildlink_stone_21");
    // Construção Madeira 22
    Sequência_Construção.push("main_buildlink_wood_22");
    // Construção Argila 22
    Sequência_Construção.push("main_buildlink_stone_22");
    // Construção Ferreiro 15
    Sequência_Construção.push("main_buildlink_smith_15");
    // Construção Ferreiro 16
    Sequência_Construção.push("main_buildlink_smith_16");
    // Construção Ferreiro 17
    Sequência_Construção.push("main_buildlink_smith_17");
    // Construção Armazém 23
    Sequência_Construção.push("main_buildlink_storage_23");
    // Construção Madeira 23
    Sequência_Construção.push("main_buildlink_wood_23");
    // Construção Argila 23
    Sequência_Construção.push("main_buildlink_stone_23");
    // Construção Ferro 20
    Sequência_Construção.push("main_buildlink_iron_20");
    // Construção Ferro 21
    Sequência_Construção.push("main_buildlink_iron_21");
    // Construção Ferro 22
    Sequência_Construção.push("main_buildlink_iron_22");
    // Construção Ferreiro 18
    Sequência_Construção.push("main_buildlink_smith_18");
    // Construção Ferreiro 19
    Sequência_Construção.push("main_buildlink_smith_19");
    // Construção Ferreiro 20
    Sequência_Construção.push("main_buildlink_smith_20");
    // Construção Fazenda 22
    Sequência_Construção.push("main_buildlink_farm_22");
    // Construção Madeira 24
    Sequência_Construção.push("main_buildlink_wood_24");
    // Construção Argila 24
    Sequência_Construção.push("main_buildlink_stone_24");
    // Construção Ferro 23
    Sequência_Construção.push("main_buildlink_iron_23");
    // Construção Academia 1
    Sequência_Construção.push("main_buildlink_snob_1")
    // Construção Madeira 25
    Sequência_Construção.push("main_buildlink_wood_25");
    // Construção Argila 24
    Sequência_Construção.push("main_buildlink_stone_25");
    // Construção Ferro 24
    Sequência_Construção.push("main_buildlink_iron_24");
    // Construção Armazém 24
    Sequência_Construção.push("main_buildlink_storage_24");
    // Construção Muralha 18
    Sequência_Construção.push("main_buildlink_wall_18");
    // Construção Muralha 19
    Sequência_Construção.push("main_buildlink_wall_19");
    // Construção Armazém 25
    Sequência_Construção.push("main_buildlink_storage_25");
    // Construção Muralha 20
    Sequência_Construção.push("main_buildlink_wall_20");
    // Construção Madeira 26
    Sequência_Construção.push("main_buildlink_wood_26");
    // Construção Argila 26
    Sequência_Construção.push("main_buildlink_stone_26");
    // Construção Ferro 25
    Sequência_Construção.push("main_buildlink_iron_25");
    // Construção Armazém 26
    Sequência_Construção.push("main_buildlink_storage_26");
    // Construção Armazém 27
    Sequência_Construção.push("main_buildlink_storage_27");
    // Construção Fazenda 23
    Sequência_Construção.push("main_buildlink_farm_23");
    // Construção Fazenda 24
    Sequência_Construção.push("main_buildlink_farm_24");
    // Construção Fazenda 25
    Sequência_Construção.push("main_buildlink_farm_25");
    // Construção Fazenda 26
    Sequência_Construção.push("main_buildlink_farm_26");
    // Construção Fazenda 27
    Sequência_Construção.push("main_buildlink_farm_27");
    // Construção Oficina 6
    // Sequência_Construção.push("main_buildlink_garage_6");
    // Construção Oficina 7
    // Sequência_Construção.push("main_buildlink_garage_7");
    // Construção Estábulo 10
    Sequência_Construção.push("main_buildlink_stable_10");
    // Construção Estábulo 11
    Sequência_Construção.push("main_buildlink_stable_11");
    // Construção Estabulo 12
    Sequência_Construção.push("main_buildlink_stable_12");
    // Construção Oficina 8
    //Sequência_Construção.push("main_buildlink_garage_8");
    // Construção Estabulo 13
    Sequência_Construção.push("main_buildlink_stable_13");
    // Construção Edificio Principal 21
    //Sequência_Construção.push("main_buildlink_main_21");
    // Construção Oficina 9
    //Sequência_Construção.push("main_buildlink_garage_9");
    // Construção Estabulo 14
    Sequência_Construção.push("main_buildlink_stable_14");
    // Construção Edificio Principal 22
    //Sequência_Construção.push("main_buildlink_main_22");
    // Construção Oficina 10
    //Sequência_Construção.push("main_buildlink_garage_10");
    // Construção Estabulo 15
    Sequência_Construção.push("main_buildlink_stable_15");
    // Construção Quartel 17
    Sequência_Construção.push("main_buildlink_barracks_17");
    // Construção Quartel 18
    Sequência_Construção.push("main_buildlink_barracks_18");
    // Construção Quartel 19
    Sequência_Construção.push("main_buildlink_barracks_19");
    // Construção Quartel 20
    Sequência_Construção.push("main_buildlink_barracks_20");
    // Construção Madeira 27
    Sequência_Construção.push("main_buildlink_wood_27");
    // Construção Argila 27
    Sequência_Construção.push("main_buildlink_stone_27");
    // Construção Ferro 26
    Sequência_Construção.push("main_buildlink_iron_26");
    // Construção Madeira 28
    Sequência_Construção.push("main_buildlink_wood_28");
    // Construção Argila 28
    Sequência_Construção.push("main_buildlink_stone_28");
    // Construção Ferro 27
    Sequência_Construção.push("main_buildlink_iron_27");
    // Construção Fazenda 28
    Sequência_Construção.push("main_buildlink_farm_28");
    // Construção Fazenda 29
    Sequência_Construção.push("main_buildlink_farm_29");
    // Construção Fazenda 30
    Sequência_Construção.push("main_buildlink_farm_30");
    // Construção Madeira 29
    Sequência_Construção.push("main_buildlink_wood_29");
    // Construção Argila 29
    Sequência_Construção.push("main_buildlink_stone_29");
    // Construção Quartel 21
    // Sequência_Construção.push("main_buildlink_barracks_21");
    // Construção Quartel 22
    // Sequência_Construção.push("main_buildlink_barracks_22");
    // Construção Ferro 28
    Sequência_Construção.push("main_buildlink_iron_28");
    // Construção Madeira 30
    Sequência_Construção.push("main_buildlink_wood_30");
    // Construção Argila 30
    Sequência_Construção.push("main_buildlink_stone_30");
    // Construção Quartel 23
    // Sequência_Construção.push("main_buildlink_barracks_23");
    // Construção Quartel 24
    // Sequência_Construção.push("main_buildlink_barracks_24");
    // Construção Quartel 25
    // Sequência_Construção.push("main_buildlink_barracks_25");
    // Construção Ferro 29
    Sequência_Construção.push("main_buildlink_iron_29");
    // Construção Ferro 30
    Sequência_Construção.push("main_buildlink_iron_30");


    return Sequência_Construção;

}
