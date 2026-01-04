// ==UserScript==
// @name         Correo Argentino Helper
// @namespace    http://rarakun.com/
// @version      1.1
// @description  Permite autocompletar el campo de busqueda de Correo Argentino basandose en la URL
// @author       ezechico+cah@gmail.com
// @match        http://www.correoargentino.com.ar/formularios/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30765/Correo%20Argentino%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/30765/Correo%20Argentino%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryParams() {
        var queryParams = {};
        if (location.search.length > 0) {
            var queries = location.search.substring(1, location.search.length).split("&");
            for (var query in queries) {
                if (query < queries.length) {
                    var parts = queries[query].split("=");
                    queryParams[parts[0]] = parts[1];
                }
            }
        }

        return queryParams;
    }
    var params = getQueryParams();
    if (params.numero)
    {
        var formType = location.pathname.substr(location.pathname.lastIndexOf("/")+1);
        var inputNumero = document.getElementById("numero");
        if (formType === "oidn" || formType === "ondng" || formType === "onpa" || formType === "mercadolibre")
        {
            inputNumero.value = params.numero;
        }
        else if (formType === "ondi" || formType === "ondnc")
        {
            var inputProducto = document.getElementsByName("producto")[0];
            var prefix = params.numero.substr(0,2).toUpperCase();
            for(var i=0 ; i < inputProducto.options.length; i++ )
            {
                if (inputProducto.options[i].value == prefix)
                {
                    inputProducto.options[i].setAttribute("selected", "selected");
                    break;
                }
            }
            inputNumero.value = params.numero.substr(2,params.numero.length-4);
        }
    }
})();