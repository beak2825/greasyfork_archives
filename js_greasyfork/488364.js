// ==UserScript==
// @name         Subir aldeas
// @namespace    Subir aldeas
// @version      0.0.1
// @description  Agrega un botón en las aldeas para subir todas las de la isla de nivel con un click
// @author       You
// @match        https://*.grepolis.com/game/*
// @match        http://*.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488364/Subir%20aldeas.user.js
// @updateURL https://update.greasyfork.org/scripts/488364/Subir%20aldeas.meta.js
// ==/UserScript==


function subirNiveles(ventanaAldea){
    var i = 0;
    function upgrade(){
        if (i <6 ){
            var botonUpgrade = ventanaAldea.children[ventanaAldea.children.length -1].children[0].children[0].children[1].children[1]
            var botonSiguiente = ventanaAldea.children[ventanaAldea.children.length -1].children[0].children[0].children[0].children[0]
            var intervalo1 = Math.floor(Math.random() * (350 - 250 + 1)) + 250;
            var intervalo2 = Math.floor(Math.random() * (350 - 250 + 1)) + 250;
            var intervalo = intervalo1 + intervalo2
            botonUpgrade.click();

            setTimeout(function(){
                botonSiguiente.click();}, intervalo1)

            i++
            setTimeout(upgrade, intervalo)
        }
    }
    upgrade();
}


function ventanaAbiertaCallback(ventanaAldea){
    setTimeout(function(){
        var boton = ventanaAldea.children[ventanaAldea.children.length -1].children[0].children[0].children[1].children[0];
        boton.addEventListener('click', function(){
            console.log("Hola")
            subirNiveles(ventanaAldea);
        });
    }, 1000);
}

// Crear un nuevo observador de mutaciones
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        // Verificar si se ha agregado algún nodo
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            // Iterar sobre los nodos agregados
            mutation.addedNodes.forEach(function(node) {
                // Verificar si el nodo agregado tiene la clase window_curtain
                if (node.classList && node.classList.contains('window_curtain')) {
                    // Verificar si la ventana c1236 está como hijo de window_curtain
                    if(node.children[0].classList.contains("farm_town")){
                        // Ejecutar la función de callback
                        console.log(node.children[0]);

                        ventanaAbiertaCallback(node.children[0]);
                    }
                }
            });
        }
    });
});

// Configurar opciones para el observador
const config = { childList: true, subtree: true };

// Observar cambios en el cuerpo del documento
const body = document.body;
if (body) {
    observer.observe(body, config);
} else {
    console.error('No se encontró el cuerpo del documento');
}