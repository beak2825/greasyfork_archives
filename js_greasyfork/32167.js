// ==UserScript==
// @name        PRF Sistema SISCOM - Altera Link Historico
// @namespace   br.gov.prf.siscom.scripts.AlteraLinkHistorico
// @description Realiza o link do historico do SISCOM permitindo conexao segura
// @match       *://www.prf.gov.br/multa/menu.jsp
// @match       *://www.prf.gov.br/multa2/menu.jsp
// @run-at      document-end
// @grant       none
// @author      Marcelo Barros
// @version     1.0.1
// @downloadURL https://update.greasyfork.org/scripts/32167/PRF%20Sistema%20SISCOM%20-%20Altera%20Link%20Historico.user.js
// @updateURL https://update.greasyfork.org/scripts/32167/PRF%20Sistema%20SISCOM%20-%20Altera%20Link%20Historico.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let menuAuto = TreeDef.items.filter(i => i.text.trim() === 'Auto de Infração')[0];
    if (menuAuto) {
        let menuHistorico = menuAuto.menu.items.filter(i => i.text.trim() === 'Histórico Multa')[0];
        if (menuHistorico) menuHistorico.action.target = '_blank';
    }
})();