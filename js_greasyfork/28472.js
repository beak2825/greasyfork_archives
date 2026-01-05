// ==UserScript==
// @name         Gearbest
// @namespace    Gearbest
// @version      0.1
// @description  Avisa cuando un estado deja de estar en Processing
// @author       GoRhY
// @match        https://login.gearbest.com/m-users-a-order_detail-order_id-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28472/Gearbest.user.js
// @updateURL https://update.greasyfork.org/scripts/28472/Gearbest.meta.js
// ==/UserScript==

//Alerta si el estado ya no está en "Processing"
if ($("li.on span").eq(-1).text() != "Processing"){
    alert("ENVIADO!");
}

//Recarga cada 60 segundos
setTimeout(function() {
  location.reload();
}, 60000);