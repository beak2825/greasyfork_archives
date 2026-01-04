// ==UserScript==
// @name         EmuParadise 2UP
// @version      1.1.18
// @description  descarga directa de emuparadise (isos PS2)
// @author       Putoelquelolea
// @include      https://www.emuparadise.me/*/*/*
// @include      https://m.emuparadise.me/*/*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none

// @namespace https://greasyfork.org/users/1379231
// @downloadURL https://update.greasyfork.org/scripts/512169/EmuParadise%202UP.user.js
// @updateURL https://update.greasyfork.org/scripts/512169/EmuParadise%202UP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var id = ((document.URL).split("/"))[5];
    var downloadUrl = "/roms/get-download.php?gid=" + id + "&test=true";
    var fileName = $("h1").text() + ".7z";

    // Verificar si la página contiene el texto "Download Links"
    if ($("body").text().includes("Download Links")) {
        var aviso = $('<div></div>').css({
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // Centrado
            backgroundColor: '#444', // Fondo oscuro
            color: 'yellow', // Letras amarillas
            padding: '20px',
            borderRadius: '10px',
            zIndex: '1000',
            cursor: 'pointer',
            fontSize: '16px',
            border: '2px solid orange',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)', // Sombra para efecto 3D
            transition: 'background-color 0.3s ease, transform 0.3s ease'
        }).text('Haz clic aquí para descargar: ' + fileName);

        $('body').append(aviso);

        // Efecto de botón 3D
        aviso.on('mouseenter', function() {
            $(this).css({
                transform: 'translate(-50%, -50%) translateY(-5px)', // Levantar
                backgroundColor: '#555' // Cambiar color al pasar el mouse
            });
        }).on('mouseleave', function() {
            $(this).css({
                transform: 'translate(-50%, -50%)', // Regresar a la posición original
                backgroundColor: '#444' // Color original
            });
        });

        aviso.on('click', function() {
            $(this).fadeOut(500, function() {
                $(this).remove();
            });

            var a = document.createElement('a');
            a.href = downloadUrl;
            a.download = fileName;
            a.onerror = function() {
                alert('Error al generar el enlace de descarga. Inténtalo de nuevo más tarde.');
            };
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }
})();
