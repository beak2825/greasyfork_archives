// ==UserScript==
// @name         Descargar Identidad Digital ITACA
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Script para descargar un CSV con el listado de identidades digitales y contraseñas de un grupo de ITACA
// @author       David López Castellote
// @match        https://docent.edu.gva.es/md-front/www/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476294/Descargar%20Identidad%20Digital%20ITACA.user.js
// @updateURL https://update.greasyfork.org/scripts/476294/Descargar%20Identidad%20Digital%20ITACA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var DESCARGAR_ID_DIGITAL_ITACA = window.DESCARGAR_ID_DIGITAL_ITACA = {};

    DESCARGAR_ID_DIGITAL_ITACA.recorrerAlumnosRec = function( alumnado, i, callback ){
        if( i < alumnado.length ){
            const alumnadoEl = alumnado[i];
            const idGrupo = alumnadoEl.getAttribute("data-grup");
            const idAlumno = alumnadoEl.getAttribute("data-id");
            if( idGrupo && idAlumno ){
                const urlAlumno = alumnadoEl.querySelector("a").href;
                window.location.href = urlAlumno;
                setTimeout( function(){
                    const nombre = document.querySelector('#imc-seccio-alumne-labelledby').innerText;
                    const correo = document.querySelector('.imc-identidad-mail').innerText;
                    const clave_inicial = document.querySelector('.imc-identidad-contasenya').innerText;
                    const codigo_recuperacion = document.querySelector('.imc-identidad-codigo').innerText;console.log( `i = ${i}, NOMBRE: ${nombre}, CORREO: ${correo}, CLAVE INICIAL: ${clave_inicial}` );
                    if( nombre && correo && clave_inicial ){
                        DESCARGAR_ID_DIGITAL_ITACA.alumnos.push({nombre,correo, clave_inicial});
                    }
                    DESCARGAR_ID_DIGITAL_ITACA.recorrerAlumnosRec( alumnado, ++i, callback );
                }, 500 );
            }
        } else{
            callback();
        }
    }


    DESCARGAR_ID_DIGITAL_ITACA.descargarIdentidadDigital = function() {
        setTimeout( function(){
            DESCARGAR_ID_DIGITAL_ITACA.alumnos = [];
            const alumnado = document.querySelectorAll(".imc-alumnes .imc-alumne");
            DESCARGAR_ID_DIGITAL_ITACA.recorrerAlumnosRec( alumnado, 0, function(){
                console.log(DESCARGAR_ID_DIGITAL_ITACA.alumnos);
                let strCsv = "data:text/csv;charset=utf-8," + "Nombre;Correo;Clave inicial\n";
                for( let alumno of DESCARGAR_ID_DIGITAL_ITACA.alumnos ){
                    strCsv += `${alumno.nombre};${alumno.correo};${alumno.clave_inicial}\n`;
                }
                strCsv = encodeURI(strCsv);
                const linkCsv = document.createElement("a");
                linkCsv.setAttribute("href", strCsv);
                linkCsv.setAttribute("download", document.querySelector("[data-centre] span").innerText + "_id-digital.csv" || "identidad_digital.csv");
                document.body.appendChild(linkCsv);
                linkCsv.click();
            });
        }, 500 );
    }

    DESCARGAR_ID_DIGITAL_ITACA.alumnos = [];

    setInterval( function(){
        const botonDescargaIdDigitalEl = document.getElementById("boton-descarga-id-digital");
        if( !botonDescargaIdDigitalEl ){
            if( window.location.hash.includes("tasques/diaries/perSessio") ){
                const botonesNavEl = document.querySelector('.imc-sessio-nav ul');
                const botonDescargaEl = document.createElement('li');
                botonDescargaEl.setAttribute("id", "boton-descarga-id-digital");
                botonDescargaEl.innerHTML = `<a href="#" onclick="window.DESCARGAR_ID_DIGITAL_ITACA.descargarIdentidadDigital()" class="imc-bt-text">Descarga id. digital</a>`
                botonesNavEl.appendChild(botonDescargaEl);
            }
        }
    } , 500 );
})();