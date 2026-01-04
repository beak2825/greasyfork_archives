// ==UserScript==
// @name     CampusVirtualUGD::borrarMensajeBienvenida
// @version  2
// @grant    none
// @match https://campusvirtual.ugd.edu.ar/moodle/
// @description Borra mensaje de bienvenida del campus virtual UGD
// @namespace https://greasyfork.org/users/325953
// @downloadURL https://update.greasyfork.org/scripts/388531/CampusVirtualUGD%3A%3AborrarMensajeBienvenida.user.js
// @updateURL https://update.greasyfork.org/scripts/388531/CampusVirtualUGD%3A%3AborrarMensajeBienvenida.meta.js
// ==/UserScript==
var divMensaje = document.querySelector(".box.generalbox.sitetopic");
divMensaje.remove();
