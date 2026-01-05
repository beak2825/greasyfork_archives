// ==UserScript==
// @name AB64H
// @description Auto BASE64 Hangouts
// @author JlXip
// @namespace AB64H
// @version 1.0.0-RC3
// @include https://hangouts.google.com/webchat/*

// @require http://code.jquery.com/jquery-git.min.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @require https://greasyfork.org/scripts/130-portable-md5-function/code/Portable%20MD5%20Function.js?version=10066
// @require https://greasyfork.org/scripts/23618-jsaes/code/JSAES.js?version=150018
// @require https://greasyfork.org/scripts/23619-jsaes-wrapper/code/JSAES%20Wrapper.js?version=150219

// @license APACHE LICENSE 2.0
// @supportURL https://gitlab.com/jlxip/AB64H
// @downloadURL https://update.greasyfork.org/scripts/23620/AB64H.user.js
// @updateURL https://update.greasyfork.org/scripts/23620/AB64H.meta.js
// ==/UserScript==


var msginput = null;    // Campo de entrada del mensaje
var key = null; // Clave (AES-256) para cifrar las comunicaciones


function AB64H_keypress(evt) {  // Función que se ejecutará cada vez que se pulse una tecla
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    if(charCode==170) { // Si la tecla pulsada es ª...
        if(key === null) {  // Si aún no se ha establecido la clave...
            var globalkey=prompt("PASSWORD OF COMMUNICATION");  // Pedimos la clave de cifrado para la comunicación
            if(globalkey === "" || globalkey === null) { return; }  // Si no se introduce contraseña, cerramos la función
            var md5key=hex_md5(globalkey);  // Hasheamos la clave en md5 para obtener siempre una clave de 256 bits
            key=AESW_init(md5key);  // Variable con la llave
            // LIMPIEZA DE VARIABLES QUE PUEDEN SER EXPUESTAS (seguridad)
            globalkey=null;
            md5key=null;

            return false;   // Devolvemos "false" para que no se escriba el carácter ª y para que no se cifre un mensaje en blanco
        }

        var oneChanged = false; // Variable booleana para saber si se ha descifrado al menos un mensaje
        $('span[dir="ltr"]').each(function() {  // Por cada etiqueta "span" con el campo dir="ltr"...
            if($(this).html().substr(0, 5)=="AES: ") {  // Si los primeros 4 bytes son "AES: "...
                var bencoded=$(this).html().substr(5, $(this).html().length);   // Obtenemos lo que queda después de "AES: "
                var encoded=atob(bencoded); // Lo decodificamos de BASE64 para obtener los bytes limpios
                var decoded=AESW_decryptLongString(encoded, key);   // Decodificamos el mensaje
                $(this).html(decoded);  // Y lo cambiamos en el documento HTML
                if(msginput.html() === "") {    // Si no se ha introducido nada en el campo de entrada del mensaje...
                   oneChanged = true;  // Cambiamos el valor de la variable booleana para saber que al menos se ha descifrado un mensaje y que no hay que encriptar nada
                }
            }
        });

        if(oneChanged === false) {  // Si no se ha cambiado ningún mensaje (porque se quiera cifrar texto)...
            var decoded=msginput.text();    // Variable con el mensaje en texto plano
            var encrypted=AESW_encryptLongString(decoded, key); // Ciframos el mensaje
            var bencrypted=btoa(encrypted); // Convertimos el mensaje cifrado en imprimible cifrándolo en BASE64
            msginput.text("AES: "+bencrypted);  // Cambiamos el mensaje a enviar por el mensaje cifrado con el prefijo "AES: "
        }

        return false;   // Devolvemos "false" para que no se escriba el carácter ª
    }
}


function AB64H_setKeypress() {  // Función que establece el evento keypress del campo de entrada del mensaje
    msginput=$('div[role="textbox"]');
    msginput.keypress(AB64H_keypress);
}


$(function() {
    waitForKeyElements('div[role="textbox"]', AB64H_setKeypress);   // Cuando cargue el campo de texto del mensaje, ejecutar AB64H_setKeypress()
});