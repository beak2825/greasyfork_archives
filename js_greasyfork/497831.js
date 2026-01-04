// ==UserScript==
// @name     	LAB4-Cripto
// @namespace	http://tampermonkey.net/
// @version  	1.0
// @description  LAB4-Cripto-Script
// @author   	C.León
// @match    	https://cripto.tiiny.site/
// @run-at   	document-end
// @grant    	none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497831/LAB4-Cripto.user.js
// @updateURL https://update.greasyfork.org/scripts/497831/LAB4-Cripto.meta.js
// ==/UserScript==

(function() {
	'use strict';
    if (window.scriptExecuted) {
        return; // Si el script ya se ha ejecutado, salir
    }
    window.scriptExecuted = true; // Marcar el script como ejecutado

	// Función para derivar la clave del primer carácter de cada oración en el párrafo
	function obtenerConcatenacionPrimerCaracter(parrafo) {
    	var oraciones = parrafo.split('. ');
    	var resultado = '';

    	for (var i = 0; i < oraciones.length; i++) {
        	var oracion = oraciones[i];
        	var primerCaracter = oracion.charAt(0);
        	resultado += primerCaracter;
    	}
    	return resultado;
	}

	// Función para descifrar texto cifrado con 3DES
	function decrypt3DES(encryptedText, key) {
    	var keyHex = CryptoJS.enc.Utf8.parse(key);
    	var decrypted = CryptoJS.TripleDES.decrypt({
        	ciphertext: CryptoJS.enc.Base64.parse(encryptedText)
    	}, keyHex, {
        	mode: CryptoJS.mode.ECB,
        	padding: CryptoJS.pad.Pkcs7
    	});
    	return decrypted.toString(CryptoJS.enc.Utf8);
	}

	// Obtener el párrafo y derivar la clave
	var parrafo = document.querySelector('p').innerText;
	var clave = obtenerConcatenacionPrimerCaracter(parrafo);
	console.log("La llave es: " + clave + "");

	// Obtener los divs con mensajes cifrados
	var elementos = document.querySelectorAll('[class^="M"]');
	var cantidadMensajes = elementos.length; // Contar la cantidad de mensajes cifrados

	// Imprimir la lista de mensajes en consola
	console.log("Los mensajes cifrados son: "+ cantidadMensajes);

	// Procesar cada div
	elementos.forEach(function(elemento) {
    	var mensajeCifrado = elemento.id;
    	var mensajeDescifrado = decrypt3DES(mensajeCifrado, clave);

    	// Imprimir en consola
    	console.log("" + mensajeCifrado + " " + mensajeDescifrado);

    	// Mostrar en la página
    	var nuevoElemento = document.createElement("p");
    	nuevoElemento.textContent = mensajeDescifrado;
    	document.body.appendChild(nuevoElemento);
	});
})();
