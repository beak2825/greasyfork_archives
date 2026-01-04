// ==UserScript==
// @name         UOC tercera columna
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Añade una tercera columna útil al campus de la UOC. Utiliza un bloque con el
// @author       You
// @match        *://cv.uoc.edu/rb/inici/grid*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/34145/UOC%20tercera%20columna.user.js
// @updateURL https://update.greasyfork.org/scripts/34145/UOC%20tercera%20columna.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("UOC tercera columna: iniciado");
    var breakColumnModulTitle = "__BR-COL__";
    var appendBeforeNews = true;
    var deleteBreakColumnModul = true;
    // --------------------------------------------
    var centerColumnSelector = "div[id=gridContent] > .row > .main-column .column-last";
    var rightColumnSelector = "div[id=gridContent] > .row > .main-column + div > .column";
    var modulTitleSelector = ".modul__title";
    var modulClass = ".modul";

    var centerModules = document.querySelector(centerColumnSelector).children;
    
    /* Ñapa para diferenciar el comportamiento de Chrome del de FF, ya que el primero
     * elimina los elementos del array de nodos cuando estos se mueven o eliminan, mientras 
     * que el Firefox mantiene la posición del array */
    var initialLenght = centerModules.length; 
    
    console.log("Módulos centrales encontrados: " + centerModules.length);
    var afterBreak = false;
    for (var i = 0; i < centerModules.length; i++) {
        var module = centerModules[i];
        if (!afterBreak) {
            if (module.querySelector(modulTitleSelector + "[title*='" + breakColumnModulTitle + "']")) {
                console.log("Salto de columna encontrado en elemento número " + (i+1));
                afterBreak = true;
                if (deleteBreakColumnModul) {
                    console.log("Borrando bloque de salto de columna");
                    module.parentNode.removeChild(module);
                    console.log("Elementos iniciales = " + initialLenght + ". Elementos actuales = " + centerModules.length + " Es menor = " + (centerModules.length < initialLenght));
                    
                    /* Ñapa: Evita que el índice avance si el navegador ha eliminado la posición en el
                     * array del módulo eliminado */
                    if (centerModules.length < initialLenght) i--;
                }
            }
        } else {
            console.log("Moviendo elemento " + i + " a la columna derecha");
            document.querySelector(rightColumnSelector).appendChild(module);
            console.log("Elementos iniciales = " + initialLenght + ". Elementos actuales = " + centerModules.length + " Es menor = " + (centerModules.length < initialLenght));
            
            /* Ñapa: Evita que el índice avance si el navegador ha eliminado la posición en el
             * array del módulo movido */
            if (centerModules.length < initialLenght) i--;
        }
    }

    if (appendBeforeNews) {
        var moduleNews = document.querySelector(rightColumnSelector).firstElementChild;
        document.querySelector(rightColumnSelector).appendChild(moduleNews);
    }
    console.log("UOC tercera columna: finalizado");
})();