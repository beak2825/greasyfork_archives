// ==UserScript==
// @name           hwm_player_semaphores
// @author         Demin
// @namespace      Demin
// @description    Светофоры в личных рекордах ГО игроков (by Alex Kocharin & Demin)
// @homepage       https://greasyfork.org/users/1602-demin
// @icon           http://i.imgur.com/LZJFLgt.png
// @version        2.2
// @encoding 	   utf-8
// @include        http://*heroeswm.ru/pl_hunter_stat.php*
// @include        http://178.248.235.15/pl_hunter_stat.php*
// @include        http://*lordswm.com/pl_hunter_stat.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/1215/hwm_player_semaphores.user.js
// @updateURL https://update.greasyfork.org/scripts/1215/hwm_player_semaphores.meta.js
// ==/UserScript==

// (c) 2014-2015, demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )
// (c) 2009, Alex Kocharin

(function() {

var version = '2.2';


if (typeof GM_getValue != 'function') {
	this.GM_getValue=function (key,def) {return localStorage[key] || def;};
	this.GM_setValue=function (key,value) {return localStorage[key]=value;};
	this.GM_deleteValue=function (key) {return delete localStorage[key];};
}


var script_num = 482541;
var script_name = "hwm_player_semaphores: Светофоры в личных рекордах ГО игроков (by Alex Kocharin & Demin)";
update_n(version,script_num,script_name);

var url_cur = location.href;
var url = 'http://'+location.hostname+'/';


// set this to "true" for inserting my line after results table
var insertafter = false;
//var insertafter = true;


var text_setting, text_record, text_loaded, text_err, text_parsrec, text_loadrec, text_parspl, text_loadpl, text_sleeping, text_loadsem;

if ( url.match('lordswm') ) {
	text_setting = 'Setting semaphores...';
	text_record = 'Record';
	text_loaded = 'Semaphores loaded successfully';
	text_err = 'Error';
	text_parsrec = 'Parsing records information...';
	text_loadrec = 'Loading records information...';
	text_parspl = 'Parsing player information...';
	text_loadpl = 'Loading player information...';
	text_sleeping = 'Sleeping 2 sec... please wait';
	text_loadsem = 'Load semaphores';
} else {
	text_setting = '\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u0441\u0432\u0435\u0442\u043e\u0444\u043e\u0440\u043e\u0432...';
	text_record = '\u0420\u0435\u043a\u043e\u0440\u0434';
	text_loaded = '\u0421\u0432\u0435\u0442\u043e\u0444\u043e\u0440\u044b \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u044b \u0443\u0441\u043f\u0435\u0448\u043d\u043e';
	text_err = '\u041e\u0448\u0438\u0431\u043a\u0430';
	text_parsrec = '\u0421\u0447\u0438\u0442\u044b\u0432\u0430\u043d\u0438\u0435 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438 \u043e \u0440\u0435\u043a\u043e\u0440\u0434\u0430\u0445...';
	text_loadrec = '\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438 \u043e \u0440\u0435\u043a\u043e\u0440\u0434\u0430\u0445...';
	text_parspl = '\u0421\u0447\u0438\u0442\u044b\u0432\u0430\u043d\u0438\u0435 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438 \u043e\u0431 \u0438\u0433\u0440\u043e\u043a\u0435...';
	text_loadpl = '\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438 \u043e\u0431 \u0438\u0433\u0440\u043e\u043a\u0435...';
	text_sleeping = '\u0417\u0430\u0434\u0435\u0440\u0436\u043a\u0430, 2 \u0441\u0435\u043a... \u043f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435';
	text_loadsem = '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0441\u0432\u0435\u0442\u043e\u0444\u043e\u0440\u044b';
}
text_loaded = '';

function loadsem(log, where)
{
	function setsem(hash, hash2)
	{
		log.innerHTML = text_setting;
		for(var i=0; i<where.childNodes.length; i++) {
			var newtd = document.createElement('td');
			if (i == 0) {
				newtd.innerHTML = '&nbsp;';
			} else {
				var trec = 0;
				var trec2 = 0;
				var prec = 0;
				var dd = 0.6;
				var m;
				var armyx = '';
				if (m = where.childNodes[i].innerHTML.match(/army_info\.php\?name=(\S+)"/)) {
					armyx = m[1];
					if (hash[m[1]]) {
						trec = hash[m[1]];
					}
					if (hash2[m[1]]) {
						trec2 = hash2[m[1]];
					}
				}
				if (m = where.childNodes[i].innerHTML.match(/warlog\.php\?warid=\d+">(\d+)</)) {
					prec = m[1];
				}
				if (trec > 0 && prec > 0) {
					dd = prec * 1.3 / trec;
				}
				var color = 0;
				if (dd <= 0.3) { color = 1;
				} else if (dd <= 0.5) { color = 2;
				} else if (dd <= 0.7) { color = 3;
				} else if (dd <= 1) { color = 4;
				} else { color = 5;
				}

				var record = String(trec);
				if (trec != trec2) record += ' - '+String(trec2);
				if (trec > 0 && prec > 0) {
					newtd.innerHTML = '<a href="'+url+'&mid='+armyx+'#'+armyx+'"><img src="i/map/nl'+String(color)+'.gif" border="0" alt="'+text_record+': '+record+'" title="'+text_record+': '+record+'" width="12" height="12"></a>';
				} else {
					newtd.innerHTML = '&nbsp;';
				}
			}
			newtd.setAttribute('class', 'wblight');
			where.childNodes[i].insertBefore(newtd, where.childNodes[i].childNodes[0]);
		}

		log.innerHTML = text_loaded;
	}

	function parserecs()
	{
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
			log.innerHTML = text_parsrec;
			var pos1 = xmlhttp.responseText.indexOf('class=wblight');
			var pos2 = xmlhttp.responseText.indexOf('<tr><td', pos1+10);
			var pos3 = xmlhttp.responseText.indexOf('</table>', pos2+5);
			if (pos1 == -1 || pos2 == -1 || pos3 == -1) {
				log.innerHTML = text_err+': parse2 1st err';
				return;
			}

			var text = xmlhttp.responseText.substr(pos2, pos3-pos2) + '<tr>';
			pos1 = 0;
			pos2 = text.indexOf('<tr>', pos1+1);
			var m, name, value, hash = {}, hash2 = {};
			while(pos2 != -1) {
				var textt = text.substr(pos1, pos2-pos1);
				if (textt.indexOf('rowspan=') > 0) {
					if (m = textt.match(/'army_info\.php\?name=(\S+)'/)) {
						name = m[1];
					}
				}
				if (m = textt.match(/'warlog\.php\?warid=\d+'>(\d+)</)) {
					value = m[1];
				}
				hash[name] = value;
				if (textt.indexOf('rowspan=') > 0) {
					hash2[name] = value;
				}

				pos1 = pos2;
				pos2 = text.indexOf('<tr>', pos1+1);
			}
			setsem(hash, hash2);
        } else {
			log.innerHTML = text_err+': http code is '+String(xmlhttp.status);
		}
	  }
	}
	
	function getrecs()
	{
		log.innerHTML = text_loadrec;
		xmlhttp.open('GET', url, true);
		xmlhttp.onreadystatechange = parserecs;
		xmlhttp.send(null);
	}

	function parseplayer()
	{
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
			log.innerHTML = text_parspl;
			var pos1 = xmlhttp.responseText.indexOf('class=wblight');
			var pos2 = xmlhttp.responseText.indexOf('male.gif');
			if (pos1 == -1 || pos2 == -1 || pos1 > pos2) {
				log.innerHTML = text_err+': parse 1st err';
				return;
			}
			var text = xmlhttp.responseText.substr(pos1, pos2-pos1);
			var m;
			if (m = text.match(/\[(\d+)\]&nbsp;<img src=.*i\/r\d*(\d).gif'/)) {
				url = '/plstats_hunters.php?level='+String(m[1])+'&race='+String(m[2]);
				log.innerHTML = text_sleeping;
				setTimeout(getrecs, 2000);
			} else {
				log.innerHTML = text_err+': parse 2nd err';
				return;
			}
        } else {
			log.innerHTML = text_err+': http code is '+String(xmlhttp.status);
		}
	  }
	}

	var xmlhttp = new XMLHttpRequest();
	if (!xmlhttp) {
		log.innerHTML = text_err+': xmlhttp create';
		return;
	}

	var alla = where.childNodes[1].getElementsByTagName('a');
	var url = false;
	for(var i=0; i<alla.length; i++) {
		if (alla[i].href.indexOf('pl_info.php?') > 0) {
			url = alla[i].href;
			break;
		}
	}
	if (url == false) {
		log.innerHTML = text_err+': error 1';
		return;
	}

	log.innerHTML = text_loadpl;
	xmlhttp.open('GET', url, true);
	xmlhttp.onreadystatechange = parseplayer;
	xmlhttp.send(null);
}

var newtr = document.createElement('tr');
var newtd = document.createElement('td');
var newa = document.createElement('a');
newtd.setAttribute('align', 'center');
newa.innerHTML = text_loadsem;
newa.href = '#';
newtd.appendChild(newa);
newtr.appendChild(newtd);

var alltbl = document.getElementsByTagName('table');
var ctbl = false;
var wb = false;
for(var i=0;i<alltbl.length;i++) {
	if (alltbl[i].getAttribute('class') == 'wbwhite') {
		ctbl = alltbl[i];
		newa.addEventListener('click', function(e) {
			e.preventDefault();
			loadsem(newtd, wb.childNodes[0]);
		}, false);
		var n = ctbl.childNodes[0];
		n.insertBefore(newtr, n.childNodes[insertafter ? 2 : 1]);
	} else if (alltbl[i].getAttribute('class') == 'wb') {
		wb = alltbl[i];
	}
}


function $(id) { return document.querySelector("#"+id); }

function addEvent(elem, evType, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(evType, fn, false);
	}
	else if (elem.attachEvent) {
		elem.attachEvent("on" + evType, fn);
	}
	else {
		elem["on" + evType] = fn;
	}
}

function update_n(a,b,c,d,e){if(e){e++}else{e=1;d=(Number(GM_getValue(b+'_update_script_last2','0'))||0)}if(e>3){return}var f=new Date().getTime();var g=document.querySelector('#update_demin_script2');if(g){if((d+86400000<f)||(d>f)){g=g.innerHTML;if(/100000=1.1/.exec(g)){var h=new RegExp(b+'=(\\d+\\.\\d+)=(\\d+)').exec(g);var i=/url7=([^%]+)/.exec(g);if(a&&h&&i){if(Number(h[1])>Number(a))setTimeout(function(){if(confirm('\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043A\u0440\u0438\u043F\u0442\u0430: "'+c+'".\n\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u0441\u0435\u0439\u0447\u0430\u0441?\n\nThere is an update available for the script: "'+c+'".\nWould you like install the script now?')){if(typeof GM_openInTab=='function'){GM_openInTab(i[1].replace(/\s/g,'')+h[2])}else{window.open(i[1].replace(/\s/g,'')+h[2],'_blank')}}},500)}GM_setValue(b+'_update_script_last2',''+f)}else{setTimeout(function(){update_n(a,b,c,d,e)},1000)}}}else{var j=document.querySelector('body');if(j){var k=GM_getValue(b+'_update_script_array2');if(e==1&&((d+86400000<f)||(d>f)||!k)){if(k){GM_deleteValue(b+'_update_script_array2')}setTimeout(function(){update_n(a,b,c,d,e)},1000);return}var l=document.createElement('div');l.id='update_demin_script2';l.setAttribute('style','position: absolute; width: 0px; height: 0px; top: 0px; left: 0px; display: none;');l.innerHTML='';j.appendChild(l);if((d+86400000<f)||(d>f)||!k){var m=new XMLHttpRequest();m.open('GET','photo_pl_photos.php?aid=1777'+'&rand='+(Math.random()*100),true);m.onreadystatechange=function(){update(m,a,b,c,d,e)};m.send(null)}else{document.querySelector('#update_demin_script2').innerHTML=k;setTimeout(function(){update_n(a,b,c,d,e)},10)}}}}function update(a,b,c,d,e,f){if(a.readyState==4&&a.status==200){a=a.responseText;var g=/(\d+=\d+\.\d+(=\d+)*)/g;var h='';var i=/(url7=[^%]+\%)/.exec(a);if(i){h+=i[1]}while((i=g.exec(a))!=null){if(h.indexOf(i[1])==-1){h+=' '+i[1]}};GM_setValue(c+'_update_script_array2',''+h);var j=document.querySelector('#update_demin_script2');if(j){j.innerHTML=h;setTimeout(function(){update_n(b,c,d,e,f)},10)}}}

})();
