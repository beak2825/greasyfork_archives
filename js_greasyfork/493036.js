// ==UserScript==
// @name         Autoselect Creative Commons on Incompetech
// @namespace    Autoselect Creative Commons on Incompetech
// @version      v1.0.0.4
// @license      GNU General Public License v3.0
// @description  Automatically selects the Creative Commons License option on incompetech.com.
// @description:es Selecciona automáticamente la opción Licencia Creative Commons en incompetech.com.
// @description:fr Sélectionne automatiquement l'option Creative Commons License sur incompetech.com.
// @description:de Wählt automatisch die Option „Creative Commons-Lizenz“ auf incompetech.com aus.
// @author       Mr. Mole (MoleTech)
// @match        *://incompetech.com/music/royalty-free/licenses/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=incompetech.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493036/Autoselect%20Creative%20Commons%20on%20Incompetech.user.js
// @updateURL https://update.greasyfork.org/scripts/493036/Autoselect%20Creative%20Commons%20on%20Incompetech.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i = 0;
    window.onload = function(){
        if (i == 0) {
            ChangeDisplay('cc');
            i + 1;
        }
    }
})();