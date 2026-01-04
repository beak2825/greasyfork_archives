// ==UserScript==
// @name ClanStatistics
// @author Demin, CheckT
// @namespace clan
// @version 1.4.1
// @description Статистика по клану, фракциям, уровням..
// @homepage https://greasyfork.org/ru/scripts/1214
// @icon http://i.imgur.com/LZJFLgt.png
// @encoding utf-8

// @include *://*heroeswm.ru/clan_info.php*
// @include *://*lordswm.com/clan_info.php*

// @grant GM_deleteValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_log
// @grant GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461891/ClanStatistics.user.js
// @updateURL https://update.greasyfork.org/scripts/461891/ClanStatistics.meta.js
// ==/UserScript==
(function () {
	if (typeof GM_getValue != 'function') {
		this.GM_getValue = function (key, def) {
			return localStorage[key] || def;
		};
		this.GM_setValue = function (key, value) {
			return localStorage[key] = value;
		};
		this.GM_deleteValue = function (key) {
			return delete localStorage[key];
		};
	}
	
	var url_cur = location.href;
	var url = 'http://' + location.hostname + '/';
	var clan_online = document.querySelectorAll("img[src$='clans/online.gif']");
	var clan_offline = document.querySelectorAll("img[src$='clans/offline.gif']");
	var clan_battle = document.querySelectorAll("img[src$='clans/battle.gif']");
	var clan_arcomag = document.querySelectorAll("img[src$='clans/arcomag.gif']");
	
	if (clan_offline[0]) {
		var clan_table = clan_offline[0].parentNode;
		var img_link = /(\S*\/)i\//.exec(clan_offline[0].src)[1];
	} else if (clan_online[0]) {
		var clan_table = clan_online[0].parentNode;
		var img_link = /(\S*\/)i\//.exec(clan_online[0].src)[1];
	}
	
	if (clan_table) {
		
		var hwm_clan_statistics = GM_getValue("hwm_clan_statistics", '0');
		
		while (clan_table.tagName != 'TR') {
			clan_table = clan_table.parentNode;
		}
		clan_table = clan_table.parentNode.childNodes;
		
		var add_table_parent = document.querySelector("a[href^='clan_log.php?id']");
		if (add_table_parent != null) {
			while (add_table_parent.tagName != 'TR') {
				add_table_parent = add_table_parent.parentNode;
			}
		}
		var add_table = document.createElement('tr');
		add_table.setAttribute('id', 'clan_statistics');
		
		if (add_table_parent != null) {
			var add_hide_parent = add_table_parent.previousSibling.firstChild;
			var add_hide = document.createElement('span');
			add_hide.setAttribute('id', 'clan_statistics_hide');
			add_hide.innerHTML = '&nbsp;&nbsp;&nbsp;[<<]';
			
			add_hide_parent.appendChild(add_hide);
			add_table_parent.parentNode.insertBefore(add_table, add_table_parent);
		}
		addEvent($("clan_statistics_hide"), "click", clan_statistics_hide_f);
		
		if (hwm_clan_statistics == '1') {
			hwm_clan_statistics = '0';
			clan_statistics_hide_f();
		} else {
			main_statistics();
		}
		
	}
	
	function main_statistics() {
		let is_lordswm = location.hostname.match('lordswm')
		var text_all = is_lordswm ? 'All' : 'Всего';
		var text_online = is_lordswm ? 'Online' : 'В сети';
		var text_sr_level = is_lordswm ? 'The average' : "Средний уровень героев";
		var text_level = is_lordswm ? ' level' : ' уровней';
		var st_author = is_lordswm ? 'Script author' : "Автор скрипта";
		
		var frak_mass = [];
		var frak_mass_name = [];
		var frak_mass_title = [];
		var frak_i, frak_i_title, frak_img_ver;
		
		var ur_mass = [];
		var ur_mass_n = [];
		
		var clan_table_length = clan_table.length;
		
		for (var i = clan_table_length; i--;) {
			frak_i = clan_table[i].childNodes[2].querySelector("img[src*='i/f/r'][src*='.png']");
			frak_i_title = frak_i.title;
			frak_img_ver = /i\/f\/r\d+\.png(.+)/.exec(frak_i.src)[1];
			frak_i = /i\/f\/r(\d+)\.png/.exec(frak_i.src)[1];
			if (!frak_mass_name[frak_i]) {
				frak_mass.push(frak_i);
				frak_mass_name[frak_i] = 1;
				frak_mass_title[frak_i] = frak_i_title;
			} else {
				frak_mass_name[frak_i]++;
			}
			
			frak_i = Number(clan_table[i].childNodes[3].innerHTML);
			if (!ur_mass_n[frak_i]) {
				ur_mass.push(frak_i);
				ur_mass_n[frak_i] = 1;
			} else {
				ur_mass_n[frak_i]++;
			}
		}

//frak_mass.sort( function(a, b) { return b - a; } );
		frak_mass.sort(function (a, b) {
			return b.replace(/(\d*)(\d)/, '$2.$1') - a.replace(/(\d*)(\d)/, '$2.$1');
		});
		ur_mass.sort(function (a, b) {
			return a - b;
		});
		
		var add_table_html = '<td colspan="2" class="wbwhite"><table width="100%" height="100%"><tr><td width="60%" valign="top" style="border-right:1px #5D413A solid;">';
		add_table_html += '<table width="100%" cellpadding="5"><tr><td align="center">';
		
		add_table_html += '<b>' + text_all + ':</b> ' + clan_table_length + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>' + text_online + ':</b> ' + (clan_table_length - clan_offline.length);
		add_table_html += ' (' + Math.round((clan_table_length - clan_offline.length) / clan_table_length * 100) + '%)';
		
		add_table_html += '</td></tr><tr><td align="center" style="white-space:nowrap">';
		
		if (clan_online[0]) add_table_html += '<img src="' + img_link + 'i/clans/online.gif" align="absmiddle" border="0" height="15" width="15"> <b>' + clan_online[0].title + ':</b> ' + clan_online.length + '&nbsp;&nbsp;&nbsp;';
		if (clan_battle[0]) add_table_html += '<img src="' + img_link + 'i/clans/battle.gif" align="absmiddle" border="0" height="15" width="15"> <b>' + clan_battle[0].title + ':</b> ' + clan_battle.length + '&nbsp;&nbsp;&nbsp;';
		if (clan_arcomag[0]) add_table_html += '<img src="' + img_link + 'i/clans/arcomag.gif" align="absmiddle" border="0" height="15" width="15"> <b>' + clan_arcomag[0].title + ':</b> ' + clan_arcomag.length + '&nbsp;&nbsp;&nbsp;';
		if (clan_offline[0]) add_table_html += '<img src="' + img_link + 'i/clans/offline.gif" align="absmiddle" border="0" height="15" width="15"> <b>' + clan_offline[0].title + ':</b> ' + clan_offline.length;
		
		add_table_html += '</td></tr><tr><td>';
		
		for (var i = frak_mass.length; i--;) {
			frak_i = frak_mass[i];
			add_table_html += '<img src="' + img_link + 'i/f/r' + frak_i + '.png' + frak_img_ver + '" align="absmiddle" border="0" height="15" width="15"> <b>' + frak_mass_title[frak_i] + ':</b> ' + frak_mass_name[frak_i];
			add_table_html += ' (' + Math.round(frak_mass_name[frak_i] / clan_table_length * 100) + '%)<br>';
		}
		
		add_table_html += '</td></tr></table>';
		add_table_html += '</td><td valign="top" height="100%">';
		
		add_table_html += '<table width="100%" height="100%" cellpadding="5"><tr><td align="center">';
		
		var ur_sredn = 0;
		
		for (var i = ur_mass.length; i--;) {
			frak_i = ur_mass[i];
			ur_sredn += Number(frak_i) * Number(ur_mass_n[frak_i]);
		}
		
		add_table_html += '<b>' + text_sr_level + ':</b> ' + Math.round(ur_sredn / clan_table_length * 10) / 10;
		add_table_html += '</td></tr><tr><td height="100%" valign="middle">';
		
		for (var i = ur_mass.length; i--;) {
			frak_i = ur_mass[i];
			add_table_html += '<b>' + frak_i + text_level + ':</b> ' + ur_mass_n[frak_i];
			add_table_html += ' (' + Math.round(ur_mass_n[frak_i] / clan_table_length * 100) + '%)<br>';
		}
		
		add_table_html += '</td></tr><tr><td align="right" valign="bottom">';
		
		add_table_html += st_author + ': <a href="pl_info.php?id=15091">Demin</a>';
		
		add_table_html += '</td></tr></table></td></tr></table></td>';
		
		add_table.innerHTML = add_table_html;
		
	}
	
	function clan_statistics_hide_f() {
		var add_hide_html = '&nbsp;&nbsp;&nbsp;';
		var clan_statistics = document.getElementById('clan_statistics');
		
		if (hwm_clan_statistics == '0') {
			hwm_clan_statistics = '1';
			if (clan_statistics != null) {
				clan_statistics.style.display = 'none';
			}
			//console.log(clan_statistics);
			if (clan_online[0]) add_hide_html += '<img src="' + img_link + 'i/clans/online.gif" align="absmiddle" border="0" height="15" width="15"> <b>' + clan_online[0].title + ':</b> ' + clan_online.length + '&nbsp;&nbsp;&nbsp;';
			if (clan_battle[0]) add_hide_html += '<img src="' + img_link + 'i/clans/battle.gif" align="absmiddle" border="0" height="15" width="15"> <b>' + clan_battle[0].title + ':</b> ' + clan_battle.length + '&nbsp;&nbsp;&nbsp;';
			if (clan_arcomag[0]) add_hide_html += '<img src="' + img_link + 'i/clans/arcomag.gif" align="absmiddle" border="0" height="15" width="15"> <b>' + clan_arcomag[0].title + ':</b> ' + clan_arcomag.length + '&nbsp;&nbsp;&nbsp;';
			add_hide_html += '[>>]';
		} else {
			hwm_clan_statistics = '0';
			if (clan_statistics != null) {
				clan_statistics.style.display = 'table-row';
			}
			add_hide_html += '[<<]';
			main_statistics();
		}
		GM_setValue("hwm_clan_statistics", hwm_clan_statistics);
		if ($("clan_statistics_hide") != null) {
			$("clan_statistics_hide").innerHTML = add_hide_html;
		}
	}
	
	function $(id) {
		return document.querySelector("#" + id);
	}
	
	function addEvent(elem, evType, fn) {
		if (elem != null) {
			if (elem.addEventListener) {
				elem.addEventListener(evType, fn, false);
			} else if (elem.attachEvent) {
				elem.attachEvent("on" + evType, fn);
			} else {
				elem["on" + evType] = fn;
			}
		}
	}
})();