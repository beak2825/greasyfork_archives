// ==UserScript==
// @name         Remover Mensagem de Reinício
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove a mensagem de reinício
// @author       Você
// @match        https://www.pathofexile.com/account/view-settings
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484995/Remover%20Mensagem%20de%20Rein%C3%ADcio.user.js
// @updateURL https://update.greasyfork.org/scripts/484995/Remover%20Mensagem%20de%20Rein%C3%ADcio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para remover a mensagem de reinício
    function removerMensagemReinicio() {
        // Seletor XPath da mensagem
        var xpath = "//div[contains(text(),'Reinicia em')]";

        // Encontrar todos os elementos que correspondem ao XPath
        var elementos = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        // Iterar sobre os elementos encontrados e removê-los
        for (var i = 0; i < elementos.snapshotLength; i++) {
            var elemento = elementos.snapshotItem(i);
            elemento.parentNode.removeChild(elemento);
        }
    }

    // Chamar a função para remover a mensagem de reinício
    removerMensagemReinicio();

    // Adicionar um observador de mutação para lidar com alterações dinâmicas na página
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Chamar a função sempre que houver uma mutação na página
            removerMensagemReinicio();
        });
    });

    // Configurar e iniciar o observador de mutação
    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
