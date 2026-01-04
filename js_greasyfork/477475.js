// ==UserScript==
// @name         Gestionar hilos
// @version      0.1
// @author       josem
// @match        http://lamansion-crg.net/*
// @description  En primera estancia vamos a exportar al portapapeles el título y el link del post
// @namespace https://greasyfork.org/users/1196675
// @downloadURL https://update.greasyfork.org/scripts/477475/Gestionar%20hilos.user.js
// @updateURL https://update.greasyfork.org/scripts/477475/Gestionar%20hilos.meta.js
// ==/UserScript==

(function() {

    const currentURL = window.location.href;

    let mainTitle = "";

    // Nos aseguramos que se trata de un hilo
    if (currentURL.includes("showtopic")) {

        // Encontramos el título del hilo
        const maintitleElements = document.querySelectorAll("div.maintitle");

        if (maintitleElements.length > 1) {

            const secondMaintitleElement = maintitleElements[1];

            const firstTable = secondMaintitleElement.querySelector("table");

            if (firstTable) {

                const firstTd = firstTable.querySelector("td");

                if (firstTd) {

                    const text = firstTd.textContent.trim();

                    console.log("Título del hilo: ", text);

                    mainTitle = text;

                } else {

                    console.log("No se encontró un primer td en la primera tabla dentro del segundo elemento 'maintitle'.");

                }

            } else {

                console.log("No se encontró una tabla dentro del segundo elemento 'maintitle'.");

            }

        } else {

            console.log("No se encontraron suficientes elementos 'maintitle' en la página.");

        }

        // Agregamos el botón para que el usuario pueda interactuar.
        // Encontramos la barra de botones
        // El que queremos es el menú de arriba, el primero

        const buttonsPad = document.querySelector("td.nopad");

        if (buttonsPad){

            console.log(buttonsPad)

            const anchorElement = document.createElement("a");

            anchorElement.href = "#"; // Usamos "#" como href para que no cambie de página al hacer clic

            const imgElement = document.createElement("img");

            imgElement.src = "https://i.imgur.com/LCOzAga.png"; // Icono del botón

            imgElement.border = 0

            anchorElement.appendChild(imgElement);

            //anchorElement.textContent = imgElement;

            buttonsPad.appendChild(anchorElement);

            anchorElement.addEventListener("click", function(event) {

                event.preventDefault(); // Evitar que el enlace siga el enlace href

                copyToClipboard(mainTitle + "\t" + currentURL);

            });
        }

    }

    // Función para copiar al portapapeles

    function copyToClipboard(text){

        const _tempInput = document.createElement("textarea");

        _tempInput.value = text;

        document.body.appendChild(_tempInput);

        _tempInput.select();

        document.execCommand("copy");

        document.body.removeChild(_tempInput);

        console.log("Texto copiado al portapapeles: " + text);

    }

})();


