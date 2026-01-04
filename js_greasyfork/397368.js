// ==UserScript==
// @name                WME Latam Pack
// @description         Permite fechar UR velhas, fazer um comentário inicial nas URs sem comentário e outras funções bacanas no WME.
// @match             https://*.waze.com/*editor*
// @match             https://www.waze.com/*
// @match             https://www.google.com.br/maps*
// @version             0.183
// @grant               ericdanieldavid
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAYCAYAAAB0kZQKAAAABHNCSVQICAgIfAhkiAAABPNJREFUSIntlU2MldUZx3/nvOe8970fzJ1h5nasUxjAURAzBLilxZk7rUbiBGPSBdiYENNVF924aIIbE+Nel91W2xKb+NG6aEtMm5Io3AFEDCQiBMQMDDPAfA/33ve978c5pwvjRueDIu58krM6ef6/f57znOeBH+K+xuZe2L7+XrPFvSRVq8NPWGcOS+SIn/PWdZQ11jpaDUuSpE2EGBOCP5w5U//HfTdRrVbLQvj/DfKq+tQvtrD+QcuDvV00kyapSchMyp3FlNuThnNnl2g20gu+z9P1en3qvpgYHh7eH4b26MgTvTzz5CBCQCsOvzpJE096FHSBcrHMQmuOzlKZo/++yJlT8ygl9586deKD72RiaGjo8Th2Yy8ceowdj25kemmWvM4TJiGtpEVXoRMtfaQnWGw2KZeKLIWLdHd0c+7zcf7+zjjW0X/2bP36cvre3ZioVPo+fe7g1uKWh8pkqSWnc1jn0FLRU+ohUAFSSoy1LDQXyGkf6yyN6A7l9Qrlw43rrV1TUxN/Xk5frmVgz56hFzf2d1R+skXTikK08picm6WrWKar0EVe51GeQnsa5Wkq5W6kEOS0RivN+NUGc3MxgfZ+vBJDrWXCWQ5u3V4kSTPWF3o4+sFFBn50jbfqt/nN8yN44qtihmmElgqnclgyPhy7zuTH88wEHnt0nmaQrPhT1qyEc27bhr5OlFRML7QY3TTJsVN5pq7fZnxqhjANsc4SpRE3liawGN44co6JTxZ4KJezr/z+IP2jO3j/2LHD91wJhKiU1vnkVUBHl+ZfH1U4tHuWY9e6CEqWKInwPR9LhhQebx85x65tA/z6wC/Zuvu53x2dnXl2S3/v06sh1mzMzZs3vbpzT5k70RKByvPI9gfIOh+m+vN+5hozdARl/Jzm5vQ8f/rjRYK2+/hv9c/euTk5/bjQJbN5Y2X0vff/mV+Nsepz7Ny5d19HWeNJQSm3jjiLSbIYFYTMN+bpLvbQjBsshou0bYjSYvbDK/MXH93UM3p1fOrTvt6e/S/+9ldBsWPbm4ODe/etxFl1Tvx099B/dv2sc9/e4QoSjbEG6xy+5yOlxDpLalJSk2BsSilfRNkCubzA2IxbtxtcvjJHoehz7cs2E+Otw6dP11//JmfZnqjVah/ZTI509kgGq+uI0wQlHVJIPCmITRubWhwW5xxCCAKVx8PHyZRWZDDWUOzw2FntJjUxF843EJaby/GWNeGsGHl4l2HgkQLWGowA62J85YMDJRXS8wGQQuJwOOfIbAo4jDUYa7HOEGcJX1xqsDCbzJ0+U39rOd6yjblhQ/+lpRnvoPDbpDZECIlSkpnpmJuTIYWSBGlITUaaJRhncBiidsrVL5aIk4yg6GiGIZcv3eH8yRip7L6JiYkby/FW7ImhoZED1vB2pQ9vw4Bl/pbHlc8MnucAwYEXHqBU1CAEzjnakeHdv0zhnMMYGNieI0kcU+NZ5Ck7OjY2dnwl1poLbGjvyBEHz0uJCvI+pVKJ6ek5+gc023bkMcbia48L51tcu5xR6e0mbLVoRzHGur+ePHni0FqMu17ltVrNaq1FLghoNZuYzCUmQyCExjk8LTLPQxVLJeJ2myzLOH78+F3prz0xv3YrxEvW2tfaUYRz7tbYyRPfWki1Wu1GO4r6nHM4516+W+3/OwYHB7tWu69Wq+XvDf59xv8Aw6gysUnudcsAAAAASUVORK5CYII=
// @namespace http://greasemonkey.chizzum.com
// @downloadURL https://update.greasyfork.org/scripts/397368/WME%20Latam%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/397368/WME%20Latam%20Pack.meta.js
// ==/UserScript==

/// <summary>
///
/// </summary>
/// <param name=""></param>
/// <returns></returns>
var global_tentativaJNF = 0;
var global_tentativaHighlights = 0;

var global_intervalosRealceRadaresUsuario = [];
var global_intervalosRealceRadaresNoSpeed = [];
var global_intervalosRealcePlacesUsuario = [];

var seg_listaSegmentosSelecionados = [];
var seg_NomeCidadeEscolhida = null; //''
var seg_IdEstadoCidadeEscolhida = null; //0
var seg_NomesRuasColetados = [];
var seg_idAcessosTravados = [];

var intervaloPainelNumeracao = 0;

///comando   |  TimeoutID   |   FinishStatus    |   isSaveComand
let global_FilaInstrucaoAssincrona = [];

//realce de places
var ou_RealcePlaceLastLon;
var ou_RealcePlaceLastLat;
var ou_RealcePlaceLastZoom;

//LISTAS----------------------------------------------------------------------------------------------
var lstChamps = false;
var champsBrazil = [];

var lstLogradouros = false;
var logradouros = [];
var logradourosAbreviados = [];

var lstPrefixos = false;
var prefixosNomes = [];
var prefixosNomesAbreviados = [];

var lstGrafias = false;
var grafias = [];
var grafiasCorretas = [];

var lstPalavrasFeias = false;
var palavrasFeias = [];

var lstUFs = false;
var UFestados = [];
var UFestadosSiglas = [];

var WMEBasepais = '';
var lstTraducoes = false;
var traducoes = [];
var traducoeColunas = { id: 0, posicao: 1, Traducao: 2 };
var enuTipoSubstituicao = { innerText: 0, value: 1, previousSibling: 2, previousSibling2x: 3, nextSibling: 4, textoSimples: 5 };

var lstNomeCategoria = false;
var nomeCategoria = [];
var nomeCategoriaColunas = { Identificacao: 0, NomePadrao: 1, Categoria: 2 };

//Final das LISTAS------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------
/*INICIO Inicialização de componentes e HTML*/
//-----------------------------------------------------------------------------------------------------------
function genericBootstrap() {
	console.log('init');
	if (typeof (unsafeWindow) === "undefined") {
		unsafeWindow = (function () {
			var dummyElem = document.createElement('p');
			dummyElem.onclick = function () { return window; };
			return dummyElem.onclick();
		})();
	}

	if (window.location.host.indexOf("waze.com") != -1) {
		//livemap, UL ou location
		if (window.location.pathname.indexOf("livemap") != -1 || window.location.pathname.indexOf("ul") != -1 || window.location.pathname.indexOf("location") != -1)
		{
			console.log('Pagamos o livemap UL/Location. Vamos criar o butão já já.');
			window.setTimeout(
				function () {

					var inicio = 0;
					var acrescimo = 0;

					//?navigate=yes&latlng=-5.07765456%2C-42.79673475
					if (window.location.search.indexOf("latlng=") != -1) {
						inicio = window.location.search.indexOf("latlng=");
						acrescimo = 7;
					}
					//?ll=-23.20178914%2C-46.79734826&navigate=yes&zoom=17"
					else if (window.location.search.indexOf("ll=") != -1) {
						inicio = window.location.search.indexOf("ll=");
						acrescimo = 3;
					}
										
					var meio = window.location.search.indexOf("%2C");
					var fim = window.location.search.indexOf("&zoom");
			
					var lon = window.location.search.substring(meio + 3, fim); 
					var lat = window.location.search.substring(inicio + acrescimo, meio);

					var botao = '<div class="wz-poi-actions" style="text-align: center;"><a class="wz-app-button is-primary js-routing-button" href="https://www.waze.com/reporting/location?lat=' + lat + '&lng=' + lon + '&zoom=17" ';
					botao += 'target="_blank" >Criar Alerta Programado</a></div> ';
					document.getElementsByClassName("wz-folding is-open")[0].innerHTML += botao;

				}, 5000);
		}
		else if (window.location.pathname.indexOf("editor") != -1 )
		{
			console.log('Pagamos o editor. Vamos criar o butão já já.');
			window.setTimeout(genericInitScript, 500);
		}
		return;
	}
	else if (window.location.host.indexOf("anp.gov.br") != -1) {
		window.setTimeout(
			function () {
				//define o municipio e clica em pesquisar. Bença pai!
				console.log('Ahhhh muleke vamos lá, caçar na ANP.');

				var municipio = unescape(genericGetQueryString(window.location.href, "WmeMunicipio"));
				var municipiosDropDown = document.getElementsByName("sMunicipio")[0].children;

				console.log(municipio);
				console.log(municipiosDropDown);

				for (var i = 0; i < municipiosDropDown.length; i++) {
					if (genericCompararTextos(municipiosDropDown[i].text, municipio)) {
						document.getElementsByName("sMunicipio")[0].value = municipiosDropDown[i].value;
						document.getElementsByName("bPesquisar")[0].click();
						return;
					}
				}

				//se chegou aqui é pq não achou. Dá alerta!!!
				alert('Puxa, não consegui localizar o município que estava sendo visualizado no Wme. Selecione manualmente por favor.');

			}
			, 2000);
	}
	else if (window.location.href.indexOf("google.com.br/maps") != -1) {
		window.setTimeout(googleInitWme, 5000);
		return;
	}
}

function googleInitWme() {

	if (document.getElementsByClassName("widget-settings-content").length == 0) {
		//painel nunca foi aberto. Tenta denovo daqui 5 segundos.
		window.setTimeout(googleInitWme, 5000);
	}
	else if (document.getElementById('painelEditorWME') != null) {
		//painel já existe, bença e não faça nada meu amigo!
	}
	else {
		var string = '<ul><li><a role="menuitem" class="widget-settings-button" id="btnIrWme" href="" target="_blank">';
		string += '<div class="widget-settings-button-icon widget-settings-button-icon-default maps-sprite-settings-rate-review">';
		string += '</div> <div class="widget-settings-button-icon widget-settings-button-icon-hover maps-sprite-settings-rate-review-blue">';
		string += '</div> ';
		string += '<label class="widget-settings-button-label">Editar no WME</label> ';
		string += '</a>';
		string += 'com Zoom: <input type="number" min="1" max="8" value="4" size="1" id="inputZoomWME" style="width:50px;line-height:14px;height:22px;margin-bottom:4px;">  ';
		string += '</li></ul>';

		var painel = document.createElement('div');
		painel.className = "widget-settings-list";
		painel.id = "painelEditorWME";

		painel.innerHTML = string;

		var referencial = document.getElementsByClassName("widget-settings-content")[0];
		referencial.insertBefore(painel, referencial.childNodes[4]);
		document.getElementById('btnIrWme').onclick = funOu_LinkFromGMaps;
	}
}

function genericInitScript() {
	//	Waze object needed
	if (typeof (W) == 'undefined') {
		console.log('W NOK');
		window.setTimeout(genericInitScript, 500);
		return;
    }
    MUV_Waze = W;
	MUV_waze_loginmanager = MUV_Waze.loginManager;
	if (typeof (MUV_waze_loginmanager) == 'undefined') {
		console.log('login manager NOK');
		window.setTimeout(genericInitScript, 500);
		return;
	}
	MUV_waze_user = MUV_waze_loginmanager.user;
	if (typeof (MUV_waze_user) == 'undefined' || MUV_waze_user == null) {
		console.log('user NOK');
		window.setTimeout(genericInitScript, 500);
		return;
	}
	if (MUV_waze_user.rank < 2) {
		console.log('Funções apenas disponíveis para níveis superiores.');
		return;
	}

	//Se tiver o URO+ ele usa o objeto de lá, senão cria um aqui.
	if (typeof wazeModel == "undefined") {
		if (typeof W.model != "undefined") {
			wazeModel = W.model;
		}
		else if (typeof W != "undefined") {
			if (typeof W.controller != "undefined") {
				if (typeof W.controller.model != "undefined") {
					wazeModel = W.controller.model;
				}
				else {
					window.setTimeout(genericInitScript, 500);
					return;
				}
			}
			else {
				window.setTimeout(genericInitScript, 500);
				return;
			}
		}
		else {
			window.setTimeout(genericInitScript, 500);
			return;

		}
	}

	//	Waze GUI needed
	MUV_userInfos = document.getElementById('user-details');
	if (typeof (MUV_userInfos) === 'undefined') {
		console.log('userInfos NOK');
		window.setTimeout(genericInitScript, 500);
		return;
	}

	//Dá uma espera pra ver se o JNF carregou....
	if (typeof (WMETB_JNF_FixNode) == 'undefined' && typeof (WME_JNF_FixNode) == 'undefined' && global_tentativaJNF < 5) {
		window.setTimeout(genericInitScript, 500);
		global_tentativaJNF++;
		console.log('global_tentativaJNF' + global_tentativaJNF);
		return;
	}

	if (typeof (wmech_version) == 'undefined' && global_tentativaHighlights < 5) {
		window.setTimeout(genericInitScript, 500);
		global_tentativaHighlights++;
		return;
	}

	genericLoadLists();
}

function genericLoadLists() {
	for (var codpais in wazeModel.countries.objects) {
		WMEBasepais = wazeModel.countries.objects[codpais].name;
		break;
	}

	if (WMEBasepais == '') {
		//Não carregou país ainda.
		window.setTimeout(genericLoadLists, 1500);
		return;
	}

	window.setTimeout(function () { genericLoadLists_Wait(1); }, 15000);

	var apiURL = "https://sheets.googleapis.com/v4/spreadsheets/14jhrmpba7HLrd1s4GsYerdr9QP_Zgvz7c2C0Qdg2w8k/values/";
	var apiKey = "AIzaSyCUDfVh0blt62O3ee92vYxmsxFLz4vbqDo";

	//champs
	$.getJSON(apiURL+ "champs/?key=" + apiKey, function (data) {
		//console.log(data);

		for (var i = 0; i < data.values.length; i++) {
			if (data.values[i][1] == WMEBasepais) {
				champsBrazil.push(data.values[i][0]);
			}
		}
		localStorage.setItem("champsBrazil", champsBrazil);

		lstChamps = true;
	});
	//Logradouros
	$.getJSON(apiURL+ "Logradouros/?key=" + apiKey, function (data) {

		for (var i = 0; i < data.values.length; i++) {
			if (data.values[i][2] == WMEBasepais) {
				logradouros.push(data.values[i][0]);
				logradourosAbreviados.push(data.values[i][1]);
			}
		}
		localStorage.setItem("logradouros", logradouros);
		localStorage.setItem("logradourosAbreviados", logradourosAbreviados);

		lstLogradouros = true;
	});
	//Abreviaturas
	$.getJSON(apiURL+ "Abreviaturas/?key=" + apiKey, function (data) {
		//console.log(data.values);

		for (var i = 0; i < data.values.length; i++) {
			if (data.values[i][2] == WMEBasepais) {
				prefixosNomes.push(data.values[i][0]);
				prefixosNomesAbreviados.push(data.values[i][1]);
			}
		}
		localStorage.setItem("prefixosNomes", prefixosNomes);
		localStorage.setItem("prefixosNomesAbreviados", prefixosNomesAbreviados);

		lstPrefixos = true;
	});
	//Grafias
	$.getJSON(apiURL+ "Grafias/?key=" + apiKey, function (data) {
		//console.log(data.values);

		for (var i = 0; i < data.values.length; i++) {
			if (data.values[i][2] == WMEBasepais) {
				grafias.push(data.values[i][0]);
				grafiasCorretas.push(data.values[i][1]);
			}
		}
		localStorage.setItem("grafias", grafias);
		localStorage.setItem("grafiasCorretas", grafiasCorretas);

		lstGrafias = true;
	});
	//BadWord
	$.getJSON(apiURL+ "BadWords/?key=" + apiKey, function (data) {
		//console.log(data.values);

		for (var i = 0; i < data.values.length; i++) {
			if (data.values[i][1] == WMEBasepais) {
				palavrasFeias.push(data.values[i][0]);
			}
		}
		localStorage.setItem("palavrasFeias", palavrasFeias);

		lstPalavrasFeias = true;
	});
	//UFs
	$.getJSON(apiURL+ "UFs/?key=" + apiKey, function (data) {
		//console.log(data.values);

		for (var i = 0; i < data.values.length; i++) {
			if (data.values[i][2] == WMEBasepais) {
				UFestados.push(data.values[i][0]);
				UFestadosSiglas.push(data.values[i][1]);
			}
		}
		localStorage.setItem("UFestados", UFestados);
		localStorage.setItem("UFestadosSiglas", UFestadosSiglas);

		lstUFs = true;
	});
	// //Traduções
	$.getJSON(apiURL+ "Traduções/?key=" + apiKey, function (data) {
		//console.log(data.values);

		var colunas = data.values[0]; //Primeira linha
		var colunaPais = colunas.indexOf(WMEBasepais);

		for (var i = 1; i < data.values.length; i++) {
			var traducaoItem = [];

			traducaoItem.push(data.values[i][0]);
			traducaoItem.push(data.values[i][1]);

			if (typeof (data.values[i][colunaPais]) != 'undefined') {
				traducaoItem.push(data.values[i][colunaPais]);
			}

			traducoes.push(traducaoItem);
		}
		localStorage.setItem("traducoes", traducoes);
		lstTraducoes = true;
	});
	//NomeCategoria
	$.getJSON(apiURL+ "NomeCategoria/?key=" + apiKey, function (data) {
		//console.log(data.values);

		for (var i = 0; i < data.values.length; i++) {
			if (data.values[i][3] == WMEBasepais) {
				var itemCategoria = [];
				itemCategoria.push(data.values[i][0]);
				itemCategoria.push(data.values[i][1]);
				itemCategoria.push(data.values[i][2]);

				nomeCategoria.push(itemCategoria);
			}
		}
		localStorage.setItem("nomeCategoria", nomeCategoria);

		lstNomeCategoria = true;
	});
}



function genericLoadLists_Wait(tentativa) {
	console.log('Tentando grafia ' + tentativa);

	if (lstChamps &&
		lstLogradouros &&
		lstPrefixos &&
		lstGrafias &&
		lstPalavrasFeias &&
		lstUFs &&
		lstTraducoes &&
		lstNomeCategoria
		) {
		window.setTimeout(genericMontarHTML, 2000);
	}
	else {
		if (tentativa < 5) {
			console.log('Aguardando atualização de grafias');
			window.setTimeout(function () { genericLoadLists_Wait(tentativa + 1); }, 700);
		}
		else {
			console.log('Impossível obter atualização de grafias.');

			var msg = genericTraducao('msg_Impossivel');
			genericExibirMensagem(msg);

			champsBrazil = localStorage.getItem("champsBrazil").split(',');
			logradouros = localStorage.getItem("logradouros").split(',');
			logradourosAbreviados = localStorage.getItem("logradourosAbreviados").split(',');
			prefixosNomes = localStorage.getItem("prefixosNomes").split(',');
			prefixosNomesAbreviados = localStorage.getItem("prefixosNomesAbreviados").split(',');
			grafias = localStorage.getItem("grafias").split(',');
			grafiasCorretas = localStorage.getItem("grafiasCorretas").split(',');
			palavrasFeias = localStorage.getItem("palavrasFeias").split(',');
			UFestados = localStorage.getItem("UFestados").split(',');
			UFestadosSiglas = localStorage.getItem("UFestadosSiglas").split(',');

			var traducoesPrev = localStorage.getItem("traducoes").split(',');
			for (var i = 0; i < traducoesPrev.length; i = i + 3) {
				traducoes.push([traducoesPrev[i], traducoesPrev[i + 1], traducoesPrev[i + 2]]);
			}

			var NomeCategoriaPrev = localStorage.getItem("nomeCategoria").split(',');
			for (var i = 0; i < NomeCategoriaPrev.length; i = i + 3) {
				nomeCategoria.push([NomeCategoriaPrev[i], NomeCategoriaPrev[i + 1], NomeCategoriaPrev[i + 2]]);
			}

			lslstChamps = true;
			lstLogradouros = true;
			lstPrefixos = true;
			lstGrafias = true;
			lstPalavrasFeias = true;
			lstUFs = true;
			lstTraducoes = true;

			lstNomeCategoria = true;

			window.setTimeout(genericMontarHTML, 2000);
		}
	}
}

function genericMontarHTML() {

	var scriptTestDebug = (typeof (chrome.extension) == 'undefined');

	/*Permissões.*/
	var JNFInstalado = (typeof (WMETB_JNF_FixNode) != 'undefined' || typeof (WME_JNF_FixNode) != 'undefined');
	var ResolvedorSenior = (W.loginManager.user.rank >= 3);
	var userChamp = champsBrazil.indexOf(W.loginManager.user.userName) != -1;
	
	if (!ResolvedorSenior && userChamp)
	{
		ResolvedorSenior = true;
	}

	if (W.loginManager.user.rank < 2) {
		return;
	}

	/*HTML de verdade*/

	pckControls = document.createElement('section');
	pckControls.style.fontSiaze = '12px';
	pckControls.id = "sidepanel-mastersbrasil";
	pckControls.className = "tab-pane";
	tabbyHTML = '';
	tabbyHTML += '<p><ul class="nav nav-tabs">';
	/*aba URS, link e definição*/
	tabbyHTML += '<li><a href="#" id="_WmelinkURs" style="text-decoration:none;font-size:12px">URs</a></li>';
	/*aba Vias, link e definição*/
	tabbyHTML += '<li><a href="#" id="_WmelinkVias" style="text-decoration:none;font-size:12px">Vias</a></li>';
	/*aba Places, link e definição*/
	tabbyHTML += '<li><a href="#" id="_WmelinkPlaces" style="text-decoration:none;font-size:12px">Places</a></li>';
	/*aba Outras, link e definição*/
	tabbyHTML += '<li><a href="#" id="_WmelinkOutrasFuncoes" style="text-decoration:none;font-size:12px">Outras Funções</a></li>';
	tabbyHTML += '</ul>';
	pckControls.innerHTML = tabbyHTML;

	/////////////////////////////*Conteúdo aba URS*/////////////////////////////
	abaURS = document.createElement('p');
	abaURS.id = 'abaURs';
	abaURS.style = 'height:300px!important;';
	abaURS.innerHTML = '<br>';
	if (ResolvedorSenior) {
		abaURS.innerHTML += '<a id="dadosURs" download="" href="">Obter CSV de informações das URs</a>';
	}
	abaURS.innerHTML += '<hr style="margin-top: 5px;margin-bottom:5px;">';
	abaURS.innerHTML += '<b>Acompanhamento de URs visíveis</b><br/>';
	abaURS.innerHTML += '<input type="button" id="btnSeguirTodas" value="Seguir todas"/><br/>';
	abaURS.innerHTML += '<input type="button" id="btnNaoSeguirTodas" value="Parar de seguir"/>';
	abaURS.innerHTML += '<hr style="margin-top: 5px;margin-bottom:10px;">';

	abaURS.innerHTML += '<b>Comunicação com as URs</b><br/>';  //@JuniorDummer - Melhoria visual  ////////////////////////FALTA TRADUÇÃO///////////////////////
	abaURS.innerHTML += 'Apenas nas URs abertas há mais de: <input type="number" min="0" value="0" size="2" style="width:50px;line-height:14px;height:22px;margin-bottom:3px;"	id="_inputDiasMensagemInicial"/><br/>';
	abaURS.innerHTML += 'Mensagem:'; //@JuniorDummer - Melhoria visual ////////////////////////FALTA TRADUÇÃO///////////////////////
	abaURS.innerHTML += '<input type="text" id="_txtAberturaUR" value="" style="width:190px;line-height:14px;height:22px;margin-bottom:4px; margin-top:4px;" title="Mensagem que deseja enviar nas URs"/><br/>';
	abaURS.innerHTML += '<input type="checkbox" id="chkSeguirInicial" checked="false" />Seguir URs comentadas<br/>';
	abaURS.innerHTML += '<input type="button" id="_MUV_btnAbre" value="Iniciar comunicação de URs"/><br/>';
	

	abaURS.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';
	abaURS.innerHTML += '<b>Fechamento de URs</b><br/>';	//@JuniorDummer - Melhoria visual ////////////////////////FALTA TRADUÇÃO///////////////////////
	abaURS.innerHTML += 'Qtd dias abertura: <input type="number" min="7" value="15" size="2" style="width:50px;line-height:14px;height:22px;margin-bottom:4px;margin-top:4px;"	id="_inputDiasAberturaUR"/><br/>';
	abaURS.innerHTML += 'Qtd dias últ comentário: <input type="number" min="3" value="7" size="2" style="width:50px;line-height:14px;height:22px;margin-bottom:4px;" id="_inputDiasComentarioUR"/><br/>';
	abaURS.innerHTML += 'Mensagem:'; //@JuniorDummer - Melhoria visual ////////////////////////FALTA TRADUÇÃO///////////////////////
	abaURS.innerHTML += '<input type="text" id="_txtFechamentoUR" value="" style="width:190px;line-height:25px;height:22px;margin-bottom:4px;"/><br/>';
	abaURS.innerHTML += '<input type="checkbox" id="chkOferecerAjuda" checked="true" /> Enviar comentário de apoio.<br/>';
	abaURS.innerHTML += '<input type="checkbox" id="chkFecharApenasVisiveis" checked="true" /> Apenas as visíveis.<br/>';
	abaURS.innerHTML += '<input type="button" id="_MUV_btnFecha" value="Fechar URs não identificadas" /><br/><br/>';


	if (ResolvedorSenior) {
		abaURS.innerHTML += '<input type="checkbox" id="chkResolverModoBruto" /> Modo bruto.<br/>';
		abaURS.innerHTML += '<input type="button" id="_btnResolver" value="Resolver todas as URs" title="Apriori apenas URs sem nenhum comentário serão resolvidas." /><br/>';

		abaURS.innerHTML += '<input type="checkbox" id="chkResolverOK" checked="true"/> Resolvido &nbsp&nbsp';
		abaURS.innerHTML += '<input type="checkbox" id="chkResolverNI" /> Não Identificado.<br/><br/>';

		abaURS.innerHTML += '<input type="button" id="_MUV_btnFechaMP" value="Resolver todas as MPs visíveis"/><br/><br/>';
		abaURS.innerHTML += '<select id="selFanfarrao" style="width:100px;line-height:25px;height:22px;margin-bottom:4px;"></select><br/>';
		abaURS.innerHTML += '<input type="button" id="btnFanfarrao" value="Contar URs fechadas pelo fanfarrão" />';
		abaURS.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';
	}

	abaURS.innerHTML += 'Enviar comentário em todas as URs (pode ser filtrada com URO+)<br/>';
	abaURS.innerHTML += '<input type="text" id="txtComentario" value="" style="width:256px;line-height:25px;height:22px;margin-bottom:4px;"/><br/>';
	abaURS.innerHTML += '<input type="button" id="btnComentar" value="Enviar"/>';


   /////////////////////*conteúdo aba Vias*/////////////////////
	abaVias = document.createElement('p');
	abaVias.id = 'abaVias';
	abaVias.style = 'height:300px!important;';
	abaVias.innerHTML = '<br>';
    	
	if (ResolvedorSenior) {
		abaVias.innerHTML += '<input type="button" id="btnPermitirTudo" value="Permitir todas as conversões" /><br/><br/>';
		abaVias.innerHTML += '<input type="button" id="btnLiberacao" value="Liberar junções travadas" /><br/><br/>';
	
		abaVias.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';
		abaVias.innerHTML += '<b>Revisão de Nomes</b><br/>';
		abaVias.innerHTML += 'Cidade para atribuir aos segmentos "não nomeados".<br/>';
		abaVias.innerHTML += '<select id="selCidadeSegNome" style="width:100px;line-height:25px;height:22px;margin-bottom:4px;"></select><br/>';
		if (userChamp) {
			abaVias.innerHTML += '<input type="checkbox" id="chkRevisaoPlace" checked="false"/> Revisar nomes de places.';
		}

		abaVias.innerHTML += '<input type="button" id="btnIniciarRevisao" value="Iniciar" />&nbsp&nbsp';      //<<<<======= Start
		abaVias.innerHTML += '<input type="button" id="btnPararRevisao" value="Parar" disabled="true" /><br/><br/>';
	}

	abaVias.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';
	abaVias.innerHTML += 'Acessos/saídas das vias<br/>';
	abaVias.innerHTML += '<input type="checkbox" id="chkViaIn" checked="true"/> Acesso.';
	abaVias.innerHTML += '<input type="checkbox" id="chkViaOut" checked="true"/> Saída.<br/>';
	abaVias.innerHTML += '<input type="button" id="btnTestaAcessoVia" value="Testar"/>';

	abaVias.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';
	abaVias.innerHTML += '<input type="checkbox" id="chkProtegerTotal"/>Proteção total<br/>';
	abaVias.innerHTML += '<input type="button" id="btnProtegerMapa" value="Proteger o mapa"/>';
	

	abaVias.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';
	abaVias.innerHTML += '<input type="checkbox" id="chkDirty4x4" /> Realçar vias marcadas como Dirt Road / 4x4 Trail.<br/>';
	abaVias.innerHTML += '<input type="checkbox" id="chkSobrescritaInstrucao" /> Realçar vias com instrução forçada.<br/>';
	abaVias.innerHTML += '<input type="checkbox" id="chkRoteamento" /> Realçar vias com roteamento.<br/>';
	abaVias.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';
	abaVias.innerHTML += '<input type="checkbox" id="chkVelocidades" /> Avaliar velocidades.<br/>';
	abaVias.innerHTML += '<input type="checkbox" id="chkMaturidade" /> Avaliar maturidade.<br/>';
	abaVias.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';
	abaVias.innerHTML += '<input type="checkbox" id="chkClosures" /> Apresentar interdições no feed.<br/>';
	abaVias.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';

	abaVias.innerHTML += 'Tolerância de alinhamento para seleção: <input type="number" min="0" value="1" size="2" style="width:50px;line-height:14px;height:22px;margin-bottom:4px;"	id="inputToleranciaAlinhamento" title="Sabe aquela coisa chata de ter que selecionar vários picadinhos de segmentos sem nome, para depois colocar o nome nos benditos? Bem selecione apenas dois deles, que estejam juntos. Na aba WME Brasil vai ter um botão que te ajudará muito."/><br/>';

	/*conteúdo aba Places*/
	abaPlaces = document.createElement('p');
	abaPlaces.id = 'abaPlaces';
	abaPlaces.style = 'height:300px!important;';
	abaPlaces.innerHTML = '<br>';
	abaPlaces.innerHTML += '<input type="button" id="btnSelecionarSobreposto" value="Selecionar place (sobreposto em nó)" /><br/><br/>';
	abaPlaces.innerHTML += 'Tolerância de espaçamento: <input type="number" min="0" value="5" size="2" style="width:50px;line-height:14px;height:22px;margin-bottom:4px;"	id="inputEspacamentoTolerancia"/><br/>';
	abaPlaces.innerHTML += '<input type="checkbox" id="chkPlacesProblematicos"/> Realçar possíveis places problemáticos.';
	abaPlaces.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';

	if (ResolvedorSenior) {
		abaPlaces.innerHTML += 'Updates<br/>';
		abaPlaces.innerHTML += '<input type="button" id="btnPlacesTrue" value="Aprovar todos" />&nbsp';
		abaPlaces.innerHTML += '<input type="button" id="btnPlacesFalse" value="Reprovar todos" /><br/>';

		abaPlaces.innerHTML += '<input type="checkbox" id="chkPlaceUsuario"/>Apenas usuário selecionado:<br/>';
		abaPlaces.innerHTML += '<select id="selUsuariosPlaces" style="width:100px;line-height:25px;height:22px;margin-bottom:4px;"></select><br/>';
		abaPlaces.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';
	}

	abaPlaces.innerHTML += 'Postos de combustível<br/>';
	abaPlaces.innerHTML += '<select id="selCidadePosto" style="width:100px;line-height:25px;height:22px;margin-bottom:4px;"></select><br/>';
	abaPlaces.innerHTML += '<input type="button" id="btnPesquisarPosto" value="Pesquisar" />';

	abaPlaces.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';

	abaPlaces.innerHTML += 'Lock<br/>';
	abaPlaces.innerHTML += '<input type="checkbox" id="chkLockPonto"/>Ponto ';
	abaPlaces.innerHTML += '<input type="checkbox" id="chkLockArea"/>Area<br/>';
	abaPlaces.innerHTML += 'Nível desejado: <input type="number" min="1" max="6" value="2" size="1" style="width:50px;line-height:14px;height:22px;margin-bottom:4px;"	id="inputLockLevel"/><br/>';
	abaPlaces.innerHTML += '<input type="checkbox" id="chkRaiseLock"/>Subir<input type="checkbox" id="chkLowerLock"/>Descer<br/>';
	abaPlaces.innerHTML += '<input type="button" id="btnLockPlace" value="Efetuar" />';

	abaPlaces.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';

	if (ResolvedorSenior) {
		abaPlaces.innerHTML += 'Revisão de Places<br/>';
		abaPlaces.innerHTML += '<input type="button" id="btnIniciarRevisaoPlace" value="Iniciar" />&nbsp&nbsp';
		abaPlaces.innerHTML += '<input type="button" id="btnPararRevisaoPlace" value="Parar" disabled="true" /><br/>';

		abaPlaces.innerHTML += '<input type="checkbox" id="chkNomeCategoria"/>Corrigir categorias comumente erradas.<br/>';
	}

	/*conteúdo aba Outras*/
	abaOutrasFuncoes = document.createElement('p');
	abaOutrasFuncoes.id = "abaOutrasFuncoes";
	abaOutrasFuncoes.style = 'height:300px!important;';
	abaOutrasFuncoes.innerHTML = '<br>';

	abaOutrasFuncoes.innerHTML += '<input type="button" id="btnComentariosNovatos" value="Comentário de boas vias à novatos" /><br/><br/>';
	abaOutrasFuncoes.innerHTML += '<input type="text" id="txtComentarioNovato" value="" style="width:256px;line-height:25px;height:22px;margin-bottom:4px;"/><br/>';

	abaOutrasFuncoes.innerHTML += '<b>Radares</b><br/>';
	abaOutrasFuncoes.innerHTML += '<input type="checkbox" id="chkRadaresZerados" value="0" /> Realçar os sem velocidade e considerar para exclusão<br/>';

	abaOutrasFuncoes.innerHTML += '<select id="selUsuarioRadar" style="width:100px;line-height:25px;height:22px;margin-bottom:4px;"></select><br/>';
	abaOutrasFuncoes.innerHTML += '<input type="checkbox" id="chkRadarNAO" value="0" /> Não... <br/>';
	abaOutrasFuncoes.innerHTML += '<input type="checkbox" id="chkRadarCriado" value="0" /> Criado ';
	abaOutrasFuncoes.innerHTML += '<input type="checkbox" id="chkRadarAtualizado" value="0" /> Atualizado<br/>';
	abaOutrasFuncoes.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';

	abaOutrasFuncoes.innerHTML += '<input type="button" id="btnGmaps" value="Exibir no Google Maps" /><br/><br/>';
	abaOutrasFuncoes.innerHTML += '<input type="button" id="btnZoom" value="Exibir com mais zoom" /><br/><br/>';
	abaOutrasFuncoes.innerHTML += '<input type="button" id="_btnUndoAll" value="Desfazer todas as alterações" /><br/><br/>';
	abaOutrasFuncoes.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';

	if (userChamp) {
		abaOutrasFuncoes.innerHTML += '<a id="dadosEditores" download="" href="">Obter CSV de informações dos editores</a><br/><br/>';
	}

	abaOutrasFuncoes.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';
	abaOutrasFuncoes.innerHTML += 'Intervalo das execuções assíncronas (em segundos): <input type="number" min="1" value="1" size="2" style="width:50px;line-height:14px;height:22px;margin-bottom:4px;"	id="inputExecAssync" title="Revisão de nomes, aprovação de places e outras coisas usam esse valor para calcular o tempo de cada comando a ser executado."/><br/>';

	abaOutrasFuncoes.innerHTML += '<input type="checkbox" id="chkDebugMode">Debug Mode</input><br/>';
	
	var userTabs = document.getElementById('user-info');
	var navTabs = genericgetByClass('nav-tabs', userTabs)[0];
	var tabContent = genericgetByClass('tab-content', userTabs)[0];

	newtabUR = document.createElement('li');
	newtabUR.innerHTML = '<a href="#sidepanel-mastersbrasil" data-toggle="tab" id="tituloCabecalho">WME Brasil</a>';
	newtabUR.innerHTML += '<img id="assyncEngine" src=""></img>';
	navTabs.appendChild(newtabUR);

	tabContent.appendChild(pckControls);

	pckControls.appendChild(abaURS);
	pckControls.appendChild(abaVias);
	pckControls.appendChild(abaPlaces);
	pckControls.appendChild(abaOutrasFuncoes);

	funNav_TabExibirFuncoes('URs');

	//Pegando valores customizados do usuário
	genericObterCheckboxPersistido('chkSeguirInicial');
	genericObterCheckboxPersistido('chkProtegerTotal');
	
	genericObterCheckboxPersistido('chkDirty4x4');
	genericObterCheckboxPersistido('chkSobrescritaInstrucao');
	genericObterCheckboxPersistido('chkRoteamento');
	genericObterCheckboxPersistido('chkClosures');
	genericObterCheckboxPersistido('chkVelocidades');
	genericObterCheckboxPersistido('chkMaturidade');
	genericObterCheckboxPersistido('chkPlacesProblematicos');
	
	if (ResolvedorSenior) {
		genericObterCheckboxPersistido('chkNomeCategoria');
	}

	if (localStorage.getItem("inputExecAssync") != null) {
		document.getElementById('inputExecAssync').value = localStorage.getItem("inputExecAssync");
	}

	//Eventos------------------------------------------
	//Abas
	document.getElementById('_WmelinkURs').onclick = function () { funNav_TabExibirFuncoes('URs'); };
	document.getElementById('_WmelinkVias').onclick = function () { funNav_TabExibirFuncoes('Vias'); };
	
	document.getElementById('_WmelinkPlaces').onclick = function () { funNav_TabExibirFuncoes('Places'); };
	document.getElementById('_WmelinkOutrasFuncoes').onclick = function () { funNav_TabExibirFuncoes('OutrasFuncoes'); };
	//Botões
	document.getElementById('dadosURs').onclick = funUR_ObterDados;
	document.getElementById('btnSeguirTodas').onclick = function () { funUR_SeguirTodasVisiveis(true) };
	document.getElementById('btnNaoSeguirTodas').onclick = function () { funUR_SeguirTodasVisiveis(false) };
	document.getElementById('_MUV_btnAbre').onclick = funUR_IniciarComunicacao;
	document.getElementById('_MUV_btnFecha').onclick = funUR_Encerramento;

	document.getElementById('btnComentar').onclick = funUR_EnviarComentario;
	if (ResolvedorSenior) {
		document.getElementById('_btnResolver').onclick = funUR_ResolverVisiveis;

		document.getElementById('chkResolverOK').onclick = function()
		{
			document.getElementById('chkResolverNI').checked = !document.getElementById('chkResolverOK').checked;
		};

		document.getElementById('chkResolverNI').onclick = function()
		{
			document.getElementById('chkResolverOK').checked = !document.getElementById('chkResolverNI').checked;
		};

		document.getElementById('btnFanfarrao').onclick = funUR_ContarFechadasUsuario;
		document.getElementById('_MUV_btnFechaMP').onclick = funUR_EncerramentoMP;
	}

	if (ResolvedorSenior) {
		document.getElementById('btnPermitirTudo').onclick = function () { funVia_CorretorDeNo('Permissao'); };
		document.getElementById('btnLiberacao').onclick = function () { funVia_CorretorDeNo('Liberacao'); };

		document.getElementById('btnIniciarRevisao').onclick = funRevVia_IniciarFaxinaNew;
		document.getElementById('btnPararRevisao').onclick = genericAssincStop;

		document.getElementById('selCidadeSegNome').onfocus = function () {
			seg_listaSegmentosSelecionados = [];
			genericLoadDropDownCidades('selCidadeSegNome');
		};
	}

	document.getElementById('btnTestaAcessoVia').onclick = funVia_TestarAcessos;
	document.getElementById('btnProtegerMapa').onclick = funVia_ProtegerMapa;
	
	document.getElementById('btnSelecionarSobreposto').onclick = funPlace_SelecionarSobreposto;
	document.getElementById('chkPlacesProblematicos').onclick = genericPersistirCheckboxes;

	if (ResolvedorSenior) {
		document.getElementById('btnPlacesTrue').onclick = function () { funPlace_AprovarReprovarPU(true); };
		document.getElementById('btnPlacesFalse').onclick = function () { funPlace_AprovarReprovarPU(false); };
		document.getElementById('selUsuariosPlaces').onclick = funPlace_RealcarPUsDoUsuario;
	}

	document.getElementById('selCidadePosto').onfocus = function () { genericLoadDropDownCidades('selCidadePosto'); };
	document.getElementById('btnPesquisarPosto').onclick = funPlace_PesquisarANP;
	document.getElementById('btnLockPlace').onclick = funPlace_LockPlace;

	if (ResolvedorSenior) {
		document.getElementById('btnIniciarRevisaoPlace').onclick = funRevPla_IniciarFaxina;
		document.getElementById('btnPararRevisaoPlace').onclick = genericAssincStop;

		document.getElementById('chkNomeCategoria').onclick = genericPersistirCheckboxes
	}

	document.getElementById('chkSeguirInicial').onclick = genericPersistirCheckboxes;
	document.getElementById('chkProtegerTotal').onclick = genericPersistirCheckboxes;
	
	document.getElementById('chkDirty4x4').onclick = genericPersistirCheckboxes;
	document.getElementById('chkSobrescritaInstrucao').onclick = genericPersistirCheckboxes;
	document.getElementById('chkRoteamento').onclick = genericPersistirCheckboxes;
	document.getElementById('chkMaturidade').onclick = genericPersistirCheckboxes;
	document.getElementById('chkVelocidades').onclick = genericPersistirCheckboxes;

	document.getElementById('chkClosures').onclick = genericPersistirCheckboxes;
	document.getElementById('inputExecAssync').onchange = function () { localStorage.setItem("inputExecAssync", document.getElementById('inputExecAssync').value); };

    document.getElementById('btnComentariosNovatos').onclick = funOu_ComentarioNovatos;

	document.getElementById('selUsuarioRadar').onfocus = funOu_ListarUsuariosRadar;
	document.getElementById('selUsuarioRadar').onclick = funOu_RealcarRadaresUsuario;

	document.getElementById('chkRadarNAO').onclick = funOu_RealcarRadaresUsuario;
	document.getElementById('chkRadarCriado').onclick = funOu_RealcarRadaresUsuario;
	document.getElementById('chkRadarAtualizado').onclick = funOu_RealcarRadaresUsuario;
	document.getElementById('chkRadaresZerados').onclick = funOu_Realcadores;

	document.getElementById('btnGmaps').onclick = funOu_LinkGMaps;
	document.getElementById('btnZoom').onclick = funOu_LinkZoomed;

	document.getElementById('_btnUndoAll').onclick = funOu_DesfazerTudo;

	if (userChamp) {
		document.getElementById('dadosEditores').onclick = funOu_ObterDadosTodosEditores;
	}

	//DropdownLists
	if (ResolvedorSenior) {
		document.getElementById('selFanfarrao').onfocus = funUR_LocalizarSolucionadores;
		document.getElementById('selUsuariosPlaces').onfocus = funPlace_ProcurarUsuariosPU;

		document.getElementById('chkPlaceUsuario').onclick = function () { document.getElementById('selUsuariosPlaces').options.length = 0; };
	}

	//Registrando eventos automatizados
	window.setInterval(genericMontarHTML_Selecionados, 5000);

	window.setInterval(funOu_Realcadores, 8000);//8 segundos
	window.setInterval(funOu_AssyncEngine, 5000);//5 segundos

	window.setTimeout(genericTraducoes, 5000);
}

function genericPersistirCheckboxes() {
	localStorage.setItem(this.attributes.id.value, this.checked);

	if (this.attributes.id.value == "chkMaturidade" ||
		this.attributes.id.value == "chkVelocidades") {
		if (this.checked) {
			if (document.getElementById("chkDirty4x4").checked) document.getElementById("chkDirty4x4").click();

			if (this.attributes.id.value == "chkMaturidade" && document.getElementById("chkVelocidades").checked) document.getElementById("chkVelocidades").click();
			if (this.attributes.id.value == "chkVelocidades" && document.getElementById("chkMaturidade").checked) document.getElementById("chkMaturidade").click();

		}

		var routeLayer = Waze.map.getLayersBy("uniqueName", "__CamadaAvaliacaoWMEBrasil");
		if (routeLayer.length > 0) {
			routeLayer[0].removeAllFeatures();
		}
	}
	else {
		if (this.checked
			&&
				(
				this.attributes.id.value == "chkDirty4x4"
				)
			) {
			if (document.getElementById("chkVelocidades").checked) document.getElementById("chkVelocidades").click();
			if (document.getElementById("chkMaturidade").checked) document.getElementById("chkMaturidade").click();
		}
	}
}

function genericObterCheckboxPersistido(chkName) {
	if (localStorage.getItem(chkName) != null)
		document.getElementById(chkName).checked = localStorage.getItem(chkName) === "true";
}

function genericMontarHTML_Selecionados() {
	try {
		if (document.getElementById('pacotao-alternative-content') != null) {
			return;
		}

		var alternativeContent;
		var todosSelecionados = [];
		var segmentosSelecionados = [];

		if (W.selectionManager.getSelectedFeatures().length > 0) {
			for (i = 0; i < W.selectionManager.getSelectedFeatures().length; i++) {
				todosSelecionados.push(Waze.selectionManager.getSelectedFeatures()[i].geometry.id);
			}

			//Agora vamos ver se elas não tem nome mesmo. (se uma tiver, tiro a liberação do botão)
			for (i = 0; i < W.selectionManager.getSelectedFeatures().length; i++) {
				for (var seg in wazeModel.segments.objects) {
					var segmento = wazeModel.segments.objects[seg];

					if (segmento.geometry.id == W.selectionManager.getSelectedFeatures()[i].geometry.id) {
						segmentosSelecionados.push(segmento);
						break;
					}
				}
			}

			if (intervaloPainelNumeracao != 0) {
				window.clearInterval(intervaloPainelNumeracao);
			}

			if (segmentosSelecionados.length >= 1) {

				var userTabs = document.getElementById('edit-panel');
				var segmentBox = genericClassName('segment', userTabs)[0];
				var navTabs = genericClassName('nav nav-tabs', segmentBox)[0];

				var PacotaoTab = document.createElement('li');
				PacotaoTab.innerHTML = '<a href="#pacotao-alternative-content" data-toggle="tab" id="pacotaoalternativo-tab-link">WME Brasil</a>';
				navTabs.appendChild(PacotaoTab);

				var tabContent = genericClassName('tab-content', segmentBox)[0];

				alternativeContent = document.createElement('div');
				alternativeContent.id = 'pacotao-alternative-content';
				alternativeContent.className = 'tab-pane';
				tabContent.appendChild(alternativeContent);

				if (W.selectionManager.getSelectedFeatures().length == 2) {
					if (segmentosSelecionados.length == Waze.selectionManager.getSelectedFeatures().length
						&&
						(
							wazeModel.streets.objects[segmentosSelecionados[0].attributes.primaryStreetID].name == null
							&&
							wazeModel.streets.objects[segmentosSelecionados[1].attributes.primaryStreetID].name == null
						)
						&& funVia_TestarSegmentosAlinhados(segmentosSelecionados[0], segmentosSelecionados[1])
						) {
						alternativeContent.innerHTML += '<input type="button" id="btnSelecionarViasNome" value="Selecionar via sem nome - Apenas em linha reta"/><br/><br/>';
						document.getElementById('btnSelecionarViasNome').onclick = funVia_SelecionarSegmentosAlinhados;
					}
				}

				alternativeContent.innerHTML += '<input type="button" id="_btnApagarNumeros" value="Apagar todos números das casas" /><br/><br/>';
				alternativeContent.innerHTML += '<input type="number" min="0" value="0" size="4" style="width:50px;line-height:14px;height:22px;margin-bottom:4px;" id="numeroCasaMin"/> até ';
				alternativeContent.innerHTML += '<input type="number" min="0" value="0" size="4" style="width:50px;line-height:14px;height:22px;margin-bottom:4px;" id="numeroCasaMax"/><br/>';
				alternativeContent.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;">';

				alternativeContent.innerHTML += 'Nome alternativo único:<br/>';
				alternativeContent.innerHTML += '<input type="button" id="btnAplicarAlternativo" value="Incluir alternativo"/><br/><br/>';
				alternativeContent.innerHTML += '<input type="button" id="btnRevisarNomes" value="Revisar nomes"/><br/><br/>';
				alternativeContent.innerHTML += '<select id="selTrocarCidadeSelecionados" style="width:100px;line-height:25px;height:22px;margin-bottom:4px;"></select>';
				alternativeContent.innerHTML += '<input type="checkbox" id="chkMarcarSemCidade" /> Definir sem cidade.<br/>';
				alternativeContent.innerHTML += '<input type="button" id="btnTrocarCidadeSelecionados" value="Alterar cidade"/><br/>';

				if (segmentosSelecionados.length == 1) {
					alternativeContent.innerHTML += '<input type="button" id="btnPesquisar" value="Pesquisar segmento no forum"/><br/>';
					document.getElementById('btnPesquisar').onclick = funVia_PesquisarSegmentoForum;
				}
				else {
					alternativeContent.innerHTML += '<p id="PmensagemSelecionados">Se quiser pesquisar no forum, selecione APENAS UM segmento.</p><br/>';
				}

				alternativeContent.innerHTML += '<hr style="margin-top: 10px;margin-bottom:10px;" id="hrFinal">';

				genericMontarHTML_SelecionadosAtribuirBotoes();
			}
		}
	} catch (e) {
		genericLog(e);
	}
}

function genericMontarHTML_SelecionadosAtribuirBotoes() {
	window.setTimeout
	(
	function () {
		genericTraducoes();

		document.getElementById('_btnApagarNumeros').onclick = funVia_ApagarTodosNumeros;

		document.getElementById('selTrocarCidadeSelecionados').onfocus = function () {
			genericLoadDropDownCidades('selTrocarCidadeSelecionados');
			document.getElementById('chkMarcarSemCidade').checked = false;
		};
		document.getElementById('chkMarcarSemCidade').onclick = function () {
			document.getElementById('selTrocarCidadeSelecionados').options.length = 0;
		};
		document.getElementById('btnTrocarCidadeSelecionados').onclick = funVia_AplicarMudancaCidade;

		document.getElementById('btnAplicarAlternativo').onclick = funVia_AplicarNomeAlternativo;
		document.getElementById('btnRevisarNomes').onclick = funRevVia_IniciarFaxinaNew;

		//document.getElementById('btnEnviarComentario').onclick = funVia_EnviarComentario;

		intervaloPainelNumeracao = window.setInterval(
			function () {
				$('[class="overlay"]')[0].style.display = "none";
			}
		, 3000);
	}
	, 3000);
}

function genericTraducao(msg_id) {
	console.log("Obter mensagem:" + msg_id);

	for (var trad = 0; trad < traducoes.length; trad++) {
		if (traducoes[trad][traducoeColunas.posicao] == enuTipoSubstituicao.textoSimples
			&& traducoes[trad][traducoeColunas.id] == msg_id) {
			return traducoes[trad][traducoeColunas.Traducao];
		}
	}
}

function genericTraducoes() {
	if (traducoes.length > 90) //Server para evitar que se no ultimo load os texts foram pegos zuados, o mecanismos escreva coisas doidas.
	{
		for (var i = 0; i < traducoes.length; i++) {
			if (traducoes[i][traducoeColunas.posicao] != enuTipoSubstituicao.textoSimples) {
				var Componente = document.getElementById(traducoes[i][traducoeColunas.id]);
				var traducao = traducoes[i][traducoeColunas.Traducao];

				try {
					if (Componente != null && typeof (traducao) != 'undefined') {
						if (traducoes[i][traducoeColunas.posicao] == enuTipoSubstituicao.innerText) {
							Componente.innerText = traducao;
							//console.log("OK inner");
						}
						else if (traducoes[i][traducoeColunas.posicao] == enuTipoSubstituicao.value) {
							Componente.value = traducao;
							//console.log("OK value");
						}
						else if (traducoes[i][traducoeColunas.posicao] == enuTipoSubstituicao.previousSibling) {
							Componente.previousSibling.textContent = traducao;
							//console.log("OK prev");
						}
						else if (traducoes[i][traducoeColunas.posicao] == enuTipoSubstituicao.previousSibling2x) {
							Componente.previousSibling.previousSibling.textContent = traducao;
							//console.log("OK prev2");
						}
						else if (traducoes[i][traducoeColunas.posicao] == enuTipoSubstituicao.nextSibling) {
							Componente.nextSibling.textContent = traducao;
							//console.log("OK next");
						}
						else {
							console.log("Fail");
						}
					}
				} catch (e) {
					genericLog("Falha na tradução " + i + " " + Componente + "\n " + e);
				}
			}
		}
	}
}

//-----------------------------------------------------------------------------------------------------------
/*INICIO Funções genéricas*/
//-----------------------------------------------------------------------------------------------------------

function genericClassName(classname, node) {
	if (!node) node = document.getElementsByTagName("body")[0];
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i = 0, j = els.length; i < j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
	return a;
}

function genericgetByClass(classname, node) {
	if (!node) node = document.getElementsByTagName("body")[0];
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i = 0, j = els.length; i < j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
	return a;
}

function genericDesacentuaTexto(texto) {
	//Desacentuando.

	var regA = new RegExp("[À-Å]", "gi");
	var regE = new RegExp("[È-Ë]", "gi");
	var regI = new RegExp("[Ì-Ï]", "gi");
	var regO = new RegExp("[Ò-Ö]", "gi");
	var regU = new RegExp("[Ù-Ü]", "gi");

	var regC = new RegExp("[Ç]", "gi");
	var regN = new RegExp("[Ñ]", "gi");

	return texto.toUpperCase().replace(regA, "A").replace(regE, "E").replace(regI, "I").replace(regO, "O").replace(regU, "U").replace(regC, "C").replace(regN, "N");
}

/// <summary>
/// Verifica se um texto está contido no outro, desprezando acentos e maiúscula/minúscula.
/// </summary>
/// <param name="texto1"></param>
/// <param name="texto2"></param>
/// <returns>boolean</returns>
function genericCompararTextos(texto1, texto2) {
	texto1 = genericDesacentuaTexto(texto1);
	texto2 = genericDesacentuaTexto(texto2);

	return (texto1.indexOf(texto2) != -1 ||
	texto2.indexOf(texto1) != -1);
}

function genericLog(mensagem) {
	try {
		if (document.getElementById('chkDebugMode').checked) {
			var texto = genericTraducao('msg_Extreme');

			texto += mensagem.message;
			texto += '\n\n\n';
			texto += mensage.stack;

			alert(texto);

			window.open("https://www.waze.com/forum/user_message_redirect.php?username=ericdanieldavid", "_blank");
		}

		console.log(mensagem);
	}
	catch (e) {
		var msgX = genericTraducao('msg_ExtremeBad');
		alert( + mensagem + '\n\n' + e.message);
	}
}

function genericGetQueryString(link, name) {
	var pos = link.indexOf(name + '=') + name.length + 1;
	var len = link.substr(pos).indexOf('&');
	if (-1 == len) len = link.substr(pos).length;
	return link.substr(pos, len);
}

function genericSortList(x, y) {
	if (x[1] < y[1])
		return -1;

	if (x[1] > y[1])
		return 1;

	return 0;
}

//Chupinhada de WMETB_DispWarn
genericExibirMensagem = function (msg) {
	msg = "WME Latam Pack: " + msg;
	var obj = $('<div id="mylog">').append(msg).css('background-color', 'rgba(255, 150, 0, 0.6)');
    $('#WMETB_logger_warn').append(obj); obj.delay(300).slideUp({ duration: 3500, always: function () { obj.remove(); } });
};

//-----------------------------------------------------------------------------------------------------------
/*INICIO Assincronicidade*/
//-----------------------------------------------------------------------------------------------------------

/// <summary>
///
/// </summary>
/// <param name="selectorId"></param>
/// <param name="list">Array de array [0] = Id ; [1] = value</param>
/// <returns></returns>
function genericLoadDropDown(selectorId, list) {
	console.log(list);

	var selector = document.getElementById(selectorId);

	var currentId = null;
	if (selector.selectedIndex >= 0) {
		currentId = selector.options[selector.selectedIndex].value;
	}

	selector.options.length = 0;

	var usrOption = document.createElement('option');
	usrOption.setAttribute('value', 0);
	usrOption.appendChild(document.createTextNode(""));
	selector.appendChild(usrOption);

	//Reatribuo a lista ordenando pela descrição sempre.
	list = list.sort(genericSortList);

	//tiro as repetições.
	for (var i = list.length - 1; i > 0; i--) {
		if (list[i][1] == list[i - 1][1]) {
			list.splice(i, 1);
		}
	}

	for (i = 0; i < list.length; i++) {
		var usrOption = document.createElement('option');

		if (currentId !== null && list[i][0] == currentId) {
			usrOption.setAttribute('selected', true);
		}
		usrOption.setAttribute('value', list[i][0]);
		usrOption.appendChild(document.createTextNode(list[i][1]));
		selector.appendChild(usrOption);
	}
}

function genericLoadDropDownCidades(selectorId) {
	var lista = [];
	for (var objcit in wazeModel.cities.objects) {

		if (typeof (wazeModel.cities.objects[objcit].attributes.outOfScope) == "undefined" ||
			(typeof (wazeModel.cities.objects[objcit].attributes.outOfScope) != "undefined" && wazeModel.cities.objects[objcit].attributes.outOfScope == false)) {
			lista.push([wazeModel.cities.objects[objcit].attributes.id, wazeModel.cities.objects[objcit].attributes.name]);
		}
	}

	genericLoadDropDown(selectorId, lista);
}

function genericAssincCommand(comando, isSaveComand) {
	isSaveComand = isSaveComand || false; //parametro será preenchido se não passarem (preguiça de mudar o código)

	///comando   |  TimeoutID   |   FinishStatus    |   isSaveComand
	global_FilaInstrucaoAssincrona.push([comando, 0, false, isSaveComand]);
	localStorage.setItem("global_FilaInstrucaoAssincrona", global_FilaInstrucaoAssincrona);

	var idInstrucao = global_FilaInstrucaoAssincrona.length - 1;

	var qtddSaveAllow = 70;
	var qtddSaveComand = 0;

	for (var i = 0; i < global_FilaInstrucaoAssincrona.length; i++) {
		if (global_FilaInstrucaoAssincrona[i][3])       //isSaveComand
		{
			qtddSaveComand++;
		}
	}

	if (
			(qtddSaveComand < qtddSaveAllow)
		||
			(qtddSaveComand <= qtddSaveAllow && isSaveComand)
		) {
		genericAssincExecute(idInstrucao);
	}

	//Se isso é verdade, não devo executar as instruções agora. Elas estão em wait().... parametro [1] = 0, sem o timeOutID definido.

}

function genericAssincExecute(idInstrucao) {
	var temporizador = document.getElementById('inputExecAssync').value;
	var comando = global_FilaInstrucaoAssincrona[idInstrucao][0];

	var instrucaoFuncao = "                                                     \
		var timeOutID = window.setTimeout(function () {                         \
																				\
			console.log(\"Instrução " + idInstrucao + " - Started\");           "

			+
				comando
			+
			
			"genericAssincOK(" + idInstrucao + ");                               \
			console.log(\"Instrução " + idInstrucao + " - OK\");                \
																				\
		}, ((" + idInstrucao + " + 1) * " + (temporizador + 500) + "));         \
		return timeOutID;                   ";

	console.log(instrucaoFuncao);

	var funct = new Function(instrucaoFuncao);
	global_FilaInstrucaoAssincrona[idInstrucao][1] = funct.call();
}

function genericAssincStop() {
	console.log(global_FilaInstrucaoAssincrona);

	for (var i = 0; i < global_FilaInstrucaoAssincrona.length; i++) {
		globalThis.clearTimeout(global_FilaInstrucaoAssincrona[i][1]);
	}

	global_FilaInstrucaoAssincrona = [];
	console.log(global_FilaInstrucaoAssincrona);

	var tims = 1000;while (tims--){globalThis.clearTimeout(tims);}

	document.getElementById('btnIniciarRevisaoPlace').disabled = false;
	document.getElementById('btnPararRevisaoPlace').disabled = true;

	document.getElementById('btnIniciarRevisao').disabled = false;
	document.getElementById('btnPararRevisao').disabled = true;

	genericExibirMensagem("Revisão paralizada.");
}

function genericAssincRestart() {
	//pega a fila de instruções que ficou sem gerar timeout e manda vê.
	var qtddSave = document.getElementById('inputQtddSave').value;
	if (wazeModel.actionManager.unsavedActionsNum() == 0) {
		console.log('Retomando fila pendente.');

		//Até quantos saves deve fazer.
		var qtExecute = 70;

		for (var i = 0; i < global_FilaInstrucaoAssincrona.length; i++) {
			genericAssincExecute(i);

			//isSaveComand
			if (global_FilaInstrucaoAssincrona[i][3] == true) {
				qtExecute--;
			}

			if (qtExecute == -1) {
				break;
			}
		}

		console.log('Fila reprovisionada. ' + qtExecute + ' atualmente.');
	}

}

genericAssincBreak = function () {
	var paralizador = document.createElement('section');
	paralizador.id = 'paralizador';

	var painel = null;
	var textobotao = '';
	if (document.getElementsByClassName('segment').length > 0) {
		textobotao = '<input type="button" id="btnParalizarRevisao" value="' + genericTraducao('msg_ParalizarSegmento') + '" class="btn btn-default"/><br/>';
		paralizador.innerHTML += textobotao;
		painel = document.getElementsByClassName('segment')[0]; //Comando atual é de segmento.
	}

	if (document.getElementsByClassName('landmark').length > 0) {
		textobotao = '<input type="button" id="btnParalizarRevisao" value="' + genericTraducao('msg_ParalizarPlace') + '" class="btn btn-default"/><br/>';
		paralizador.innerHTML += textobotao;
		painel = document.getElementsByClassName('landmark')[0]; //Comando atual é de place (revisão de nome).
	}

	if (painel == null &&
		document.getElementsByClassName('place-update').length > 0) {

		for (var i = 0; i < document.getElementsByClassName('place-update').length; i++) {
			if (document.getElementsByClassName('place-update')[i].className == "place-update") {
				//Comando atual é de aprovação de place.
				painel = document.getElementsByClassName('place-update')[i];
				break;
			}
		}
		textobotao = '<input type="button" id="btnParalizarRevisao" value="' + genericTraducao('msg_ParalizarPlace') + '" class="btn btn-block btn-primary"/>';
		paralizador.className = "navigation";
		paralizador.innerHTML += textobotao;
	}

	console.log(textobotao);

	if ($('[class="' + painel.className + '"]').find('input[id="btnParalizarRevisao"]').length == 0) {
		painel.insertBefore(paralizador, painel.children[1]);
		document.getElementById('btnParalizarRevisao').onclick = genericAssincStop;
	}
}

genericAssincOK = function (idInstrucao) {
	global_FilaInstrucaoAssincrona[idInstrucao][2] = true;

	//Ultimo.
	if (idInstrucao == global_FilaInstrucaoAssincrona.length - 1) {
		var msg = genericTraducao('msg_AtualizacoesOK');
		genericExibirMensagem(msg);
		global_FilaInstrucaoAssincrona = [];

		var t = [];
		Waze.selectionManager.setSelectedModels(t);

		console.log('Alterações feitas com sucesso. Fim da fila assincrona.');
	}
	else {
		//Se ele não é o último, tem mais alguém pendente....
		if (global_FilaInstrucaoAssincrona[idInstrucao + 1][1] == 0) //o próximo é fila que ficou parada?
		{
			console.log("Instrução final, id" + idInstrucao);
			console.log(global_FilaInstrucaoAssincrona);

			console.log('OK! Fila andou e a ultima instrução já foi salva. Bora pro agito minha gente!!!!');
			global_FilaInstrucaoAssincrona = global_FilaInstrucaoAssincrona.slice(idInstrucao + 1);
			//global_FilaInstrucaoAssincrona.splice(0, idInstrucao + 1);

			console.log(global_FilaInstrucaoAssincrona);
		}
	}
}

//-----------------------------------------------------------------------------------------------------------
/*INICIO navegabilidade*/
//-----------------------------------------------------------------------------------------------------------
function funNav_InativarTodasTab() {

	var tabs = document.getElementById("sidepanel-mastersbrasil").children;

	//0 é um P vazio

	//1 são os botões de tab
	for	(var j =0; j<tabs[1].children.length; j++)
	{
		tabs[1].children[j].className = "";
	}

	for (var i = 2; i < tabs.length; i++) {
		tabs[i].style.display = 'none';
	}
}

function funNav_TabExibirFuncoes(grupo) {
	funNav_InativarTodasTab();
	funNav_AtivarTab(grupo);
	document.getElementById('aba' + grupo).style.display = 'block';
}

function funNav_AtivarTab(grupo) {
	console.log('ativando ' + grupo);
	var e = document.getElementById("_Wmelink" + grupo).parentElement;
	e.className = "active";
}

function funNav_InativarTab(grupo) {
	console.log('INativando ' + grupo);
	var e = document.getElementById("_Wmelink" + grupo).parentElement;
	e.className = "";
}

//-----------------------------------------------------------------------------------------------------------
/*INICIO funções de botões*/
//-----------------------------------------------------------------------------------------------------------
function funUR_ObterDados() {
	var dataCache =
	[
		'id',
		'type',
		'typeText',
		'description',
		'state',
		'driveDate',
		'resolvedOn',
		'updatedOn',
		'updatedBy',
		'comments'
	];

	for (var urobj in wazeModel.updateRequestSessions.objects) {
		var ureq = wazeModel.updateRequestSessions.objects[urobj];
		var murInfo = wazeModel.mapUpdateRequests.objects[urobj];

		var drive = new Date(); drive.setTime(murInfo.attributes.driveDate);
		var resolved = new Date(); resolved.setTime(murInfo.attributes.resolvedOn);
		var updated = new Date(); resolved.setTime(murInfo.attributes.updatedOn);

		var strMensagem = '';

		for (i = 0; i < ureq.comments.length; i++) {
			var updatedBy = ureq.comments[i].userID;

			var user = wazeModel.users.get(updatedBy);
			var nome = 'Wazer(reportante)';
			if (updatedBy != -1) {
				if (user != null) {
					nome = user.userName;
				}
			}

			strMensagem += nome + ': ' + ureq.comments[i].text;
		}

		var resolvedBy = murInfo.attributes.updatedBy;
		var nomeResolvedBy = '';
		if (resolvedBy != -1) {
			if (wazeModel.users.get(resolvedBy) != null) {
				nomeResolvedBy = wazeModel.users.get(resolvedBy).userName;
			}
		}

		var descricao = murInfo.attributes.description;

		if (descricao != null && descricao != '') {
			descricao = descricao.replace(',', '_').replace(new RegExp(String.fromCharCode(10), 'g'), '');
		}

		dataCache.push('\n' +
			murInfo.attributes.id,
			murInfo.attributes.type,
			murInfo.attributes.typeText,
			descricao,
			murInfo.getState(),
			drive.toDateString(),
			resolved.toDateString(),
			updated.toDateString(),
			nomeResolvedBy,
			strMensagem.replace(',', '_').replace(new RegExp(String.fromCharCode(10), 'g'), '')
		);

		$('#dadosURs').each(function () {
			this.href = 'data:text/csv;base64,' + btoa(dataCache);
			this.download = 'URs.csv';
		});
	}
}

function funUR_SeguirTodasVisiveis(resp) {

	var msgConfirmacao = genericTraducao('msg_ConfirmacaoUR');

	if (confirm(msgConfirmacao)) {
		var contagemSeguindo = 0;
		for (var urobj in wazeModel.updateRequestSessions.objects) {
			var ureq = wazeModel.updateRequestSessions.objects[urobj];

			for (var murobj in wazeModel.mapUpdateRequests.objects) {
				var murInfo = wazeModel.mapUpdateRequests.objects[murobj];

				if (murInfo.attributes.id == ureq.id) {
					if (Waze.map.getExtent().toGeometry().containsPoint(murInfo.geometry)) {
						ureq.setFollowing(resp);
						contagemSeguindo++;
					}
					break;
				}
			}
		}

		(resp==true?msgConfirmacao = genericTraducao('msg_SeguindoAgora'):msgConfirmacao = 'Deixou de seguir '); //Sem acesso a planilha de tradução; não consigo colocar a genericTraducao pra brincar =( (biuick84)
		genericExibirMensagem(msgConfirmacao + contagemSeguindo + ' URs');
	}
}

function funUR_IniciarComunicacao() {

	try {
		var cont = 0;
		var diasAberturaMsgInicial = document.getElementById('_inputDiasMensagemInicial').value;
		var seguirAposEnvio = document.getElementById('chkSeguirInicial').checked;

		for (var urobj in wazeModel.updateRequestSessions.objects) {
			var ureq = wazeModel.updateRequestSessions.objects[urobj];
			if (ureq.comments.length == 0 && ureq.open == true) {
				for (var murobj in wazeModel.mapUpdateRequests.objects) {
					var murInfo = wazeModel.mapUpdateRequests.objects[murobj];
					var dateNow = new Date();
					var diasAbertura = Math.floor((dateNow.getTime() - murInfo.attributes.driveDate) / 86400000);

					if (murInfo.attributes.id == ureq.id) {
						if (
								(murInfo.attributes.description == null || murInfo.attributes.description == '')
								&&
								diasAbertura >= diasAberturaMsgInicial
								&&
								Waze.map.getExtent().toGeometry().containsPoint(murInfo.geometry)
							) {
							var textoAbertura = document.getElementById('_txtAberturaUR').value;
							if (textoAbertura == '') {
								textoAbertura = genericTraducao('msg_PadraoAberturaUR');
							}

							ureq.addComment(textoAbertura);
							ureq.setFollowing(seguirAposEnvio);
							cont = cont + 1;
							break;
						}
					}
				}
			}
		}

		genericExibirMensagem(genericTraducao('msg_ConfirmacaoContatoUR') + cont + ' URs.');
	} catch (e) {
		genericLog(e);
	}
}

function funUR_Encerramento() {
	try {
		var diasConfAbertura = document.getElementById('_inputDiasAberturaUR').value;
		var diasConfComentario = document.getElementById('_inputDiasComentarioUR').value;

		var userChamp = champsBrazil.indexOf(W.loginManager.user.userName) != -1;
		
		var qtdeFechada = 0;

		if ((diasConfAbertura < 7 ||
			diasConfComentario < 3) && !userChamp) {
			genericExibirMensagem(genericTraducao('msg_ParametrosFecharUR'));
			return;
		}

		for (var urobj in wazeModel.updateRequestSessions.objects) {
			var ureq = wazeModel.updateRequestSessions.objects[urobj];
			if (ureq.comments.length > 0 && ureq.open == true) {
				var dateNow = new Date();
				var diasComentario = Math.floor((dateNow.getTime() - ureq.comments.slice(-1)[0].createdOn) / 86400000);

				if (diasComentario >= diasConfComentario) {
					if (ureq.comments.slice(-1)[0].userID != -1
					&& ureq.comments.slice(-1)[0].text.toUpperCase().indexOf('ENCERRAR') == -1
					&& ureq.comments.slice(-1)[0].text.toUpperCase().indexOf('FECHAR') == -1
					&& ureq.comments.slice(-1)[0].text.toUpperCase().indexOf('FINALIZAR') == -1
					&& ureq.comments.slice(-1)[0].text.toUpperCase().indexOf('FECHE') == -1
					&& ureq.comments.slice(-1)[0].text.toUpperCase().indexOf('ENCERRE') == -1
						)//Não foi o reportante o ultimo, não tem as palavras chaves no último comentário
					{
						for (var murobj in wazeModel.mapUpdateRequests.objects) {
							var murInfo = wazeModel.mapUpdateRequests.objects[murobj];
							var diasAbertura = Math.floor((dateNow.getTime() - murInfo.attributes.driveDate) / 86400000);

							if (murInfo.attributes.id == ureq.id) {
								if (diasAbertura >= diasConfAbertura
									&& murInfo.attributes.permissions != 0) //Só onde realmente tem permissão.
								{
									var fechamento = false;
									var ultimato = false;

									//Hora de brincar e analisar o histórico.
									if (document.getElementById('chkOferecerAjuda').checked) {
										if (ureq.comments.length != 1) {
											var FoiCobradoAgora = funUR_CobrarEditorSolucaoPendente(ureq);
											if (FoiCobradoAgora) {
												continue;
											}
										}
										else {
											ultimato = true;
										}
									}
									else {
										if (ureq.comments.length != 1) {
											continue;
										}
									}

									//Final análise.

									if (document.getElementById('chkFecharApenasVisiveis').checked == false) {
										fechamento = true;
									}

									if (document.getElementById('chkFecharApenasVisiveis').checked == true
										&& Waze.map.getExtent().toGeometry().containsPoint(murInfo.geometry)
									) {
										fechamento = true;
									}


									if (fechamento == true) {
										var textFechamento = document.getElementById('_txtFechamentoUR').value;
										if (textFechamento == '') {
											textFechamento = 'Wazer, ';

											if (ultimato) {
												textFechamento += genericTraducao('msg_UltimatoUsuario');
											}

											textFechamento += genericTraducao('msg_Fechamento');
										}

										ureq.addComment(textFechamento);
										ureq.setFollowing(false);

										console.log('Fechando');
										console.log(ureq);

										var instrucaoFechamento = "";
										instrucaoFechamento = "$('div[data-id=" + murInfo.attributes.id + "]').click();";
										genericAssincCommand(instrucaoFechamento, false);

										instrucaoFechamento = "$('label[for^=\"state-not-identified\"]').click();";
										genericAssincCommand(instrucaoFechamento, true);

										instrucaoFechamento = "$('button[class=\"btn btn-primary done\"]').click();";
										genericAssincCommand(instrucaoFechamento, false);
										qtdeFechada++;
										break;
									}
								}
							}
						}
					}
					else {
						if (ureq.comments.slice(-1)[0].userID == -1
							&& diasComentario >= diasConfAbertura
							&& document.getElementById('chkOferecerAjuda').checked
							) {
							var FoiCobrado = funUR_CobrarEditorSolucaoPendente(ureq);
							if (FoiCobrado) {
								continue;
							}
						}
					}
				}
			}
		}
		
		if (qtdeFechada <= 0)
			genericExibirMensagem('Nada a encerrar'); //Sem acesso a planilha de tradução; não consigo colocar a genericTraducao pra brincar =( (biuick84)
	} catch (e) {
		genericLog(e);
	}
}

function funUR_EncerramentoMP() {
	try {
		for (var problemaID in wazeModel.problems.objects) {
			var problema = wazeModel.problems.objects[problemaID];

			if (Waze.map.getExtent().toGeometry().containsPoint(problema.geometry)) {

				var instrucao = "$('div[data-id=\"" + problema.attributes.id + "\"]').click();";
				genericAssincCommand(instrucao, false);

				instrucao = "$('label[for=\"state-solved\"]').click();";
				genericAssincCommand(instrucao, true);
			}

		}
	} catch (e) {
		genericLog(e);
	}
}

function funUR_EnviarComentario() {

	try {
		var cont = 0;

		for (var urobj in wazeModel.updateRequestSessions.objects) {
			var ureq = wazeModel.updateRequestSessions.objects[urobj];
			if (ureq.open == true) {
				for (var murobj in wazeModel.mapUpdateRequests.objects) {
					var murInfo = wazeModel.mapUpdateRequests.objects[murobj];

					if (murInfo.attributes.id == ureq.id) {
						if (Waze.map.getExtent().toGeometry().containsPoint(murInfo.geometry)) {

							if ($('div[data-id="' + ureq.id + '"]')[0].style.visibility == "visible")
							{
								var textoAbertura = document.getElementById('txtComentario').value;

								if (ureq.comments.length != 0) {
									if (ureq.comments.slice(-1)[0].text == textoAbertura) {
										break;
									}
								}

								if (textoAbertura != "") {
									ureq.addComment(textoAbertura);
									console.log(ureq);
									cont = cont + 1;
									break;
								}
							}
						}
					}
				}
			}
		}

		genericExibirMensagem(genericTraducao('msg_ComentarioUR') + cont + ' URs.');
	} catch (e) {
		genericLog(e);
	}
}

/// <summary>
///
/// </summary>
/// <param name="ureq">objeto do tipo updateRequestSessions</param>
/// <returns></returns>
function funUR_CobrarEditorSolucaoPendente(ureq) {
	if (ureq.comments.slice(-1)[0].text.indexOf('inatividade') == -1) {
		//Obter os editores que comentaram.

		var strMensagem = '';

		var distId = [];
		for (i = 0; i < ureq.comments.length; i++) {
			var updatedBy = ureq.comments[i].userID;
			if (updatedBy != -1
				&& updatedBy != wazeModel.loginManager.user.id
				) {
				if (distId.indexOf(updatedBy) == -1) {
					var user = wazeModel.users.get(updatedBy);

					console.log(ureq);

					strMensagem += user.userName + ', ';

					distId.push(updatedBy);
				}

				if (updatedBy == 46379388 && wazeModel.loginManager.user.id == 12739915) {
					//ericdanieldavid não cobra mais o OlavoAG.
					return true;
				}
			}
		}
		strMensagem += genericTraducao('msg_CobrandoEditor');

		//Varer o array e tirar o próprio usuário. Se for só eu, mata!
		if (distId.length > 0) {
			ureq.addComment(strMensagem);
			return true;
		}
	}

	return false;
}

function funUR_ResolverVisiveis() {
	var requestsResolver = new Array();
	for (var urobj in wazeModel.updateRequestSessions.objects) {
		var ureq = wazeModel.updateRequestSessions.objects[urobj];

        if (
            ureq.open == true
            &&
            (ureq.comments.length == 0 || document.getElementById('chkResolverModoBruto').checked)

        )
        {
			for (var murobj in wazeModel.mapUpdateRequests.objects) {
				var murInfo = wazeModel.mapUpdateRequests.objects[murobj];

				if (murInfo.attributes.id == ureq.id) {
                    if (Waze.map.getExtent().toGeometry().containsPoint(murInfo.geometry)
                        && $('div[data-id="' + ureq.id + '"]')[0].style.visibility == "visible"
                    ) {
						requestsResolver.push(murInfo);
					}
					break;
				}
			}
		}
	}

	console.log(requestsResolver);

	//primeiro conta, se der confirma ai sim marca como resolvido.
	if (requestsResolver.length > 0) {
		if (confirm(requestsResolver.length + genericTraducao('msg_ResolverTudoConfirma'))) {
			var index;
			for (index = 0; index < requestsResolver.length; ++index) {
				var instrucaoFechar = "";

				instrucaoFechar = "$('div[data-id=" + requestsResolver[index].attributes.id + "]').click();";
				genericAssincCommand(instrucaoFechar, false);

				if (document.getElementById('chkResolverOK').checked)
				{
					instrucaoFechar = "$('label[for^=\"state-solved\"]').click();";
				}
				else
				{
					instrucaoFechar = "$('label[for^=\"state-not-identified\"]').click();";
				}

				genericAssincCommand(instrucaoFechar, true);

				instrucaoFechar = "$('button[class=\"btn btn-primary done\"]').click();";
				genericAssincCommand(instrucaoFechar, false);
			}
		}
	}
	else {
		genericExibirMensagem(genericTraducao('msg_NadaResolver'));
	}
}

function funUR_LocalizarSolucionadores() {
	var selectUser = document.getElementById('selFanfarrao');
	var numUsers = wazeModel.users.objects.length;

	var currentId = null;
	if (selectUser.selectedIndex >= 0) {
		currentId = selectUser.options[selectUser.selectedIndex].value;
	}

	var editorIds = new Array();
	var distId = new Array();

	for (var urobj in wazeModel.updateRequestSessions.objects) {
		var ureq = wazeModel.updateRequestSessions.objects[urobj];

		for (var murobj in wazeModel.mapUpdateRequests.objects) {
			var murInfo = wazeModel.mapUpdateRequests.objects[murobj];
			if (murInfo.attributes.id == ureq.id) {
				if (murInfo.attributes.resolvedBy != null) {
					var resolvedBy = murInfo.attributes.resolvedBy;
					if (distId.indexOf(resolvedBy) == -1) {
						var user = wazeModel.users.get(resolvedBy);
						var usrRank = user.normalizedLevel;

						var tmpAry = new Array();
						tmpAry.push(user.userName + ' (' + usrRank + ')');
						tmpAry.push(resolvedBy);

						editorIds.push(tmpAry);
						distId.push(resolvedBy);
					}
				}
				break;
			}
		}
	}

	selectUser.options.length = 0;

	for (var i = 0; i < editorIds.length; i++) {
		var usrOption = document.createElement('option');

		if (currentId !== null && editorIds[i][1] == currentId) {
			usrOption.setAttribute('selected', true);
		}
		usrOption.setAttribute('value', editorIds[i][1]);
		usrOption.appendChild(document.createTextNode(editorIds[i][0]));
		selectUser.appendChild(usrOption);
	}
}

function funUR_ContarFechadasUsuario() {
	var count = 0;
	for (var urobj in wazeModel.updateRequestSessions.objects) {
		var ureq = wazeModel.updateRequestSessions.objects[urobj];

		for (var murobj in wazeModel.mapUpdateRequests.objects) {
			var murInfo = wazeModel.mapUpdateRequests.objects[murobj];
			if (murInfo.attributes.id == ureq.id) {
				if (murInfo.attributes.resolvedBy == document.getElementById('selFanfarrao').value) {
					count++;
				}
				break;
			}
		}
	}

	alert(wazeModel.users.get(document.getElementById('selFanfarrao').value).userName + ' ----> ' + count + ' URs.');
}

//-----------------------------------------------------------------------------------------------------------
/// <summary>
///
/// </summary>
/// <param name="tipoCorrecao">enum ['Reverse', 'Permissao', 'Liberacao'] - tipo de correção a realizar</param>
/// <param name="uturn">boolean - se deve ou não corrigir U-Turn também</param>
/// <returns></returns>
function funVia_CorretorDeNo(tipoCorrecao) {
	var ModoBruto = false;
	var inicioExecucao = Date.now();

	var msgLenta = genericTraducao('msg_CorrecaoNoLenta');

	for (var node in wazeModel.nodes.objects) {
		if (inicioExecucao + 15000 < Date.now()) {
			if (confirm(msgLenta)) {
				inicioExecucao = Date.now();
			}
			else {
				break;
			}
		}

		var nozinho = wazeModel.nodes.objects[node];

		if (tipoCorrecao == 'Permissao') {
			try {
				if (Waze.map.getExtent().toGeometry().containsPoint(nozinho.geometry)) {

					var s = wazeModel.getTurnGraph();

					if (nozinho.attributes.segIDs.length > 1 &&
						nozinho.areConnectionsEditable()) {
						if (!nozinho.areAllConnectionsEnabled()) {
							var instrucao = "                               \
							var t = [];                                     \
							t.push(wazeModel.nodes.objects["+ node + "]);   \
							Waze.selectionManager.setSelectedModels(t);";
							genericAssincCommand(instrucao, false);

							instrucao = "$('[class=\"allow-connections btn btn-default\"]')[0].click();";
							genericAssincCommand(instrucao, true);
						}
					}
				}
			}
			catch (err) { }
		}

		if (tipoCorrecao == 'Liberacao') {
			try {
				if (Waze.map.getExtent().toGeometry().containsPoint(nozinho.geometry)
					&& nozinho.areAllConnectionsDisabled()) {
					var instrucao = "                               \
							var t = [];                                     \
							t.push(wazeModel.nodes.objects["+ node + "]);   \
							Waze.selectionManager.setSelectedModels(t);";
					genericAssincCommand(instrucao, false);

					instrucao = "$('[class=\"allow-connections btn btn-default\"]')[0].click();";
					genericAssincCommand(instrucao, true);
				}
			}
			catch (err) { }
		}

		if (wazeModel.actionManager.unsavedActionsNum() > 150) {
			if (ModoBruto == false &&
			confirm(genericTraducao('msg_CorrecaoPesada'))) {
				break;
			}
			else {
				ModoBruto = true;
			}
		}
	}
}

function funVia_TestarAcessos() {

	try {
		var tipoAcesso;
		if (document.getElementById('chkViaIn').checked && document.getElementById('chkViaOut').checked) {
			tipoAcesso = 'InOut';
		}
		else if (document.getElementById('chkViaIn').checked) {
			tipoAcesso = 'In';
		}
		else if (document.getElementById('chkViaOut').checked) {
			tipoAcesso = 'Out';
		}
		else {
			genericExibirMensagem(genericTraducao('msg_TipoTesteAcesso'));
			return;
		}

		seg_idAcessosTravados = [];
		var segmentosTestados = [];

		for (var node in wazeModel.nodes.objects) {
			if (wazeModel.nodes.objects[node].attributes.segIDs.length > 1) //Se só tem 1, é rua sem saída.
			{
				if (Waze.map.getExtent().toGeometry().containsPoint(wazeModel.nodes.objects[node].geometry)) {
					for (i = 0; i < wazeModel.nodes.objects[node].attributes.segIDs.length; i++) {
						var segIDTeste = wazeModel.nodes.objects[node].attributes.segIDs[i];
						if (segmentosTestados.indexOf(segIDTeste) == -1) {
							console.log('Testando segmento ' + segIDTeste);
							segmentosTestados.push(segIDTeste);

							var segmento = wazeModel.segments.objects[segIDTeste];
							var outroNo = (segmento.attributes.fromNodeID != node ? segmento.attributes.fromNodeID : segmento.attributes.toNodeID);

							if (!funVia_TestarAcessosNo(wazeModel.segments.objects[segIDTeste], wazeModel.nodes.objects[node], tipoAcesso)
								&&
								!funVia_TestarAcessosNo(wazeModel.segments.objects[segIDTeste], wazeModel.nodes.objects[outroNo], tipoAcesso)
							) {
								seg_idAcessosTravados.push(segIDTeste);
							}
						}
					}
				}
			}
		}

		var t = [];
		seg_idAcessosTravados.forEach(
			function (entry) {
				t.push(wazeModel.segments.objects[entry]);
			}
		);

		if (t.length > 0) {
			Waze.selectionManager.setSelectedModels(t);
			genericExibirMensagem(t.length + genericTraducao('msg_TesteAcessoProblema') + '<br/>' +
				(tipoAcesso == 'In' ? genericTraducao('msg_TesteAcessoProblemaIn') : (tipoAcesso == 'Out' ? genericTraducao('msg_TesteAcessoProblemaOut') : genericTraducao('msg_TesteAcessoProblemaInOut')))
			);
		}
		else {
			genericExibirMensagem(genericTraducao('msg_TesteAcessoNoProblem'));
		}
	} catch (e) {
		genericLog(e);
	}
}

function funVia_ProtegerMapa() {
	for (var segId in wazeModel.segments.objects) {
		var segmento = wazeModel.segments.objects[segId];

		if (funRevVia_VerificarSegmentoVisivel(segmento)) {

			if (segmento.attributes.lockRank != null
				&&
				(segmento.attributes.lockRank < segmento.attributes.rank
				||
					(
						segmento.attributes.lockRank == segmento.attributes.rank &&
						document.getElementById('chkProtegerTotal').checked
					)
				)

				) {
				var instrucao = "                                       \
					var segmento = wazeModel.segments.objects["+ segId + "];   \
																			\
					var t = new Array();                                    \
					t.push(segmento);                                       \
					Waze.selectionManager.setSelectedModels(t);                        \
					genericAssincBreak();";

				genericAssincCommand(instrucao, false);

				instrucao = "$('[id=\"unpavedCheckbox\"]').click();     \
							document.getElementById(\"unpavedCheckbox\").checked = false;";
				genericAssincCommand(instrucao, false);

				instrucao = "\
				wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].oldAttributes = { lockRank: " + segmento.attributes.lockRank + " };    \
				wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].newAttributes = { lockRank: null };                                    \
				$('[name=\"lockRank\"]')[0].value = null;";
				console.log(instrucao);
				genericAssincCommand(instrucao, true);
			}
		}
	}
}

/// <summary>
///
/// </summary>
/// <param name="segmento">Segmento que é base para teste</param>
/// <param name="no">nó principal de teste</param>
/// <param name="tipoAcesso">enum ['In','Out','InOut']</param>
/// <returns>boolean (true está OK, false está cagado)</returns>
function funVia_TestarAcessosNo(segmento, no, tipoAcesso) {
	if (no.areAllConnectionsDisabled()) {
		return false;
	}

	//Se qualquer conversão é permitida, pára de testar e dá return TRUE
	var segmentosTestar = no.attributes.segIDs.clone();
	var index = segmentosTestar.indexOf(segmento.attributes.id);

	if (index > -1) {
		segmentosTestar.splice(index, 1);
	}

	if (segmentosTestar.length > 0) {
		for (j = 0; j < segmentosTestar.length; j++) {
			var SegTeste = segmentosTestar[j];

			var liberadoIn = false;
			if (tipoAcesso == 'In' || tipoAcesso == 'InOut') {
				if
				(
					(!segmento.attributes.fwdDirection || !segmento.attributes.revDirection)
					&&
					(
					//Aqui só sai nunca entra
						(segmento.attributes.fwdDirection && segmento.attributes.toNodeID == no.attributes.id)
						||
						(segmento.attributes.revDirection && segmento.attributes.fromNodeID == no.attributes.id)
					)
				) {
					console.log('mão única inversa a este nó');
					liberadoIn = true;
				}
				else {
					liberadoIn = wazeModel.segments.objects[SegTeste].isTurnAllowed(segmento, no); //do primeiro pro segundo, nesse nó.
				}
			}

			var liberadoOut = false;
			if (tipoAcesso == 'Out' || tipoAcesso == 'InOut') {
				if (
					(!segmento.attributes.fwdDirection || !segmento.attributes.revDirection)
					&&
					(
					//Aqui só entra não se sai.
						(segmento.attributes.fwdDirection && segmento.attributes.toNodeID == no.attributes.id)
						||
						(segmento.attributes.revDirection && segmento.attributes.fromNodeID == no.attributes.id)
					)
				) {
					console.log('mão única inversa a este nó');
					liberadoOut = true;
				}
				else {
					liberadoOut = segmento.isTurnAllowed(wazeModel.segments.objects[SegTeste], no); //do primeiro pro segundo, nesse nó.
				}
			}

			if (
				(tipoAcesso == 'In' && liberadoIn) ||
				(tipoAcesso == 'Out' && liberadoOut) ||
				(tipoAcesso == 'InOut' && (liberadoIn || liberadoOut))
				) {
				return true; //Achou 1 permitido, tá limpo!
			}
		}

		return false;
	}

	return true;
}

function funVia_ApagarTodosNumeros() {
	try {
		if ($('[class="olLayerDiv house-numbers-layer"]').length == 0) {
			genericExibirMensagem(genericTraducao('msg_ApagarAbrirPainel'));
			return;
		}

		var qtddNumeros = $("div[class=number-preview]").length;
		console.log('Encontrados ' + qtddNumeros + ' números de casas. Vamos a destruição!');

		var intervaloMenor = parseInt(document.getElementById('numeroCasaMin').value);
		var intervaloMaior = parseInt(document.getElementById('numeroCasaMax').value);

		for (var i = qtddNumeros - 1; i >= 0; i--) {

			var numero = $("div[class=number-preview]")[i];
			var numeroAtual = numero.innerHTML;

			if (intervaloMenor <= intervaloMaior) {
				if (
					(numeroAtual >= intervaloMenor &&
					numeroAtual <= intervaloMaior)
					||
					(intervaloMenor == 0 &&
					intervaloMaior == 0)
					) {
					numero.click();
					numero.parentElement.getElementsByClassName("delete-button")[0].click();
				}
				else {
					console.log('Ignorado ' + numeroAtual);
				}
			}
			else {
				genericExibirMensagem("Intervalo inválido!");
			}
		}
	} catch (e) {
		genericLog(e);
	}
}

function funVia_AplicarNomeAlternativo() {
	var NomeAlternativo = window.prompt(genericTraducao('msg_confirmAlternativo'));
	console.log(NomeAlternativo);

	var todosSelecionados = [];
	for (i = 0; i < Waze.selectionManager.getSelectedFeatures().length; i++) {
		todosSelecionados.push(Waze.selectionManager.getSelectedFeatures()[i].geometry.id);
	}

	console.log("Selecionados " + todosSelecionados.length + " segmentos para aplicação de alternativo único.");

	for (var i = 0; i < todosSelecionados.length; i++) {

		var instrucao = "                                       \
		var geometryID = "+ todosSelecionados[i] + ";            \
		var segmentoAlternar;                                   \
																\
		for (var seg in wazeModel.segments.objects) {           \
			var segmento = wazeModel.segments.objects[seg];     \
																\
			if (segmento.geometry.id == geometryID) {           \
				segmentoAlternar = segmento;                    \
				break;                                          \
			}                                                   \
		}                                                       \
																\
		var t = new Array();                                    \
		t.push(segmentoAlternar);                               \
		Waze.selectionManager.setSelectedModels(t);                        \
		$('a[class=\"address-edit-input primary-street\"]').click();";
		genericAssincCommand(instrucao);

		instrucao = "$('a[class=\"add-alt-street-btn\"]').click();";
		genericAssincCommand(instrucao);

		instrucao = "$('tr[class=\"alt-street-form-template new-alt-street\"]').find('input[name=\"streetName\"]').attr(\"value\", \"" + NomeAlternativo + "\");";
		genericAssincCommand(instrucao);

		instrucao = "$('div[class=\"action-buttons\"]').find('button[class=\"save-button waze-btn waze-btn-blue waze-btn-smaller\"]').click();";
		genericAssincCommand(instrucao);

	}
}

function genericGerarIframe(timeout, id, sourceLink) {
	window.setTimeout(
		function () {
			var ifra = document.createElement('iframe');
			ifra.id = 'ifra' + id;
			ifra.style = "width:2px;height:2px";
			ifra.src = sourceLink;

			document.getElementById('rodapezinho').appendChild(ifra);

			window.setTimeout(function () { console.log('Limpando ' + ifra); ifra.src = ""; }, 5000);
		}
	, timeout * 700);

	console.log(sourceLink);
}

function funVia_PesquisarSegmentoForum() {
	var todosSelecionados = [];
	for (i = 0; i < Waze.selectionManager.getSelectedFeatures().length; i++) {
		todosSelecionados.push(Waze.selectionManager.getSelectedFeatures()[i].geometry.id);
	}

	for (var i = 0; i < todosSelecionados.length; i++) {
		var segmentoPesquisar;
		for (var seg in wazeModel.segments.objects) {
			var segmento = wazeModel.segments.objects[seg];

			if (segmento.geometry.id == todosSelecionados[i]) {
				segmentoPesquisar = segmento.attributes.id;
				break;
			}
		}
	}

	var mapsUrl = 'https://www.waze.com/forum/search.php?keywords=' + segmentoPesquisar + '&terms=all&author=&sv=0&sc=1&sf=all&sr=posts&sk=t&sd=d&st=0&ch=300&t=0&submit=Search';
	window.open(mapsUrl, '_blank');
}

function funVia_AplicarMudancaCidade() {
	var todosSelecionados = [];
	for (i = 0; i < Waze.selectionManager.getSelectedFeatures().length; i++) {
		todosSelecionados.push(Waze.selectionManager.getSelectedFeatures()[i].geometry.id);
	}

	if (todosSelecionados.length > 0) {
		var seg_NomeCidadeEscolhida_MudancaCidade;
		var seg_IdEstadoCidadeEscolhida_MudancaCidade;
		var semCidade = false;

		if (!document.getElementById('chkMarcarSemCidade').checked) {
			for (var cit in wazeModel.cities.objects) {
				if (document.getElementById('selTrocarCidadeSelecionados').value == wazeModel.cities.objects[cit].attributes.id) {
					seg_NomeCidadeEscolhida_MudancaCidade = wazeModel.cities.objects[cit].attributes.name;
					seg_IdEstadoCidadeEscolhida_MudancaCidade = wazeModel.cities.objects[cit].attributes.stateID;

					break;
				}
			}
		}
		else {
			semCidade = true;
		}

		for (var i = 0; i < todosSelecionados.length; i++) {

			var segmentoAlternar;
			for (var seg in wazeModel.segments.objects) {
				var segmento = wazeModel.segments.objects[seg];

				if (segmento.geometry.id == todosSelecionados[i]) {
					segmentoAlternar = segmento.attributes.id;
					break;
				}
			}

			var comando = "                                                                 \
			var segmentoAlternar = wazeModel.segments.objects["+ segmentoAlternar + "];     \
			var t = [];                                                                     \
			t.push(segmentoAlternar);                                                       \
			Waze.selectionManager.setSelectedModels(t);"
			genericAssincCommand(comando);

			comando = "$('a[class=\"address-edit-input primary-street\"]').click();";
			genericAssincCommand(comando);

			if (semCidade) {
				comando = "$('input[name=\"emptyCity\"]').click();";
			}
			else {
				comando = "$('[name=stateID]').val(\"" + seg_IdEstadoCidadeEscolhida_MudancaCidade + "\");          \
				$('input[name=\"cityName\"]').attr(\"value\", \"" + seg_NomeCidadeEscolhida_MudancaCidade + "\");";
			}
			genericAssincCommand(comando);

			comando = "$('div[class=\"action-buttons\"]').find('button[class=\"save-button waze-btn waze-btn-blue waze-btn-smaller\"]').click();";
			genericAssincCommand(comando);

		}
	}
}

function funVia_SinalizarVariacaoVelocidades() {
	if (document.getElementById('chkVelocidades').checked) {

		console.log('Avaliando velocidades...');

		var WM = Waze.map;

		var rlayers = WM.getLayersBy("uniqueName", "__CamadaAvaliacaoWMEBrasil");
		if (rlayers.length == 0) {
			var drc_style1 = new OL.Style({
				strokeDashstyle: 'solid',
				strokeColor: "${strokeColor}",
				strokeOpacity: 1.0,
				strokeWidth: "${strokeWidth}",
				fillColor: '#0040FF',
				fillOpacity: 1.0,
				pointRadius: "${pointRadius}",
				label: "${labelText}",
				fontFamily: "Tahoma, Courier New",
				labelOutlineColor: "${labelOutlineColor}",
				labelOutlineWidth: "${labelOutlineWidth}",
				fontColor: "${fontColor}",
				fontOpacity: 1.0,
				fontSize: "${fontSize}",
				display: 'block'
			});

			var drc_mapLayer1 = new OL.Layer.Vector("Velocidades Máximas", {
				displayInLayerSwitcher: true,
				uniqueName: "__CamadaAvaliacaoWMEBrasil",
				styleMap: new OL.StyleMap(drc_style1)
			});

			drc_mapLayer1.setVisibility(true);

			WM.addLayer(drc_mapLayer1);
		}

		var routeLayer = WM.getLayersBy("uniqueName", "__CamadaAvaliacaoWMEBrasil")[0];
		routeLayer.removeAllFeatures();

		var labelFeatures = [];

		for (var seg in wazeModel.segments.objects) {

			var Avaliacao = funVia_AvaliarVelocidade(seg);

			if (Avaliacao != '') {

				var segmento = wazeModel.segments.objects[seg];

				var segText = (segmento.attributes.fwdDirection ? 'AB: ' + segmento.attributes.fwdMaxSpeed : '') +
								(segmento.attributes.fwdDirection && segmento.attributes.revDirection ? ' / ' : '') +
								(segmento.attributes.revDirection ? 'BA: ' + segmento.attributes.revMaxSpeed : '');

				var label = new OpenLayers.Feature.Vector(segmento.getCenter(), {
					labelText: segText,
					fontColor: '#ffffff',
					fontSize: "13px",
					pointRadius: 0,
					labelOutlineWidth: 6,
					labelOutlineColor: Avaliacao
				});
				labelFeatures.push(label);
			}

		}
		if (labelFeatures.length > 0) {
			routeLayer.addFeatures(labelFeatures);
		}
	}
}

function funVia_SinalizarMaturidade() {
	if (document.getElementById('chkMaturidade').checked) {

		console.log('Avaliando maturidade...');

		var WM = Waze.map;

		var rlayers = WM.getLayersBy("uniqueName", "__CamadaAvaliacaoWMEBrasil");
		if (rlayers.length == 0) {
			var drc_style1 = new OL.Style({
				strokeDashstyle: 'solid',
				strokeColor: "${strokeColor}",
				strokeOpacity: 1.0,
				strokeWidth: "${strokeWidth}",
				fillColor: '#0040FF',
				fillOpacity: 1.0,
				pointRadius: "${pointRadius}",
				label: "${labelText}",
				fontFamily: "Tahoma, Courier New",
				labelOutlineColor: "${labelOutlineColor}",
				labelOutlineWidth: "${labelOutlineWidth}",
				fontColor: "${fontColor}",
				fontOpacity: 1.0,
				fontSize: "${fontSize}",
				display: 'block'
			});

			var drc_mapLayer1 = new OL.Layer.Vector("Maturidade das vias", {
				displayInLayerSwitcher: true,
				uniqueName: "__CamadaAvaliacaoWMEBrasil",
				styleMap: new OL.StyleMap(drc_style1)
			});

			drc_mapLayer1.setVisibility(true);

			WM.addLayer(drc_mapLayer1);
		}

		var routeLayer = WM.getLayersBy("uniqueName", "__CamadaAvaliacaoWMEBrasil")[0];
		routeLayer.removeAllFeatures();

		var labelFeatures = [];

		for (var seg in wazeModel.segments.objects) {

			var Avaliacao = funVia_AvaliarMaturidade(seg);

			if (Avaliacao != '') {

				var segmento = wazeModel.segments.objects[seg];

				var segText = "•••";

				var label = new OpenLayers.Feature.Vector(segmento.getCenter(), {
					labelText: segText,
					fontColor: '#ffffff',
					fontSize: "13px",
					pointRadius: 0,
					labelOutlineWidth: 6,
					labelOutlineColor: Avaliacao
				});
				labelFeatures.push(label);
			}

		}
		if (labelFeatures.length > 0) {
			routeLayer.addFeatures(labelFeatures);
		}
	}
}

function funVia_AvaliarVelocidade(idSegmento) {
	var segmentoPrime = wazeModel.segments.objects[idSegmento];

	//Se tem algum null

	if (
		((segmentoPrime.attributes.fwdDirection && segmentoPrime.attributes.revDirection) && (segmentoPrime.attributes.fwdMaxSpeed == null || segmentoPrime.attributes.revMaxSpeed == null))
		||
		((segmentoPrime.attributes.fwdDirection && !segmentoPrime.attributes.revDirection) && (segmentoPrime.attributes.fwdMaxSpeed == null))
		||
		((!segmentoPrime.attributes.fwdDirection && segmentoPrime.attributes.revDirection) && (segmentoPrime.attributes.revMaxSpeed == null))
		) {
		return '#ff0000';
	}

	var somavelocidadeAB = 0;
	var somavelocidadeBA = 0;
	var contasegmentos = 0;

	for (var seg in wazeModel.segments.objects) {
		if (wazeModel.segments.objects[seg].attributes.primaryStreetID == segmentoPrime.attributes.primaryStreetID &&
			seg != idSegmento) {
			somavelocidadeAB += wazeModel.segments.objects[seg].attributes.fwdMaxSpeed;
			somavelocidadeBA += wazeModel.segments.objects[seg].attributes.revMaxSpeed;
			contasegmentos++;
		}
	}

	if (contasegmentos > 0) {
		//Se a street tem velocidades diferentes
		if (
		((segmentoPrime.attributes.fwdDirection && segmentoPrime.attributes.revDirection) && (segmentoPrime.attributes.fwdMaxSpeed != somavelocidadeAB / contasegmentos || segmentoPrime.attributes.revMaxSpeed != somavelocidadeBA / contasegmentos))
		||
		((segmentoPrime.attributes.fwdDirection && !segmentoPrime.attributes.revDirection) && (segmentoPrime.attributes.fwdMaxSpeed != somavelocidadeAB / contasegmentos))
		||
		((!segmentoPrime.attributes.fwdDirection && segmentoPrime.attributes.revDirection) && (segmentoPrime.attributes.revMaxSpeed != somavelocidadeBA / contasegmentos))
		) {
			return '#cc00ff';
		}
	}

	return '';
}

function funVia_AvaliarMaturidade(idSegmento) {
	var segmentoPrime = wazeModel.segments.objects[idSegmento];

	var dateNow = new Date();
	var diasUpdate = Math.floor((dateNow.getTime() - segmentoPrime.attributes.updatedOn) / 86400000);


	if (diasUpdate > 90) {
		return '#66ff33';
	}
	else if (diasUpdate > 30) {
		return '#ffff66';
	}
	else if (diasUpdate > 15) {
		return '#ff9900';
	}
	else {
		return '#ff3300';
	}
}

function funVia_TestarSegmentosAlinhados(segmento1, segmento2) {
	//Os pontos somente estarão alinhados se o determinante da matriz quadrada calculado pela regra de Sarrus for igual a 0.
	/*
	x1  y1  1|
	x2  y2  1| = 0
	x3  y3  1|

	x1  y1  1|x1  y1  |
	x2  y2  1|x2  y2  | = 0
	x3  y3  1|x3  y3  |

	x1 * y2 * 1     = A
	y1 * 1  * x3    = B
	1  * x2 * y3    = C

	x3 * y2 * 1     = D
	y3 * 1  * x1    = E
	1  * x2 * y1    = F

	(A+B+C)-(D+E+F) = 0?
	*/

	//Só retas valem.
	if (segmento1.geometry.components.length != 2 ||
		segmento2.geometry.components.length != 2) {
		return false;
	}

	var noExtremo1;
	var noExtremo2;
	var noComum;

	//Só se estiverem "congruentes" (juntas) - com 1 ponto em comum.
	if (segmento1.attributes.fromNodeID == segmento2.attributes.fromNodeID) {
		noExtremo1 = wazeModel.nodes.objects[segmento1.attributes.toNodeID];
		noExtremo2 = wazeModel.nodes.objects[segmento2.attributes.toNodeID];
		noComum = wazeModel.nodes.objects[segmento1.attributes.fromNodeID];
	}
	else if (segmento1.attributes.toNodeID == segmento2.attributes.toNodeID) {
		noExtremo1 = wazeModel.nodes.objects[segmento1.attributes.fromNodeID];
		noExtremo2 = wazeModel.nodes.objects[segmento2.attributes.fromNodeID];
		noComum = wazeModel.nodes.objects[segmento1.attributes.toNodeID];
	}
	else if (segmento1.attributes.fromNodeID == segmento2.attributes.toNodeID) {
		noExtremo1 = wazeModel.nodes.objects[segmento1.attributes.toNodeID];
		noExtremo2 = wazeModel.nodes.objects[segmento2.attributes.fromNodeID];
		noComum = wazeModel.nodes.objects[segmento1.attributes.fromNodeID];
	}
	else if (segmento1.attributes.toNodeID == segmento2.attributes.fromNodeID) {
		noExtremo1 = wazeModel.nodes.objects[segmento1.attributes.fromNodeID];
		noExtremo2 = wazeModel.nodes.objects[segmento2.attributes.toNodeID];
		noComum = wazeModel.nodes.objects[segmento1.attributes.toNodeID];
	}
	else {
		return false;
	}

	var A = noExtremo1.geometry.x * noExtremo2.geometry.y;
	var B = noExtremo1.geometry.y * noComum.geometry.x;
	var C = noExtremo2.geometry.x * noComum.geometry.y;

	var D = noComum.geometry.x * noExtremo2.geometry.y;
	var E = noComum.geometry.y * noExtremo1.geometry.x;
	var F = noExtremo2.geometry.x * noExtremo1.geometry.y;

	var tolerancia = parseInt(document.getElementById('inputToleranciaAlinhamento').value) * 100;

	console.log(segmento1.attributes.id);
	console.log(segmento2.attributes.id);
	console.log('Alinhamento: A     ' + A);
	console.log('Alinhamento: B     ' + B);
	console.log('Alinhamento: C     ' + C);
	console.log('Alinhamento: D     ' + D);
	console.log('Alinhamento: E     ' + E);
	console.log('Alinhamento: F     ' + F);

	console.log((A + B + C) - (D + E + F));

	console.log('Tolerancia de ' + tolerancia);


	return (
		(A + B + C) - (D + E + F) < tolerancia
		&&
		(A + B + C) - (D + E + F) > -1 * tolerancia
		);
}

function funVia_SelecionarSegmentosAlinhados(segmento1, segmento2) {
	segmento2 = segmento2 || true;
	var chamadaRaiz = false;

	console.log(segmento1);
	console.log(segmento2);

	//****************************************************************************************************************************************
	if (segmento2 == true) {
		console.log('Raiz');
		chamadaRaiz = true;
		seg_listaSegmentosSelecionados = [];//estes são os segmentos "prime"... aquilo q o usuário selecionou mesmo.

		for (i = 0; i < Waze.selectionManager.getSelectedFeatures().length; i++) {
			for (var seg in wazeModel.segments.objects) {
				var segmento = wazeModel.segments.objects[seg];

				if (segmento.geometry.id == Waze.selectionManager.getSelectedFeatures()[i].geometry.id) {
					if (wazeModel.streets.objects[segmento.attributes.primaryStreetID].name == null) {
						seg_listaSegmentosSelecionados.push(segmento);
					}
					break;
				}
			}
		}
		segmento1 = seg_listaSegmentosSelecionados[0];
		segmento2 = seg_listaSegmentosSelecionados[1];

		console.log(seg_listaSegmentosSelecionados);

		for (var i = 0; i < wazeModel.nodes.objects[segmento1.attributes.fromNodeID].attributes.segIDs.length; i++) {
			//Vou testar EXCETO se for o segmento 1- pq ele já é o garantido.
			if (wazeModel.nodes.objects[segmento1.attributes.fromNodeID].attributes.segIDs[i] != segmento1.attributes.id) {
				var segmentoTeste = wazeModel.segments.objects[wazeModel.nodes.objects[segmento1.attributes.fromNodeID].attributes.segIDs[i]];
				if (funVia_TestarSegmentosAlinhados(segmento1, segmentoTeste) &&
					wazeModel.streets.objects[segmentoTeste.attributes.primaryStreetID].name == null) {
					seg_listaSegmentosSelecionados.push(segmentoTeste);

					funVia_SelecionarSegmentosAlinhados(segmento1, segmentoTeste);
				}
			}
		}

		for (var i = 0; i < wazeModel.nodes.objects[segmento1.attributes.toNodeID].attributes.segIDs.length; i++) {
			//Vou testar EXCETO se for o segmento 1- pq ele já é o garantido.
			if (wazeModel.nodes.objects[segmento1.attributes.toNodeID].attributes.segIDs[i] != segmento1.attributes.id) {
				var segmentoTeste = wazeModel.segments.objects[wazeModel.nodes.objects[segmento1.attributes.toNodeID].attributes.segIDs[i]];
				if (funVia_TestarSegmentosAlinhados(segmento1, segmentoTeste) &&
					wazeModel.streets.objects[segmentoTeste.attributes.primaryStreetID].name == null) {
					seg_listaSegmentosSelecionados.push(segmentoTeste);

					funVia_SelecionarSegmentosAlinhados(segmento1, segmentoTeste);
				}
			}
		}
	}
	//****************************************************************************************************************************************


	var segmentoJaSelecionado = false;
	if (!chamadaRaiz) {
		for (var i = 0; i < seg_listaSegmentosSelecionados.length - 1; i++) {
			if (seg_listaSegmentosSelecionados[i].attributes.id == segmento2.attributes.id) {
				segmentoJaSelecionado = true;
			}
		}
	}

	if (!segmentoJaSelecionado) {
		for (var i = 0; i < wazeModel.nodes.objects[segmento2.attributes.fromNodeID].attributes.segIDs.length; i++) {
			//Vou testar EXCETO se for o segmento 1- pq ele já é o garantido.
			if (wazeModel.nodes.objects[segmento2.attributes.fromNodeID].attributes.segIDs[i] != segmento2.attributes.id) {
				var segmentoTeste = wazeModel.segments.objects[wazeModel.nodes.objects[segmento2.attributes.fromNodeID].attributes.segIDs[i]];
				if (funVia_TestarSegmentosAlinhados(segmento2, segmentoTeste) &&
					wazeModel.streets.objects[segmentoTeste.attributes.primaryStreetID].name == null) {
					seg_listaSegmentosSelecionados.push(segmentoTeste);

					funVia_SelecionarSegmentosAlinhados(segmento2, segmentoTeste);
				}
			}
		}

		for (var i = 0; i < wazeModel.nodes.objects[segmento2.attributes.toNodeID].attributes.segIDs.length; i++) {
			//Vou testar EXCETO se for o segmento 1- pq ele já é o garantido.
			if (wazeModel.nodes.objects[segmento2.attributes.toNodeID].attributes.segIDs[i] != segmento2.attributes.id) {
				var segmentoTeste = wazeModel.segments.objects[wazeModel.nodes.objects[segmento2.attributes.toNodeID].attributes.segIDs[i]];
				if (funVia_TestarSegmentosAlinhados(segmento2, segmentoTeste) &&
					wazeModel.streets.objects[segmentoTeste.attributes.primaryStreetID].name == null) {
					seg_listaSegmentosSelecionados.push(segmentoTeste);

					funVia_SelecionarSegmentosAlinhados(segmento2, segmentoTeste);
				}
			}
		}
	}

	if (chamadaRaiz) {
		console.log(seg_listaSegmentosSelecionados);
		Waze.selectionManager.setSelectedModels(seg_listaSegmentosSelecionados);
		seg_listaSegmentosSelecionados = [];
	}
}

funVia_SelecionarSegmentoClosure = function (idSegmento) {
	console.log('Selecionando segmento ' + idSegmento);

	var seg = wazeModel.segments.objects[idSegmento];
	var sel = []; sel.push(seg);
	Waze.selectionManager.setSelectedModels(sel);
	var currentZoom = Waze.map.getZoom();

	window.setTimeout(function () {
		Waze.map.zoomToExtent(seg.geometry.getBounds());
		Waze.map.zoomTo(currentZoom);

		$('[class="nav nav-tabs"]')[1].children[1].children[0].click();//vai pra aba de interdição
	}, 300);
};
//-----------------------------------------------------------------------------------------------------------

function funPlace_ObterPoint(geometryPlace) {
	if (geometryPlace.id.indexOf('Geometry_Point') != -1) {
		return geometryPlace;
	}
	else {
		return funPlace_ObterPoint(geometryPlace.components[0]);
	}
}

/// <summary>
/// Usuários que tem coisa pra aprovar.
/// </summary>
/// <param name=""></param>
/// <returns></returns>
function funPlace_ProcurarUsuariosPU() {
	var usuariosPUs = [];

	if (document.getElementById('chkPlaceUsuario').checked) {
		for (var objs in wazeModel.venues.objects) {
			var place = wazeModel.venues.objects[objs];

			if (!place.attributes.adLocked) {
				for (var i = 0; i < place.attributes.venueUpdateRequests.length; i++) {
					var usuario = wazeModel.users.get(place.attributes.venueUpdateRequests[i].attributes.createdBy);

					if (Waze.map.getExtent().toGeometry().containsPoint(funPlace_ObterPoint(place.attributes.geometry)) &&
						usuariosPUs.indexOf(place.attributes.venueUpdateRequests[i].attributes.createdBy) == -1 &&

						(
						(
						typeof (usuario.temporary) != 'undefined' &&
						usuario.temporary == false
						)
						||
						typeof (usuario.temporary) == 'undefined'
						)
						) {
						usuariosPUs.push([place.attributes.venueUpdateRequests[i].attributes.createdBy, usuario.userName]);
					}
				}
			}
		}

		console.log(usuariosPUs.length + ' identificados.');

		if (usuariosPUs.length == 0) //Já que perdeu tempo de caçar PU e naõ achou nenhum. Localiza os places.
		{
			for (var objs in wazeModel.venues.objects) {
				var place = wazeModel.venues.objects[objs];

				if (!place.attributes.adLocked &&
					Waze.map.getExtent().toGeometry().containsPoint(funPlace_ObterPoint(place.attributes.geometry))) {

					var criador = wazeModel.users.get(place.attributes.createdBy);
					var atualizador = wazeModel.users.get(place.attributes.updatedBy);
					if (
						usuariosPUs.indexOf(criador.id) == -1 &&
						(
						(
						typeof (criador.temporary) != 'undefined' &&
						criador.temporary == false
						)
						||
						typeof (criador.temporary) == 'undefined'
						)

						) {
						usuariosPUs.push([criador.id, criador.userName]);
					}
					if (
						usuariosPUs.indexOf(atualizador.id) == -1 &&
						(
						(
						typeof (atualizador.temporary) != 'undefined' &&
						atualizador.temporary == false
						)
						||
						typeof (atualizador.temporary) == 'undefined'
						)

						) {
						usuariosPUs.push([atualizador.id, atualizador.userName]);
					}

				}
			}
		}
	}

	genericLoadDropDown('selUsuariosPlaces', usuariosPUs);
}

/// <summary>
/// Do que tem pra aprovar o que é do usuário.
/// </summary>
/// <param name=""></param>
/// <returns></returns>
function funPlace_RealcarPUsDoUsuario() {

	console.log(global_intervalosRealcePlacesUsuario);

	for (i = 0; i < global_intervalosRealcePlacesUsuario.length; i++) {
		console.log('parando ' + global_intervalosRealcePlacesUsuario[i]);
		window.clearInterval(global_intervalosRealcePlacesUsuario[i]);
	}

	global_intervalosRealcePlacesUsuario = [];

	for (var objs in wazeModel.venues.objects) {
		var place = wazeModel.venues.objects[objs];

		if (!place.attributes.adLocked) {

			var danadoAtualizou = false;

			for (var i = 0; i < place.attributes.venueUpdateRequests.length; i++) {

				if (place.attributes.venueUpdateRequests[i].attributes.createdBy == document.getElementById('selUsuariosPlaces').value) {
					$('div[data-id="' + place.attributes.id + '"]').css("fill", "#FF0000");
					$('div[data-id="' + place.attributes.id + '"]').css("background-color", "#FF0000");
					danadoAtualizou = true;
					break;
				}

			}

			if (!danadoAtualizou) {
				$('div[data-id="' + place.attributes.id + '"]').css("fill", "");
				$('div[data-id="' + place.attributes.id + '"]').css("background-color", "");
			}

			if (place.attributes.venueUpdateRequests.length == 0 &&
				(place.attributes.createdBy == document.getElementById('selUsuariosPlaces').value ||
				place.attributes.updatedBy == document.getElementById('selUsuariosPlaces').value
				)) {
				global_intervalosRealcePlacesUsuario.push(funOu_RealcadorPlaceUpdate(place.attributes.id));
			}
		}
	}
}

function funPlace_SelecionarSobreposto() {
	try {
		var tolerancia = parseInt(document.getElementById('inputEspacamentoTolerancia').value);
		var nosJuncao = [];//id, X, Y
		var poinPlaces = [];//id, X, Y

		for (var node in wazeModel.nodes.objects) {
			if (Waze.map.getExtent().toGeometry().containsPoint(wazeModel.nodes.objects[node].geometry)) {
				nosJuncao.push([node, (-1) * wazeModel.nodes.objects[node].geometry.x, (-1) * wazeModel.nodes.objects[node].geometry.y]);
			}
		}

		for (var objs in wazeModel.venues.objects) {
			var landmark = wazeModel.venues.objects[objs];
			if (landmark.attributes.geometry.__proto__.CLASS_NAME.toUpperCase().indexOf("POINT") != -1) {

				if (Waze.map.getExtent().toGeometry().containsPoint(landmark.attributes.geometry)) {
					poinPlaces.push([objs, (-1) * landmark.attributes.geometry.x, (-1) * landmark.attributes.geometry.y]);
				}
			}
		}

		console.log(tolerancia);
		console.log(nosJuncao);
		console.log(poinPlaces);

		nosJuncao = nosJuncao.sort(genericSortList);
		poinPlaces = poinPlaces.sort(genericSortList);

		console.log(nosJuncao);
		console.log(poinPlaces);

		for (var i = 0; i < poinPlaces.length; i++) {
			for (var j = 0; j < nosJuncao.length; j++) {
				//ordenei por X pq se o ponto + tolerancia < junção, nem olha mais as outras junções. Proximo ponto!
				if (poinPlaces[i][1] + tolerancia < nosJuncao[j][1]) {
					continue;
				}

				if (poinPlaces[i][1] < nosJuncao[j][1] + tolerancia && poinPlaces[i][1] + tolerancia > nosJuncao[j][1] &&
					poinPlaces[i][2] < nosJuncao[j][2] + tolerancia && poinPlaces[i][2] + tolerancia > nosJuncao[j][2]) {

					console.log('Selecionar ' + poinPlaces[i][0]);

					var t = [];
					t.push(wazeModel.venues.objects[poinPlaces[i][0]]);
					Waze.selectionManager.setSelectedModels(t);

					return;
				}
			}
		}
	} catch (e) {
		genericLog(e);
	}




}

function funPlace_PesquisarANP() {

	try {
		var countCity = 0;
		var selecionadaListada = false;
		var idCidade = 0;

		for (var cit in wazeModel.cities.objects) {
			if (wazeModel.cities.objects[cit].attributes.name != "") {
				if (typeof (wazeModel.cities.objects[cit].attributes.outOfScope) == "undefined" ||
				(typeof (wazeModel.cities.objects[cit].attributes.outOfScope) != "undefined" && wazeModel.cities.objects[cit].attributes.outOfScope == false)) {
					idCidade = wazeModel.cities.objects[cit].attributes.id;
					countCity++;

					if (document.getElementById('selCidadePosto').value == wazeModel.cities.objects[cit].attributes.id) {
						selecionadaListada = true;
						break;
					}
				}
			}
		}

		if (selecionadaListada == false && countCity > 1) {
			genericExibirMensagem(genericTraducao('msg_ANP'));
			return;
		}

		var indexEstado = UFestados.indexOf(wazeModel.states.objects[wazeModel.cities.objects[idCidade].attributes.stateID].name);

		var link = "https://postos.anp.gov.br/consulta.asp";
		link += "?WmeMunicipio=" + wazeModel.cities.objects[idCidade].attributes.name.toUpperCase();

		var site = "<html>                                                                      \
			<body onload='document.forms[\"frmPesquisa\"].submit()'>                        \
			<form method=\"Post\" action=\"" + link + "\" name=\"frmPesquisa\">             \
				<input name=\"sEstado\" value=\""+ UFestadosSiglas[indexEstado] + "\"/>     \
			</form>                                                                         \
			</body>                                                                         \
			</html>";
		var popupWindow = window.open("", "_blank");
		popupWindow.document.write(site);
		popupWindow.document.close();

		console.log(indexEstado);
		console.log(codMunicipios);
		console.log(nomePosto);
	} catch (e) {
		genericLog(e);
	}
}

function funPlace_LockPlace() {
	if (global_FilaInstrucaoAssincrona.length > 0) {
		genericAssincStop();
		return;
	}

	var lockarPonto = document.getElementById('chkLockPonto').checked;
	var lockarArea = document.getElementById('chkLockArea').checked;
	var lockRaise = document.getElementById('chkRaiseLock').checked;
	var lockLower = document.getElementById('chkLowerLock').checked;

	var lvlLock = document.getElementById('inputLockLevel').value - 1;

	console.log('Queremos um lock ' + lvlLock + ' na área');

	for (var objs in wazeModel.venues.objects) {
		var landmark = wazeModel.venues.objects[objs];

		if (Waze.map.getExtent().toGeometry().containsPoint(funPlace_ObterPoint(landmark.attributes.geometry))) {
			if (
				((lockRaise == lockLower) && (landmark.attributes.lockRank != lvlLock))
				|| ((lockRaise) && (landmark.attributes.lockRank < lvlLock))
				|| ((lockLower) && (landmark.attributes.lockRank > lvlLock))) {
				console.log(landmark);

				if (
						(lockarPonto &&
						landmark.attributes.geometry.__proto__.CLASS_NAME.toUpperCase().indexOf("POINT") != -1)
					||
						(lockarArea &&
						landmark.attributes.geometry.__proto__.CLASS_NAME.toUpperCase().indexOf("POINT") == -1)
					) {
					var instrucao = "                                                                                       \
					var landmark = wazeModel.venues.objects[\""+ landmark.attributes.id + "\"];                             \
																															\
					var t = [];                                                                                             \
					t.push(landmark);                                                                                       \
					Waze.selectionManager.setSelectedModels(t);                                                                        \
																															\
					genericAssincBreak();";
					genericAssincCommand(instrucao, false);

					instrucao = "$('input[name=\"services\"]')[0].click();";    //Fake... só serve pra gerar Action no ActionManager
					genericAssincCommand(instrucao, false);

					instrucao = "                                                                               \
					wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].newAttributes = \
						{ lockRank: " + lvlLock + " };                                                          \
																												\
					wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].oldAttributes = \
						{ lockRank: " + landmark.attributes.lockRank + " };";
					genericAssincCommand(instrucao, true);
				}
			}
		}
	}
}

function funPlace_AprovarReprovarPU(valor) {

	if (global_FilaInstrucaoAssincrona.length > 0) {
		genericAssincStop();
		return;
	}

	var apenasUsuario = document.getElementById('chkPlaceUsuario').checked;
	var usuario = document.getElementById('selUsuariosPlaces').value;


	for (var objs in wazeModel.venues.objects) {
		var landmark = wazeModel.venues.objects[objs];

		if (landmark.attributes.venueUpdateRequests.length > 0
			&& landmark.attributes.adLocked == false
			&& landmark.attributes.permissions == -1
			) {
			if (!apenasUsuario ||
				(apenasUsuario && landmark.attributes.venueUpdateRequests[0].attributes.createdBy == usuario)) {

				if (
					document.getElementById('chkFecharApenasVisiveis').checked &&
					!Waze.map.getExtent().toGeometry().containsPoint(funPlace_ObterPoint(landmark.attributes.geometry))) {
					continue;
				}

				console.log('Aprovação de places, enfilerando place' + objs);

				var strComando = "$('[data-id=\"" + objs + "\"]').click();        \
								genericAssincBreak();";
				genericAssincCommand(strComando);

				for (var i = 0; i < landmark.attributes.venueUpdateRequests.length; i++) {

					//if (landmark.attributes.venueUpdateRequests[i]._pending)
					{
						if (valor) {
							strComando = "$('[class=\"approve\"]').click();";
							genericAssincCommand(strComando, true);
						}
						else {

							console.log(landmark);

							if (landmark.attributes.venueUpdateRequests[i].attributes.updateType == "flag") {
								strComando = "$('[class=\"approve\"]').click();";
							}
							else {
								strComando = "$('[class=\"reject\"]').click();";
							}
							genericAssincCommand(strComando, true);
						}

						if (i < landmark.attributes.venueUpdateRequests.length - 1)//Não ultimo.
						{
							strComando = "$('[class=\"next waze-plain-btn\"]').click();";
							genericAssincCommand(strComando);
						}
					}
				}
			}
		}
	}

	if (global_FilaInstrucaoAssincrona.length > 0) {
		strComando = "$('[class=\"close-panel\"]').click();";
		genericAssincCommand(strComando);
	}

	console.log(global_FilaInstrucaoAssincrona);
}

//-----------------------------------------------------------------------------------------------------------

function funOu_ListarUsuariosRadar() {
	var usuariosPUs = [];
	var usuario;
	for (var key in wazeModel.cameras.objects) {
		var radar = wazeModel.cameras.objects[key];
		if (Waze.map.getExtent().toGeometry().containsPoint(radar.geometry)) {

			if (usuariosPUs.indexOf(radar.attributes.updatedBy) == -1) {

				usuario = wazeModel.users.get(radar.attributes.updatedBy);
				if (typeof (usuario) != 'undefined' &&
					(
					typeof (usuario.temporary) == 'undefined' ||
					usuario.temporary == false)) {

					console.log(usuario);
					usuariosPUs.push([radar.attributes.updatedBy, usuario.userName]);
				}
			}

			if (usuariosPUs.indexOf(radar.attributes.createdBy) == -1) {

				usuario = wazeModel.users.get(radar.attributes.createdBy);
				if (typeof (usuario) != 'undefined' &&
					(
					typeof (usuario.temporary) == 'undefined' ||
					usuario.temporary == false)) {
					console.log(usuario);
					usuariosPUs.push([radar.attributes.createdBy, usuario.userName]);
				}
			}
		}
	}

	console.log(usuariosPUs);

	genericLoadDropDown('selUsuarioRadar', usuariosPUs);
}

function funOu_RealcarRadaresUsuario() {
	var usuarioradar = document.getElementById('selUsuarioRadar').value;

	console.log(global_intervalosRealceRadaresUsuario);

	for (i = 0; i < global_intervalosRealceRadaresUsuario.length; i++) {
		console.log('parando ' + global_intervalosRealceRadaresUsuario[i]);
		window.clearInterval(global_intervalosRealceRadaresUsuario[i]);
	}

	global_intervalosRealceRadaresUsuario = [];

	for (var key in wazeModel.cameras.objects) {
		var radar = wazeModel.cameras.objects[key];
		if (radar.attributes.permissions < 0 &&
			Waze.map.getExtent().toGeometry().containsPoint(radar.geometry)) {
			if (
					(
						document.getElementById('chkRadarNAO').checked &&
						(
							(document.getElementById('chkRadarCriado').checked && radar.attributes.createdBy != usuarioradar)
						||
							(document.getElementById('chkRadarAtualizado').checked && radar.attributes.updatedBy != usuarioradar)
						)
					)
				||

					(
						!document.getElementById('chkRadarNAO').checked &&
						(
							(document.getElementById('chkRadarCriado').checked && radar.attributes.createdBy == usuarioradar)
						||
							(document.getElementById('chkRadarAtualizado').checked && radar.attributes.updatedBy == usuarioradar)
						)
					)


				) {
				global_intervalosRealceRadaresUsuario.push(funOu_RealcadorRadar(radar.geometry.id));
			}
			else {
				$('image[id="' + radar.geometry.id + '"]').animate({ opacity: 1 });
			}
		}
	}
}

function funOu_RealcarPlaces() {
	var inicioExecucao = Date.now();

	if (document.getElementById('chkPlacesProblematicos').checked && global_FilaInstrucaoAssincrona.length == 0) {
		for (var objs in wazeModel.venues.objects) {
			if (inicioExecucao + 15000 < Date.now()) {
				genericExibirMensagem("Too many places... :-(");
				break;
			}

			var landmark = wazeModel.venues.objects[objs];

			if (!Waze.map.getExtent().toGeometry().containsPoint(funPlace_ObterPoint(landmark.attributes.geometry))) {
				continue;
			}

			var nomeVia = "";
			if (landmark.attributes.streetID != null &&
				landmark.attributes.streetID != "" &&
				typeof (wazeModel.streets.objects[landmark.attributes.streetID]) != "undefined") {
				nomeVia = wazeModel.streets.objects[landmark.attributes.streetID].name;
			}

			var sobreposto = false;

			//sobrepostos (mesmo nome ou mesmo tipo [exceto outros]) tipos (ponto área) diferentes
			if (landmark.attributes.geometry.__proto__.CLASS_NAME.toUpperCase().indexOf("POINT") != -1) {	//esse é ponto e está sobrepondo uma área.
				for (var placePoli in wazeModel.venues.objects) {
					var landmarkPoligonal = wazeModel.venues.objects[placePoli];

					if (landmarkPoligonal.attributes.geometry.__proto__.CLASS_NAME.toUpperCase().indexOf("POLYGON") != -1 &&
						(
						genericCompararTextos(landmarkPoligonal.attributes.name, landmark.attributes.name)
						)
					) {
						if (landmarkPoligonal.attributes.geometry.containsPoint(landmark.attributes.geometry)) {
							sobreposto = true;
							break;
						}
					}
				}
			}

			if  //posto com badeiras zuadas OU sem nome
				(landmark.isGasStation() &&
					(landmark.attributes.brand == "Esso" ||
					landmark.attributes.brand == "Ypiranga" ||
					landmark.attributes.name == "")
				) {
				$('[id="' + landmark.geometry.id + '"]').css("fill", "#8dc63f"); // verde
			}

			for (var h = 0; h < palavrasFeias.length; h++) {
				if//"casa" tipos outros (se tiver número aproveita, senão lixo)
							(!landmark.isResidential() &&
								(
									genericCompararTextos(landmark.attributes.name, palavrasFeias[h])
								||
									new RegExp(palavrasFeias[h].toUpperCase(), "gi").test(genericDesacentuaTexto(landmark.attributes.name))
								)
							) {
					$('[id="' + landmark.geometry.id + '"]').css("fill", "#ff8000");//laranja
				}
			}

			if//"casa" tipos outros (se tiver número aproveita, senão lixo)
			(!landmark.isResidential() &&
				landmark.attributes.categories.length > 0 &&
				landmark.attributes.categories[0] == "OTHER" &&
				(landmark.attributes.name.toUpperCase().indexOf("CASA") == 0)
			) {
				if (landmark.attributes.houseNumber != "") {
					$('[id="' + landmark.geometry.id + '"]').css("fill", "#ff00ff");//magenta
				}
				else {
					$('[id="' + landmark.geometry.id + '"]').css("fill", "#FF0000");//vermelho
				}
			}

			if //place com nome de rua no nome do place
				(nomeVia != null &&
					nomeVia != "" &&
					landmark.attributes.name.toUpperCase().indexOf("PÇ") == -1 &&
					genericCompararTextos(landmark.attributes.name, nomeVia)
				) {
				$('[id="' + landmark.geometry.id + '"]').css("fill", "#FF0000");//vermelho
			}

			if
			(sobreposto) {
				$('[id="' + landmark.geometry.id + '"]').css("fill", "#00ACC8");//azul
			}
		}
	}
}

function funOu_RealcarDirty4x4() {
	if (document.getElementById('chkDirty4x4').checked) {
		console.log("funOu_RealcarDirty4x4.");
		for (var seg in wazeModel.segments.objects) {
			var segmentoTestado = wazeModel.segments.objects[seg];

			if (segmentoTestado.attributes.flags == 16) {
				$('[id="' + segmentoTestado.geometry.id + '"]').attr("stroke", "#663300");
				$('[id="' + segmentoTestado.geometry.id + '"]').attr("stroke-opacity", "1");
			}
		}
	}
}

function funOu_RealcarSobrescritaInstrucao() {
	if (document.getElementById('chkSobrescritaInstrucao').checked) {
		console.log("funOu_RealcarSobrescritaInstrucao.");
		for (var item in W.model.getTurnGraph()._adjacencyList) {

			for (var subItem in W.model.getTurnGraph()._adjacencyList[item]) {
				if (W.model.getTurnGraph()._adjacencyList[item][subItem]._instructionOpcode != null) {
					var idSegmento = item.substring(0, item.length - 1);
					$('[id="' + wazeModel.segments.objects[idSegmento].geometry.id + '"]').attr("stroke", "	#0000CD");
					$('[id="' + wazeModel.segments.objects[idSegmento].geometry.id + '"]').attr("stroke-opacity", "1");
				}
			}
		}
	}
}

function funOu_RealcarSegmentosComRoteamento() {
	if (document.getElementById('chkRoteamento').checked) {
		console.log("funOu_SegmentosComRoteamento.");
		for (var seg in wazeModel.segments.objects) {
			var segmentoTestado = wazeModel.segments.objects[seg];

			if (segmentoTestado.attributes.routingRoadType != null) {
				$('[id="' + segmentoTestado.geometry.id + '"]').attr("stroke", "#ff3df5");
				$('[id="' + segmentoTestado.geometry.id + '"]').attr("stroke-opacity", "1");
			}
		}
	}
}

function funOu_RealcarRadaresSemVelocidade() {
	for (i = 0; i < global_intervalosRealceRadaresNoSpeed.length; i++) {
		window.clearInterval(global_intervalosRealceRadaresNoSpeed[i]);
	}
	global_intervalosRealceRadaresNoSpeed = [];

	if (document.getElementById('chkRadaresZerados').checked) {
		for (var key in wazeModel.cameras.objects) {
			var radar = wazeModel.cameras.objects[key];
			if (radar.attributes.permissions < 0 &&
				Waze.map.getExtent().toGeometry().containsPoint(radar.geometry)) {
				if (radar.attributes.validated &&
				(radar.attributes.speed == null || radar.attributes.speed == 0)) {
					console.log(radar.geometry.id);
					global_intervalosRealceRadaresNoSpeed.push(funOu_RealcadorRadar(radar.geometry.id));
				}
				else {
					$('image[id="' + radar.geometry.id + '"]').animate({ opacity: 1 });
				}
			}
		}
		console.log(global_intervalosRealceRadaresNoSpeed);
	}
}

function funOu_RealcadorRadar(idRadar) {
	console.log('DEVE Realçar radar ' + idRadar);

	return window.setInterval(function () {
		console.log('Realçar radar ' + idRadar);
		$('image[id="' + idRadar + '"]').animate({ opacity: 0.3 });
		window.setTimeout(
			function () {
				$('image[id="' + idRadar + '"]').animate({ opacity: 1 });
			}, 1000);
	}, 2000);
}

function funOu_RealcadorPlaceUpdate(idPlace) {

	return window.setInterval(function () {

		$('div[data-id="' + idPlace + '"]').animate({ opacity: 0.3 });
		window.setTimeout(
			function () {
				$('div[data-id="' + idPlace + '"]').animate({ opacity: 1 });
			}, 1000);
	}, 2000);
}

function funOu_Realcadores() {

	var href = $('.WazeControlPermalink a').attr('href');

	var lon = genericGetQueryString(href, 'lon');
	var lat = genericGetQueryString(href, 'lat');
	var zoom = parseInt(genericGetQueryString(href, 'zoom'));

	if (ou_RealcePlaceLastLon == lon &&
		ou_RealcePlaceLastLat == lat &&
		ou_RealcePlaceLastZoom == zoom) {

		return;
	}
	else {
		console.log('Atualizando parametros de realce.');
		ou_RealcePlaceLastLon = lon;
		ou_RealcePlaceLastLat = lat;
		ou_RealcePlaceLastZoom = zoom;
	}

	//Places
	if (zoom >= 4) {
		funOu_RealcarPlaces();
	}

	//Radares
	funOu_RealcarRadaresSemVelocidade();

	//4x4
	funOu_RealcarDirty4x4();

	//Sobre escrita de instrução
	funOu_RealcarSobrescritaInstrucao();

	//Roteamento diferente de neutro
	funOu_RealcarSegmentosComRoteamento();

	//Interdições
	funOu_ListarInterdicoesFeed();

	//Velocidades
	funVia_SinalizarVariacaoVelocidades();

	//Maturidade
	funVia_SinalizarMaturidade();
}

function funOu_ListarInterdicoesFeed() {
	if (document.getElementById('chkClosures').checked) {
		while (document.getElementById('listaClosures') != null) {
			document.getElementById('listaClosures').remove();
		}

		var idSegmentosDesenhados = [];
		for (var closureId in wazeModel.roadClosures.objects) {
			var closureObj = wazeModel.roadClosures.objects[closureId];
			var DoisSentidos = false;

			var segmento = wazeModel.segments.objects[closureObj.segID];

			if (segmento != null
				&& idSegmentosDesenhados.indexOf(closureObj.segID) == -1
				&& funRevVia_VerificarSegmentoVisivel(segmento)) {
				for (var closureIdReverso in wazeModel.roadClosures.objects) {
					if (wazeModel.roadClosures.objects[closureIdReverso].segID == closureObj.segID) {
						DoisSentidos = true;
						break;
					}
				}

				console.log(closureObj);
				console.log('Duplo sentido ' + DoisSentidos);

				var Myhtml = document.createElement('ul');
				Myhtml.id = "listaClosures";
				Myhtml.className = 'full-closures list-unstyled';

				var txtHTM = '';

				txtHTM += '<li class="closure-item"  style="display: block;">';
				txtHTM += '<div class="details section"  style="display: block;">';

				txtHTM += '<div class="buttons pull-right"  style="display: block;">';
				txtHTM += '<div class="btn btn-block btn-default" style="display: block;" onclick="funVia_SelecionarSegmentoClosure(' + closureObj.segID + ')" >';
				txtHTM += '<i class="fa fa-pencil"  style="display: block;"></i>';
				txtHTM += '</div></div>';
				txtHTM += '<div class="direction">';

				if (DoisSentidos) {
					txtHTM += '<div class="dir-label span">';
					txtHTM += genericTraducao('msg_ClosuresMaoDupla');
					txtHTM += '</div>';
				}
				else {
					txtHTM += '<div class="dir-icon">' + (closureObj.forward ? 'A' : 'B') + '</div>';
					txtHTM += '<div class="dir-sep"></div>';
					txtHTM += '<div class="dir-icon">' + (closureObj.forward ? 'B' : 'A') + '</div>';
				}

				var rua = wazeModel.streets.objects[segmento.attributes.primaryStreetID];
				var cidade = wazeModel.cities.objects[rua.cityID];


				txtHTM += '</div>';
				txtHTM += '<div class="subtext"><span class="street">' + rua.name + '</span><span class="city">, ' + cidade.attributes.name + '</span><span class="country"></span></div>';
				txtHTM += '<h3 class="reason">' + closureObj.reason + '</h3>';
				txtHTM += '</div>';

				txtHTM += '<div class="dates row section">';
				txtHTM += '<div class="col-xs-6 start-date">';
				txtHTM += '<div class="date-label">Início</div>';
				txtHTM += '<div class="date">' + closureObj.startDate.substring(0, 10) + '</div>';
				txtHTM += '<div class="time">' + closureObj.startDate.substring(11) + '</div>';
				txtHTM += '</div>';

				txtHTM += '<div class="col-xs-6 end-date">';
				txtHTM += '<div class="date-label">Fim</div>';
				txtHTM += '<div class="date">' + closureObj.endDate.substring(0, 10) + '</div>';
				txtHTM += '<div class="time">' + closureObj.endDate.substring(11) + '</div>';
				txtHTM += '</div>';
				txtHTM += '</div></li>';

				Myhtml.innerHTML = txtHTM;

				var divClos = document.createElement('div');
				divClos.className = "closures-list";
				divClos.appendChild(Myhtml);
				document.getElementsByClassName("feed-issues")[0].appendChild(divClos);

				idSegmentosDesenhados.push(closureObj.segID);
			}
		}
	}
}

function funOu_ComentarioNovatos() {

	var comentarioNovato = genericTraducao('msg_ComentarioNovato');
	if (document.getElementById('txtComentarioNovato').value != '') {
		comentarioNovato = document.getElementById('txtComentarioNovato').value;
	}

	var quantosComentarios = 0;

	for (var idComent in W.model.mapComments.objects) {
		var comentario = W.model.mapComments.objects[idComent];

		if (comentario.attributes.conversation.length == 0
			&& comentario.attributes.lockRank == 0
			&& comentario.attributes.endDate == null
			&& W.model.users.getObjectById(comentario.attributes.createdBy).rank == 0
		) {
			quantosComentarios++;

            comentario.addComment(comentarioNovato);

            var instrucao = "													\
			var comentario = W.model.mapComments.objects[\""+ idComent + "\"];	\
			var t = [];														\
			t.push(comentario);												\
			W.selectionManager.setSelectedModels(t);";

            genericAssincCommand(instrucao, false);

            instrucao = "$('#lockRank-2').click();";
            genericAssincCommand(instrucao, false);

            var dataFinal = new Date();
			dataFinal.setDate(dataFinal.getDate() + 3);

            instrucao = "wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].newAttributes = { endDate: \"" + formatDate(dataFinal) + " 00:00\" };";
            genericAssincCommand(instrucao, true);

		}
	}

	genericExibirMensagem(genericTraducao('msg_ComentarioUR') + quantosComentarios + '.');
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function funOu_LinkGMaps() {
	var href = $('.WazeControlPermalink a').attr('href');

	var lon = genericGetQueryString(href, 'lon');
	var lat = genericGetQueryString(href, 'lat');
	var zoom = parseInt(genericGetQueryString(href, 'zoom'));

	zoom = zoom > 6 ? 19 : zoom + 12;
	var mapsUrl = 'https://maps.google.com/?ll=' + lat + ',' + lon + '&z=' + zoom;
	window.open(mapsUrl, '_blank');
}

function funOu_LinkFromGMaps() {
	var href = window.location.href;
	var posLon = href.indexOf('@-') + 1;
	var posLat = href.indexOf(',-', posLon) + 1;
	var posFim = href.indexOf(',', posLat);

	var lon = href.substr(posLon, posLat - posLon - 1);
	var lat = href.substr(posLat, posFim - posLat);
	var zoom = parseInt(document.getElementById('inputZoomWME').value);

	var mapsUrl = 'https://www.waze.com/pt-BR/editor/?env=row&lon=' + lat + '&lat=' + lon + '&zoom=' + zoom;
	window.open(mapsUrl, '_blank');


	$('#btnIrWme').each(function () {
		this.href = mapsUrl;
	});
}

function funOu_LinkZoomed() {
	var href = $('.WazeControlPermalink a').attr('href');
	var zoom = parseInt(genericGetQueryString(href, 'zoom'));

	var mapsUrl = href.replace('zoom=' + zoom, 'zoom=' + (zoom + 2));
	window.open(mapsUrl, '_blank');
}

function funOu_DesfazerTudo() {
	while (wazeModel.actionManager.undo()) {
		//faz nada... só desfaz... kkk
	}
}

function funOu_ObterDadosTodosEditores() {
	var distId = [];

	//Editores de segmentos
	for (var seg in wazeModel.segments.objects) {
		var updatedBy = wazeModel.segments.objects[seg].attributes.createdBy;
		if (distId.indexOf(updatedBy) == -1) {
			distId.push(updatedBy);
		}

		updatedBy = wazeModel.segments.objects[seg].attributes.updatedBy;
		if (distId.indexOf(updatedBy) == -1) {
			distId.push(updatedBy);
		}
	}

	//Editores de radares
	for (var key in wazeModel.cameras.objects) {
		var updatedBy = wazeModel.cameras.objects[key].attributes.updatedBy;
		if (distId.indexOf(updatedBy) == -1) {
			distId.push(updatedBy);
		}
	}

	//Editores de UR
	for (var urobj in wazeModel.updateRequestSessions.objects) {
		var ureq = wazeModel.updateRequestSessions.objects[urobj];
		if (ureq.comments.length != 0) {
			for (i = 0; i < ureq.comments.length; i++) {
				var updatedBy = ureq.comments[i].userID;
				if (distId.indexOf(updatedBy) == -1) {
					distId.push(updatedBy);
				}
			}
		}
	}

	var dataCache =
	[
		'login'
	];

	for (i = 0; i < distId.length; i++) {
		if (distId[i] != -1) {
			var user = wazeModel.users.get(distId[i]);
			if (typeof (user) != 'undefined') {
				dataCache.push('\n' + user.userName);
			}
		}
	}

	$('#dadosEditores').each(function () {
		this.href = 'data:text/csv;base64,' + btoa(dataCache);
		this.download = 'editores.csv';
	});
}

function funOu_AssyncEngine() {

	if(document.getElementById("tituloCabecalho") == null)
	{
		var userTabs = document.getElementById('user-info');
		var navTabs = genericgetByClass('nav-tabs', userTabs)[0];
		var tabContent = genericgetByClass('tab-content', userTabs)[0];
	
		newtabUR = document.createElement('li');
		newtabUR.innerHTML = '<a href="#sidepanel-mastersbrasil" data-toggle="tab" id="tituloCabecalho">WME Brasil</a>';
		newtabUR.innerHTML += '<img id="assyncEngine" src=""></img>';
		navTabs.appendChild(newtabUR);
	}

	var img = document.getElementById('assyncEngine');
	
	if (global_FilaInstrucaoAssincrona.length == 0) {
		img.src = '';
		img.title = '';
	}
	else {
		img.src = 'https://i.imgur.com/SbRFZJE.gif';
		img.title = global_FilaInstrucaoAssincrona.length + ' pendentes neste momento.';
	}	
}

//-----------------------------------------------------------------------------------------------------------
/*INICIO Revisão de nomes*/
//-----------------------------------------------------------------------------------------------------------

/// <summary>
/// Verifica se pode fazer a revisão: cidade escolhida ou se vai criar a cidade nova.
/// </summary>
/// <param name=""></param>
/// <returns>boolean (true -> pode fazer a revisão | false -> não pode fazer a revisão)</returns>
function funRevVia_VerificarCidadeEscolhida() {
	var userChamp = champsBrazil.indexOf(W.loginManager.user.userName) != -1;

	var countCity = 0;
	var adaListada = false;
	seg_NomeCidadeEscolhida = null;
	var selecionadaListada = false;

	for (var cit in wazeModel.cities.objects) {
		if (wazeModel.cities.objects[cit].attributes.name != "") {
			if (typeof (wazeModel.cities.objects[cit].attributes.outOfScope) == "undefined" ||
			(typeof (wazeModel.cities.objects[cit].attributes.outOfScope) != "undefined" && wazeModel.cities.objects[cit].attributes.outOfScope == false)) {
				seg_NomeCidadeEscolhida = wazeModel.cities.objects[cit].attributes.name;
				seg_IdEstadoCidadeEscolhida = wazeModel.cities.objects[cit].attributes.stateID;
				countCity++;

				if (document.getElementById('selCidadeSegNome').value == wazeModel.cities.objects[cit].attributes.id) {
					selecionadaListada = true;
					break;
				}
			}
		}
	}

	console.log("seg_NomeCidadeEscolhida = " + seg_NomeCidadeEscolhida);

	if (seg_NomeCidadeEscolhida == null && !userChamp) {
		//Não tem cidade nenhuma, precisa de champ pra criar.
		genericExibirMensagem(genericTraducao('msg_SemCidade'));
		genericAssincStop();
		return false;
	}

	if (countCity > 1 && !selecionadaListada) {
		//se não tiver nada pra nomear do zero, então, encrencar pra q!?
		var segmentoPelado = false;

		for (var seg in wazeModel.segments.objects) {
			if (wazeModel.segments.objects[seg].attributes.primaryStreetID == null) {
				segmentoPelado = true;
				break;
			}
		}

		if (segmentoPelado) {
			//Terá que selecionar no combo.
			genericExibirMensagem(genericTraducao('msg_RevisaoPeladosCidade'));
			genericAssincStop();
			return false;
		}
	}

	return true;
}

function funRevVia_CorrigirNome(streetID) {
	var rua = wazeModel.streets.objects[streetID].name;
	var logradouroDaRuaOriginal = rua.substring(0, rua.indexOf(" "));
	var logradouroDaRua = logradouroDaRuaOriginal;
	var nomeDaRuaOriginal = " " + rua.substring(rua.indexOf(" ") + 1, rua.length) + " ";
	var nomeDaRua = nomeDaRuaOriginal;

	console.log('logradouroDaRuaOriginal= ' + logradouroDaRuaOriginal);
	console.log('nomeDaRuaOriginal= ' + nomeDaRuaOriginal);

	if (logradouros.indexOf(logradouroDaRua) != -1) {
		//tem logradouro pra atualizar.
		logradouroDaRua = logradourosAbreviados[logradouros.indexOf(logradouroDaRua)];
	}
	else {
		//tá soando como sigla de rodovia.
		if (logradouroDaRua.indexOf("-") != -1) {
			var Sigla = logradouroDaRua.substring(0, logradouroDaRua.indexOf("-") + 1);
			if (logradouros.indexOf(Sigla) != -1) {
				logradouroDaRua = logradouroDaRua.replace(Sigla, logradourosAbreviados[logradouros.indexOf(Sigla)]);
			}
		}
	}

	for (x = 0; x < prefixosNomes.length; x++) {
		if (nomeDaRua.indexOf(prefixosNomes[x]) != -1) {
			nomeDaRua = nomeDaRua.replace(prefixosNomes[x], prefixosNomesAbreviados[x]);
		}
	}

	nomeDaRua = funRevisao_CorrigirNome(nomeDaRua);

	//////////////////////////////////////////////////////////////////////////////////////////
	//Regionalização estadual.
	//Goiás -> "Rua" não abrevia, se tiver abreviado "desabrevia"
	var Estado = wazeModel.states.objects[wazeModel.cities.objects[wazeModel.streets.objects[streetID].cityID].attributes.stateID].name;
	if (Estado == "Goiás") {
		if (logradouroDaRuaOriginal == "R." ||
			logradouroDaRua == "R.") {
			logradouroDaRua = "Rua";
		}
	}
	//////////////////////////////////////////////////////////////////////////////////////////
	//Fim das regionalizaçoes.
	//////////////////////////////////////////////////////////////////////////////////////////

	if (logradouroDaRuaOriginal != logradouroDaRua
		|| nomeDaRuaOriginal != nomeDaRua) {
		return (logradouroDaRua + nomeDaRua).trim();
	}
	else {
		return (logradouroDaRuaOriginal + nomeDaRuaOriginal).trim();
	}
}

function funRevVia_IniciarFaxinaNew() {   //<<<<Nomes

	seg_listaSegmentosSelecionados = [];
	var userChamp = champsBrazil.indexOf(W.loginManager.user.userName) != -1;

	document.getElementById('btnIniciarRevisao').disabled = true;
	document.getElementById('btnPararRevisao').disabled = false;

	for (i = 0; i < Waze.selectionManager.getSelectedFeatures().length; i++) {
		for (var seg in wazeModel.segments.objects) {
			if (wazeModel.segments.objects[seg].geometry.id == Waze.selectionManager.getSelectedFeatures()[i].geometry.id) {
				seg_listaSegmentosSelecionados.push(seg);
				break;
			}
		}
	}

	if (funRevVia_VerificarCidadeEscolhida() == false) {
		return;
	}

	genericExibirMensagem(genericTraducao('msg_RevisaoAguarde'));
	var streetAlterados = [];

	for (var seg in wazeModel.segments.objects) {
		if (seg_listaSegmentosSelecionados.length != 0 &&
			seg_listaSegmentosSelecionados.indexOf(seg) == -1) {
			//se for de selecionados, e não é dos selecioados, Tchau!
			continue;
		}

		var segmento = wazeModel.segments.objects[seg];
		var segmentoSelecionado = false;
		var painelAberto = false;

		//Só fazer na tela.
		if (funRevVia_VerificarSegmentoVisivel(segmento)) {
			var segmentoSts = [];
			segmentoSts.push(segmento.attributes.primaryStreetID);
			segmentoSts = segmentoSts.concat(segmento.attributes.streetIDs); //Assim para primaryStreetID ser a primeira SEMPRE

			var NomeOriginais = [];
			var NomesModificados = [];

			for (iBuscaNome = 0; iBuscaNome < segmentoSts.length; iBuscaNome++) {
				console.log("buscando nomes: " + segmentoSts[iBuscaNome]);

				if (typeof (wazeModel.streets.objects[segmentoSts[iBuscaNome]]) != 'undefined'
					&& typeof (wazeModel.streets.objects[segmentoSts[iBuscaNome]].name) != 'undefined'
					&& wazeModel.streets.objects[segmentoSts[iBuscaNome]].name != null
					&& wazeModel.streets.objects[segmentoSts[iBuscaNome]].name != "") {
					NomeOriginais.push(wazeModel.streets.objects[segmentoSts[iBuscaNome]].name);
					NomesModificados.push(funRevVia_CorrigirNome(segmentoSts[iBuscaNome]));
				}
			}

			//sangrentos
			if (segmento.attributes.primaryStreetID == null) {

				funRevVia_SelecionarSegmento(segmento, segmentoSelecionado);
				painelAberto = funRevVia_AbrirPainel(painelAberto);
				funRevVia_CorrigirSegmentoSangrento(segmento);
				funRevVia_AplicarCorrecao(painelAberto);
				continue;
			}

			if (streetAlterados.indexOf(segmentoSts[0]) == -1) {
				//faz a mudança por streetId (que significam os nomes da via - principal e alternativos).
				for (iStreetLocalizada = 0; iStreetLocalizada < segmentoSts.length; iStreetLocalizada++) {
					//Alternativos duplicados (inválidos)
					if (funRevVia_CorrigirNomesDuplicados(segmento, segmentoSts, NomesModificados, iStreetLocalizada, segmentoSelecionado, painelAberto)) {
						segmentoSelecionado = true;
						painelAberto = true;
					}

					console.log('Original: ' + NomeOriginais[iStreetLocalizada]);
					console.log('Abreviado: ' + NomesModificados[iStreetLocalizada]);

					//se teve mudança, faça-a!
					if (NomeOriginais[iStreetLocalizada] != NomesModificados[iStreetLocalizada]) {
						funRevVia_CorrigirGrafiaNome(segmento, segmentoSts, NomesModificados, iStreetLocalizada, segmentoSelecionado, painelAberto);
						segmentoSelecionado = true;
						painelAberto = true;

						streetAlterados = streetAlterados.concat(segmentoSts);
					}
				}

				funRevVia_AplicarCorrecao(painelAberto);
			}
		}
	}

	console.log("Acabou revisão de nomes de segmentos.");
	console.log(seg_NomesRuasColetados);
	document.getElementById('btnIniciarRevisao').disabled = false;
	document.getElementById('btnPararRevisao').disabled = true;


	if (document.getElementById('chkRevisaoPlace') != null &&
		document.getElementById('chkRevisaoPlace').checked) {
		funRevPla_IniciarFaxina();
	}
}

function funRevVia_VerificarSegmentoVisivel(segmento) {
	var totalGeo = segmento.geometry.components.length;
	var naTela = 0;
	for (var compSegmento = 0; compSegmento < totalGeo; compSegmento++) {
		var pontogeometrico = segmento.geometry.components[compSegmento];

		if (Waze.map.getExtent().toGeometry().containsPoint(pontogeometrico)) {
			naTela++;
		}
	}

	return (naTela == totalGeo);
}

function funRevVia_SelecionarSegmento(segmento, segmentoSelecionado) {
	if (!segmentoSelecionado) {
		var instrucao = "                                                           \
		var segmento = wazeModel.segments.objects["+ segmento.attributes.id + "];  \
		var t = [];                                                                 \
		t.push(segmento);                                                           \
		Waze.selectionManager.setSelectedModels(t);";
		genericAssincCommand(instrucao, false);
	}

	return true;
}

function funRevVia_AbrirPainel(painelAberto) {  ///ABRIR PAINEL PARA EDIÇÃO DO NOME
	if (!painelAberto) {
		var instrucao = "                                   \
			$('[class=\"full-address\"]').click();     \
			genericAssincBreak();";
		genericAssincCommand(instrucao, false);
	}

	return true;
}

function funRevVia_CorrigirSegmentoSangrento(segmento) {
	var instrucao = "";

	if (seg_NomeCidadeEscolhida != null) {
		instrucao = "$('[class=\"form-control state-id\"]').val(\"" + seg_IdEstadoCidadeEscolhida + "\");";
		genericAssincCommand(instrucao, false);

		console.log(instrucao);

		instrucao = "$('input[class=\"city-name form-control\"]').attr(\"value\",\"" + seg_NomeCidadeEscolhida + "\");";

		console.log(instrucao);
	}
	else {
		instrucao = "$('input[class=\"empty-city\"]').click();";
	}
	genericAssincCommand(instrucao, false);

	instrucao = "$('input[class=\"empty-street\"]').click();";
	genericAssincCommand(instrucao, false);

}

function funRevVia_CorrigirNomesDuplicados(segmento, segmentoSts, NomesModificados, iStreetLocalizada, segmentoSelecionado, painelAberto) {
	if (iStreetLocalizada != 0) {
		//Vejo se já está na lista, se tiver é duplicado, deve ser apagado.
		var existente = false;
		for (j = 0; j < segmentoSts.length; j++) {
			if (NomesModificados[iStreetLocalizada] == NomesModificados[j] && iStreetLocalizada != j) {
				//Opa é um duplicado, apaga o iStreetLocalizada
				existente = true;
				break;
			}
		}

		if (existente) {
			funRevVia_SelecionarSegmento(segmento, segmentoSelecionado);
			funRevVia_AbrirPainel(painelAberto);

			console.log("apagando nome duplicado" + segmentoSts[iStreetLocalizada]);
			var instrucao = "$('tr[data-id=\"" + segmentoSts[iStreetLocalizada] + "\"]').find('a[class=\"alt-street-delete\"]').click();";
			genericAssincCommand(instrucao, true);
		}

		return existente;
	}

	return false;
}

function funRevVia_CorrigirGrafiaNome(segmento, segmentoSts, NomesModificados, iStreetLocalizada, segmentoSelecionado, painelAberto) {

	seg_NomesRuasColetados.push(NomesModificados[iStreetLocalizada]);
	segmentoSelecionado = funRevVia_SelecionarSegmento(segmento, segmentoSelecionado);  ///////////////////////////////////////////ACOMPANHAR

	//junior tu tava apanhando pra selecionar toda a via, a treta tá aqui.
	//Como antes o beta e o produção eram diferentes, eu tava disparando todos os possíveis aqui.
	var instrucao = "                                                                                   \
		$('a[class=\"select-entire-street\"]').click();                                                 \
		$('button[class=\"action-button btn btn-default btn-positive select-entire-street\"]').click(); \
		$('button[class=\"action-button btn btn-default select-entire-street\"]').click();              \
		$('button[class=\"action-button select-entire-street waze-btn waze-btn-white\"]').click();";
	genericAssincCommand(instrucao, false);

	painelAberto = funRevVia_AbrirPainel(painelAberto);

	//Principal ou alternativa?
	if (iStreetLocalizada == 0) {

		instrucao = "document.getElementsByClassName(\"form-control street-name tts-input\")[0].value = \"" + NomesModificados[iStreetLocalizada] + "\";";
		genericAssincCommand(instrucao, false);

		//Força o campo a saber que mudou. O WME guarda o valor em algum outro canto.
		instrucao = "$('[class=\"form-control street-name tts-input\"]').trigger('change');";
		genericAssincCommand(instrucao, false);

	}
	else {

		//Alternativo a gente apaga e cria outro.
		instrucao = "$('tr[data-id=\"" + segmentoSts[iStreetLocalizada] + "\"]').find('a[class=\"alt-street-delete\"]').click();";
		genericAssincCommand(instrucao, false);

		instrucao = "$('a[class=\"add-alt-street-btn\"]').click();";
		genericAssincCommand(instrucao, false);

		instrucao = "$('tr[class=\"alt-street-form-template new-alt-street\"]').find('input[name=\"streetName\"]').attr(\"value\", \"" + NomesModificados[iStreetLocalizada] + "\");";
		genericAssincCommand(instrucao, false);

		funRevVia_AplicarCorrecao(painelAberto);
	}
}

function funRevVia_AplicarCorrecao(painelAberto) {
	//Para este segmento acabou. Se mudou aplicar.
	if (painelAberto) {

		var instrucao = "                                                                                       \
			$('div[class=\"action-buttons\"]').find('button[class=\"save-button waze-btn waze-btn-blue waze-btn-smaller\"]').click();   \
			genericAssincBreak();";
		genericAssincCommand(instrucao, true);
	}
}

//-----------------------------------------------------------------------------------------------------------

function funRevPla_IniciarFaxina() {
	document.getElementById('btnIniciarRevisaoPlace').disabled = true;
	document.getElementById('btnPararRevisaoPlace').disabled = false;

	seg_NomesRuasColetados = [];

	for (var place in wazeModel.venues.objects) {
		var landmark = wazeModel.venues.objects[place];

		//places não visuais, não faço nada com eles.
		if (!Waze.map.getExtent().toGeometry().containsPoint(funPlace_ObterPoint(landmark.attributes.geometry))) {
			continue;
		}

		if (landmark.attributes.approved &&
			landmark.attributes.venueUpdateRequests.length == 0 &&
			landmark.state == null)//não pegar quem já deletei.
		{
			console.log('Avaliando place ' + place);

			//Posto de Combustível sem nome
			if (landmark.attributes.name == "") {
				if (landmark.isGasStation()) {
					//Colocar "Posto de Combustível"
					funRevPla_SelecionarPlace(landmark);
					funRevPla_NovoNome("Posto de Combustível")
					continue;
				}
			}

			//Posto ESSO ou Ypiranga
			if (landmark.isGasStation()) {
				if (landmark.attributes.brand == "Esso") {
					var nome = " " + landmark.attributes.name + " ";
					nome = nome.replace("Esso", "Shell").trim();
					funRevPla_SelecionarPlace(landmark);
					funRevPla_MudarBandeira(nome, "Shell");
					continue;
				}

				if (landmark.attributes.brand == "Ypiranga") {
					funRevPla_SelecionarPlace(landmark);
					funRevPla_MudarBandeira(landmark.attributes.name, "Ipiranga");
					continue;
				}
			}

			//Arrumar Categorias
			if (document.getElementById('chkNomeCategoria').checked) {
				for (var iCategorias = 0; iCategorias < nomeCategoria.length; iCategorias++) {
					var testeNome = new RegExp(genericDesacentuaTexto(nomeCategoria[iCategorias][nomeCategoriaColunas.Identificacao]), "gi");

					if (testeNome.test(genericDesacentuaTexto(landmark.attributes.name))) {
						console.log('identificado em ' + nomeCategoria[iCategorias][nomeCategoriaColunas.Identificacao]);


						var placeAlterado = false;

						if (nomeCategoria[iCategorias][nomeCategoriaColunas.NomePadrao] != "") {
							funRevPla_SelecionarPlace(landmark);
							funRevPla_NovoNome(nomeCategoria[iCategorias][nomeCategoriaColunas.NomePadrao]);
							placeAlterado = true;
						}

						if (landmark.attributes.categories[0] != nomeCategoria[iCategorias][nomeCategoriaColunas.Categoria]) {
							funRevPla_SelecionarPlace(landmark);
							funRevPla_AlterarCategoria(nomeCategoria[iCategorias][nomeCategoriaColunas.Categoria]);
							placeAlterado = true;
						}

						if (placeAlterado) {
							continue;
						}
					}
				}
			}

			var nomeOriginal = " " + landmark.attributes.name;

			//Se tiver tudo maiusculo, pelo menos vamos deixar "arrumadinho"
			if (nomeOriginal == nomeOriginal.toUpperCase()) {
				var splitado = nomeOriginal.split(' ');
				nomeOriginal = '';
				for (x = 0; x < splitado.length; x++) {
					nomeOriginal += splitado[x].charAt(0).toUpperCase() + splitado[x].slice(1).toLowerCase() + ' ';
				}
			}

			var nomeNovo = funRevisao_CorrigirNome(nomeOriginal);

			if (nomeOriginal.trim() != nomeNovo.trim()) {
				//Ajusta o nome
				seg_NomesRuasColetados.push(nomeOriginal + "    trocando por      " + nomeNovo);

				funRevPla_SelecionarPlace(landmark);
				funRevPla_NovoNome(nomeNovo.trim());
				continue;
			}
		}
	}

	console.log("Acabou");
	console.log(seg_NomesRuasColetados);

	document.getElementById('btnIniciarRevisaoPlace').disabled = false;
	document.getElementById('btnPararRevisaoPlace').disabled = true;
}

function funRevPla_SelecionarPlace(landmark) {
	var instrucao = "                                                                                       \
	var landmark = wazeModel.venues.objects[\""+ landmark.attributes.id + "\"];                             \
																											\
	console.log(\"Update place \" + landmark.attributes.id + \" Started\");                                 \
																											\
	var t = [];                                                                                             \
	t.push(landmark);                                                                                       \
	Waze.selectionManager.setSelectedModels(t);                                                                        \
																											\
	genericAssincBreak();";
	genericAssincCommand(instrucao, false);
}

function funRevPla_Apagar() {
	var instrucao = "$('div[class=\"toolbar-button WazeControlDeleteFeature ItemInactive\"]').click();";
	genericAssincCommand(instrucao, true);
}

function funRevPla_ConverterResidencial(numero) {
	var instrucao;

	if (numero != null) {
		instrucao = "$('a[class=\"address-edit-input primary-street\"]').click();";
		genericAssincCommand(instrucao, false);

		instrucao = "$('input[name=\"houseNumber\"]').attr('value', " + numero + ");";
		genericAssincCommand(instrucao, false);

		instrucao = "$('button[class=\"save-button waze-btn waze-btn-blue waze-btn-smaller\"]').click();";
		genericAssincCommand(instrucao, true);
	}

	instrucao = "$('button[class=\"btn-link toggle-residential\"]').click();";
	genericAssincCommand(instrucao, true);
}

function funRevPla_MudarBandeira(novoNome, bandeira) {
	var instrucao = "$('input[name=\"services\"]')[0].click();";    //Fake... só serve pra gerar Action no ActionManager
	genericAssincCommand(instrucao, false);

	instrucao = "                                                                               \
				wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].newAttributes = \
					{ name: \""+ novoNome + "\", brand: \"" + bandeira + "\" };                             \
																											\
				$('[name=\"name\"]')[0].value = \""+ novoNome + "\";                                        \
																											\
				wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].oldAttributes = \
					{ name: \"\", brand: \"\" };";
	genericAssincCommand(instrucao, true);
}

function funRevPla_NovoNome(novoNome) {
	var instrucao = "$('input[name=\"services\"]')[0].click();";    //Fake... só serve pra gerar Action no ActionManager
	genericAssincCommand(instrucao, false);

	instrucao = "                                                                               \
			wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].newAttributes = \
				{ name: \"" + novoNome + "\"};                                                          \
																										\
			$('[name=\"name\"]')[0].value = \""+ novoNome + "\";                                        \
																										\
			wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].oldAttributes = \
				{ name: \"\" };";

	genericAssincCommand(instrucao, true);
}

function funRevPla_AdicionarAlternativo(alternativo) {
	var instrucao = "$('[class=\"add\"]')[0].click();";
	genericAssincCommand(instrucao, false);

	instrucao = "$('input[name=\"services\"]')[0].click();";    //Fake... só serve pra gerar Action no ActionManager
	genericAssincCommand(instrucao, false);

	instrucao = "                                                                                       \
			wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].newAttributes = \
				{ aliases: [\"" + alternativo + "\"] };                                                 \
																										\
			$('[class=\"alias-name form-control\"]')[0].value = \"" + alternativo + "\";                    \
																										\
			wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].oldAttributes = \
				{ aliases: [] };";

	genericAssincCommand(instrucao, true);
}

function funRevPla_AlterarCategoria(novaCategoria) {
	var instrucao = "$('[class=\"fa fa-remove\"]').click();";
	genericAssincCommand(instrucao, false);

	for (var item in W.Config.venues.subcategories) {
		var categoria = W.Config.venues.subcategories[item];

		if (item == novaCategoria) {
			instrucao = "$('[data-category=\"" + item + "\"]')[0].click();";
			genericAssincCommand(instrucao, false);
			break;
		}

		for (var cats = 0; cats < categoria.length; cats++) {
			if (categoria[cats] == novaCategoria) {
				instrucao = "$('[data-category=\"" + item + "\"]')[0].click();";
				genericAssincCommand(instrucao, false);

				console.log(novaCategoria);

				instrucao = "$('[data-category=\"" + novaCategoria + "\"]')[0].click();";
				genericAssincCommand(instrucao, true);

				break;
			}
		}
	}
}

function funRevPla_Descricao(descricao) {
	var instrucao = "$('input[name=\"services\"]')[0].click();";    //Fake... só serve pra gerar Action no ActionManager
	genericAssincCommand(instrucao, false);

	instrucao = "                                                                                       \
			wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].newAttributes = \
				{ description: \"" + descricao + "\"};                                                  \
																										\
			$('[name=\"description\"]')[0].value = \"" + descricao + "\";                               \
																										\
			wazeModel.actionManager.getActions()[wazeModel.actionManager.getActions().length - 1].oldAttributes = \
				{ description: \"\" };";

	genericAssincCommand(instrucao, true);
}

/// <summary>
/// Faz as devidas abreviações e correções de grafia registradas nas listas
/// </summary>
/// <param name="nomeCorrigir">Nome a corrigir</param>
/// <returns>Nome Corrigido</returns>
function funRevisao_CorrigirNome(nomeCorrigir) {
	for (x = 0; x < grafias.length; x++) {
		if (nomeCorrigir.toUpperCase().indexOf(grafias[x].toUpperCase()) != -1) {
			var re = new RegExp(grafias[x], "gi");
			nomeCorrigir = nomeCorrigir.replace(re, grafiasCorretas[x]);
		}
	}

	return nomeCorrigir;
}
/*FINAL Revisão de nomes*/

/*FINAL*/

/* engage! =================================================================== */
genericBootstrap();
/* end ======================================================================= */