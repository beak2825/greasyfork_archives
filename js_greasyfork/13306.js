// ==UserScript==

// @name         Recordar Contraseña Intranet UPV
// @description  Introduce los credenciales en los inputs
// @namespace    https://greasyfork.org/users/18637
// @version      0.6

// @match        https://www.upv.es/pls/soalu/est_intranet.Ni_portal_n?P_IDIOMA=c
// @match        https://intranet.upv.es/pls/soalu/est_intranet.Ni_portal_n?P_IDIOMA=c
// @match        https://www.upv.es/pls/soalu/est_intranet.NI_Indiv?P_IDIOMA=c&P_MODO=alumno&P_CUA=sakai&P_VISTA=MSE
// @match        https://intranet.upv.es/pls/soalu/est_intranet.ni_portal_n?P_IDIOMA=c

// @copyright    Deleko (2013)

// @downloadURL https://update.greasyfork.org/scripts/13306/Recordar%20Contrase%C3%B1a%20Intranet%20UPV.user.js
// @updateURL https://update.greasyfork.org/scripts/13306/Recordar%20Contrase%C3%B1a%20Intranet%20UPV.meta.js
// ==/UserScript==


//alumno

//document.getElementsByName("dni")[0].value="tu_identificador";
//document.getElementsByName("clau")[0].value="tu_pin";

//personal

document.getElementsByName("dni")[1].value="tu_identificador";
document.getElementsByName("rclau")[0].value="tu_contraseña";


var x = document.getElementsByClassName("upv_btsubmit");
var i;
for (i = 0; i < x.length; i++) {
    if(x[i].value = "Entrar"){
         x[i].click();
    }
}