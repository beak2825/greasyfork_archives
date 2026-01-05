// ==UserScript==
// @name        PRF Sistema SEI - Ordenar Processos
// @namespace   br.gov.prf.sei.scripts.ordenaprocessos
// @description Cria um botão que ordena os processos do SEI
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @include     /^https?:\/\/sei\.prf\.gov\.br\/sei\/controlador\.php\?.*acao=procedimento_controlar.*$/
// @author      Marcelo Barros
// @version     1.0.9
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/22217/PRF%20Sistema%20SEI%20-%20Ordenar%20Processos.user.js
// @updateURL https://update.greasyfork.org/scripts/22217/PRF%20Sistema%20SEI%20-%20Ordenar%20Processos.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var tipoOrdem = [];

function inicio() {

	var idTabelaProcessosRecebidos = 'tblProcessosRecebidos';
	var idTabelaProcessosGerados = 'tblProcessosGerados';
	var idTabelaProcessosDetalhado = 'tblProcessosDetalhado';

	var tabelaRecebidos = getTabela(idTabelaProcessosRecebidos);
	var tabelaGerados = getTabela(idTabelaProcessosGerados);
	var tabelaDetalhado = getTabela(idTabelaProcessosDetalhado);

	if ($('#divInfraBarraLocalizacao').text() == 'Controle de Processos' && (tabelaRecebidos.length > 0 || tabelaGerados.length > 0 || tabelaDetalhado.length > 0)) {

		var keyTipoOrdem = 'tipoOrdem';

		var idModalOrdenar = 'modalOrdenar';

		var tabelaBodyRecebidos = getTabelaBody(tabelaRecebidos);
		var tabelaBodyGerados = getTabelaBody(tabelaGerados);
		var tabelaBodyDetalhado = getTabelaBody(tabelaDetalhado);

		var trsRecebidos = getProcessos(tabelaBodyRecebidos);
		var trsGerados = getProcessos(tabelaBodyGerados);
		var trsDetalhado = getProcessos(tabelaBodyDetalhado);

		var trs = trsRecebidos.add(trsGerados).add(trsDetalhado);

		adicionarModalOrdenar(idModalOrdenar, 'Ordenar Processos', 'Ordenar', keyTipoOrdem, function() {
			ordenar(tabelaBodyRecebidos, trsRecebidos, tabelaBodyGerados, trsGerados, tabelaBodyDetalhado, trsDetalhado, keyTipoOrdem);
		});

		$('#divComandos a:last-of-type').after(
			newElement('a')
			.attr('href', '#')
			.addClass('botaoSEI')
			.click(function() {
				carregarCheckboxTipoOrdem();
				$('#' + idModalOrdenar).dialog('open');
			}).append(
				newElement('img')
				.attr('src', dataImg)
				.attr('alt', 'Classificar')
				.attr('title', 'Classificar')
				.addClass('infraCorBarraSistema')
			)
		);

		carregarTipoOrdem(keyTipoOrdem);
		if (tipoOrdem.length > 0)
			ordenar(tabelaBodyRecebidos, trsRecebidos, tabelaBodyGerados, trsGerados, tabelaBodyDetalhado, trsDetalhado, keyTipoOrdem);
	}
}

function newElement(elemento) {
	return $(document.createElement(elemento));
}

function getArrayCheckbox() {
	var retorno = [];
	$.each(tipoOrdemFuncao, function(key, value) {
		retorno.push(
			newElement('p')
			.append(
				newElement('label')
				.append([
					newElement('input')
					.attr('id', value.id)
					.attr('type', 'checkbox')
					.attr('name', 'ordem')
					.attr('value', key)
					.change(function() { changeTipoOrdem(this.value, this.checked); }),
					value.text
				])
			)

		);
	});
	return retorno;
}

function getLinkAtribuido(trs) {
	return trs.find('td:nth-child(4) a');
}

function ordenar(tabelaBodyRecebidos, trsRecebidos, tabelaBodyGerados, trsGerados, tabelaBodyDetalhado, trsDetalhado, keyTipoOrdem) {
	ordenarElementos(tabelaBodyRecebidos, trsRecebidos);
	ordenarElementos(tabelaBodyGerados, trsGerados);
	ordenarElementos(tabelaBodyDetalhado, trsDetalhado);
	salvarTipoOrdem(keyTipoOrdem);
}

function carregarTipoOrdem(keyTipoOrdem) {
	var valueTipoOrdem = GM_getValue(keyTipoOrdem);
	tipoOrdem = (valueTipoOrdem ? valueTipoOrdem.split(',') : []);
}

function salvarTipoOrdem(keyTipoOrdem) {
	GM_setValue(keyTipoOrdem, tipoOrdem.toString());
}

function carregarCheckboxTipoOrdem() {
	$.each(tipoOrdemFuncao, function(key, value) {
		$('#' + value.id).prop('checked', tipoOrdem.indexOf(key) != -1);
	});
}

function changeTipoOrdem(ordem, valor) {
	if (valor) {
		if (tipoOrdem.indexOf(ordem) == -1)
			tipoOrdem.push(ordem);
	} else {
		for (var i = tipoOrdem.length - 1; i >= 0; i--)
			if (tipoOrdem[i] === ordem)
				tipoOrdem.splice(i, 1);
	}
}

function getImg(tr) {
	return $(tr).find('img.imagemStatus[src*=sei_anotacao]').first();
}

function getPossuiAnotacao(img) {
	return img.length == 1;
}

function getAnotacaoPrioridade(img) {
	return img.attr('src').indexOf('prioridade') != -1;
}

function getNomeProcesso(tr) {
	return $(tr).find('td:nth-child(3) a').first().text();
}

function getTabIndexProcesso(tr) {
	return $(tr).find('td:first-child>a').first().attr('id');
}

function getAtribuido(tr) {
	return getLinkAtribuido($(tr)).first().text();
}

function getAnotacao(img) {
	var strfuncao = img.parent().attr('onmouseover');
	var start = strfuncao.indexOf('infraTooltipMostrar') + 21;
	var end = strfuncao.indexOf("'", start);
	return strfuncao.substring(start, end);
}

function substituirDatas(str) {
	var re = /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/;
	var subst = '$3$2$1';
	return str.replace(re, subst);
}

function substituirNumeroProcesso(str) {
	var re = /\d{5}\.(\d{6})\/(\d{4})\-\d{2}/;
	var subst = '$2$1';
	return str.replace(re, subst);
}

function compareBoolean(b1, b2) {
	return b1.toString().localeCompare(b2.toString());
}

function getInteressados(tr) {
	return $(tr).find('td:nth-child(6)').text();
}

function compareInteressado(e1, e2) {
	return getInteressados(e1).localeCompare(getInteressados(e2));
}

function compareAnotacaoPrioridade(e1, e2) {
	var img1 = getImg(e1);
	var img2 = getImg(e2);

	var possuiAnotacao1 = getPossuiAnotacao(img1);
	var possuiAnotacao2 = getPossuiAnotacao(img2);

	if (possuiAnotacao1 && possuiAnotacao2)
		return -1 * compareBoolean(getAnotacaoPrioridade(img1), getAnotacaoPrioridade(img2));
	else
		return -1 * compareBoolean(possuiAnotacao1, possuiAnotacao2);
}

function compareAnotacao(e1, e2) {
	var img1 = getImg(e1);
	var img2 = getImg(e2);

	var possuiAnotacao1 = getPossuiAnotacao(img1);
	var possuiAnotacao2 = getPossuiAnotacao(img2);

	if (possuiAnotacao1 && possuiAnotacao2)
		return substituirDatas(getAnotacao(img1)).localeCompare(substituirDatas(getAnotacao(img2)));
	else
		return -1 * compareBoolean(possuiAnotacao1, possuiAnotacao2);
}

function compareNumeroProcesso(e1, e2) {
	return getNomeProcesso(e1).localeCompare(getNomeProcesso(e2));
}

function compareDataProcesso(e1, e2) {
	return substituirNumeroProcesso(getNomeProcesso(e1)).localeCompare(substituirNumeroProcesso(getNomeProcesso(e2)));
}

function compareAtribuido(e1, e2) {
	return getAtribuido(e1).localeCompare(getAtribuido(e2));
}

function compareTabIndexProcesso(e1, e2) {
	return getTabIndexProcesso(e1).localeCompare(getTabIndexProcesso(e2));
}

function compare(e1, e2) {
	if (tipoOrdem.length === 0)
		return compareTabIndexProcesso(e1, e2);

	var compareValue;
	$.each(tipoOrdem, function(key, value) {
		compareValue = tipoOrdemFuncao[value].compare(e1, e2);
		if (compareValue !== 0)
			return false;
	});
	return compareValue;
}

function getTabela(idTabelaProcessos) {
	return $('#' + idTabelaProcessos).first();
}

function getTabelaBody(tabela) {
	return tabela.children('tbody').first();
}

function getProcessos(tabelaBody) {
	return tabelaBody.children('tr.infraTrClara');
}

function ordenarElementos(tabelaBody, processos) {
	processos.detach();
	processos.sort(compare);
	processos.appendTo(tabelaBody);
}

function adicionarModalOrdenar(id, titulo, textoAcao, keyTipoOrdem, acaoOrdenar) {
	$('html body').first().append(
		newElement('div')
		.attr('id', id)
		.attr('title', titulo)
		.append(newElement('form').append(getArrayCheckbox()))
	);
	$('#' + id).dialog({
		autoOpen: false,
		modal: true,
		buttons: [{
			text: textoAcao,
			click: function() {
				acaoOrdenar();
				$(this).dialog('close');}
		},{
			text: 'Cancelar',
			click: function() {
				$(this).dialog('close');}
		}],
		close: function(event, ui) {
			carregarTipoOrdem(keyTipoOrdem);
		}
	});
}

var tipoOrdemFuncao = {
	anotacao_prioridade	: {id: 'chkOrdenarAnotacaoPrioridade', text: 'Prioridade da Anotação', compare: compareAnotacaoPrioridade},
	anotacao            : {id: 'chkOrdenarAnotacao',           text: 'Texto da Anotação',      compare: compareAnotacao},
	numero_processo	    : {id: 'chkOrdenarNumeroProcesso',     text: 'Número do Processo',     compare: compareNumeroProcesso},
	data_processo	    : {id: 'chkOrdenarDataProcesso',       text: 'Data do Processo',       compare: compareDataProcesso},
	atribuido	        : {id: 'chkOrdenarAtribuido',          text: 'Processo Atribuido',     compare: compareAtribuido},
	interessado	        : {id: 'chkOrdenarInteressado',          text: 'Interessados',     compare: compareInteressado}
};

var dataImg = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABmNAAAZjQEn17ZGAAAAB3RJTUUH4AgDETQYTff36wAAAkxJREFUWMPtVzGIE0EUfbu54+RyELAwklQWAS2TGUhhoYWVWlpYCHqFCIeIINhYHApXWJxgI4d4yIG19nYBscjezJpaxDKx0IAKIpmdb+EKuWU3OzvZXSz2wRDy8/fn7cz/7/8BKlSoUKFQOHFGxtgVAFct4tUAvHddd9fzPJ0HwZUE+ysAa5YxL2qt9wD8yIOgm2BfWyJmLelk8iQYLBGTwlUowd0lYg601r8KLZIiwRh7CuACgK8ANoUQn2yKBL1er2Z0nkTk+75RxXY6HRfAnblnzwHITpBzfpuINk1OwHEc3e127/m+P0hzbjQadSKaf7hpJTNE9ATAqnEiu+4WgIGBXz0IjtRf07ZIVjOm1oqJk1KqHjE1y5IZU/+NyPeTtm++A+BuBqk6gFnCrmfdwViCQohtzvkjIkqVISGEyrDTG7kQTEl0eJ6nYIdoDh63ykHG2EMi+haK6ZGltZ4yxg77/f4xC4LreU0zD8Kmn4SuUuo0gA9pf8A5P0FE22HXOhOzGXsA9N9sEfumBNO6CC1QgDjt21rgciv8fA1g31RmZgYdxEhahsPhZwCXU9ymQRBcN96pdrs9DTVqHLO+AHgXBMHzyWRiRHI8Hn9stVp1AGdjfv45m81OjUaj75mmmUXDgpTSal5kjL0EcCPSVs9LKQf/07j1j6QCcEkI8dbm0vQYwP3Im96UUr7IieQOEb2RUh7a3upUTH76WmtuOvsVPfLXkkq37JRIIvg7xqZpftosCUlCfW3u4u4AUFrrZ2Ufb4UKFSqUgD90bdNado4QVwAAAABJRU5ErkJggg==";

inicio();