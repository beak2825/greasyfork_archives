// ==UserScript==
// @name        PRF Sistema SISCOM - Cria Link para Imprimir Auto
// @namespace   br.gov.prf.siscom.scripts.linkimprimirauto
// @description Cria um link no status da multa para imprimir o Auto de Infração
// @include     /^https?:\/\/www\.prf\.gov\.br\/multass2?\/pages\/historico\/historicoMultaDetalhe\.seam\?cid=[0-9]+$/
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @author      Marcelo Barros
// @version     1.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22254/PRF%20Sistema%20SISCOM%20-%20Cria%20Link%20para%20Imprimir%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/22254/PRF%20Sistema%20SISCOM%20-%20Cria%20Link%20para%20Imprimir%20Auto.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);


function newElement(elemento) {
	return $(document.createElement(elemento));
}

(function() {
	'use strict';
	var span = $('#consultaHistoricoMulta fieldset').filter(function() {
		return $(this).children('legend').text() === 'DETALHAMENTO DA MULTA';
	}).find('table>tbody>tr:first-child>td:first-child span.value').first();
	if (span.length == 1) {
		var text = span.text();
		var a = newElement('a')
		.attr('href', window.location.protocol + '//www.prf.gov.br/multa/imprimirautoeletronico.do?numeroAuto=' + text.trim())
		.attr('target', '_blank')
		.text(text);
		span.text('').append(a);
	}
})();