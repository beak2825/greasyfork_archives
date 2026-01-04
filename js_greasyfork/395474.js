// ==UserScript==
// @name         Inversa.es
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Muestra si ya tienes facturas activas/impagadas de empresas con facturas en el mercado primario
// @author       Alberizo
// @match        https://mk.inversa.es/proyectos.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395474/Inversaes.user.js
// @updateURL https://update.greasyfork.org/scripts/395474/Inversaes.meta.js
// ==/UserScript==

(function() {
    'use strict';

//-- Funciones de Inversa -----------------------------------------------------------------------------------------------

    function getEstadoFactura(factura) {
            // Activa es una factura que no ha llegado a FH_VENCIMIENTO
            // Finalizada es una factura pagada y que se ha hecho reparto
            // Retrasada es cuando ha superado 10 dias de FH_VENCIMIENTO pero no se ha pagado
            var estado = factura.ESTADO;
            var fech = factura.FH_VENCIMIENTO.split("/");
            var date = new Date(fech[2]+"-"+fech[1]+"-"+fech[0]);
            if(factura.TIEMPO_RESTANTE === 'FINALIZADO' && estado === 'ACTIVO' && date < Date.now() && factura.RATING!=='AP'){
                estado = 'VENCIDA';
            }
            switch (estado) {
                case "FINALIZADO":
                    estado = "PAGADA";
                    break;
                case "ACTIVO":
                    estado = "ACTIVA";
                    break;
                default: //VENCIDA
                    break;
            }
            return estado;
    }

    var params = {
        intCodInversor: lender_id
    };


//-- Empresas ya invertidas ---------------------------------------------------------------------------------------------

    function empresas_ya_invertidas(){
        var empresas_invertidas = []
        var empresas_en_curso = []

        function formatearNombreEmpresa(nombreEmpresa){
            nombreEmpresa = nombreEmpresa.split('S.L')[0]
            nombreEmpresa = nombreEmpresa.split('S.A')[0];
            nombreEmpresa = nombreEmpresa.replace(',', '');
            nombreEmpresa = nombreEmpresa.replace('-', '');
            nombreEmpresa = nombreEmpresa.replace(/[0-9]/g, '');
            nombreEmpresa = nombreEmpresa.toLowerCase();
            nombreEmpresa = nombreEmpresa.trim();

            return nombreEmpresa;
        }

        $.post('inversapi/api.php', {params: params, 'function': 'ObtenerResumenPrestamosPorInversorMasDetalle'}, function (data) {
            const project = JSON.parse(data);

            project.forEach(v =>{
                if(getEstadoFactura(v) !== 'PAGADA'){
                    empresas_invertidas.push(formatearNombreEmpresa(v.PROYECTO))
                }
            });

            var facturas_activas = $('#row_tabla_valores a button[data-nombre!=""]')
            facturas_activas.each(function(factura){
                var empresa = formatearNombreEmpresa($(this).data('nombre'))

                if(empresas_invertidas.includes(empresa)){
                    var parent = $(this).parents('.detalles-inversion:first').eq(0)
                    parent.prepend('<div style="background-color:#d20080;border-radius:5px;color:#fff;left:0;padding:5px 10px;position:absolute;top:10px;margin:0 10px;text-align:center;right:0;z-index:10">Ya tienes facturas de ' + empresa.toUpperCase() +'</div>')
                }
            });
        });

        $.post('inversapi/api.php', {params: params, 'function': 'ObtenerPujasPorInversorNoTraspasadasIncluyendoEnTramites'}, function (data) {
            const project = JSON.parse(data);

            project.forEach(v =>{
                empresas_en_curso.push(formatearNombreEmpresa(v.PROYECTO))
            });

            var facturas_activas = $('#row_tabla_valores a button[data-nombre!=""]')
            facturas_activas.each(function(factura){
                var empresa = formatearNombreEmpresa($(this).data('nombre'))

                if(empresas_en_curso.includes(empresa)){
                    var parent = $(this).parents('.detalles-inversion:first').eq(0)
                    parent.prepend('<div style="background-color:#00a3b4;border-radius:5px;color:#fff;left:0;padding:5px 10px;position:absolute;top:10px;margin:0 10px;text-align:center;right:0;z-index:10">Ya tienes facturas en curso de ' + empresa.toUpperCase() +'</div>')
                }
            });
        });
    }

    empresas_ya_invertidas();
    
})();

//------------------------------------------------------------------------------------------------------------------