// ==UserScript==
// @name                Muralha PT Casual 3
// @namespace           @@marcosvinicius.santosmarques
// @website             https://tribalwarsbr100.wixsite.com/tw100
// @email               tribalwarsbr100@gmail.com
// @description 	    Script Facilitador Processo de Derrubar Muralhas Game Tribal Wars
// @author		        Marcos v.s Marques
// @include             http*://*.*game.php*
// @version     	    0.0.1
// @supportURL          https://github.com/tribalwarsbr100?tab=followers
// @grant               GM_getResourceText
// @grant               GM_addStyle
// @grant               GM_getValue
// @grant               unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/390522/Muralha%20PT%20Casual%203.user.js
// @updateURL https://update.greasyfork.org/scripts/390522/Muralha%20PT%20Casual%203.meta.js
// ==/UserScript==

//https://pt.stackoverflow.com/questions/93373/saber-posi%C3%A7%C3%A3o-de-uma-tr-html-tr-tr-na-sequencia-de-trs
// Adicionando Tabela Lateral
$('#plunder_list tr:first').append('<th rowspan="2"><img id="sendall"src="https://dsbr.innogamescdn.com/asset/4799ea22/graphic/unit/unit_ram.png" class=""></th>');

// Seletor tr tr (coluna correta a ser envolvida)
var Coluna = $('#plunder_list tr:not(:first, :last)').length,
    Coluna_Aldeias = [],
    //abaixo add ID aldeias para atacar automaticamente
    //Coluna_AldeiasId = [],
    Coordenadas_aldeias = [],
    axe = 100,
    spy = 1,
    ram = 15,
    enviar = $('#target_attack'),
    comfirmar = $('#troop_confirm_go');

for (i = 1; i <= $('#plunder_list tr:not(:first, :last)').length; i++) {
    Coordenadas_aldeias.push($('#plunder_list tr:not(:first)').eq(i).find('td').eq(3).find('a').text().split(/[()|]/));
}

for (i = 0; i <= Coluna; i++) {
    Coluna_Aldeias.push(parseInt($('#plunder_list tr:not(:first, :last)').eq(i).find('td').eq(6).text()));

}


//console.log(Coluna_Aldeias)
$(document).ready(function () {
    var Script = $('a#Deruba_Muralha').length,
        AldeiaURL = [];
    $("img.Deruba_Muralha").click(function () {
        $(this).closest("tr").remove(); // Remover aldeias da lista após um ataque (Temporariamente para atualizar a página)
    });

    function enviar() {
        $('#target_attack').click();
    }

    function comfirmar() {
        $('#troop_confirm_go').click();
    }

    if (window.location.href.indexOf("&from=simulator&") > -1) {
        setTimeout(function () {
            enviar();
        }, 1000);
    }

    if (window.location.href.indexOf("&try=confirm") > -1) {
        setTimeout(function () {
            comfirmar();
        }, 1000);
    }

    for (i = 0; i <= Script; i++) {
        AldeiaURL.push($('a#Deruba_Muralha').eq(i).attr('href'));
    }
// Fechamento Abas navegador Tempo em Ms
    if (window.location.href.indexOf("screen=place") > -1) {
        setTimeout(function () {
          window.close()
        }, 5000);
    }


});


// 1 a 14 Nivel muralha divisão tropas

for (i = 0; i <= Coluna; i++) {

    if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 1) {
        spy = 1;
        axe = 30;
        ram = 3;
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 2) {
        spy = 1;
        axe = 55;
        ram = 7
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 3) {
        spy = 1;
        axe = 67;
        ram = 10;
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 4) {
        spy = 1;
        axe = 73;
        ram = 13;
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 5) {
        spy = 1;
        axe = 83;
        ram = 15;
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 6) {
        spy = 1;
        axe = 87;
        ram = 20;
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 7) {
        spy = 1;
        axe = 192;
        ram = 29;
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 8) {
        spy = 1;
        axe = 192;
        ram = 39;
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 9) {
        spy = 1;
        axe = 329;
        ram = 46;
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 10) {
        spy = 1;
        axe = 349;
        ram = 51;
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 11) {
        spy = 1;
        axe = 513;
        ram = 61;
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 12) {
        spy = 1;
        axe = 584;
        ram = 73;
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 13) {
        spy = 1;
        axe = 879;
        ram = 89;
    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 14) {
        spy = 1;
        axe = 923;
        ram = 101;
    } else {
        spy = 0;
        axe = 0;
        ram = 0;
    }

                       ///////////////////////////////////// CONFIGURAÇÃO MUNDO \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

                                             ////////////////ENVIO DE APENAS UMA ALDEIA \\\\\\\\\\\\\\\\\\
  /*  if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) > 0) {
          $('#plunder_list tr:gt(1)').eq(i).append('<td><a id="Deruba_Muralha" href="https://brp4.tribalwars.com.br/game.php?village=1820&screen=place&x=' + Coordenadas_aldeias[i][1] + '&y=' + Coordenadas_aldeias[i][2] + '&from=simulator&axe=' + axe + '&spy=' + spy + '&ram=' + ram + '" target="_blank"><img class="Deruba_Muralha" src="https://dsbr.innogamescdn.com/asset/4799ea22/graphic/unit/unit_ram.png" class=""></a></td>');
    
    } else {
       $('#plunder_list tr:gt(1)').eq(i).append('0 Muralha')
    }
*/

                                                ////////////////ENVIO DE QUALQUER ALDEIA \\\\\\\\\\\\\\\\\\
/*Abaixo no texto em > https://coloque aqui o mundo < Exemplo :> https://br90.tribalwars.com.br/game.php?village=  */
   $('#plunder_list tr:gt(1)').eq(i).append('<td><a id="Deruba_Muralha" href=" https://ptp3.tribalwars.com.pt/game.php?village='+game_data.village.id+'&screen=place&x=' + Coordenadas_aldeias[i][1] + '&y=' + Coordenadas_aldeias[i][2] + '&from=simulator&axe=' + axe + '&spy=' + spy + '&ram=' + ram + '" target="_blank"><img class="Deruba_Muralha" src="https://dsbr.innogamescdn.com/asset/4799ea22/graphic/unit/unit_ram.png" class=""></a></td>');
    spy = 0;
    axe = 0;
    ram = 0;


// Coloração Tabela
    if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 1) {
//LightBlue
        $('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').css('background', 'rgb(233,150,122)');

    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 2) {
//DeepSkyBlue
        $('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').css('background', 'rgb(255,160,122)');

    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 3) {
//CornflowerBlue
        $('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').css('background', 'rgb(255,127,80)');

    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 4) {
//Slate blue
        $('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').css('background', 'rgb(255,99,71)');

    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 5) {
//DarkSlateBlue
        $('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').css('background', 'rgb(165,42,42)');

    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 6) {
//Medium blue
        $('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').css('background', 'rgb(255,0,0)');

    } else if (parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) >= 7) {
//NavyBlue
        $('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').css('background', 'rgb(255,0,0)');

    }




}
