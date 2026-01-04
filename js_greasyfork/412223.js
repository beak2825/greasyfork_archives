// ==UserScript==
// @name         Waves.exchange (Bot)
// @icon         https://icons.duckduckgo.com/ip2/waves.exchange.ico
// @namespace    https://greasyfork.org/users/592063
// @version      0.1.2
// @description  Realiza interés compuesto en Waves.exchange
// @author       wuniversales
// @include      https://waves.exchange/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/412223/Wavesexchange%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/412223/Wavesexchange%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Segundos_de_espera_del_bot: {
            type: 'number',
            default: '5'
        },
    }
});

var segundosdeesperadelbot=cfg.get('Segundos_de_espera_del_bot');


(function() {
    'use strict';
        setInterval(function(){
            try {
                if($('#resultadodiario').length){}else{

                var saldo=$(".css-1p77krg:last").html();
                saldo = saldo.replace("</span>", "");
                saldo = saldo.replace('<span class="css-roynbj">', "");
                saldo = saldo.replace('<span class="css-1bikyx1">', "");
                saldo = parseInt(saldo);
                var porcentaje=$(".css-1vmdsrm:last").html();
                porcentaje = porcentaje.replace("</span>", "");
                porcentaje = porcentaje.replace('<span class="css-roynbj">', "");
                porcentaje = porcentaje.replace('<span class="css-1bikyx1">', "");
                porcentaje = porcentaje.replace('<span class="css-9txc7y">%', "");
                porcentaje = parseInt(porcentaje);

                    if(saldo!=0){
                        $(".css-d6asn3:last").after('<div class="css-d6asn3"><div class="css-wxvpcw"><table><tr colspan="2"><th><div class="css-15w9k9e">Ganancias aproximadas</div></th></tr><tr><td><div class="css-15w9k9e">Diario:</div></td><td><input id="resultadodiario" style="width: 100%;" readonly="readonly" type="text" onmouseover="this.select()" onclick="this.select()" value="0"></td></tr><tr><td><div class="css-15w9k9e">Mensual:</div></td><td><input id="resultadomensual" style="width: 100%;" readonly="readonly" type="text" onmouseover="this.select()" onclick="this.select()" value="0"></td></tr><tr><td><div class="css-15w9k9e">Anual:</div></td><td><input id="resultadoanual" style="width: 100%;" readonly="readonly" type="text" onmouseover="this.select()" onclick="this.select()" value="0"></td></tr></table></div></div>');
                        document.getElementById("resultadodiario").value=((porcentaje*saldo)/100)/365;
                        document.getElementById("resultadomensual").value=((porcentaje*saldo)/100)/12;
                        document.getElementById("resultadoanual").value=(porcentaje*saldo)/100;
                    }
                }
            } catch (error) {}
        },parseInt(segundosdeesperadelbot+'000'));
})();