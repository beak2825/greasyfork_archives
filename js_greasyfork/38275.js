// ==UserScript==
// @name         dgt dlc
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  RELLENAR DATOS DGT BAJA VEHICULOS
// @author       VFORNER
// @match        https://sedeapl.dgt.gob.es:7443/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38275/dgt%20dlc.user.js
// @updateURL https://update.greasyfork.org/scripts/38275/dgt%20dlc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cambiarCampoSiExiste(idCampo, valor) {
        var elemento = $(idCampo);
        if(elemento) {
            elemento.value = valor;
        }
    }

    function recogerParametro(parameterName) {
        var result = null,
            tmp = [];
        location.search
            .substr(1)
            .split("&")
            .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
        return result;
    }

    function rellenarDatosFormulario() {
        var datos = recogerParametro('datos');
        datos = JSON.parse(datos);

        if(datos) {
            cambiarCampoSiExiste('formularioConsulta:comboCodMedioAmbiental', datos.homologacion);
            cambiarCampoSiExiste('formularioConsulta:inputMatricula', datos.matricula);
            cambiarCampoSiExiste('formularioConsulta:inputBastidor', datos.bastidor);
            cambiarCampoSiExiste('formularioConsulta:inputDocTitular', datos.dni_titular);

            if(datos.solicitante) {
                localStorage.setItem('solicitante', datos.solicitante);
            }

            if(datos.cema) {
                localStorage.setItem('cema', datos.cema);
            }

            if(datos.tipo_baja) {
                localStorage.setItem('tipo_baja', datos.tipo_baja);
            }

            var botonConsultar = $('botonConsultar');
            if(botonConsultar) {
                botonConsultar.click();
            }

        } else {
            var botonBaja = $('botonContinuar');
            if(botonBaja) {
                var elementosCertDestruccion = document.getElementsByName('formularioConsulta:j_id45');
                if(elementosCertDestruccion && elementosCertDestruccion.length == 1) {
                    var elementoCertDestruccion = elementosCertDestruccion[0];
                    elementoCertDestruccion.checked = true;

                    var solicitante = localStorage.getItem('solicitante');
                    if(solicitante) {
                        cambiarCampoSiExiste('formularioConsulta:inputDocPropieatario', solicitante);
                    }

                    var tipo_baja = localStorage.getItem('tipo_baja');
                    if(tipo_baja) {
                        cambiarCampoSiExiste('formularioConsulta:comboTipoBaja', tipo_baja);
                    }

                    var cema = localStorage.getItem('cema');
                    if(cema) {
                        cambiarCampoSiExiste('formularioConsulta:inputCemaBaja', cema);
                    }
                }
            }
            localStorage.removeItem('solicitante');
            localStorage.removeItem('tipo_baja');
        }
    }

    
    setTimeout(function () {
      //SI JQUERY NO EXISTE SE CARGA
      if(typeof jQuery=='undefined') {
          var headTag = document.getElementsByTagName("head")[0];
          var jqTag = document.createElement('script');
          jqTag.type = 'text/javascript';
          jqTag.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
          jqTag.onload = rellenarDatosFormulario;
          headTag.appendChild(jqTag);
      } else {
          rellenarDatosFormulario();
      }
    }, 2000);
    
    

})();