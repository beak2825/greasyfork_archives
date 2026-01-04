// ==UserScript==
// @name           Direct Image Link E6AI
// @name:en        Direct Image Link E6AI
// @version        2025.03.30.1
// @description    Рипалка ссылок / имён / номеров картинок
// @description:en Ripper of image links / names / numbers
// @match          http*://e6ai.net/posts*
// @match          http*://e6ai.net/pool*
// @match          http*://e6ai.net/favorites*
// @author         Rainbow-Spike
// @namespace      https://greasyfork.org/users/7568
// @homepage       https://greasyfork.org/ru/users/7568-rainbow-spike
// @icon           https://www.google.com/s2/favicons?domain=e6ai.net
// @grant          none
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/468205/Direct%20Image%20Link%20E6AI.user.js
// @updateURL https://update.greasyfork.org/scripts/468205/Direct%20Image%20Link%20E6AI.meta.js
// ==/UserScript==

var post_list = document . querySelectorAll ( '.thumbnail' );
if ( post_list != null ) {
	var mode = 2, // 0 - номера постов post numbers, 1 - имена файлов file names, 2 - полные ссылки full links
		lever = { // 0 - нет no, 1 - да yes
			nl:  1, // использовать "чёрный список" тегов use tag negative list
			pl:  1, // использовать "белый список" тегов use tag positive list
			dl:  1, // фильтр уже скачанных картинок filter of already downloaded pics
			top: 1, // полный список вверху страницы full list on page top
			pic: 1, // вставка под каждой картинкой insertion under every pic
		},
		tag = {
			nl: /^censored|gore|male\/male|my_little_pony/,
			pl: /[^_]pussy[^_]|female_on_top|animated|child_on_child|tribadism|camel_toe/,
		},
		css = { // стили styles
			nl:   'opacity: 0.5; border: 3px dotted red;', // "чёрный список" negative list
			neut: 'opacity: 0.5; border: 3px dashed gray;', // вне "белого списка" out of positive list
			dl:   'opacity: 0.5; border: 16px double green;', // скачанное downloaded
			top:  'columns: 300px; font-size: 40%; line-height: .25em; max-height: 100px;', // колонки в полном списке columns in full list
			pic:  'word-wrap: anywhere;', // под каждой картинкой under every pic
		},
		node = {
			top: document . querySelector ( 'body' ),
			new: document . createElement ( 'div' ),
		},
		md5_list = [ // список MD5-кодов уже закачанных файлов, ВСТАВЬ СВОЙ СПИСОК list of MD5-codes of already downloaded files, INSERT YOUR LIST
'00000000000000000000000000000000', '00000000000000000000000000000000'
		],
		x, y, post_tags, src, name, md5, ext, num, insert;
	for ( x = 0; x < post_list . length; x++ ) {
		// получение данных data mining
		post_tags = post_list [ x ] . getAttribute ( 'data-tags' );
		src = post_list [ x ] . getAttribute ( 'data-file-url' );
		name = src . split ( '/' ) . pop ( );
		[ md5, ext ] = name . split ( '.' );
		num = post_list [ x ] . getAttribute ( 'data-id' );
		// фильтрация filtering
		if ( md5 != '' && lever . nl && tag . nl . test ( post_tags ) )		{ post_list [ x ] . style = css . nl;	md5 = ''; }; // сначала "чёрный список" negative list in first
		if ( md5 != '' && lever . pl && !tag . pl . test ( post_tags ) )	{ post_list [ x ] . style = css . neut;	md5 = ''; }; // затем "белый список" positive list in middle
		if ( md5 != '' && lever . dl ) { // фильтр скачанного в конце filter of downloaded in last
			for ( y = 0; y < md5_list . length; y++ ) {
				if ( md5_list [ y ] == md5 )								{ post_list [ x ] . style = css . dl;	md5 = ''; break; };
			};
		};
		if ( md5 != '' ) {
			if ( lever . top && node . top != null ) { // пополнение и режим полного списка complection and mode of full list
				switch ( mode ) {
					case 0: insert = num + '.' + ext; break; // номер поста + расширение post number + extension
					case 1: insert = name; break; // имя файла file name
					case 2: insert = src; break; // путь картинки pic path
				};
				node . new . innerHTML += '<a href = "' + src + '">' + insert + ' </a><br>';
			};
			if ( lever . pic ) {
				switch ( mode ) {
					case 0: insert = num; break; // номер поста post number
					case 1: case 2: insert = md5; break; // MD5-код картинки pic MD5-code
				};
				post_list [ x ] . innerHTML += '<a href = "' + src + '" style = "' + css . pic + '">' + insert + ' </a>'; // вставка MD5-кода под избранными картинками insertion of MD5-code under the chosen pics
			};
		};
	};
	if ( lever . top && node . top != null ) { // вставка и выделение полного списка insertion and selection of full list
		node . new . style = css . top;
		node . top . insertBefore ( node . new, node . top . firstChild);
		function selectblock ( sel_node ) {
			var rng = document . createRange ( );
			rng . selectNode ( sel_node );
			var sel = window . getSelection ( );
			sel . removeAllRanges ( );
			sel . addRange ( rng );
		};
		selectblock ( node . new );
	}
}