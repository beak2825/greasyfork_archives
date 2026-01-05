// ==UserScript==
// @name         FC
// @namespace    https://greasyfork.org/es/scripts/20780-fc
// @version      1.1.1
// @description  Borra temas por palabra clave en forocoches.
// @author       DonNadie
// @match        http://*.forocoches.com/*
// @match        https://*.forocoches.com/*
// @match        http://www.forocoches.com/*
// @match        https://www.forocoches.com/*
// @exclude      http://www.forocoches.com/foro/private.php*
// @exclude      https://*.forocoches.com/foro/private.php*
// @exclude      http://*.forocoches.com/foro/private.php*
// @exclude      http://www.forocoches.com/foro/newthread.php*
// @exclude      https://*.forocoches.com/foro/newthread.php*
// @exclude      http://*.forocoches.com/foro/newthread.php*
// @exclude      http://www.forocoches.com/foro/newreply.php*
// @exclude      https://*.forocoches.com/foro/newreply.php*
// @exclude      http://*.forocoches.com/foro/newreply.php*
// @exclude      http://www.forocoches.com/foro/showthread.php?t=*
// @exclude      https://*.forocoches.com/foro/showthread.php?t=*
// @exclude      http://*.forocoches.com/foro/showthread.php?t=*
// @grant        none
// @require 	 http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/20780/FC.user.js
// @updateURL https://update.greasyfork.org/scripts/20780/FC.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var hitman = function ()
{
	var words = {
		politics: ["VOX","partido popular", " C'S", "votado", "podemita","pudremitas", "riverita", "peperro","político", "Saenz de Santamaria", "Sáenz de Santamaría", "votantes", "pdr snchz", "partidos politicos", "partidos políticos", "partido político", "partido politico", "Pedro Sánchez", "Pedro Sanchez", "rajoy","soraya", "falange", "pableras", "upyd", "coletas","psoe","debate", "carmena", "voto", "pablemos", "ciudadanos", "ciutadans", "discurso", "albert", "rivera", "iglesias", "elecciones", "votar", "votación", "votacion", "pedro sanchez", "pedro sánchez", "podemos", "podemitas", " pp","Donald","trump","Hilari","clinton","jilari","espinar","rufian"],
		football: ["Peña Real Valladolid","Peña Bética", "Peña Athletic", "PEÑA COLCHONERA", "PENYA BLAUGRANA", "piqué", "PEÑA CELTISTA", "real madrid", "futbol", "fútbol", "porra", "apuesta", "penya culer", "peña culer", "culers", "culeros", "culerdos", "FC Barcelona", "barça", "Barsa", "atleti", "PEÑA VALENCIANISTA", "merengue","ronaldo","guardiola"]
	},
	censorList = [];
	
	var init = function ()
	{
		if (window.$('#vB_Editor_001_iframe').length > 0) {
		       return;
		}
		getCensoredWords();
		removeThreads();
		setupPanel();
	};
	
	var setupPanel = function ()
	{
		window.$(".cajasprin:nth-of-type(1) tr").eq(1).append('<td><div id="hitman-config" title="Configuración de hitman (borrado de temas)">Anti-CiberVoluntarios</div></d>');
		
		var html = parseTemplate(function()
		{/*
			<div id="hitman-panel">
				Esconder temas de:
				<ul>
					<li>
						<label>
							<input type="checkbox" value="politics"> Política
						</label>
					</li>
					<li>
						<label>
							<input type="checkbox" value="football"> Fútbol
						</label>
					</li>
					<li>
						<br>
						<label>
							Filtro propio:<br>
							<textarea name="hitman-custom" placeholder="gore,movistar"></textarea>
						</label>
					</li>
				</ul>
				<button>Guardar cambios</button>
				<br>
				<a href="https://greasyfork.org/es/scripts/20774-fc-capie/versions">Ver actualizaciones</a>
			</div>
			<style>
				#hitman-config {
					cursor: pointer;
					color: #1CC4F9;
				}
				#hitman-panel {
					display: none;
					position: fixed;
				    background: white;
				    padding: 5px;
				    border: 1px solid;
				    margin-left: 74%;
				    margin-top: 6%;
				}
				#hitman-panel  ul {
					list-style-type: none;
			    	padding: 0px;
			    	margin-top: 0px;
				}
			</style>
		*/});
		window.$("body").prepend(html);
		
		window.$("#hitman-config").on("click", function () {
			window.$('#hitman-panel').toggle();
		});

		window.$("#hitman-panel input").on("change", function () {
			updateCensor(window.$(this).val(), window.$(this).is(":checked"));
		});
		window.$("#hitman-panel textarea").on("change", function () {
			updateCensor("custom",window.$(this).val());
		});
		
		window.$("#hitman-panel button").on("click", function () {
			location.reload();
		});
		loadConfig();
	};
	var loadConfig = function ()
	{
		var config = getConfig(),
			k;
		
		for (k in config) {
			if (config[k]) {
				if (k == "custom") {
					window.$('#hitman-panel textarea[name="hitman-custom"]').val(config[k]);
				} else {
					window.$("#hitman-panel input[value=" + k + "]").prop("checked", true);
				}
			}
		}
	};
	var parseTemplate = function(func) {
		return func.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '');
	};
	
	var updateCensor = function (type, status)
	{
		var config = getConfig();
		
		config[type] = status;
		
		setConfig(config);
	};
	
	var getConfig = function ()
	{
		var config = localStorage.hitman;
		
		if (config === undefined) {
			// default config
			return {
				politics: true,
			};
		}
		
		return JSON.parse(config);
	};
	
	var setConfig = function (config) {
		localStorage.hitman = JSON.stringify(config);
	};
	
	// find and delete threads containing the censored words
	var removeThreads = function ()
	{
		var $mainForum = window.$('#threadbits_forum_2');
		
		if ($mainForum.length > 0)
		{
			var deletedCount = 0;
			
			$mainForum.append(parseTemplate(function(){/*
				<tr class="hitman-separator">
					<td></td>
					<td></td>
  					<td></td>
				  	<td></td>
				  	<td></td>
				</tr>
				<tr class="hitman-separator">
					<td></td>
					<td></td>
  					<td><a id="hitman-next-page" href="#">Siguiente página &gt;</a></td>
				  	<td></td>
				  	<td></td>
				</tr>
				<tr class="hitman-separator">
					<td></td>
					<td></td>
  					<td></td>
				  	<td></td>
				  	<td></td>
				</tr>
				<tr class="hitman-separator">
					<td class="thead"></td>
					<td class="thead"></td>
  					<td class="thead">&nbsp;</td>
				  	<td class="thead"></td>
				  	<td class="thead"></td>
				</tr>
				<tr class="hitman-separator">
					<td class="tcat"></td>
					<td class="tcat"></td>
					<td class="tcat">Posts eliminados por hitman</td>
				  	<td class="tcat" id="hitman-count" align="right">0</td>
				  	<td class="tcat"></td>
				</tr>
				<tr>
				    <td class="thead" colspan="2" width="57">&nbsp;</td>
				    <td class="thead" width="100%">
				        <span style="float:right"><a href="#" rel="nofollow">Calificación</a> </span>
				        <a href="#">Tema</a> /
				        <a href="#" rel="nofollow">Autor</a>
				    </td>
				    <td class="thead" width="150" align="center" nowrap="nowrap"><span style="white-space:nowrap"><a href="#">Último Mensaje</a></span></td>
				    <td class="thead" align="center" nowrap="nowrap">
				    	<span style="white-space:nowrap">
				    		<a href="#" rel="nofollow" title="Respuestas">R.</a> </span> / <span style="white-space:nowrap"><a href="#" rel="nofollow" title="Visitas">V.</a>
				    	</span>
				    </td>
				</tr>
			*/}));
			
			// General section
			window.$('#threadbits_forum_2 tr:not(.hitman-separator)').each(function ()
			{
				var censoredWord = false,
					$tr = window.$(this),
					$title = $tr.find('td[title] a[style="font-weight:bold"]'),
					intro = $tr.find("td[title]").attr("title");
				
				if ($title.text().length === 0) {
					return true;
				}
				
				censoredWord = mustBeRemoved($title.text() + " " + intro);
				
				if (censoredWord !== false)
				{
					$tr.css('opacity', 0.2);
					$title.append(" (" + censoredWord + ")");
					
					// move tr to bottom
					$mainForum.append($tr);
					deletedCount++;
				}
			});
			
			window.$('#hitman-count').text(deletedCount);
			window.$('#hitman-next-page').attr("href", window.$('a[rel="next"]').eq(0).attr("href"));
		} else {
			// Home
			window.$('table[border="0"][cellpadding="2"][cellspacing="0"][width="100%"]').eq(3).find("tr").each(function ()
			{
				var $thread = window.$(this).find('td[align="left"] a').eq(1),
					text = $thread.text() + " " + $thread.attr("title");
					
				if (mustBeRemoved(text)) {
					window.$(this).remove();
				}
			});
		}
	};
	
	var getCensoredWords = function ()
	{
		if (censorList.length > 0) {
			return censorList;
		}
		
		var config = getConfig(),
			k;
		
		// setup the word censorship list
		for (k in config) {
			if (config[k]) {
				if (k == "custom" && config[k].length > 0) {
					censorList = censorList.concat(config[k].split(","));
				} else {
					censorList = censorList.concat(words[k]);
				}
			}
		}
		
		return censorList;
	};
	
	var mustBeRemoved = function (text)
	{
		var regex,
			k;
		
		for (k in censorList)
		{
			regex = new RegExp(censorList[k], "i");
			
			if (text.search(regex) !== -1) {
				return censorList[k];
			}
		}
		return false;
    };
	
	return {
		init: init
	};
}();

window.$(document).ready(function() {
	hitman.init();
});