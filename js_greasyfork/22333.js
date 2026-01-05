// ==UserScript==
// @name        PRF Sistema SEI - Carregar detalhes de interessados
// @namespace   br.gov.prf.sei.scripts.unirpaginacao
// @description Unir em uma só página os itens paginados
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @include     /^https?:\/\/sei\.prf\.gov\.br\/sei\/controlador\.php\?.*acao=procedimento_controlar.*$/
// @author      Marcelo Barros
// @version     1.0.7
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/22333/PRF%20Sistema%20SEI%20-%20Carregar%20detalhes%20de%20interessados.user.js
// @updateURL https://update.greasyfork.org/scripts/22333/PRF%20Sistema%20SEI%20-%20Carregar%20detalhes%20de%20interessados.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var idTipoVisualizacao = 'hdnTipoVisualizacao';
var idFormControlar = 'frmProcedimentoControlar';
var idTabela = 'tblProcessosDetalhado';
var idSelect = 'selInfraPaginacaoSuperior';
var idAtual = 'hdnInfraPaginaAtual';
var idDialog = 'dialogOutrasPaginas';
var idProgressBar = 'progressOutrasPaginas';

var idTabelaProcessosRecebidos = 'tblProcessosRecebidos';
var idTabelaProcessosGerados = 'tblProcessosGerados';

var tabelaRecebidos = getTabela(idTabelaProcessosRecebidos);
var tabelaGerados = getTabela(idTabelaProcessosGerados);

var linkCarregarDetalhes = newElement('a');

var dataImg = "data:image/png;base64,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";

function inicio() {
	$('#divComandos a:last-of-type').after(
		linkCarregarDetalhes
		.attr('href', '#')
		.addClass('botaoSEI')
		.click(function() {
			$('html body').first().append(
				newElement('div')
				.attr('id', idDialog)
				.attr('title', 'Carregando páginas...')
				.append(newElement('div').attr('id', idProgressBar).progressbar())
			);
			carregarDetalhes();
		}).append(
			newElement('img')
			.attr('src', dataImg)
			.attr('alt', 'Detalhes')
			.attr('title', 'Detalhes')
			.addClass('infraCorBarraSistema')
		)
	);
}

function newElement(elemento) {
	return $(document.createElement(elemento));
}

function getTabela(idTabelaProcessos) {
	return $('#' + idTabelaProcessos).first();
}

function getTabelaBody(tabela) {
	return tabela.children('tbody').first();
}

function adicionarTitulo(tbody) {
	tbody.children('tr:first-child')
		.append(newElement('th').addClass('tituloControle').css('width', '30%').text('Tipo'))
		.append(newElement('th').addClass('tituloControle').text('Interessados'))
		.children('th:first-child').css('width', '5%')
		.next().next().css('width', '18%')
		.next().css('width', '8%');
}

function removerFloat(tabela) {
	tabela.css('width', '100%').parent().parent().css('cssText', 'width: 100% !important');
}

function getProcessos(tabelaBody) {
	return tabelaBody.children('tr.infraTrClara');
}

function finalizar(tipoVisualizacao, formControlar, trsRecebidos, dialog) {

	GM_addStyle("table.infraTable td {border-bottom: 1px dotted #666;}");

	tipoVisualizacao.value = 'R';

	$.post({
		url: formControlar.attr('action'),
		data : formControlar.serialize(),
	});

	var keyTipoOrdem = 'tipoOrdem';

	var idModalOrdenar = 'modalOrdenar';

	var tabelaBodyRecebidos = getTabelaBody(tabelaRecebidos);
	var tabelaBodyGerados = getTabelaBody(tabelaGerados);

	adicionarTitulo(tabelaBodyRecebidos);
	adicionarTitulo(tabelaBodyGerados);

	removerFloat(tabelaRecebidos);
	removerFloat(tabelaGerados);

	var trsLocal = getProcessos(tabelaBodyRecebidos).add(getProcessos(tabelaBodyGerados));

	trsLocal.each(function(index, element) {
		var processoLocal = element.children[2].children[0].innerHTML;
		$.each(trsRecebidos, function(index2, element2) {
			if (processoLocal == element2.children[2].children[0].innerHTML) {
				var trRecebido = $(element2);
				$(element).append(newElement('td').css('text-align', 'justify').text(trRecebido.children('td:nth-last-child(2)').text()))
					.append(getInteressado(trRecebido.children('td:last-child')));
				trsRecebidos.splice(index2, 1);
				return false;
			}
		});
	});

	linkCarregarDetalhes.remove();
	dialog.dialog("close");
}

function getInteressado(td) {
	return newElement('td').css('text-align', 'justify').append(
		newElement('ul').css('margin', '0').css('padding-left', '16px').append(
			td.find('span.spanItemCelula,div[id^="divParticipantesOcultos"]>div.divItemCelula>div:nth-child(2)').map(function(index, element) {
				return newElement('li').text($(element).text()).get();
			})));
}

function carregarDetalhes() {

	var tipoVisualizacao = document.getElementById(idTipoVisualizacao);
	if (tipoVisualizacao) {

		var formControlar = $(document.getElementById(idFormControlar));
		if (formControlar.length) {

			tipoVisualizacao.value = 'D';

			var trsRecebidos = [];
			var recebido = 0;

			var dialog = $('#' + idDialog);
			var progressBar = $('#' + idProgressBar);

			dialog.dialog({
				modal: true,
				resizable: false,
				closeText: 'Fechar',
				minHeight: 0,
				show: {effect: "fadeIn", duration: 400},
				hide: {effect: "fadeOut", delay: 100, duration: 400}
			});

			$.ajax({
				method: 'POST',
				url: formControlar.attr('action'),
				data : formControlar.serialize(),
				success: function(dataInicial) {
					var htmlInicial = $($.parseHTML(dataInicial));

					trsRecebidos = trsRecebidos.concat(htmlInicial.find('table#' + idTabela + '>tbody>tr.infraTrClara').get());

					var atual = htmlInicial.find('#' + idAtual).first().get(0);
					if (atual) {

						var options = htmlInicial.find('#' + idSelect + '>option:not([selected="selected"])').map(function(index, element) { return element.value; }).get();
						if (options.length === 0) {
							if (htmlInicial.find('#lnkPaginaAnteriorSuperior').length === 1) {
								if (atual.value > 0)
									options = [(parseInt(atual.value) - 1).toString()];
								else
									options = ['0'];
							} else if (htmlInicial.find('#lnkProximaPaginaSuperior').length === 1) {
								options = [(parseInt(atual.value) + 1).toString()];
							}
						}

						progressBar.progressbar("option", "max", options.length + 1);
						progressBar.progressbar("option", "value", ++recebido);
						console.log(options);
						if (options.length >= 1) {

							var formPagina = $(atual.form);
							$.each(options, function(index, value) {
								atual.value = value;
								$.ajax({
									method: 'POST',
									url: formPagina.attr('action'),
									data : formPagina.serialize(),
									success: function(dataPagina) {
										trsRecebidos = trsRecebidos.concat($($.parseHTML(dataPagina)).find('table#' + idTabela + '>tbody>tr.infraTrClara').get());
										progressBar.progressbar("option", "value", ++recebido);
										if (recebido == options.length + 1) {
											finalizar(tipoVisualizacao, formControlar, trsRecebidos, dialog);
										}
									}
								});
							});

						} else {
							finalizar(tipoVisualizacao, formControlar, trsRecebidos, dialog);
						}
					}
				}
			});
		}
	}
}

if (tabelaRecebidos.length > 0 || tabelaGerados.length > 0)
	inicio();