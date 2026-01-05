// ==UserScript==
// @name        PRF Sistema SEI - Abrir Processo em Nova Aba
// @namespace   br.gov.prf.sei.scripts.abrirprocessonovaaba
// @description Permite abrir um processo em nova aba
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @include     /^https?:\/\/sei\.prf\.gov\.br\/sei\/controlador\.php\?.*acao=procedimento_controlar.*$/
// @author      Marcelo Barros
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23205/PRF%20Sistema%20SEI%20-%20Abrir%20Processo%20em%20Nova%20Aba.user.js
// @updateURL https://update.greasyfork.org/scripts/23205/PRF%20Sistema%20SEI%20-%20Abrir%20Processo%20em%20Nova%20Aba.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var elementos = [
	{idTabela: 'tblProcessosRecebidos', coluna: 'Recebidos'},
	{idTabela: 'tblProcessosGerados',   coluna: 'Gerados'  },
];

(function() {

	'use strict';

	$.each(elementos, function(index, element) {

		var colunaNumero = $('#' + element.idTabela + '>tbody>tr:first-child>th').filter(function(index, th) {
			return this.innerText == element.coluna;
		}).map(function(index, th) {
			return Array.prototype.indexOf.call(th.parentNode.children, th);
		}).get()[0];

		if (typeof colunaNumero === 'number') {
			$('#' + element.idTabela + '>tbody>tr.infraTrClara>td:nth-child(' + (colunaNumero + 1) + ')>a').each(function(index, a) {
				a.href = a.onclick.toString().match(/abrirProcesso\(\'(.+)\'\)\;/)[1];
				a.removeAttribute('onclick');
			});
		}
	});
})();