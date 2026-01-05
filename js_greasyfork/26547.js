// ==UserScript==
// @name        filtrowikiaves
// @namespace   -
// @description Adiciona filtro que permite comparar duas fontes (usuário/local)
// @include     http://www.wikiaves.com/especies.php?*&o=3&ef=
// @include     http://www.wikiaves.com.br/especies.php?*&o=3&ef=
// @version     1.1
// @require    	https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26547/filtrowikiaves.user.js
// @updateURL https://update.greasyfork.org/scripts/26547/filtrowikiaves.meta.js
// ==/UserScript==

var selecidade,seleuser,mudacidade,mudauser,extrato;

if(!('contains' in String.prototype)){String.prototype.contains = function(str, startIndex){return -1 !== String.prototype.indexOf.call(this, str, startIndex);};}

function comeca() {	
		
	$(".textpadding > div").append($("<span> | <b><a href=#>Filtrar espécies de: </a></b></span> "));	 
	$(".textpadding > div").append($("<button type='button' id='botus'> Usuário </button>"));
	$(".textpadding > div").append($("<button type='button' id='botcid'> Cidade </button>"));
	$(".textpadding > div").append($('<input style="width:200px;display:none" id="usuario" title="(Selecione um Usuário)" tabindex="3" size="36" class="buscausuario ui-autocomplete-input"  name="usuario" autocomplete="off">'));
	$(".textpadding > div").append($('<input style="width:200px;display:none" id="cidade" title="(Selecione uma Cidade)" tabindex="3" size="36" class="buscacidade ui-autocomplete-input" name="cidade" autocomplete="off">'));
	
	document.getElementById("botus").onclick = function (){
			document.getElementById("botus").style.display = "none";
			document.getElementById("botcid").style.display = "none";
			document.getElementById("usuario").style.display = "";
		location.href = 'javascript:void($(function() {\
			$(".buscausuario").blur(function(e) {\
				if(e.target.value == "") {\
					$("#"+e.target.name+"_hidden").val("");}});\
			$(".buscausuario").autocomplete({\
					minLength: 2,\
					source: "getUsuariosJSON.php",\
					open: zebrar,\
					select: function(event, ui) {\
						$("#"+event.target.name+"_hidden").val(ui.item.id);\
						seleuser = "especies.php?t=u&u="+ui.item.id;\
						mudauser = ui.item.label;\
						function conecta(){var xhr;	xhr = new XMLHttpRequest();xhr.open("GET", seleuser, false);	xhr.send();	extrato = xhr.response;	return (extrato);};conecta();\
						function analisa() {var tabela = document.getElementsByClassName("especies") [0];	var seletorc, cago;for (var i = 2; i<=tabela.rows.length; i++) {\
							var row = tabela.rows[i];\
							seletorc =  "tr.especie:nth-child(" + i + ") > td:nth-child(5) > a:nth-child(1)";\
							cago = $(seletorc).attr("href");\
							if (cago===undefined){\
								cago = $("tr.especie:nth-child(" + i + ") > td:nth-child(4) > a:nth-child(1)").attr("href");}\
							var res= cago.substring((cago.indexOf("s=")+2));\
							if (extrato.contains(res)){\
								var cuia = "tr.especie:nth-child(" + i + ")";\
								$(cuia).hide();}}}\
							analisa();\
						function contar(atabela) {tt = 0;for (var i = 1, row; i<=atabela.rows.length; i++) {row = atabela.rows[i];	var cuia = "tr.especie:nth-child(" + i + ")";\
																				if ($(cuia).is(":visible")){tt++;}}	return (tt);}var tabela = document.getElementsByClassName("especies") [0];contar(tabela);\
						$(".total > b:nth-child(2)").text(tt);\
						$(".total").append(" filtradas de "+mudauser);\
						$(".total").get(0).scrollIntoView();\
						document.getElementById("usuario").disabled = true;}\
			}).data( "ui-autocomplete" )._renderItem = renderBuscaCidade;\
			$(".buscausuario").jLabel();}))';

	}
	document.getElementById("botcid").onclick = function (){

		document.getElementById("botus").style.display = "none";
		document.getElementById("botcid").style.display = "none";
		document.getElementById("cidade").style.display = "";
		location.href = 'javascript:void($( function() {\
				$(".buscacidade").blur(function(e) {\
				if(e.target.value == "") {\
					$("#"+e.target.name+"_hidden").val("");}});\
				$(".buscacidade").autocomplete({\
					minLength: 2,\
					source: "getCidadesJSON.php",\
					open: zebrar,\
					select: function(event, ui) {\
						selecidade = "especies.php?t=c&c="+ui.item.id;\
						mudacidade = ui.item.label+"/"+ui.item.uf;\
						function conecta(){var xhr;	xhr = new XMLHttpRequest();xhr.open("GET", selecidade, false);	xhr.send();	extrato = xhr.response;	return (extrato);};conecta();\
						function analisa() {var tabela = document.getElementsByClassName("especies") [0];	var seletorc, cago;for (var i = 2; i<=tabela.rows.length; i++) {\
						var row = tabela.rows[i];\
						seletorc =  "tr.especie:nth-child(" + i + ") > td:nth-child(5) > a:nth-child(1)";\
						cago = $(seletorc).attr("href");\
						if (cago===undefined){\
							cago = $("tr.especie:nth-child(" + i + ") > td:nth-child(4) > a:nth-child(1)").attr("href");}\
						var res= cago.substring((cago.indexOf("s=")+2));\
						if (extrato.contains(res)){\
							var cuia = "tr.especie:nth-child(" + i + ")";\
							$(cuia).hide();}}}\
						analisa();\
						function contar(atabela) {tt = 0;for (var i = 1, row; i<=atabela.rows.length; i++) {row = atabela.rows[i];	var cuia = "tr.especie:nth-child(" + i + ")";\
																				if ($(cuia).is(":visible")){tt++;}}	return (tt);}var tabela = document.getElementsByClassName("especies") [0];contar(tabela);\
						$(".total > b:nth-child(2)").text(tt);\
						$(".total").append(" filtradas de "+mudacidade);\
						$(".total").get(0).scrollIntoView();\
						document.getElementById("cidade").disabled = true;}\
					}).data( "ui-autocomplete" )._renderItem = renderBuscaCidade;\
				$(".buscacidade").jLabel();}))';
		};
	
		//ui.item."login" -> pode ser id , label (nome/cidade) , uf	
 }

waitForKeyElements('.ttPage', comeca);

	