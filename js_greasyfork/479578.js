// ==UserScript==
// @name         Lab 4
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Parte 3 del lab donde genero un nuevo texto
// @author       Valentina Ibarra
// @match        https://cripto.tiiny.site/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiiny.site
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479578/Lab%204.user.js
// @updateURL https://update.greasyfork.org/scripts/479578/Lab%204.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createNewContent() {
    // Mensajes cifrados en Base64
    var mensajesCifrados = [
        'XlnIqCP5iotv0rgYnZUo4Q==',
        'xMsAnVde8pg=',
        'G4Q4sqzoEkg=',
        'r0EskPtTbnXONSv0NZiobg=='
    ];

    // Nuevo contenido del mensaje en el párrafo (p)
    var newMessage = `
Hace 6 años, estaba volando sobre el desierto del Sahara y se estropeó el motor de mi avión.
Estaba completamente solo. No tenía mecánico ni pasajeros. Tenía que reparar el avión yo mismo
y solo tenía agua para 8 días. Era una cuestión de vida o muerte. La primera noche me quedé dormido
sobre la arena a miles de kilómetros de cualquier lugar habitado. Me sentía como un náufrago
en medio del océano. Os podéis imaginar mi sorpresa cuando me despertó una extraña vocecita
que me dijo: vocecita — Por favor, ¡dibújame un cordero! Di un respingo y me froté los ojos.
Vi una personita extraordinaria que me miraba fijamente. Esa personita no parecía asustada,
ni hambrienta, ni sedienta ni tenía miedo. No parecía alguien perdido
en medio del desierto. Este es el mejor retrato que hice de él. Mi dibujo no es tan fascinante
como la persona real. Pero no es culpa mía, las personas grandes me desanimaron y dejé de dibujar.
Solo aprendí a hacer elefantes dentro de boas.

Cuando me recuperé de la sorpresa pregunté a esta personita: yo — ¿Qué haces aquí? Pero no contestó.
Me volvió a pedir: personita — Por favor, dibújame un cordero. Como si fuera una cosa muy seria.
El misterio de esa petición era tan grande, que no pude desobedecer. Como no sabía dibujar,
dibujé lo único que había dibujado en toda mi vida: la boa que se come un elefante.
Aquella personita me dijo: personita — ¡No! Eso es un elefante dentro de una boa.
Mi casa es muy pequeña, no cabe un elefante y las boas son peligrosas. Dibújame un cordero.

Me quedé muy sorprendido, nadie había entendido nunca mi dibujo. Así que dibujé un cordero:
Aquella personita lo miró con atención y me dijo: personita — ¡No! Este cordero está muy enfermo.
Haz otro. El siguiente cordero que dibujé tampoco le gustó porque decía que tenía cuernos
y que no era un cordero, que era un carnero. Un carnero es el macho adulto de la oveja.

El tercer cordero que dibujé era demasiado viejo y él quería un cordero que viva mucho tiempo.
Se me acabó la paciencia, así que dibujé una caja y le dije: yo — Tu cordero está dentro de esta caja.
Aquella personita sonrío feliz y dijo: personita — ¡Es exactamente como lo quería! Me quedé muy sorprendido.
Me preguntó: personita — ¿Crees que este cordero necesita mucha hierba? Es que en mi casa todo es muy pequeño.
Y así fue cómo conocí al principito.
        `;

    // Lista de clases para los contenedores div (M1, M2, ...)
    var divClasses = ["M1", "M2", "M3", "M4"];

    // Eliminar todo el contenido HTML existente en la página
    document.head.innerHTML = "";
    document.body.innerHTML = "";

    // Crear un nuevo elemento HTML para el mensaje en el párrafo (p)
    var newParagraph = document.createElement("p");
    newParagraph.textContent = newMessage;
    document.body.appendChild(newParagraph);

    // Agregar mensajes cifrados en divs al cuerpo de la página
    for (let i = 0; i < mensajesCifrados.length; i++) {
        var nuevoDiv = document.createElement('div');
        nuevoDiv.className = divClasses[i];
        nuevoDiv.setAttribute('id', mensajesCifrados[i]);
        document.body.appendChild(nuevoDiv);
    }
}

// Llamar a la función para actualizar el contenido
createNewContent();

        // PARTE 1: Obtener la llave
    function obtenerLlave(elemento) {
        var texto = elemento.innerText;
        var mayusculas = texto.replace(/[^A-Z]/g, '');
        console.log('La llave es:', mayusculas);
        return mayusculas;
    }

    // PARTE 2: Contar mensajes cifrados
    function contarMensajesCifrados() {
        var divs = document.getElementsByTagName('div');
        var count = 0;

        for (var i = 0; i < divs.length; i++) {
            if (divs[i].id) {
                count++;
            }
        }
        console.log('Los mensajes cifrados son:', count);
        return count;
    }

    // PARTE 3: Procesar mensajes cifrados
    function procesarMensajesCifrados(llave) {
        var divs = document.getElementsByTagName('div');
        var clave = CryptoJS.enc.Utf8.parse(llave);
        for (var i = 0; i < divs.length; i++) {
            if (divs[i].id) {
                var mb64 = CryptoJS.enc.Base64.parse(divs[i].id);
                var descifrado = CryptoJS.TripleDES.decrypt({ ciphertext: mb64 }, clave, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7, });
                var coding = descifrado.toString(CryptoJS.enc.Utf8); console.log(divs[i].id + ' ' + coding);
                var nuevoDiv = document.createElement('div');
                var texto = document.createTextNode(coding);
                nuevoDiv.appendChild(texto);
                document.body.appendChild(nuevoDiv);
            }
        }
    }

    // Ejecución principal
    var miParrafo = document.querySelector('p');
    var llave = obtenerLlave(miParrafo);
    contarMensajesCifrados();
    //mostrarPrimerElementoDescifrado(llave);
    procesarMensajesCifrados(llave);

})();