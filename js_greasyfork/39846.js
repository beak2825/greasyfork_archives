// ==UserScript==
// @name         detalheAnunco
// @version      0.7
// @description  Exibe ações extra para os detalhe do Vrum e Lugar Certo
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.0/jquery.mask.min.js
// @match        https://*.vrum.com.br/veiculo/*
// @match        https://*.lugarcerto.com.br/imovel/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/39846/detalheAnunco.user.js
// @updateURL https://update.greasyfork.org/scripts/39846/detalheAnunco.meta.js
// ==/UserScript==

var versao = GM_info.script.version;
var HASH = "ab71cc8a-0b38-11e7-a81c-3c4a92475cb4";

jQuery(document).ready(function() {
    var style = "font-size: 13px; width: 195px; margin-bottom: 5px";
    var html = '';
    html += '<div id="min-box-utils" title="Minimizar/Maximizar" style="position:fixed;top:80px;right:0;z-index:9999;border:#000 2px solid;padding:2px;background-color:white;text-align:center;cursor:nesw-resize;font-size: smaller;">&#9917;</div>';
    html += '<div id="box-utils" style="position:fixed;top:80px;right:0;z-index:9998;border:#000 2px solid;padding:2px;background-color:aliceblue;text-align:center;">';
    html += "Utils DEV<br/>";
    html += '<button class="js-btn" data-action="json" type="button" style="'+style+'" id="btn-json">Acessar Json</button>';
    html += '</br><button class="js-btn" data-action="nomin" style="'+style+'" type="button" id="btn-nomin">Não Minificado</button>';
    html += '</br><button class="js-btn" data-action="expiretmp" style="'+style+'" type="button" id="btn-cleartmp">Limpar Template</button>';
    html += '</br><button class="js-btn" data-action="expireall" style="'+style+'" type="button" id="btn-clearall" disabled="disabled">Limpar Todas as Templates</button>';
    html += "<br><a href='http://git.estaminas.com.br/scripts/js-detalhe-anuncios/raw/master/detalheAnunco.user.js'>Nova VERSÃO</a>";
    html += "<div class='historico-versao' style='cursor:pointer;color:#657df5;'>v" + versao + "</div>";
    html += '</div>';
    jQuery("body").prepend(html);

    jQuery(document).on('click', '.js-btn', function() {
        var action = jQuery(this).data('action');
        var url = window.location.toString();
        var params = null;
        url = url.split('?').join();
        if (url.length > 1) {
            params = url[1];
        }
        url_montada = window.location + "?hash=" + HASH + "&" + action + "=1";
        if (['json'].indexOf(action) > -1){
            window.open(url_montada, '_blank');
        }else{
            window.location = url_montada;
        }
    });

    jQuery("#min-box-utils").on('click', function () {
        jQuery("#box-utils").toggle();
    });
});