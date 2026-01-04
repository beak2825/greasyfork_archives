// ==UserScript==
// @name				Muleta 5.0 (PRD0028)
// @namespace			https://greasyfork.org/pt-BR/users/717545
// @description			Injeta o código da Muleta no Configurador Bravas
// @author				Paulo R. Ribeiro
// @version				6.5.0.3
// @date				2022-04-07
// @encoding			utf-8
// @license				https://creativecommons.org/licenses/by-sa/4.0/
// @icon				https://intranet.cidadejardim.poa.br/assets/libs/falarcompaulo/muleta/5.0.0/home-icon.png
// @homepageURL			https://www.falarcompaulo.com.br/
// @contactURL			https://www.falarcompaulo.com.br/contato/
// @supportURL			https://greasyfork.org/pt-BR/scripts/442809/feedback
// @twitterURL			https://twitter.com/falarcompaulo
// @contributionURL		https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=falarcompaulo@ymail.com&item_name=Contribuir+para+o+desenvolvimento+da+Muleta
// @contributionAmount	5.00
// @match				://*/home.php
// @grant				GM_getValue
// @grant				GM_setValue
// @grant				unsafeWindow
// @run-at				document-end
// @connect				*
// @license				CC BY-NC-SA 4.0
// @frames
// @downloadURL https://update.greasyfork.org/scripts/442809/Muleta%2050%20%28PRD0028%29.user.js
// @updateURL https://update.greasyfork.org/scripts/442809/Muleta%2050%20%28PRD0028%29.meta.js
// ==/UserScript==
/*eslint no-multi-str:0*/
/*jshint curly:false esversion:6 evil:true jquery:true newcap:false quotmark:single*/
/*noframes, unsafeWindow, GM_getValue, GM_setValue, $, document, console, location, setInterval, setTimeout, clearInterval*/

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║      __      _                                                 _           ║
 * ║     / _|    | | Prestador Autônomo de Serviços de Informática | |          ║
 * ║    | |_ __ _| | __ _ _ __ ___ ___  _ __ ___  _ __   __ _ _   _| | ___      ║
 * ║    |  _/ _` | |/ _` | '__/ __/ _ \| '_ ` _ \| '_ \ / _` | | | | |/ _ \     ║
 * ║    | || (_| | | (_| | | | (_| (_) | | | | | | |_) | (_| | |_| | | (_) |    ║
 * ║    |_| \__,_|_|\__,_|_|  \___\___/|_| |_| |_| .__/ \__,_|\__,_|_|\___/     ║
 * ║                                             | |                            ║
 * ║      Paulo R. Ribeiro | (51) 997-367-583    |_|   .com.br | @ymail.com     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * user.js
 * detecta o bravas pelo IP e injeta o carregador de scripts
 **/

'use strict';

(function(window)
{
	'use strict';

	var options = {
		clientHost: window.location.hostname,
		clientPort: window.location.port,
		expectedIp: 99,
		expectedPort: 8887,
		protocol: window.location.protocol,
		serverHost: 'intranet.cidadejardim.poa.br'
	};

	function detectBravasByIp()
	{
		var len = options.clientHost.split('.').length;

		if (len != 4)
			return false;

		if (len == 4 && !isNumber(options.clientHost.split('.')[3]))
			return false;

		if (options.clientHost.split('.')[3] != options.expectedIp)
			return false;
		
		if (options.clientPort != options.expectedPort)
			return false;

		return true;
	}

//	How can I check if a string is a valid number?
//	https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number/175787
	function isNumber(str)
	{
	//	we try for numbers first
		if (typeof str == 'number')
			return true;

	//	we only process strings!
		if (typeof str != 'string')
			return false;

	//	use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
	//	...and ensure strings of whitespace fail
		return !isNaN(str) && !isNaN(parseFloat(str));
	}

	function randomNumberGenerator(len)
	{
		if (len === '')
			len = 16;

		var list = '0123456789', rand = '';
		for (var i=0; i<len; i++)
		{
			rand += list.charAt(Math.floor(Math.random() * list.length));
		}
		return rand;
	}

	if (detectBravasByIp())
	{
		console.log('Bravas detectado pelo endereço IP');

		var script = document.createElement('script');
			script.crossorigin = 'anonymous';
			script.language = 'javascript';
			script.src = options.protocol + '//' + options.serverHost + '/assets/libs/falarcompaulo/muleta/5.0.0/loader.js?rand=' + randomNumberGenerator();
			script.type = 'text/javascript';
		document.getElementsByTagName('head')[0].appendChild(script);
		console.log('Injetando script ' + script.src + '...');
	}
	else
		console.log('Bravas não detectado.');

})(unsafeWindow);
