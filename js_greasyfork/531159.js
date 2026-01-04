// ==UserScript==
// @name         Hide BairesDev LLC
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide BairesDev LLC offers
// @author       You
// @match        https://co.computrabajo.com/trabajo-de*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=computrabajo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531159/Hide%20BairesDev%20LLC.user.js
// @updateURL https://update.greasyfork.org/scripts/531159/Hide%20BairesDev%20LLC.meta.js
// ==/UserScript==

(function() {
    
    //Puedes agregar mas empresas aqui, copia y agrega el nombre aqui
     const empresasOcultas = [
        "BairesDev LLC",
    ];

    function ocultarOfertas() {
        $('.box_offer').each(function() {
            const oferta = $(this);
            const texto = oferta.text().trim();
            empresasOcultas.forEach(empresa => {
                if (texto.includes(empresa)) {
                    oferta.hide();
                }
            });
        });
    }

    ocultarOfertas();
})();