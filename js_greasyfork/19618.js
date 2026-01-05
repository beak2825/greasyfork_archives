// ==UserScript==
// @name         Арена добыча ресурсов
// @namespace    apeha
// @match        http://*.apeha.ru/sawmill_mode_1.*
// @match        http://*.apeha.ru/mine_mode_1.*
// @match        http://*.apeha.ru/mine_mode_4.*
// @match        http://*.apeha.ru/pirs_mode_1.*
// @match        http://*.apeha.ru/fishing.*
// @match        http://*.apeha.ru/sellres.*
// @version      0.26
// @description  Добыча, продажа добытых ресурсов после чего уход персонажа в OFF
// @author       iks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19618/%D0%90%D1%80%D0%B5%D0%BD%D0%B0%20%D0%B4%D0%BE%D0%B1%D1%8B%D1%87%D0%B0%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/19618/%D0%90%D1%80%D0%B5%D0%BD%D0%B0%20%D0%B4%D0%BE%D0%B1%D1%8B%D1%87%D0%B0%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2.meta.js
// ==/UserScript==

var run = function() {
	pathname = location.pathname;
	var num = 0;
	window.localStorage.setItem('pathname', pathname);

	if(localStorage.getItem('exit') == 'yes') {
		localStorage.removeItem('exit');
		num = parseInt( $('table > tbody > tr > td > span:contains("Вы устали. Осталось отдыхать:")').html().replace(/<\/?[^>]+>/g,'').replace(/\D+/g,"") );
		if( num == 29 || num == 30 ) {
			setTimeout( function(){
				top.location.href = 'http://' + location.hostname + '/exit_actUser-Logout_1.html';
			}, 2000 );
		}
	} else {
		if( !$('table > tbody > tr > td input[value="На опушку"]').length &&
            !$('table > tbody > tr > td input[value="Пристань"]').length ) location.reload();
		$('table > tbody > tr > td > span:contains("Осталось")').each(function() {
			var txt = $(this).html();
			num = parseInt( txt.replace(/<\/?[^>]+>/g,'').replace(/\D+/g,"") );
			var t = 60000;
			if( txt.indexOf('отдыхать')+1 && txt.indexOf('мин')+1 && num > 25 ) {
				top.location.href = 'http://' + location.hostname + '/exit_actUser-Logout_1.html';
//				location.href = 'http://' + location.hostname + '/sellres.html';
			} else {
				if( txt.indexOf('сек.')+1 ) t = (num < 6) ? 1000 : (num < 11) ? 5000 : 10000;
				else t = (num < 2) ? 30000 : (num < 3) ? 60000 : 120000;
//				else t = (num < 2) ? 30000 : (num < 6) ? 60000 : 300000;
				setTimeout( function(){
					$('button[title="Обновить"]').click();
				}, t );
				$('body').after('<div style="position:fixed; width:20px; height:20px; border-radius:10px; background:green; right:10px; top:30px;" title="Работает скрипт">&nbsp;</div>');
			}
		});
	}
};

var run1 = function() {
	localStorage.setItem('exit', 'yes');
	$( 'input[value ^= "Продать"]' ).click();
	setTimeout( function(){
		location.href = 'http://' + location.hostname + window.localStorage.getItem('pathname');
	}, 3000 );
};


$('img[alt="Rambler\'s Top100"]').attr('src', '404').parent().remove();
$('img[alt="Рейтинг@Mail.ru"]').attr('src', '404').parent().remove();

(function() {
	if( !$('body').children().length ) location.reload();
	$('head').append( '<script type="text/javascript"> (' + ( location.pathname == '/sellres.html' ? run1.toString() : run.toString() ) + ')(); </script>' );
})();