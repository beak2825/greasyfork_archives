// ==UserScript==
// @name         Remove read more
// @namespace    https://greasyfork.org/scripts/412295-remove-read-more/code/Remove%20read%20more.user.js
// @homepage     https://greasyfork.org/en/scripts/412295/
// @contactURL   https://greasyfork.org/en/scripts/412295-remove-read-more/feedback
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsTeL1OShlJvghp1LWwhA6c9-A0CdM_tDCmYivzpnwojJSsDs&s
// @version      1.0
// @match        https://www.elmercurio.com/Inversiones/Noticias/*
// @match        https://www.elmercurio.com/legal/noticias/opinion/*
// @description  Permite eliminar el banner de suscripción de www.elmercurio.com para poder leer sin límites
// @downloadURL https://update.greasyfork.org/scripts/412295/Remove%20read%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/412295/Remove%20read%20more.meta.js
// ==/UserScript==

// delete read more content
document.getElementById('modal_atencion_cliente').remove()
document.getElementById('modal_limit_articulos').remove()

// unlock scroll
var i, l;
for(i = 0; (l = document.getElementsByTagName("link")[i]); i++ ) {
    if (l.getAttribute("href") == "https://staticmer.emol.cl/css/inversiones/modalDigital.min.css?v=2") l.disabled = true;
}