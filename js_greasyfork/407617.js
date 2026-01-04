// ==UserScript==
// @name         Google Shopping Duplicates
// @namespace    https://www.latinsud.com
// @version      0.4
// @description  Detect duplicate items
// @author       LatinSuD
// @match        https://shoppinglist.google.com/lists/*
// @match        https://shoppinglist.google.com/u/0/lists/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/407617/Google%20Shopping%20Duplicates.user.js
// @updateURL https://update.greasyfork.org/scripts/407617/Google%20Shopping%20Duplicates.meta.js
// ==/UserScript==

// ChangeLog:
//  0.4 (2022-04-24): Updated to new Google Shopping List UI (It won't work on the old one)

(function() {
    'use strict';

    var mydivd=document.createElement('DIV');

    document.body.appendChild(mydivd)
    mydivd.style="position: fixed; left: 3em; top: 0; z-index: 9999";

    var retraso=null;



    // Esta es la chicha
    function calcular() {
        console.log("Checking duplicates...")


        //var lista=Array.from(document.body.querySelectorAll('SPAN.listItemTitle'));
        var lista = Array.from(document.body.querySelector('INPUT[type=text]').parentElement.parentElement.parentElement.parentElement.querySelectorAll('DIV[role=button]'))

        var dups=""

        lista.forEach(function(e) {
            lista.some(function(f) {
                if (e==f) { return true; }

                // Try and detect plurals. This works better with spanish words.
                if (e.textContent.trim().toUpperCase().replace(/E?S *$/,"") == f.textContent.trim().toUpperCase().replace(/E?S *$/,"")) {
                    dups=dups+e.textContent +", ";
                    //console.log("BIEN");
                }

            })
        })

        mydivd.innerHTML="Duplicates: " + dups;
    }


    /****************************************/
    /*  CONFIGURAMOS EL OBSERVER Y EL TIMER */
    /****************************************/

    // selecciona el nodo target
    //var target = document.querySelector('#some-id');
    var target = document.body;


    // Configura el observer:
    var config = { attributes: false, childList: false, characterData: true, subtree: true };


    // Crea una instancia de observer
    var observer = new MutationObserver(function(mutations) {
        console.log(mutations)
        if (retraso) clearTimeout(retraso);


        retraso=setTimeout(calcular, 1000);
        console.log("FIN MUTACION")

        // pasa al observer el nodo y la configuracion
        //observer.observe(document.body, config);
    });


    // pasa al observer el nodo y la configuracion
    observer.observe(document.body, config);

    setTimeout(calcular,100);

})();