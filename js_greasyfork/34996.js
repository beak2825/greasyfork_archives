// ==UserScript==
// @name           hwmbet_stat
// @description    Отображение статистики ставок игрока в рулетке за текущий день
// @namespace      hwmbet_stat
// @include        http://www.heroeswm.ru/pl_info.php?id=*
// @include        http://www.heroeswm.ru/home.php*
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/34996/hwmbet_stat.user.js
// @updateURL https://update.greasyfork.org/scripts/34996/hwmbet_stat.meta.js
// ==/UserScript==

String.prototype.format = function() {

	var formatted = this;
	for( var arg in arguments ) {
		formatted = formatted.replace("{" + arg + "}", arguments[arg]);
	}
	return formatted;

};

function define_player_id(link) {

	q_position = link.search(/=/);
	return link.substr(q_position+1);

}

function get_GET_param(name){

	if (name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
		return decodeURIComponent(name[1]);

}

function get_JSON_data(url) {

	var xhr = new XMLHttpRequest();

	xhr.open('GET', url, false);
	xhr.send(null);

	return JSON.parse(xhr.responseText);

}

function numCommas(x) {

	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}

function display_stat_on_players_page(data) {

	roul_info = document.querySelectorAll("td[class='wb'][valign='top']")[2];
	stake_info = roul_info.querySelectorAll('b');

	icselec = document.querySelector('body > center > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr');
	icselec.innerHTML += '&nbsp;<td><a target=_blank href=http://hwmbet.ru/player/{0}><img title="Статистика ставок в рулетку за 30 дней" border=0 valign=center src=http://hwmbet.ru/static/favicon.ico /></a></td>'.format(data.player_id);

	inner_text = '<span style=font-weight:normal>, сегодня:</span> <b>{0}</b>';

	stake_info[0].innerHTML += inner_text.format(numCommas(data.total_stake));
	stake_info[1].innerHTML += inner_text.format(numCommas(data.total_win));

}

function display_stat_on_home_page(data) {

	select = document.querySelector('body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr > td > table > tbody > tr > td:nth-child(1)');

	intext_1 = '<br><br><hr><br>&nbsp;&raquo;&nbsp;<b>Поставлено сегодня:</b> {0} (место: {1})'.format(numCommas(data.total_stake), numCommas(data.stake_place));
	intext_2 = '<br>&nbsp;&raquo;&nbsp;<b>Выиграно сегодня:</b> {0} (место: {1})'.format(numCommas(data.total_win), numCommas(data.win_place));
	intext_3 = '<br><br>&nbsp;&raquo;&nbsp;<b>Баланс:</b> {0} (место: {1})'.format(numCommas(data.total_profit), numCommas(data.profit_place));
	intext_4 = '<br><br>&nbsp;&raquo;&nbsp;<b>Статистика за 30 дней:</b> <a target=_blank href=http://hwmbet.ru/player/{0}>здесь</a>'.format(data.player_id);

	select.innerHTML += (intext_1 + intext_2 + intext_3 + intext_4);

}

get_data = function(url, callback) {

	var request = new XMLHttpRequest();

	request.onreadystatechange = function()
	{
		if (request.readyState == 4 && request.status == 200)
		{
			callback(JSON.parse(request.responseText));
		}
	};

	request.open('GET', url);
	request.send();

};

if (location.href.indexOf('pl_info.php?id=') > -1) {

	get_data('https://hwmbet.ru/api/player_stat/{0}/'.format(get_GET_param('id')), display_stat_on_players_page);

} else if (location.href.indexOf('home.php') > -1) {

	player_id_select = document.querySelector('body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > a:nth-child(20)');
	player_id = define_player_id(player_id_select.href);

	get_data('https://hwmbet.ru/api/player_stat/{0}/'.format(player_id), display_stat_on_home_page);

}