// ==UserScript==
// @name        	Formatador de referências
// @namespace   	Nenhum
// @description 	Formata referências para serem usadas na Wikipédia. Para utilizar, basta apertar CTRL + Q em qualquer site que aparecerá um prompt com a referência já formatada.
// @version     	1.7
// @date		04/apr/2012
// @update		09/mai/2021
// @grant          	none
// @include		*
// @exclude		*wikipedia.org*
// @downloadURL https://update.greasyfork.org/scripts/21166/Formatador%20de%20refer%C3%AAncias.user.js
// @updateURL https://update.greasyfork.org/scripts/21166/Formatador%20de%20refer%C3%AAncias.meta.js
// ==/UserScript==
/* jshint laxbreak: true, esversion: 6 */

( function() {
'use strict';

// Messages set
const messages = {
	// General
	date: '$1 de $2 de $3', // day/month/year formatting
	day1formatted: '1º',
	formatedReference: 'Referência formatada: ',
	months: [
		'janeiro', 'fevereiro', 'março', 'abril',
		'maio', 'junho', 'julho', 'agosto',
		'setembro', 'outubro', 'novembro', 'dezembro'
	],

	// Template information
	template_name: 'Citar web',
	template_param_title: 'título',
	template_param_url: 'url',
	template_param_publisher: 'publicado',
	template_param_accessDate: 'acessodata',
	template_param_archiveURL: 'arquivourl',
	template_param_archiveDate: 'arquivodata',
};

// Main function
function formatReferences() {
	let archive, ref,
		is_archive = ( location.hostname === 'wayback.archive.org' ) || ( location.hostname === 'web.archive.org' ),
		date = new Date(),
		formatDay1 = messages.day1formatted && messages.day1formatted !== '';

	ref = `<ref>{{${ messages.template_name }|${ messages.template_param_url }=${ location.href }`
		+ `|${ messages.template_param_title }=${ document.title.replace( /\|/g, '-' ) }`
		+ `|${ messages.template_param_publisher }=${ ( !is_archive
			? location.hostname
			: /(?:https?:\/\/|www\.)(?!wayback|web\.archive)(.*)\//g.exec( location.href )[ 1 ].split( '/' )[ 0 ]
		) }`;

	if ( is_archive ) {
		archive = /b\/(\d+)/g.exec( location.href );
		ref = ref.replace(
			ref.substr( ref.indexOf( '=' ) + 1, location.href.length ),
			`${ /\d\/(.+)/.exec( location.href )[ 1 ] }`
				+ `|${ messages.template_param_archiveURL }=${ location.href }`
				+ `|${ messages.template_param_archiveDate }=${ messages.date
					.replace( '$1', archive[ 1 ].substr( 6, 2 )
					.replace( /^0/, '' )
					.replace( /^(1)$/, ( formatDay1 ? messages.day1formatted : '1' ) ) )
					.replace( '$2', messages.months[ archive[ 1 ].substr( 4, 2 ).replace( /^0/, '' ) - 1 ] )
					.replace( '$3', archive[ 1 ].substr( 0, 4 ) )
				}`
		);
	}

	ref += `|${ messages.template_param_accessDate }=${ messages.date
		.replace( '$1', date.getDate().toString()
		.replace( /^0/, '' )
		.replace( /^(1)$/, ( formatDay1 ? messages.day1formatted : '1' ) ) )
		.replace( '$2', messages.months[ date.getMonth() ] )
		.replace( '$3', date.getFullYear() )
	}}}</ref>`;

	window.prompt( messages.formatedReference, ref );
}

// Event set
document.onkeydown = ( e ) => {
	if ( e.ctrlKey && e.code === 'KeyQ' )
		formatReferences( e );
};

} )();