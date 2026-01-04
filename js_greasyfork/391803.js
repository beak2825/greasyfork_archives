// ==UserScript==
// @name                Busca 2h
// @namespace           @@marcosvinicius.santosmarques
// @icon                https://i.imgur.com/7WgHTT8.gif
// @website             https://tribalwarsbr100.wixsite.com/tw100
// @email               tribalwarsbr100@gmail.com
// @description 	    Script de coletar recursos tribal wars
// @author		        Marcos v.s Marques
// @include             https://*/game.php?village=*&screen=place&mode=scavenge*
// @version     	    0.0.1
// @copyright           2018, Tribalwarsbr100 (https://openuserjs.org//users/Tribalwarsbr100)
// @license             AGPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391803/Busca%202h.user.js
// @updateURL https://update.greasyfork.org/scripts/391803/Busca%202h.meta.js
// ==/UserScript==


//var Porcentual_de_Coleta  = [400000,183000,91515,61015] // 23h
//var Porcentual_de_Coleta  = [360000,151450,75770,50490] // 22h
//var Porcentual_de_Coleta  = [273000,113789,56910,37920] // 15h
//var Porcentual_de_Coleta  = [255000,99900,50800, 34100] // 14h
//var Porcentual_de_Coleta  = [225000,84600,42800, 28240] // 12h
//var Porcentual_de_Coleta  = [200000,79000,39400, 26240] // 11h
//var Porcentual_de_Coleta  = [135000,54000,27000,18000] // 8h
//var Porcentual_de_Coleta  = [170000,68000,34000, 22660] // 10h
//var Porcentual_de_Coleta  = [85000,34000,17000, 11330] // 5h
var Porcentual_de_Coleta  = [17500,7000,3490, 2330] // 2h
//var Porcentual_de_Coleta  = [10000,4000,2000, 1330] // 1h
//var Porcentual_de_Coleta  = [3000,1000,500, 430] // 5h



var Lanceiro = 0;
var Espadachim = 1;
var Barbaro = 2;
var Arqueiro = 3;
var Cavalaria_leve= 4;
var Arqueiro_a_cavalo = 5;
var Cavalaria_pesada = 6;

var UNIT_INEX = 0;
var Final = 1;
var iniciar = 2;
var Capacidade_Armazem = 3;
var INPUT = 4;

var Unidades_Coletando = [
    [Lanceiro, "a.units-entry-all[data-unit='spear']",true,25,"input.unitsInput[name='spear']"],
    [Espadachim, "a.units-entry-all[data-unit='sword']",true,15,"input.unitsInput[name='sword']"],
    [Barbaro, "a.units-entry-all[data-unit='axe']",true,10,"input.unitsInput[name='axe']"],
    [Arqueiro, "a.units-entry-all[data-unit='archer']",true,10,"input.unitsInput[name='archer']"],
    // [Cavalaria_leve, "a.units-entry-all[data-unit='light']",true,80,"input.unitsInput[name='light']"],
    [Arqueiro_a_cavalo , "a.units-entry-all[data-unit='marcher']",true,50,"input.unitsInput[name='marcher']"],
    [Cavalaria_pesada, "a.units-entry-all[data-unit='heavy']",true,50,"input.unitsInput[name='heavy']"],
];


function mecanismo_inteligencia(el){
    try{
        return parseInt(el[0].innerText.replace("(","").replace(")",""))
    } catch (e) {
        return 0;
    }
}

var tabela = $(document).find(".candidate-squad-widget.vis").get()[0];

function calculadora(cap_index){

    var unidades = []
    var aperte = []
    for (var u in Unidades_Coletando){
        unidades.push(0)
        aperte.push(0)
    }


    for(var i = 0; i<  Unidades_Coletando.length; i++){
        if(Unidades_Coletando[i][iniciar]){
            unidades[i] = mecanismo_inteligencia($(tabela).find(Unidades_Coletando[i][Final]).get())
        }
    }
    var coletar_recursos = Porcentual_de_Coleta[cap_index]

    for(i = 0; i<  unidades.length; i++){
        if (unidades[i] != 0) {
            if(unidades[i] * Unidades_Coletando[i][Capacidade_Armazem] > coletar_recursos){
                aperte[i] = Math.floor(coletar_recursos/Unidades_Coletando[i][Capacidade_Armazem])
                break;
            } else {
                aperte[i] = unidades[i];
                coletar_recursos -= Math.floor(unidades[i] * Unidades_Coletando[i][Capacidade_Armazem]);
            }
        }
    }

    return aperte;

}

function fill(aperte) {
    for(var i = 0; i<aperte.length; i++){
        var el = $(tabela).find(Unidades_Coletando[i][INPUT])
        el.trigger('focus');
        el.trigger('keydown');
        el.val(aperte[i])
        el.trigger('keyup');
        el.trigger('change');
    }
}
var botao = $(document).find(".btn.btn-default.free_send_button").get();

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


function pular_aldeia(){
    if ($(document).find("#village_switch_right").get()["0"]){
        jQuery.event.trigger({ type: 'keydown', which: 68 });
    }else{
        location.reload();
    }
}


sleep(10).then(() => {
  fill(calculadora(3));
    $(botao[3]).click();
}).then(sleep(3000).then(() => {
  fill(calculadora(2));
    $(botao[2]).click();
}).then(sleep(6000).then(() => {
  fill(calculadora(1));
    $(botao[1]).click();
}).then(sleep(9000).then(() => {
  fill(calculadora(0));
    $(botao[0]).click();
}).then())))


setTimeout(pular_aldeia, 50000);