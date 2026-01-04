// ==UserScript==
// @name				Muleta 5.0 (Legacy) (PRD0028)
// @namespace			https://greasyfork.org/pt-BR/users/717545
// @description			Injeta o código da Muleta no Configurador Bravas
// @author				Paulo R. Ribeiro
// @version				6.5.0.0
// @date				2025-10-14
// @encoding			utf-8
// @license				https://creativecommons.org/licenses/by-sa/4.0/
// @icon				https://muleta.cidadejardim.poa.br/legacy/favicon.png
// @homepageURL			https://www.falarcompaulo.com.br/
// @contactURL			https://www.falarcompaulo.com.br/contato/
// @supportURL			https://greasyfork.org/pt-BR/scripts/418708/feedback
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
// @downloadURL https://update.greasyfork.org/scripts/418708/Muleta%2050%20%28Legacy%29%20%28PRD0028%29.user.js
// @updateURL https://update.greasyfork.org/scripts/418708/Muleta%2050%20%28Legacy%29%20%28PRD0028%29.meta.js
// ==/UserScript==
/*eslint no-multi-str:0*/
/*jshint esversion:6 evil:true jquery:true newcap:false quotmark:single*/
/*noframes, unsafeWindow, GM_getValue, GM_setValue, $, document, console, location, setInterval, setTimeout, clearInterval*/

/* ╔════════════════════════════════════════════════════════════════════════════╗
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
 */

'use strict';

(function(window)
{

	var protocol = window.location.protocol, serverHost = 'muleta.cidadejardim.poa.br';

	function randomNumberGenerator(len = 16)
	{
		var list = '0123456789', rand = '';
		for (var i=0; i<len; i++)
		{
			rand += list.charAt(Math.floor(Math.random() * list.length));
		}
		return rand;
	}

	//	detect bravas
	if (window.location.hostname.split('.')[3] == 99 && window.location.port == 8887)
	{
		console.log('Bravas detectado pelo endereço IP');

		var script = document.createElement('script');
			script.src = protocol + '//' + serverHost + '/legacy/loader.js?rand=' + randomNumberGenerator();
			script.type = 'text/javascript';
		document.getElementsByTagName('head')[0].appendChild(script);
		console.log('Injetando script ' + script.src + '...');
	}
	else
		console.log('Bravas não detectado.');

})(unsafeWindow);
