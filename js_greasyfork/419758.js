// ==UserScript==
// @name         Coleta Heavy Axe
// @version      0.4
// @description  JeffTurbinator!! Turbinando TW
// @author       Jeff
// @include https://br*.tribalwars.com.br/*mode=scavenge*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_deleteValue
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/453961
// @downloadURL https://update.greasyfork.org/scripts/419758/Coleta%20Heavy%20Axe.user.js
// @updateURL https://update.greasyfork.org/scripts/419758/Coleta%20Heavy%20Axe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var turbinatorTW = TribalWars.getGameData();
    var tag = turbinatorTW.world + '' + turbinatorTW.player.name + ''+turbinatorTW.screen+ '_'+turbinatorTW.mode;
    var tIni = Date.now();
    var nLoop = 5;
	unsafeWindow.window.name = tag;

    if (unsafeWindow.window.name === tag) {
        iniciar();
        loop(nLoop);
        recarregar(60);
    }
    function iniciar(){
        logica();
    }
    function aleatorio(menor, maior){ var intervalo = Math.round(maior - menor); return Math.floor(Math.random() * intervalo) + menor + Timing.offset_to_server; }
    //Loop no inicar a cada X segundos. nLoop = 0 para o loop
    function loop(segundos){ var timer = setInterval(function () { if (nLoop === 0){clearInterval(timer);} else {setTimeout(function () { iniciar(); }, aleatorio(segundos*1000*0.01, segundos*1000*0.10));} }, segundos*1000); }
    //Recarrega a pagina a cada X minutos
    function recarregar(minutos){ setInterval(function () { setTimeout(function () { window.location.reload(); }, aleatorio(minutos*60000*0.01, minutos*60000*0.10)); }, minutos*60000); }
    //Buscar e Validar Objeto
    function buscarObjeto(sObj){var objeto = document.querySelectorAll(sObj); if (objeto!==undefined && objeto[0]!==undefined){return objeto;} else {return undefined;}}

    function retornarInteiro(txt,divisor){ var retInt = 0; var valor = parseInt(txt.replace('(','').replace(')','')); if (valor > 0 && divisor > 0){ retInt = Math.trunc(valor/divisor); } return retInt;  }

    function selecionarTropas(divisor){
        if (divisor > 0){
            var nrLanca = $("a.units-entry-all[data-unit='spear']")[0];
            var nrEspada = $("a.units-entry-all[data-unit='sword']")[0];
            var nrMachado = $("a.units-entry-all[data-unit='axe']")[0];
            var nrArco = $("a.units-entry-all[data-unit='archer']")[0];

            if (divisor == 1){
                nrLanca.click();
                nrEspada.click();
                nrMachado.click();
                if (nrArco != undefined) {
                    nrArco.click();
                }
            }
            else{
                var lanca = document.getElementsByName("spear")[0];
                lanca.value = retornarInteiro($("a.units-entry-all[data-unit='spear']")[0].innerText,divisor);
                lanca.dispatchEvent(new KeyboardEvent('keyup',{'key':'0'}));
                var espada = document.getElementsByName("sword")[0];
                espada.value = retornarInteiro($("a.units-entry-all[data-unit='sword']")[0].innerText,divisor);
                espada.dispatchEvent(new KeyboardEvent('keyup',{'key':'0'}));
                var machado = document.getElementsByName("axe")[0];
                machado.value = retornarInteiro($("a.units-entry-all[data-unit='axe']")[0].innerText,divisor);
                machado.dispatchEvent(new KeyboardEvent('keyup',{'key':'0'}));
                if (nrArco != undefined) {
	                var arco = document.getElementsByName("archer")[0];
        	        arco.value = retornarInteiro($("a.units-entry-all[data-unit='archer']")[0].innerText,divisor);
                	arco.dispatchEvent(new KeyboardEvent('keyup',{'key':'0'}));
                }
            }
        }
    }
    function timeOver(){
        var tempo = document.getElementsByClassName('return-countdown');
        var lRecarregar = false;
        for (var i = 0; i < 4; i++) { if (tempo[i]!==undefined && parseInt(tempo[i].innerText.split(":")[1])<1){lRecarregar = true;} }
        if (lRecarregar){
            recarregar(2);
        }
    }

    function btnsDisponiveis(objeto){
        var objRet = {}; var cont = 0;
        for (var i = 0; i < 4; i++) { if (objeto[i]!==undefined){cont = cont + 1; objRet.btn = objeto[i];} }
        objRet.cont = cont;
        return objRet;
    }

    function logica(){
        var btns = buscarObjeto("a.btn.btn-default.free_send_button:not(.btn-disabled)");
        if (btns!==undefined){
            var disp = btnsDisponiveis(btns);
            if (disp.cont > 0 ){
                selecionarTropas(disp.cont);
                setTimeout(function () { disp.btn.click(); }, aleatorio(700, 1500));
            }
        }
        timeOver();
    }

})();