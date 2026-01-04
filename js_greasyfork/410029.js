// ==UserScript==
// @name         Inversa - Mejoras Inversion Automatica
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mejoras en el autoinvertir de Inversa
// @author       Alberizo
// @match        https://mk.inversa.es/inversion_automatica.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/410029/Inversa%20-%20Mejoras%20Inversion%20Automatica.user.js
// @updateURL https://update.greasyfork.org/scripts/410029/Inversa%20-%20Mejoras%20Inversion%20Automatica.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
#modal_librados_asociados ul.dropdown-menu{overflow-y:auto !important; overflow-x:hidden !important}
#modal_librados_asociados ul.dropdown-menu .ps-scrollbar-x-rail{display:none}
#modal_librados_asociados ul.dropdown-menu a span{margin-right:10px}
#modal_librados_asociados ul.dropdown-menu a .tag{border-radius:10px; font-style:italic; padding:2px 12px}
#modal_librados_asociados ul.dropdown-menu .rating1 a .tag{background-color:#A0EC98}
#modal_librados_asociados ul.dropdown-menu .rating2 a .tag{background-color:#A6EEF2}
#modal_librados_asociados ul.dropdown-menu .rating3 a .tag{background-color:#F9E9A4}
#FormularioTramos{background:#eee; border-radius:5px; margin:30px 15px; width:100%}
#FormularioTramos td{padding:5px; text-align:center}
#FormularioTramos td:first-child{font-weight:bold; text-align:left}
#FormularioTramos thead{font-weight:bold}
` );

    function ModalMostrado(data){
//         AgregarFormularioTramos();
        MaximaPaginacion();
        AgregarInformacionLibrado(data);
    }

    function AgregarFormularioTramos(){
        var FormularioTramos = '<table id="FormularioTramos"> \
<thead><tr><td>Rating</td><td style="background:#F5CE2A;">7 a 10</td><td style="background:#66E1EA">11 a 15</td><td style="background:#56E14A">16 a 20</td><td></td></tr></thead> \
<tbody><tr><td>Importe</td><td style="background:#F8E48D"><input type="text" class="form-control" value="30" /></td><td style="background:#BDF0F7"><input type="text" class="form-control" value="20" /></td><td style="background:#CDF6C8"><input type="text" class="form-control" value="20" /></td></tr> \
<tr><td>Importe máximo</td><td style="background:#F8E48D"><input type="text" class="form-control"/></td><td style="background:#BDF0F7"><input type="text" class="form-control"/></td><td style="background:#CDF6C8"><input type="text" class="form-control"/></td></tr></tbody> \
<tfoot><tr><td></td><td><input id="limitesprogresivos" type="checkbox" checked="checked" /><label for="limitesprogresivos">¿Progresivo?</label><span data-tooltip="true" data-toggle="tooltip" title="" data-original-title="Se hará una interpolación lineal para cada rating en lugar de hacerlo por tramos de rating"><sup>&nbsp;<i class="icon_info fs-14 fa fa-info-circle" aria-hidden="true"></i></sup></span></td><td><input id="sobreescribirlimites" type="checkbox"/><label for="sobreescribirlimites">¿Sobreescribir límites?</label><span data-tooltip="true" data-toggle="tooltip" title="" data-original-title="Se sobreescribirán los límites para el librado si ya estaba definido, en caso contrario se respetarán los limites ya creados anteriormente"><sup>&nbsp;<i class="icon_info fs-14 fa fa-info-circle" aria-hidden="true"></i></sup></span><td><button class="btn">Guardar todo</button></td></tr> \
</tfoot></table>';

        $('#modal_librados_asociados #contenedor_venta .form-group:first').prepend(FormularioTramos);
    }

    function AgregarInformacionLibrado(data){
        let LibradosYaLimitados = ObtenerLibradosYaLimitados();
        let librados = [];

        data.forEach(function(librado){
            let librado_tmp = [];
            librado_tmp.RANKING_RIESGO = librado.RANKING_RIESGO;
            librado_tmp.PPJ_NU_OPINION_CREDITO = parseInt(librado.PPJ_NU_OPINION_CREDITO);
            librado_tmp.RATING = librado.RATING
            librados[librado.NOMBRE_BUSQUEDA] = librado_tmp;
        });

        let $dropdown_li = $('#cmbLibrados').parent().find('ul li');
        if($dropdown_li.length > 0){
            $dropdown_li.each(function(li){
                let librado = $(this).text()
                console.log(librado)
                $(this).find('span.text').text(librado);
                $(this).find('a').append('<span class="tag"> Rating: ' + librados[librado]['RATING'] + '</span>');
                $(this).find('a').append('<span class="tag"> Opinion: ' + numberWithDots(librados[librado]['PPJ_NU_OPINION_CREDITO']) + '€</span>');
                $(this).addClass('rating' + librados[librado]['RANKING_RIESGO']);

                if(LibradosYaLimitados.includes(librado)){
                    $(this).find('a').prepend('<span>🤖</span>');
                }
            })
        }

        $('#formDatosLibrado span.filter-option').on('DOMSubtreeModified', function () {
            if($(this).text() == 'Librados Disponibles'){
                AgregarInformacionLibrado(data);
            }
        });
    }

    function ObtenerLibradosYaLimitados(){
        let librados = [];
        $('#tabla_librados tbody tr td:first-child').each(function(){
            librados.push($(this).text());
        })
        return librados;
    }

    function MaximaPaginacion(){
        var $max_pagination = $('#modal_librados_asociados').find('.page-list:first ul li:last a')
        if($max_pagination){
            $max_pagination.click();
        }
    }

    function numberWithDots(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function CargarLibrados(iap_nu_administracion, ranking_riesgo, opinion_credito) {
        var params = {
            intCodInversor: lender_id,
            iap_nu_administracion: iap_nu_administracion,
            ranking_riesgo : ranking_riesgo,
            opinion_credito: opinion_credito
        };

        $.post('inversapi/api.php', {params: params, 'function': 'ObtenerPromotororesFiltradosAutomatica'}, function (todosPromotores) {
            const data = JSON.parse(todosPromotores);
            var fields = {cod: 'COD', valor: 'NOMBRE_BUSQUEDA'};

            setTimeout(function(){
                ModalMostrado(data)
            }
            , 1000);
        }, "json");
    }

    $('#tabla_configuraciones, #tabla_configuraciones_responsive').on('click', '.ver-asociados', function () {
        var index = $(this).parents('tr').first().index();

        if ($(window).width() > 480)
            json = $table_configuracion.bootstrapTable('getData', true);
        else
            json = $table_configuracion_responsive.bootstrapTable('getData', true);

        var data = json[index];

        cod_inversion = data.COD;
        iap_nu_administracion = data.TIPO_ADMINISTRACION;
        ranking_riesgo = data.RANKING_RIESGO || 0;
        opinion_credito = data.OPINION_CREDITO || 0;

        CargarLibrados(iap_nu_administracion, ranking_riesgo, opinion_credito)
    });

})();