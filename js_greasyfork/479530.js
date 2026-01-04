// ==UserScript==
// @name        Lab4 Cripto
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Trabajo con cifrado
// @author      Angeles Navarrete
// @match       https://cripto.tiiny.site
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479530/Lab4%20Cripto.user.js
// @updateURL https://update.greasyfork.org/scripts/479530/Lab4%20Cripto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para decodificar el texto a UTF-8
    function decodeText() {
        var parrafo = document.querySelector("p");
        if (parrafo) {
            // Decodificar el texto a UTF-8
            var decodedText = decodeURIComponent(escape(parrafo.innerText));
            parrafo.innerText = decodedText; // Reemplazar el contenido <p> con el texto decodificado
        }}// Llamar a la función al cargar la página
    decodeText();
    //
	// Agregar la librería CryptoJS con SRI al documento HTML
	var script = document.createElement("script");
	script.src ="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
	script.integrity ="sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==";
	script.crossOrigin = "anonymous";
	document.head.appendChild(script);

	script.onload = function () {
		// Parte 1: Obtener la llave
		let parrafo = document.querySelector("p").innerText;
		let oraciones = parrafo.split(". ");
		let llave = oraciones.map((o) => o[0]).join("");
		console.log("La llave es: " + llave);

		// Parte 2: Identificar la cantidad de mensajes cifrados
		let mensajesCifrados = document.querySelectorAll('div[class^="M"]');
		console.log("Los mensajes cifrados son: " + mensajesCifrados.length);

		// Parte 3: Obtener cada mensaje cifrado y descifrarlo
		mensajesCifrados.forEach((mensajeCifrado) => {
			let mensajeCifradoBase64 = mensajeCifrado.id;
			let mensajeCifradoBytes =
				CryptoJS.enc.Base64.parse(mensajeCifradoBase64);
			let mensajeDescifradoBytes = CryptoJS.TripleDES.decrypt(
				{ ciphertext: mensajeCifradoBytes },
				CryptoJS.enc.Utf8.parse(llave),
				{ mode: CryptoJS.mode.ECB }
			);
			let mensajeDescifrado = mensajeDescifradoBytes.toString(
				CryptoJS.enc.Utf8
			);
			console.log(mensajeCifradoBase64 + " " + mensajeDescifrado);
			mensajeCifrado.innerText = mensajeDescifrado;
		});
	};
})();
