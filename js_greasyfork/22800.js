// ==UserScript==
// @name        PRF Sistema SISCOM - Condutor Infrator
// @namespace   br.gov.prf.siscom.scripts.condutorinfrator
// @description Consulta informações para auxiliar o preenchimento do formulário de Condutor Infrator.
// @match       *://www.prf.gov.br/multa/consultaRealInfrator.do
// @match       *://www.prf.gov.br/multa2/consultaRealInfrator.do
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @author      Marcelo Barros
// @version     1.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22800/PRF%20Sistema%20SISCOM%20-%20Condutor%20Infrator.user.js
// @updateURL https://update.greasyfork.org/scripts/22800/PRF%20Sistema%20SISCOM%20-%20Condutor%20Infrator.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var condutor;
var veiculo;
var lotacao;

var idTipoVeiculo = 'txtTipoVeiculo';
var idMarcaModelo = 'txtMarcaModelo';
var idValidade = 'txtValidade';
var idCategoria = 'txtCategoria';
var idLotacao = 'txtLotacao';
var idDataInfracao = 'txtDataInfracao';

function receberMensagemCondutor(e) {
	if (e && e.data && e.data._tipo == 'CONDUTOR') {

		window.removeEventListener("message", receberMensagemCondutor, false);

		condutor = e.data;

		$(document.getElementById('nomeInfrator')).val(condutor.nome);
		$(document.getElementById('cnhInfrator')).val(condutor.renach);
		$(document.getElementById('ufPaisHabilitacao')).val(condutor.uf);
		$(document.getElementById(idValidade)).val(condutor.validade);
		$(document.getElementById(idCategoria)).val(condutor.categoria);
		var selectRenach = $(document.getElementById('renach'));
		selectRenach.parent().parent().prev().children().last().children().children().val(condutor.cnh);
		selectRenach.prop('checked', true);
	}
}

function receberMensagemVeiculo(e) {
	if (e && e.data && e.data._tipo == 'VEICULO') {

		window.removeEventListener("message", receberMensagemVeiculo, false);

		veiculo = e.data;

		$(document.getElementById(idTipoVeiculo)).val(veiculo.tipo);
		$(document.getElementById(idMarcaModelo)).val(veiculo.marcamodelo);
	}
}

function newElement(elemento) {
	return $(document.createElement(elemento));
}

function criarNovaLinha(aposTr, label, idTexto) {
	$(aposTr).after(
		newElement('tr')
		.append(newElement('td').addClass('bold').html('&nbsp;' + label))
		.append(newElement('td').attr('colspan', '3')
				.append(newElement('input').attr('type', 'text').attr('id', idTexto).addClass('txtField1').prop('disabled', true))));
}

function alteradoCpf(btnConsultaInfrator, cpfInfrator) {
	btnConsultaInfrator.disabled = !cpfInfrator.value || cpfInfrator.value.length < 11;
}

function alteradoProcesso(btnRegistraProcesso, txtProcesso) {
	btnRegistraProcesso.disabled = !txtProcesso.value || apenasNumeros(txtProcesso.value).length != 17;
}

function parseDate(stringDate) {
	var arrayDate = stringDate.split('/');
	return new Date(arrayDate[2], arrayDate[1]-1, arrayDate[0]);
}

function dias(data1, data2) {
	return Math.floor(Math.abs(data1 - data2) / 86400000);
}

function getTextoDiv(div, label) {
	var textos = $(div).text().split('\n');
	if (textos.length == 4 && textos[1].trim().toUpperCase() == label)
		return textos[2].trim();
	return null;
}

function apenasNumeros(str) {
	return str.replace(/\D+/g, '');
}

function formataProcesso(processo) {
	return processo.substring(0, 5) + '.' + processo.substring(5, 11) + '/' + processo.substring(11, 15) + '-' + processo.substring(15, 17);
}

(function() {

	'use strict';

	var cpfInfrator = document.getElementById('cpfInfrator');
	if (cpfInfrator) {

		var parentCpf = cpfInfrator.parentNode;
		var trCpf = parentCpf.parentNode.parentNode;

		var btnConsultaInfrator = document.createElement('input');
		btnConsultaInfrator.type = 'button';
		btnConsultaInfrator.value = 'Consultar';

		alteradoCpf(btnConsultaInfrator, cpfInfrator);
		parentCpf.appendChild(btnConsultaInfrator);

		$(cpfInfrator).on('input blur', function() {
			alteradoCpf(btnConsultaInfrator, cpfInfrator);
		});

		$(btnConsultaInfrator).click(function() {
			window.addEventListener("message", receberMensagemCondutor, false);
			window.open('https://portal.detran.go.gov.br/sha/consultas/bincouf/consulta-binco.jsp?TIPOTRANSACAO=555&CNPF=' + cpfInfrator.value, 'NovaJanelaProcesso');
		});

		var txtProcesso = document.getElementById('numProcesso');
		if (txtProcesso) {

			var btnRegistraProcesso = document.createElement('input');
			btnRegistraProcesso.type = 'button';
			btnRegistraProcesso.value = 'Registrar';

			alteradoProcesso(btnRegistraProcesso, txtProcesso);
			txtProcesso.parentNode.appendChild(btnRegistraProcesso);

			$(txtProcesso).on('input blur', function() {
				alteradoProcesso(btnRegistraProcesso, txtProcesso);
			});

			$(btnRegistraProcesso).click(function() {
				if (confirm('Deseja abrir o link para registrar o número de processo?'))
					window.open('http://www.prf.gov.br/protocolo/manterProcessoExterno.do?replicacao=false&reqCode=salvarProcessoExterno&msgAlerta=&processo.id=&processo.idItem=&processo.idArea=&processo.numero=' + formataProcesso(apenasNumeros(txtProcesso.value)) + '&processo.idAssunto=461&processo.descricaoAssunto=&processo.interessado=PRF&processo.destinatario=SEI&dataExpedicaoDocumento=15%2F01%2F2016&processo.numeroOriginalDocumento=&processo.idTipoDocumento=111&processo.descricaoTipoDocumento=&processo.observacao=', 'NovaJanelaProcesso');
			});
		}

		criarNovaLinha(trCpf, 'Tipo Veículo:', idTipoVeiculo);
		criarNovaLinha(trCpf, 'Marca/Modelo:', idMarcaModelo);
		criarNovaLinha(trCpf, 'Validade:', idValidade);
		criarNovaLinha(trCpf, 'Data Infração:', idDataInfracao);
		criarNovaLinha(trCpf, 'Categoria Atual:', idCategoria);
		criarNovaLinha(trCpf, 'Delegacia:', idLotacao);

		var arrayTxtPlacaAuto = document.getElementsByName('numeroPlaca');
		if (arrayTxtPlacaAuto.length == 1) {

			var txtPlacaAuto = arrayTxtPlacaAuto[0];

			var arrayNumeroPlacaAuto = document.getElementsByName('numPlacaAuto');
			if (arrayNumeroPlacaAuto.length == 1) {

				var numeroPlacaAuto = arrayNumeroPlacaAuto[0].value;
				txtPlacaAuto.value = numeroPlacaAuto;

				window.addEventListener("message", receberMensagemVeiculo, false);
				window.open('https://portal.detran.go.gov.br/sve/frota/consulta/bin/bckconsulta-renavam.jsp?PLACA=' + numeroPlacaAuto, 'NovaJanelaConsultaVeiculo');
			}
		}

		var arrayNumeroAuto = document.getElementsByName('realInfrator.numero');
		if (arrayNumeroAuto.length == 1) {

			var numeroAuto = arrayNumeroAuto[0].value;
			if (numeroAuto) {

				$.get('/multa/imprimirautoeletronico.do?numeroAuto=' + numeroAuto, function(paginaAuto) {
					$($.parseHTML(paginaAuto)).filter('table').first().find('table>tbody td>div.mD').map(function(index, element) {
						var delegacia = getTextoDiv(element, 'SRPRF/DIST - DEL./NOE');
						if (delegacia) $(document.getElementById(idLotacao)).val(delegacia);
						var dataInfracao = getTextoDiv(element, 'DATA');
						if (dataInfracao) $(document.getElementById(idDataInfracao)).val(dataInfracao);
					});
				});
			}
		}
	}
})();