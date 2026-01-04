// ==UserScript==
// @name         eduescaperoom candadodigital bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows the Key under a paragraph
// @author       m00n_byt3
// @match        https://eduescaperoom.com/candado/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400395/eduescaperoom%20candadodigital%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/400395/eduescaperoom%20candadodigital%20bypass.meta.js
// ==/UserScript==

document.getElementById('imagen').innerHTML = "La clave es " + clave;
document.getElementById("imagen").style.backgroundColor = "rgba(0, 255, 0, 0.5)";
msg_bien = "¡Muy bien! **Bypass creado por m00n_byt3**";