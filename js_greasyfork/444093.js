// ==UserScript==
// @name			Shiki Listing Direct Chronology Link Addition
// @version			2022.05.14
// @description:en	Chronology button addition
// @description		Добавление кнопки хронологии
// @match			http*://shikimori.one/*/list/*
// @match			http*://shikimori.org/*/list/*
// @author			Rainbow-Spike
// @namespace		https://greasyfork.org/users/7568
// @homepage		https://greasyfork.org/ru/users/7568-dr-yukon
// @icon			https://shikimori.one/favicon.ico
// @grant			none
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/444093/Shiki%20Listing%20Direct%20Chronology%20Link%20Addition.user.js
// @updateURL https://update.greasyfork.org/scripts/444093/Shiki%20Listing%20Direct%20Chronology%20Link%20Addition.meta.js
// ==/UserScript==

var lines, href, link, span_en, span_ru, i;

function h ( tag, props = {} ) {
	return Object . assign ( document . createElement ( tag ), props );
}

function insertlink ( href ) {
	link = h ( 'a', {
		class: 'tooltipped',
		style: 'margin-left: 6px; font-weight: 600;',
		href: href
	} );
	span_en = h ( 'span', {
		innerHTML: 'Chronology',
		className: 'name-en'
	} );
	span_ru = h ( 'span', {
		innerHTML: 'Хронология',
		className: 'name-ru'
	} );
	link . append ( span_en, span_ru );
	return lines [ i ] . after ( link );
}

function action ( ) {
	lines = document . querySelectorAll ( '.b-table.list-lines a.tooltipped:not(.stop)' );
	for ( i = 0; i < lines . length; i++ ) {
		href = lines [ i ] . href + '/chronology';
		insertlink ( href );
		lines [ i ] . className += 'stop';
	}
};

function insertButton ( ) {
	var Button = h ( 'input', {
		type: 'button',
		value: '[[ ]]',
		title: '[[ ]]',
		style: 'position: fixed; bottom: 20px; left: 50px;',
		onclick: ( event ) => action ( ),
	} );
	document . body . appendChild ( Button );
}

insertButton ( );