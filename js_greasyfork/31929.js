// ==UserScript==
// @name        PRF Sistema SISCOM - Conexao Segura
// @namespace   br.gov.prf.siscom.scripts.ConexaoSegura
// @description Realiza a conexao ao SISCOM de forma segura
// @match       *://www.prf.gov.br/multa/*
// @match       *://www.prf.gov.br/multa2/*
// @run-at      document-start
// @grant       none
// @author      Marcelo Barros
// @version     1.0.2
// @downloadURL https://update.greasyfork.org/scripts/31929/PRF%20Sistema%20SISCOM%20-%20Conexao%20Segura.user.js
// @updateURL https://update.greasyfork.org/scripts/31929/PRF%20Sistema%20SISCOM%20-%20Conexao%20Segura.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.protocol !== 'https:') window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
})();