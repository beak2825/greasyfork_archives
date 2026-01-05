// ==UserScript==
// @name        PRF Sistema DETRAN-GO - Publica condutor
// @namespace   br.gov.prf.detrango.scripts.publicacondutor
// @description Publica condutor
// @include     https://portal.detran.go.gov.br/sha/consultas/bincouf/consulta-binco.jsp*
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @author      Marcelo Barros
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22799/PRF%20Sistema%20DETRAN-GO%20-%20Publica%20condutor.user.js
// @updateURL https://update.greasyfork.org/scripts/22799/PRF%20Sistema%20DETRAN-GO%20-%20Publica%20condutor.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var infos = [
	{campo: 'nome', texto: 'Nome:'},
	{campo: 'renach', texto: 'Registro:'},
	{campo: 'cnh', texto: 'Nº da CNH:'},
	{campo: 'uf', texto: 'UF Habilitação Atual:'},
	{campo: 'categoria', texto: 'Categoria Atual:'},
	{campo: 'validade', texto: 'Data de Validade da CNH:'},
];

(function() {

	'use strict';

	var condutor = {
		_tipo: 'CONDUTOR'
	};

	$('td.fonteletras').each(function(index, element) {
		var td = $(element);
		var texto = td.text().replace(/\s+/g, ' ').trim();
		$.each(infos, function(index, info) {
			if (texto == info.texto) {
				condutor[info.campo] = td.next().text().trim();
			}
		});
	});

	window.opener.postMessage(condutor, '*');

})();