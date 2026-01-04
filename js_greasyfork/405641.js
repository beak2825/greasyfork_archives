// ==UserScript==
// @name     EOL - Oculta mensajes
// @version  1
// @include  https://www.elotrolado.net/*
// @grant    none
// @description   Oculta mensajes de usuarios que hayan publicado menos de 20 mensajes en el foro
// @namespace https://greasyfork.org/users/602422
// @downloadURL https://update.greasyfork.org/scripts/405641/EOL%20-%20Oculta%20mensajes.user.js
// @updateURL https://update.greasyfork.org/scripts/405641/EOL%20-%20Oculta%20mensajes.meta.js
// ==/UserScript==

var elementos = document.getElementsByClassName("row post ");
for (var i = 0; i < elementos.length; i++) {
  var re = new RegExp("\[0-9^.]*\\s*</b> mensaje");
  var mensajes = re.exec(elementos[i].innerHTML)[0];
  var m1 = parseInt(mensajes.replace(" ", "").replace(".", "").replace(" </b> mensaje", ""));
  var textos = elementos[i].getElementsByClassName("col-xs-24 message ");
  if (m1 < 20) {
    textos[0].innerText = "Mensaje oculto por script EOL - Oculta mensajes de Greasemonkey/Tampermonkey";
  }
}
