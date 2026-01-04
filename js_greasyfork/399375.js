// ==UserScript==
// @name           Demanda_Detalle
// @version        1.0
// @include        https://sisterra.fontierras.gob.gt/arrendamiento/solicitudesVaciado.php
// @author         RoLinGt
// @description    sisterra.fontierras.gob.gt
// @namespace https://greasyfork.org/users/473907
// @downloadURL https://update.greasyfork.org/scripts/399375/Demanda_Detalle.user.js
// @updateURL https://update.greasyfork.org/scripts/399375/Demanda_Detalle.meta.js
// ==/UserScript==
setInterval(function() {
    var btnGuardar = document.getElementById('btnGuardar')
    var btnLimpiar = document.getElementById('btnLimpiar')
    var btnCancelar = document.getElementById('btnCancelar')
    var idDemanda = document.getElementById('idDemanda')
    var ejercicioDem = document.getElementById('ejercicioDem')
    var noBoleta = document.getElementById('noBoleta')
    var btnPersona = document.getElementById("btnPersona")
    var idPersona = document.getElementById('idPersona')
    var idConyuge = document.getElementById('idConyuge')
    var idAvalista = document.getElementById('idAvalista')
    var estado = document.getElementById('estado')
    if (btnLimpiar.disabled == false) {
        btnLimpiar.disabled = true
    }
    if (btnCancelar.disabled == false) {
        btnCancelar.disabled = true
    }
    if (idDemanda.disabled == true) {
        idDemanda.disabled = false
    }
    if (ejercicioDem.disabled == true) {
        ejercicioDem.disabled = false
    }
    if (idPersona.value.length > 0 && noBoleta.value.length == 0 && noBoleta.style.backgroundColor == "") {
        noBoleta.style.backgroundColor = "rgb(255, 255, 0)"
        btnPersona.click()
    }
    if (noBoleta.value.length > 0 && noBoleta.style.backgroundColor == "rgb(255, 255, 0)") {
        noBoleta.style.backgroundColor = ""
    }
    for (var i = 0; i < document.cookie.split(";").length; i++) {
        if (document.cookie.split(";")[i].search("tituloEdicion") >= 0) {
            var tituloEdicion = document.cookie.split(";")[i].split("=")[1]
        }
    }
    if (tituloEdicion == idPersona.value && idPersona.style.backgroundColor == "") {
        idPersona.style.backgroundColor = "rgb(206, 246, 206)"
    }
    if (tituloEdicion == idConyuge.value && idConyuge.style.backgroundColor == "") {
        idConyuge.style.backgroundColor = "rgb(206, 246, 206)"
    }
    if (tituloEdicion == idAvalista.value && idAvalista.style.backgroundColor == "") {
        idAvalista.style.backgroundColor = "rgb(206, 246, 206)"
    }
    if (idPersona.value == "" && idPersona.style.backgroundColor == "rgb(206, 246, 206)") {
        idPersona.style.backgroundColor = ""
    }
    if (idConyuge.value == "" && idConyuge.style.backgroundColor == "rgb(206, 246, 206)") {
        idConyuge.style.backgroundColor = ""
    }
    if (idAvalista.value == "" && idAvalista.style.backgroundColor == "rgb(206, 246, 206)") {
        idAvalista.style.backgroundColor = ""
    }
    if (idPersona.style.backgroundColor == "rgb(206, 246, 206)" && idAvalista.style.backgroundColor == "rgb(206, 246, 206)") {
        if (idConyuge.style.backgroundColor == "rgb(206, 246, 206)" || idConyuge.value.length > 0) {
            btnGuardar.disabled = false
        }
    } else {
        btnGuardar.disabled = true
    }
    if (estado.value == 2) {
        estado.style.backgroundColor = "rgb(255, 255, 0)"
    }
    if (estado.value == 1) {
        estado.style.backgroundColor = ""
    }
}, 250)