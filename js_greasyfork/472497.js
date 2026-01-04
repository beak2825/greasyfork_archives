// ==UserScript==
// @name         Matador de Pássaros BdS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modificando o BdS
// @author       Killer
// @license      MIT
// @match        https://bancodeseries.com.br/index.php?action=userPage&uid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bancodeseries.com.br
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472497/Matador%20de%20P%C3%A1ssaros%20BdS.user.js
// @updateURL https://update.greasyfork.org/scripts/472497/Matador%20de%20P%C3%A1ssaros%20BdS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Removendo Passarinhos para compartilhamento
for (var i = 0; i < 21; i++) {
    var node = document.querySelector('[title="Compartilhar no X"]');
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

})();