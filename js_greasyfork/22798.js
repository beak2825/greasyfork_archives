// ==UserScript==
// @name        PRF Sistema DETRAN-GO - Publica veiculo
// @namespace   br.gov.prf.detrango.scripts.publicaveiculo
// @description Publica veiculo
// @include     https://portal.detran.go.gov.br/sve/frota/consulta/bin/bckconsulta-renavam.jsp*
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @author      Marcelo Barros
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22798/PRF%20Sistema%20DETRAN-GO%20-%20Publica%20veiculo.user.js
// @updateURL https://update.greasyfork.org/scripts/22798/PRF%20Sistema%20DETRAN-GO%20-%20Publica%20veiculo.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var infos = [
	{campo: 'tipo', texto: 'Tipo:'},
	{campo: 'marcamodelo', texto: 'Marca/Mod:'},
];

(function() {

	'use strict';

	var veiculo = {
		_tipo: 'VEICULO'
	};

	$('td.titulo').each(function(index, element) {
		var td = $(element);
		var texto = td.text();
		$.each(infos, function(index, info) {
			if (texto == info.texto) {
				veiculo[info.campo] = td.next().text();
			}
		});
	});

	window.opener.postMessage(veiculo, '*');

})();