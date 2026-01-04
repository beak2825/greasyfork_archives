// ==UserScript==
// @name        [Pixlr] Unlimited Saves UPDATED: (26/03/2024)
// @namespace   NiceATC
// @match       https://pixlr.com/*/*
// @grant       none
// @version     1.0
// @author      All Crdits to ClaytonTDM
// @description Bypasses the daily save limit
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490940/%5BPixlr%5D%20Unlimited%20Saves%20UPDATED%3A%20%2826032024%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490940/%5BPixlr%5D%20Unlimited%20Saves%20UPDATED%3A%20%2826032024%29.meta.js
// ==/UserScript==

(() => {
    // Define as configurações do usuário no armazenamento local
     localStorage.setItem('user-settings', '{"lastNewsCheck":"1970-01-01T00:00:00Z"}');

    let deletedModal = false;

    window.addEventListener('load', function () {
        // Define o nó alvo e a configuração do observador de mutação
        let targetNode = document.body;
        let config = { childList: true, subtree: true };

        // Cria um observador de mutação
        let observer = new MutationObserver(function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // Verifica se há uma modal e a remove
                    let modal = document.querySelector('.modal');
                    if (modal && !deletedModal) {
                        setTimeout(() => {
                            modal.remove();
                            deletedModal = true;
                        }, 50);
                    }
                }
            }
        });

        // Inicia a observação
        observer.observe(targetNode, config);

        // Define um intervalo para atualizar o horário da última verificação de notícias no armazenamento local
        setInterval(() => {
             localStorage.setItem('user-settings', {"lastNewsCheck":"${new Date().toISOString()}"});
        }, 500);
    });
})();