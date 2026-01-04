// ==UserScript==
// @name ClanMembers
// @author Sweag
// @namespace clan
// @version 1.6.9.1
// @description Статистика по защитам клана, сортировка списка клана по названию столбика.
// @homepage https://greasyfork.org/scripts/25034
// @include https://*heroeswm*/clan_info.php*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461888/ClanMembers.user.js
// @updateURL https://update.greasyfork.org/scripts/461888/ClanMembers.meta.js
// ==/UserScript==
(function () {
	var DEF_COUNT = 7;
	var start_index = 0, index_mas_player = 1, maxDefIndex = 0;
	var ifrom;
	var ito;
	var arr_index = 1;
	var arr = [];
	var masDef = [];
//var masWinDef = [];
	var masPlayer = [];
	var masNalog = [];
	var masPer = [];
	var masAttack = [];
	var masAll = [];
	var masPvP = [];
	var sign_sort_num = -1, sign_sort_online = -1, sign_sort_lvl = -1, sign_sort_def = -1, sign_sort_per = -1,
		sign_sort_pvp = -1, sign_sort_nalog = -1, sign_sort_attack = -1, sign_sort_all = -1, sign_sort_event = -1;
	var Defstr, LastDate = '';
	var hrefs;
	var clan_heroes_online = document.querySelectorAll("img[src$='clans/online.gif']");
	var clan_heroes_offline = document.querySelectorAll("img[src$='clans/offline.gif']");
	var len, N_row = 4;
	var index_line;
	if (clan_heroes_online.length > clan_heroes_offline.length) len = clan_heroes_offline.length; else len = clan_heroes_online.length;
	for (var i = 0; i < len; i++) {
		if (clan_heroes_offline[i]) {
			if (clan_heroes_offline[i].parentNode.parentNode.innerHTML.indexOf('1.') > -1) {
				var table_clan = clan_heroes_offline[i].parentNode;
				var str = clan_heroes_offline[i].parentNode.parentNode.parentNode.innerHTML;
				index_line = i;
				break;
			}
		} else if (clan_heroes_online[i]) {
			if (clan_heroes_online[i].parentNode.parentNode.innerHTML.indexOf('1.') > -1) {
				var table_clan = clan_heroes_online[i].parentNode;
				var str = clan_heroes_online[i].parentNode.parentNode.parentNode.innerHTML;
				index_line = i;
				break;
			}
		}
	}
	if (table_clan) {
		while (table_clan.tagName != 'TR') {
			table_clan = table_clan.parentNode;
		}
		table_clan = table_clan.parentNode.childNodes;
	}
	var table_clan_length = table_clan.length;
	if (table_clan[0].childNodes.length > 5) N_row = 5;
	var cel = '<tr><td class="wbwhite" width="30" id=sort_number title="Сортировать по номеру"><b>№</b></td>';
	cel += '<td class="wbwhite" width="15" id=sort_online title="Сортировать по онлайну"><img src="http://dcdn.heroeswm.ru/i/clans/offline.gif" align="absmiddle" border="0" width="15" height="15"></td>';
	cel += '<td class="wbwhite" width="150">&nbsp;&nbsp;Имя персонажа</td>';
	cel += '<td class="wbwhite" align="center" width="10" id=sort_lvl title="Сортировать по боевому уровню">&nbsp;lvl</td>';
	cel += '<td class="wbwhite" align="center">Описание</td>';
	if (N_row == 5) cel += '<td class="wbwhite" width="30" id=sort_event title="Сортировать по уровню сложности в ивенте">&nbsp;Ивент</td>';
	cel += '<td class="wbwhite" width="30" id=sort_defs title="Сортировать по количеству защит">&nbsp;Дефы</td>';
	cel += '<td class="wbwhite" width="30" id=sort_attack title="Сортировать по количеству боев за подъем предприятия">&nbsp;Атаки</td>';
	cel += '<td class="wbwhite" width="30" id=sort_nalog title="Сортировать по количеству налогов">&nbsp;Налоги</td>';
	cel += '<td class="wbwhite" width="30" id=sort_per title="Сортировать по количеству перехватов">&nbsp;Перехваты</td>';
	cel += '<td class="wbwhite" width="30" id=sort_pvp title="Сортировать по количеству PvP-боев">&nbsp;PvP</td>';
	cel += '<td class="wbwhite" width="30" id=sort_all title="Сортировать по количеству боев за клан">&nbsp;Всего</td></tr>' + str;
	if (clan_heroes_offline[index_line]) {
		clan_heroes_offline[index_line].parentNode.parentNode.parentNode.innerHTML = cel;
	} else if (clan_heroes_online[index_line]) {
		clan_heroes_online[index_line].parentNode.parentNode.parentNode.innerHTML = cel;
	}
	document.getElementById('sort_number').onclick = function () {
		fn_sort_number();
	};
	document.getElementById('sort_online').onclick = function () {
		fn_sort_online();
	};
	document.getElementById('sort_lvl').onclick = function () {
		fn_sort_lvl();
	};
	document.getElementById('sort_defs').onclick = function () {
		fn_sort_defs();
	};
	document.getElementById('sort_per').onclick = function () {
		fn_sort_per();
	};
	document.getElementById('sort_pvp').onclick = function () {
		fn_sort_pvp();
	};
	document.getElementById('sort_nalog').onclick = function () {
		fn_sort_nalog();
	};
	document.getElementById('sort_attack').onclick = function () {
		fn_sort_attack();
	};
	document.getElementById('sort_all').onclick = function () {
		fn_sort_all();
	};
	if (N_row == 5) document.getElementById('sort_event').onclick = function () {
		fn_sort_event();
	};

	/*hrefs = document.getElementsByTagName('a');
	for(var i = 0; i < hrefs.length; i++)
	{
		if(hrefs[i].href.indexOf('clan_log.php') > -1)
		{*/
	var myform = document.createElement('div');
	myform.id = 'sform';
	str = "<table><tr><td bgcolor='#6b6c6a' align='center' colspan='2'><font color='#ffd875'><b>Обсчет дефов за период</b></font></td></tr><tr><td>С: </td><td><input type=text id=datfrom value='01-" + getCurrentMonth() + "'></td></tr>";
	str += "<tr><td>По: </td><td><input type=text id=datto value='" + getCurrentDate() + "'></td></tr>";
	str += "<tr><td colspan=2><center><input type=button value='Загрузить' id=startscan></center></td></tr>";
	str += "</table></div>";
	myform.innerHTML = str;
	//hrefs[i].parentNode.appendChild(myform);
	document.getElementsByClassName('wb')[0].after(myform);
	//i = hrefs.length;
	document.getElementById('startscan').onclick = function () {
		prescaning();
	};
	document.getElementById('datfrom').oninput = function () {
		change_input();
	};
	document.getElementById('datto').oninput = function () {
		change_input();
	};
	/*}
}*/
// указатель на сортировку
	table_clan[0].childNodes[0].setAttribute("style", "cursor: pointer;");
	table_clan[0].childNodes[1].setAttribute("style", "cursor: pointer;");
	table_clan[0].childNodes[3].setAttribute("style", "cursor: pointer;");
	table_clan[0].childNodes[5].setAttribute("style", "cursor: pointer;");
	table_clan[0].childNodes[6].setAttribute("style", "cursor: pointer;");
	table_clan[0].childNodes[7].setAttribute("style", "cursor: pointer;");
	table_clan[0].childNodes[8].setAttribute("style", "cursor: pointer;");
	table_clan[0].childNodes[9].setAttribute("style", "cursor: pointer;");
	table_clan[0].childNodes[10].setAttribute("style", "cursor: pointer;");
	if (N_row == 5) table_clan[0].childNodes[11].setAttribute("style", "cursor: pointer;");
	for (var i = 1; i < table_clan_length + 1; i++) {
		if (N_row == 5) table_clan[i].childNodes[N_row].setAttribute("title", "Уровень сложности в ивенте");
		Defstr = table_clan[i].innerHTML;
		if (table_clan[i].innerHTML.indexOf("offline.gif") > -1) {
			Defstr += "<td class=wbwhite width=30 title='Количество защит'> </td><td class=wbwhite width=30 title='Количество боев за подъем предприятия'> </td><td class=wbwhite width=30 title='Количество налоговых боев'> </td><td class=wbwhite width=30 title='Количество перехватов'> </td><td class=wbwhite width=30 title='Количество боев PvP'> </td><td class=wbwhite width=30 title='Общее количество боев'> </td>";
		} else {
			Defstr += "<td class=wblight width=30 title='Количество защит'> </td><td class=wblight width=30 title='Количество боев за подъем предприятия'> </td><td class=wblight width=30 title='Количество налоговых боев'> </td><td class=wblight width=30 title='Количество перехватов'> </td><td class=wblight width=30 title='Количество боев PvP'> </td><td class=wblight width=30 title='Общее количество боев'> </td>";
		}
		table_clan[i].innerHTML = Defstr;
		// центровка
		table_clan[i].childNodes[5].setAttribute("align", "center");
		table_clan[i].childNodes[6].setAttribute("align", "center");
		table_clan[i].childNodes[7].setAttribute("align", "center");
		table_clan[i].childNodes[8].setAttribute("align", "center");
		table_clan[i].childNodes[9].setAttribute("align", "center");
		table_clan[i].childNodes[10].setAttribute("align", "center");
		if (N_row == 5) table_clan[i].childNodes[11].setAttribute("align", "center");
	}

	function init_clan() {
		for (var i = 1; i < table_clan_length + 1; i++) {
			masDef[i] = 0;
			masNalog[i] = 0;
			masPer[i] = 0;
			masAttack[i] = 0;
			masPvP[i] = 0;
			masAll[i] = 0;
			masPlayer[i] = Number(table_clan[i].childNodes[2].innerHTML.split("pl_info.php?id=")[1].split('" class=')[0]);
		}
	}

	function sort_mas(sign_sort, NumberC) {
		var sorted = [];
		var m, t, p, f, i, j, nan1;
		for (i = 1; i < table_clan_length + 1; i++) {
			sorted[i] = [];
			for (j = 0; j < N_row + 7; j++) {
				sorted[i][j] = table_clan[i].childNodes[j].innerHTML;
			}
			if (NumberC == 1) {
				if (sorted[i][1].indexOf("offline.gif") > -1) {
					sorted[i][1] = -1;
				} else {
					sorted[i][1] = 1;
				}
			}
			if ((NumberC == 5) && (N_row == 5)) {
				if (table_clan[i].childNodes[5].innerHTML.length > 20) {
					nan1 = table_clan[i].childNodes[5].innerHTML.split('>')[1].split('<')[0];
					if (isNaN(nan1)) nan1 = nan1.split(',')[0] + nan1.split(',')[1];
					sorted[i][5] = Number(nan1);
				} else {
					sorted[i][5] = 0
				}
			}
			sorted[i][N_row + 7] = table_clan[i].childNodes[0].getAttribute("class");
		}
		while (true) {
			f = 0;
			for (i = 1; i < table_clan_length; i++) {
				m = sign_sort * Number(sorted[i][NumberC]);
				t = sign_sort * Number(sorted[i + 1][NumberC]);
				if (m < t) {
					f = 1;
					for (j = 0; j < N_row + 8; j++) {
						p = sorted[i][j];
						sorted[i][j] = sorted[i + 1][j];
						sorted[i + 1][j] = p;
					}
				}
			}
			if (f === 0) break;
		}
		for (i = 1; i < table_clan_length + 1; i++) {
			for (j = 0; j < N_row + 7; j++) {
				table_clan[i].childNodes[j].innerHTML = sorted[i][j];
				table_clan[i].childNodes[j].setAttribute("class", sorted[i][N_row + 7]);
			}
			if (NumberC == 1) {
				if (sorted[i][1] > 0) {
					table_clan[i].childNodes[1].innerHTML = '<img src="https://dcdn.heroeswm.ru/i/clans/online.gif" align="absmiddle" border="0" height="15" width="15">';
				} else {
					table_clan[i].childNodes[1].innerHTML = '<img src="https://dcdn.heroeswm.ru/i/clans/offline.gif" align="absmiddle" border="0" height="15" width="15">';
				}
			}
			if ((NumberC == 5) && (N_row == 5)) {
				if (sorted[i][5] == 0) {
					table_clan[i].childNodes[5].innerHTML = '&nbsp; &nbsp;';
				} else {
					table_clan[i].childNodes[5].innerHTML = '&nbsp;<font color="green">' + sorted[i][5] + '</font>&nbsp;'
				}
			}
		}
	}

	function change_input() {
		document.getElementById('startscan').value = "Загрузить";
		document.getElementById('startscan').disabled = false;
		sign_sort_num = 1;
		fn_sort_number();
	}

	function fill_text() {
		table_clan[0].childNodes[0].innerHTML = "&nbsp;№";
		table_clan[0].childNodes[3].innerHTML = "&nbsp;lvl";
		if (N_row == 5) table_clan[0].childNodes[N_row].innerHTML = "&nbsp;Ивент";
		table_clan[0].childNodes[N_row + 1].innerHTML = "&nbsp;Дефы";
		table_clan[0].childNodes[N_row + 2].innerHTML = "&nbsp;Атаки";
		table_clan[0].childNodes[N_row + 3].innerHTML = "&nbsp;Налоги";
		table_clan[0].childNodes[1].innerHTML = '<img src="https://dcdn.heroeswm.ru/i/clans/offline.gif" align="absmiddle" border="0" height="15" width="15">';
		table_clan[0].childNodes[N_row + 4].innerHTML = "&nbsp;Перехваты";
		table_clan[0].childNodes[N_row + 5].innerHTML = "&nbsp;PvP";
		table_clan[0].childNodes[N_row + 6].innerHTML = "&nbsp;Всего";
	}

	function fn_sort_online() {
		//сортировка по онлайну
		sign_sort_online *= -1;
		sort_mas(sign_sort_online, 1);
		sign_sort_pvp = -1;
		sign_sort_def = -1;
		sign_sort_lvl = -1;
		sign_sort_num = 1;
		sign_sort_nalog = -1;
		sign_sort_per = -1;
		sign_sort_attack = -1;
		sign_sort_all = -1;
		fill_text();
		if (sign_sort_online > 0) {
			table_clan[0].childNodes[1].innerHTML = '<img src="https://dcdn.heroeswm.ru/i/clans/online.gif" align="absmiddle" border="0" height="15" width="15">';
		} else {
			table_clan[0].childNodes[1].innerHTML = '<img src="https://dcdn.heroeswm.ru/i/clans/offline.gif" align="absmiddle" border="0" height="15" width="15">';
		}
		Paint();
	}

	function fn_sort_number() {
		sign_sort_num *= -1;
		sort_mas(sign_sort_num, 0);
		sign_sort_pvp = -1;
		sign_sort_def = -1;
		sign_sort_lvl = -1;
		sign_sort_online = -1;
		sign_sort_nalog = -1;
		sign_sort_per = -1;
		sign_sort_attack = -1;
		sign_sort_all = -1;
		fill_text();
		table_clan[0].childNodes[0].innerHTML = "<b>&nbsp;№</b>";
		Paint();
	}

	function fn_sort_lvl() {
		// Сортировка по уровню
		sign_sort_lvl *= -1;
		sort_mas(sign_sort_lvl, 3);
		sign_sort_pvp = -1;
		sign_sort_def = -1;
		sign_sort_num = 1;
		sign_sort_online = -1;
		sign_sort_nalog = -1;
		sign_sort_per = -1;
		sign_sort_attack = -1;
		sign_sort_all = -1;
		fill_text();
		table_clan[0].childNodes[3].innerHTML = "<b>&nbsp;lvl</b>";
		Paint();
	}

	function fn_sort_defs() {
		// Сортировка по количеству дефов
		sign_sort_def *= -1;
		sort_mas(sign_sort_def, N_row + 1);
		sign_sort_pvp = -1;
		sign_sort_lvl = -1;
		sign_sort_num = 1;
		sign_sort_online = -1;
		sign_sort_nalog = -1;
		sign_sort_per = -1;
		sign_sort_attack = -1;
		sign_sort_all = -1;
		fill_text();
		table_clan[0].childNodes[N_row + 1].innerHTML = "<b>&nbsp;Дефы</b>";
		Paint();
	}

	function fn_sort_per() {
		// Сортировка по количеству перехватов
		sign_sort_per *= -1;
		sort_mas(sign_sort_per, N_row + 4);
		sign_sort_pvp = -1;
		sign_sort_lvl = -1;
		sign_sort_num = 1;
		sign_sort_online = -1;
		sign_sort_nalog = -1;
		sign_sort_attack = -1;
		sign_sort_all = -1;
		fill_text();
		table_clan[0].childNodes[N_row + 4].innerHTML = "<b>&nbsp;Перехваты</b>";
		Paint();
	}

	function fn_sort_pvp() {
		// Сортировка по количеству pvp-боев
		sign_sort_pvp *= -1;
		sort_mas(sign_sort_pvp, N_row + 5);
		sign_sort_per = -1;
		sign_sort_lvl = -1;
		sign_sort_num = 1;
		sign_sort_online = -1;
		sign_sort_nalog = -1;
		sign_sort_attack = -1;
		sign_sort_all = -1;
		fill_text();
		table_clan[0].childNodes[N_row + 5].innerHTML = "<b>&nbsp;PvP</b>";
		Paint();
	}

	function fn_sort_nalog() {
		// Сортировка по количеству налогов
		sign_sort_nalog *= -1;
		sort_mas(sign_sort_nalog, N_row + 3);
		sign_sort_pvp = -1;
		sign_sort_lvl = -1;
		sign_sort_num = 1;
		sign_sort_online = -1;
		sign_sort_per = -1;
		sign_sort_attack = -1;
		sign_sort_all = -1;
		fill_text();
		table_clan[0].childNodes[N_row + 3].innerHTML = "<b>&nbsp;Налоги</b>";
		Paint();
	}

	function fn_sort_attack() {
		// Сортировка по количеству атак упавшей предпы
		sign_sort_attack *= -1;
		sort_mas(sign_sort_attack, N_row + 2);
		sign_sort_pvp = -1;
		sign_sort_lvl = -1;
		sign_sort_num = 1;
		sign_sort_online = -1;
		sign_sort_per = -1;
		sign_sort_nalog = -1;
		sign_sort_all = -1;
		fill_text();
		table_clan[0].childNodes[N_row + 2].innerHTML = "<b>&nbsp;Атаки</b>";
		Paint();
	}

	function fn_sort_all() {
		// Сортировка по количеству боев за клан
		sign_sort_all *= -1;
		sort_mas(sign_sort_all, N_row + 6);
		sign_sort_pvp = -1;
		sign_sort_lvl = -1;
		sign_sort_num = 1;
		sign_sort_online = -1;
		sign_sort_per = -1;
		sign_sort_nalog = -1;
		sign_sort_attack = -1;
		fill_text();
		table_clan[0].childNodes[N_row + 6].innerHTML = "<b>&nbsp;Всего</b>";
		Paint();
	}

	function fn_sort_event() {
		// Сортировка по максимальному бою за клан в ивенте
		sign_sort_event *= -1;
		sort_mas(sign_sort_event, N_row);
		sign_sort_pvp = -1;
		sign_sort_all = -1;
		sign_sort_lvl = -1;
		sign_sort_num = 1;
		sign_sort_online = -1;
		sign_sort_per = -1;
		sign_sort_nalog = -1;
		sign_sort_attack = -1;
		fill_text();
		table_clan[0].childNodes[N_row].innerHTML = "<b>&nbsp;Ивент</b>";
		Paint();
	}


	function getCurrentDate() {
		var dt = new Date();
		var month = dt.getMonth() + 1;
		if (month < 10) month = '0' + month;
		var day = dt.getDate();
		if (day < 10) day = '0' + day;
		var year = dt.getFullYear();
		return day + "-" + month + "-" + (year + '')[2] + (year + '')[3];
	}

	function getCurrentMonth() {
		var dt = new Date();
		var month = dt.getMonth() + 1;
		if (month < 10) month = '0' + month;
		var year = dt.getFullYear();
		return month + "-" + (year + '')[2] + (year + '')[3];
	}

	function prescaning() {
		var t = document.getElementById('datfrom').value.split('-');
		ifrom = new Date("20" + t[2] + "-" + t[1] + "-" + t[0]);
		t = document.getElementById('datto').value.split('-');
		ito = new Date("20" + t[2] + "-" + t[1] + "-" + t[0]);
		init_clan();
		start_index = 0;
		document.getElementById('startscan').value = "Загружено: " + start_index;
		scaning();
	}

	function listen() {
		if (arr_index > arr.length - 1) {
			document.getElementById('startscan').value = "Загружено: " + start_index;
			scaning();
			return;
		}
		var cur = getCurTimestamp(arr[arr_index]);
		if (cur >= ifrom && cur <= ito) {
			var s = arr[arr_index].split(': ')[1];
			if (s.indexOf('Нападение') > -1) {
				var ss = "https://www.heroeswm.ru/" + arr[arr_index].split('<a href="')[3].split('">история')[0];
				var ans = new XMLHttpRequest();
				ans.open("GET", ss, true);
				ans.overrideMimeType('text/html; charset=windows-1251');
				ans.send();
				ans.onreadystatechange = function () {
					if (ans.readyState != 4) {
						return;
					}
					if (ans.status == 200) {
						var text_history = ans.responseText;
						var arr_history = text_history.split('Нападение Сурвилургов')[1].split('бой');
						for (var j = 0; j < arr_history.length - 1; j++) {
							for (var k = 0; k < masPlayer.length; k++) {
								var id1 = arr_history[j].split('pl_info.php?id=')[1].split('>')[0];
								if (arr_history[j].split('pl_info.php?id=').length > 2) {
									var id2 = arr_history[j].split('pl_info.php?id=')[2].split('>')[0];
									if ((id1.indexOf(masPlayer[k]) > -1) || (id2.indexOf(masPlayer[k]) > -1)) {
										masDef[k]++;
										//if(arr_history[j].indexOf('получено') > -1 )masWinDef[k]++;
									}
								} else {
									if (id1.indexOf(masPlayer[k]) > -1) {
										masDef[k]++;
									}
								}
							}
						}
						arr_index++;
						listen();
					}
				};
			} else {
				if (s.indexOf('налогообложение') > -1) {
					var ss1 = "https://www.heroeswm.ru/taxlog.php?show_history=" + arr[arr_index].split('show_history=')[1].split('>лог')[0].slice(0, -1);
					var ans1 = new XMLHttpRequest();
					ans1.open("GET", ss1, true);
					ans1.overrideMimeType('text/html; charset=windows-1251');
					ans1.send();
					ans1.onreadystatechange = function () {
						if (ans1.readyState != 4) {
							return;
						}
						if (ans1.status == 200) {
							var text_history1 = ans1.responseText;
							var arr_history1 = text_history1.split('Статистика потери/захвата налогов боевыми кланами')[1].split('pl_info.php?id=');
							for (var j = 1; j < arr_history1.length; j++) {
								for (var k = 0; k < masPlayer.length; k++) {
									if (arr_history1[j].split('>')[0].indexOf(masPlayer[k]) > -1) {
										masNalog[k]++;
									}
								}
							}
							arr_index++;
							listen();
						}
					};
				} else {
					arr_index++;
					listen();
				}
			}
		} else if (cur < ifrom) {
			for (var i = 1; i < table_clan_length + 1; i++) {
				table_clan[i].childNodes[N_row + 1].innerHTML = masDef[i];
				table_clan[i].childNodes[N_row + 3].innerHTML = masNalog[i];
				/* //процент побед в защитах
				if( masDef[i] !== 0 ){
					var percent_win = Math.round(masWinDef[i]/masDef[i]*100);
					table_clan[i].childNodes[6].innerHTML = percent_win;
				}else{
					table_clan[i].childNodes[6].innerHTML = 0;
				}*/
			}
			maxDefIndex = start_index;
			index_mas_player = 1;
			start_index = 0;
			scaningPlayer();
		} else {
			arr_index++;
			listen();
		}
	}

	function scaning() {
		var st = document.location.href;
		var xhr = new XMLHttpRequest();
		var uri = st.replace('info', 'log') + "&page=" + start_index;
		start_index++;
		arr_index = 1;
		xhr.open("GET", uri, true);
		xhr.overrideMimeType('text/html; charset=windows-1251');
		xhr.send();
		xhr.onreadystatechange = function () {
			if (xhr.readyState != 4) return;
			if (xhr.status == 200) {
				text = xhr.responseText;
				text = text.split('&gt;</a></center>')[1];
				//text = text.split('</td></tr></table>')[0];
				arr = text.split('&nbsp;&nbsp;');
				listen();
			}
		};
	}

	function listenPlayer() {
		if (arr_index > arr.length - 1) {
			document.getElementById('startscan').value = "Загружено: " + (maxDefIndex + start_index);
			LastDate = arr[arr.length - 1];
			scaningPlayer();
			return;
		}
		var cur = getCurTimestampWar(arr[arr_index]);
		if (cur == -1) {
			arr_index++;
			listenPlayer();
			return;
		}
		if (cur >= ifrom && cur <= ito) {
			var s = arr[arr_index];
			if (LastDate == arr[arr.length - 1]) {
				nextItem();
				return;
			}
			if ((s.indexOf('vs <i>Сурвилурги') > -1) || (s.indexOf('vs <i><b>Сурвилурги') > -1)) {
				if (s.indexOf('&pi;') > -1) {
					masPer[index_mas_player]++;
				} else {
					masAttack[index_mas_player]++;
				}
			}
			if (s.indexOf('&omega;') > -1) {
				masPvP[index_mas_player]++;
			}
			arr_index++;
			listenPlayer();
		} else if (cur < ifrom) {
			if (index_mas_player < table_clan_length) {
				nextItem();
				return;
			}
			document.getElementById('startscan').value = "Готово";
			document.getElementById('startscan').disabled = true;
			table_clan[table_clan_length].childNodes[N_row + 4].innerHTML = masPer[table_clan_length];
			table_clan[table_clan_length].childNodes[N_row + 2].innerHTML = masAttack[table_clan_length];
			table_clan[table_clan_length].childNodes[N_row + 5].innerHTML = masPvP[table_clan_length];
			table_clan[table_clan_length].childNodes[N_row + 6].innerHTML = masAll[table_clan_length];
			Paint();
		} else {
			if (LastDate == arr[arr.length - 1]) {
				nextItem();
				return;
			}
			arr_index++;
			listenPlayer();
		}
	}

	function nextItem() {
		masAll[index_mas_player] = masDef[index_mas_player] + masPer[index_mas_player] + masAttack[index_mas_player] + masNalog[index_mas_player] + masPvP[index_mas_player];
		table_clan[index_mas_player].childNodes[N_row + 4].innerHTML = masPer[index_mas_player];
		table_clan[index_mas_player].childNodes[N_row + 2].innerHTML = masAttack[index_mas_player];
		table_clan[index_mas_player].childNodes[N_row + 5].innerHTML = masPvP[index_mas_player];
		table_clan[index_mas_player].childNodes[N_row + 6].innerHTML = masAll[index_mas_player];
		index_mas_player++;
		if (start_index) {
			maxDefIndex += start_index;
		} else maxDefIndex++;
		document.getElementById('startscan').value = "Загружено: " + maxDefIndex;
		start_index = 0;
		scaningPlayer();
	}

	function scaningPlayer() {
		var st = table_clan[index_mas_player].childNodes[2].innerHTML.split('pl_info.php?id=')[1].split(' ')[0].slice(0, -1);
		var xhr = new XMLHttpRequest();
		var uri = 'https://www.heroeswm.ru/pl_warlog.php?id=' + st + '&page=' + start_index;
		start_index++;
		arr_index = 1;
		xhr.open("GET", uri, true);
		xhr.overrideMimeType('text/html; charset=windows-1251');
		xhr.send();
		xhr.onreadystatechange = function () {
			if (xhr.readyState != 4) return;
			if (xhr.status == 200) {
				text = xhr.responseText;
				if (text.indexOf('&gt;</a></center>') > -1) {
					text = text.split('&gt;</a></center>')[1];
				} else {
					var tmp_arr = text.split('</a></center>');
					text = tmp_arr[tmp_arr.length - 1];
				}
				arr = text.split('&nbsp;&nbsp;');
				listenPlayer();
			}
		};
	}

	function Paint() {
		var all;
		for (var i = 1; i < table_clan_length + 1; i++) {
			all = Number(table_clan[i].childNodes[N_row + 6].innerHTML);
			if (all < DEF_COUNT) {
				table_clan[i].childNodes[5].setAttribute("style", "color: red;");
				table_clan[i].childNodes[6].setAttribute("style", "color: red;");
				table_clan[i].childNodes[7].setAttribute("style", "color: red;");
				table_clan[i].childNodes[8].setAttribute("style", "color: red;");
				table_clan[i].childNodes[9].setAttribute("style", "color: red;");
				table_clan[i].childNodes[10].setAttribute("style", "color: red;");
				if (N_row == 5) table_clan[i].childNodes[11].setAttribute("style", "color: red;");
			} else {
				table_clan[i].childNodes[5].setAttribute("style", "color: green;");
				table_clan[i].childNodes[6].setAttribute("style", "color: green;");
				table_clan[i].childNodes[7].setAttribute("style", "color: green;");
				table_clan[i].childNodes[8].setAttribute("style", "color: green;");
				table_clan[i].childNodes[9].setAttribute("style", "color: green;");
				table_clan[i].childNodes[10].setAttribute("style", "color: green;");
				if (N_row == 5) table_clan[i].childNodes[11].setAttribute("style", "color: green;");
			}
			/*if( def === 0 ){
				table_clan[i].childNodes[6].setAttribute("style", "color: black;");
			}else{
				if(100*masWinDef[i]/def < 75){
					table_clan[i].childNodes[6].setAttribute("style", "color: red;");
				}else{
					table_clan[i].childNodes[6].setAttribute("style", "color: green;");
				}
			}*/
		}
	}

	function getCurTimestamp(str) {
		var t = str.split(' ')[0].split('-');
		return (new Date("20" + t[2] + "-" + t[1] + "-" + t[0]));
	}

	function getCurTimestampWar(str) {
		if (str.length < 5) return -1;
		var t = str.split('>')[1].split('<')[0].split(' ')[0].split('-');
		return (new Date("20" + t[2] + "-" + t[1] + "-" + t[0]));
	}
})();