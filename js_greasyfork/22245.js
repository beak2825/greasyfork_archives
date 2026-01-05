// ==UserScript==
// @name        PRF Sistema SISCOM - Consulta Status Automaticamente
// @namespace   br.gov.prf.siscom.scripts.consultastatusautomaticamente
// @description Consulta automaticamente o status da multa ao se pesquisar um item que retorne apenas um resultado.
// @match       *://www.prf.gov.br/multass/pages/historico/historicoMultaList.seam
// @match       *://www.prf.gov.br/multass2/pages/historico/historicoMultaList.seam
// @author      Marcelo Barros
// @version     1.0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22245/PRF%20Sistema%20SISCOM%20-%20Consulta%20Status%20Automaticamente.user.js
// @updateURL https://update.greasyfork.org/scripts/22245/PRF%20Sistema%20SISCOM%20-%20Consulta%20Status%20Automaticamente.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let idConsultaHistorico = 'consultaHistoricoMulta';
    let idPainelResultado = idConsultaHistorico + ':painelResultadoMultas';

    let painelResultado = document.getElementById(idPainelResultado);
    if (painelResultado) {
        let bodyResultado = document.getElementById(painelResultado.children[0].id + ':tabelaResult:tb');
        if (bodyResultado.children.length == 1) {
            let tr = bodyResultado.children[0];
            document.title = 'Historico' + tr.children[0].textContent;
            let link = tr.children[5].children[1];
            link.click();
            link.style['pointer-events'] = 'none';
        }
    }
})();