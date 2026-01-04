// ==UserScript==
// @name             Сортировка боев для наймов и боевиков
// @include			 http://www.ganjawars.ru/war/*
// @version          2.0
// @author           Buger_man
// @description      ganjawars - сортировка боев для найма и боевика
// @namespace https://greasyfork.org/users/153961
// @downloadURL https://update.greasyfork.org/scripts/33495/%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%B1%D0%BE%D0%B5%D0%B2%20%D0%B4%D0%BB%D1%8F%20%D0%BD%D0%B0%D0%B9%D0%BC%D0%BE%D0%B2%20%D0%B8%20%D0%B1%D0%BE%D0%B5%D0%B2%D0%B8%D0%BA%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/33495/%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%B1%D0%BE%D0%B5%D0%B2%20%D0%B4%D0%BB%D1%8F%20%D0%BD%D0%B0%D0%B9%D0%BC%D0%BE%D0%B2%20%D0%B8%20%D0%B1%D0%BE%D0%B5%D0%B2%D0%B8%D0%BA%D0%BE%D0%B2.meta.js
// ==/UserScript==

//*********************НАСТРОЙКИ**********************
//Исключения НПС из списка сортировки , для добавления указать ник в виде |ник
var npc = /\[Soldier|\[Sergeant|\[Captain|\[Major|\[Colonel|\[General|\[Elite|\[Superb|Джинни Томимо|Девятипалый|Боец Триады| Триады|Охранник музея|Кассир|Хосе Вирт|Босс Отто|Паоло Джакометти|Ли Хан|Питер Коулсон|Дейв Бишоп|Пьяный Джо|Нэхкоменс|Растлинг Ховелл|Призрак Z-Lands/i;
//*********************КОНЕЦ**************************

(function f() {
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	var request = new XMLHttpRequest();
	var span_content = root.document.createElement('span');
	var tm = 0;
	var answerPage = new String();
	var spisInner = new Array;
	var spisStroka = new Array;

	function REQ(url, method, param, async, onsuccess, onfailure) {
		request.open(method, url, async);
		request.send(param);
		if (request.readyState == 4 && request.status == 200 && typeof onsuccess != 'undefined') onsuccess(request);
		else if (request.readyState == 4 && request.status != 200 && typeof onfailure != 'undefined') onfailure(request)
	}

	function Reqest_slow(URL) {
		REQ(URL, 'GET', null, false, function(req) {
			answerPage = req.responseText
		});
		var span = document.createElement('span');
		span.innerHTML = answerPage;
		return span
	}

	function ajaxQuery1(url, onsuccess, onfailure) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('GET', url, true);
		xmlHttpRequest.send(null);
		var timeout = setTimeout(function() {
			xmlHttpRequest.abort()
		}, 10000);
		xmlHttpRequest.onreadystatechange = function() {
			if (xmlHttpRequest.readyState != 4) return;
			clearTimeout(timeout);
			if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200 && typeof onsuccess != 'undefined') {
				onsuccess(xmlHttpRequest)
			} else {
				if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status != 200 && typeof onfailure != 'undefined') {
					onfailure()
				}
			}
		}
	}

	function ajaxQuery(url, async, onsuccess, onfailure) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('GET', url, async);
		xmlHttpRequest.send(null);
		if (async) {
			var timeout = setTimeout(function() {
				xmlHttpRequest.abort();
				alert('warSortToProf: сервер не отвечает...\nСтраница будет обновлена.');
				root.location.reload()
			}, 10000);
			xmlHttpRequest.onreadystatechange = function() {
				if (xmlHttpRequest.readyState != 4) return;
				clearTimeout(timeout);
				if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200 && typeof onsuccess != 'undefined') {
					onsuccess(xmlHttpRequest)
				} else {
					if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status != 200 && typeof onfailure != 'undefined') {
						onfailure()
					}
				}
			}
		} else {
			if (xmlHttpRequest.status == 200 && typeof onsuccess != 'undefined') {
				onsuccess(xmlHttpRequest)
			} else {
				if (xmlHttpRequest.status != 200 && typeof onfailure != 'undefined') {
					onfailure()
				}
			}
		}
	}

	function aaa(d) {
		var a = +d;
		return Math.round(a * 241 / 3 + 759)
	}
	var Z2 = '58172,45812,58168,58166,68864,58160,68882,68876,68858,45814,58148,45838,45842,55886,68870';
	var Z3 = '99137,45820,133699,133698,45793,45811,99130,58162,45817,45791,45809,133697,58159,68863,45796,133696,99131,58153,133695,45805,45787,12761,58150,133694,45839,68860,58147,45785,133693,55885,55888,133692,58141';
	var G3 = ' 133678,45736,45797,45737,58114,45739,65395,133679,99117,133680,45742,58117,45743,65399,45745,58120,45748,133681,99122,133682,99118,45751,45752,99114,45754,133683,58105,133684,54622,45757,65368,58102,45761,133685,45763,133686,65413,58108,45766,45767,65374,45769,133687,133688,99110,45772,54619,133689,133690,65423,99111,45778,99119,99112,45781,133691,45782';
	var G2 = '65390,65351,58115,65354,45740,65396,58118,45746,58139,45749,65402,65362,58121,65363,65365,58123,65366,54623,58124,65408,45758,58135,58133,45760,58097,58126,65411,65372,58109,58111,54620,58127,65414,65375,65417,45770,58103,45773,58112,65420,65380,45775,45776,65381,65383,65384,45779,65426,65386,65387,65429';
	var dis = false;
	var user = [35060555, 69945787, 26808153, 168335885, 61245527, 86533496, 128660939, 63601382, 123374202, 16678361, 17331390, 42950253, 150542453, 167122450, 152728323, 137705669, 162890651, 140530510, 125653178, 159018423, 166642458, 12146034, 72036462, 51629466, 158119413, 71976052, 172144087, 159723830, 134263064, 156623606, 134550818, 139193201, 118980531, 143921380, 91318631, 154677612, 128950540, 158917766, 27068915, 29052024, 156268453, 81202014, 29526312, 134934490, 164582471, 155693909, 81341472, 24259578, 129412377, 149938266, 149924529, 91914383, 64224206, 128662144, 126015964, 137051755, 54316134, 130205508, 152084773, 135596196, 22824744, 20731579, 76566298, 135124719, 127730598, 42923903, 28220333, 158644793, 72087394, 25207190, 155228859, 116149825, 151082695, 165483650, 115757638, 54318705, 124866233, 66918024, 139481357, 102989056, 38075546, 153446503, 19219866, 155655027, 123728633, 149973613, 64247824, 52994811, 151864820, 165931830, 156127869, 23658604, 161257795, 23536739, 141247565, 139983922, 118420688, 123511090, 100610065, 10503780, 155476527, 155248059, 33147096, 88326375, 15605911, 85196669, 72981745, 92884569, 29530810, 150777750, 167813718, 153284712, 59232293, 159021958, 15080772, 42576783, 121497615, 23433350, 10606285, 55247760, 157925810, 56930663, 26947933, 28820342, 154418858, 162744524, 156900114, 140820112, 157090745, 108308890, 6618298, 138950032, 36326368, 86300529, 157258561, 14735097, 126119995, 6462371, 37933998, 84987481, 31306980, 23807060, 40293308, 40477994, 81115575, 38189378, 168736507, 42795049, 81331109, 42380930, 21793586, 27683867, 156937951, 167530463, 58045609, 45273975, 149585924, 77348183, 4391940, 32429478, 12635264, 67372711, 151451425, 47737075, 11507866, 138450359, 155027624, 134282585, 32891555, 170158488, 53880647, 41881739, 43300827, 26556067, 89883958, 17995988, 20814001, 130722131, 15843376, 12743795, 26536787, 33442080, 118410405, 126746194, 16189131, 163894817, 33045635, 123199638, 132568352, 131363111, 149089786, 171014921, 72683788, 156517968, 15538993, 137805443, 41756740, 121220385, 48712964, 153537842, 123972605, 125387918, 99413420, 135088328, 82901465, 43512265, 134507438, 18895400, 117680738, 27703870, 157417219, 30034661, 21074522, 29479558, 100809533, 23195804, 51437710, 148975311, 156824761, 130615850, 156818254, 109802689, 166232999, 136140534, 94132547, 39180209, 64398208, 104119909, 153731205, 168358860, 153031100, 83696123, 28747962, 121464679, 26557754, 81738560, 30205209, 12357472, 157758154, 107321433, 34001842, 139004418, 150759835, 5069230, 167502507, 167858785, 120357284, 26527950, 20804200, 24851394, 170242275, 11712797, 149590102, 169534217, 174440656, 137480816, 164275597, 35281713, 82418582, 117738417, 67475136, 173093386, 41531727, 127980194, 170870080, 2903604, 168606367, 126301147, 162313777, 36397061, 117063537, 104762334, 63214738, 164542063, 36393446, 168389628, 122817813, 34663548, 29243860, 19694154, 113404675, 84118114, 88704826, 16781187, 36174136, 174162140, 37230519, 136303450, 37160549, 99190334, 21511455, 82167058, 133819383, 120977296, 59399868, 25496310, 27938122, 16284406, 171972013, 45864264, 81229488, 115175623, 171223627, 140453952, 12268543, 159516169, 157254062, 15609686, 126604004, 171485434, 109679939, 93190398, 76991181, 176298927, 69335495, 118115743, 72981745, 77793069, 152622846, 21598054, 143889407, 37093551, 73397871, 125658641, 138613917, 122888667, 139335311, 73740734, 119283789, 166473678, 169222604, 39272191, 71270163, 157880341, 160075449, 77723179, 34742034, 84632167, 178423261, 171276728, 23187208, 71639937, 67726499, 56020245, 154909454, 64135197, 148826051, 23101091, 51639668, 41997098, 38750988, 7518352, 91027343, 24721977, 128470870, 16960090, 58320590, 126196392, 131386006, 47368265, 78954448, 52706816, 26912586, 101974928, 17894045, 179692769, 57131094, 31934062, 11847917, 167019222, 136727369, 176979189, 137325451, 166141901, 62474868, 46115868, 23262802, 106836139, 65707642, 20007936, 74986463, 21655171, 27844453, 10877651, 73046493, 41386805, 167385622, 56394839, 87139049, 141437232, 81983898, 30443959, 74255510, 175872357, 93837483, 145562831, 46774039, 14803943, 96922845, 77027251, 83185604, 96301146, 21087456, 179189079, 13784111, 15926521, 176680510, 30151385, 119924930, 50992583, 90127449, 123334116, 181876470, 180687376, 130157147, 70799088];
	var xxx = root.document.getElementById('hpheader');
	var yyy = xxx.parentNode;
	var zzz = yyy.innerHTML;
	var xyz = /d\=(\d+)/.exec(zzz);
	var yzx = xyz[1];
	var test = aaa(yzx);
	/*
	if (user.indexOf(test) == -1) {
		var divCom = root.document.getElementById("comment");
		var note = root.document.createElement('div');
		note.align = "justify";
		note.innerHTML = "<center><font color=red><b>ВНИМАНИЕ!</b></font></center><br>&nbsp;&nbsp;&nbsp;Вас нет в списке пользователей скрипта. Данный скрипт распространяется на <b>платной основе</b>. Для его приобретения необходимо связаться с автором скрипта - <a href=http://www.ganjawars.ru/info.php?id=436429><b>Buger_man</b></a>. Полную информацию о скрипте можно найти на странице персонажа.";
		divCom.parentNode.insertBefore(note, divCom);
		return
	}
	*/
	
	if (localStorage.getItem('warSortParam') != null) {
		var param = JSON.parse(localStorage.getItem('warSortParam'));
		var level = param.level;
		var profNaim = param.profNaim;
		var profBoevik = param.profBoevik;
		var levelInnerMax = param.levelInnerMax;
		var tupeSort = param.tupeSort;
		var tupeVar = param.tupeVar;
		var island = param.island;
		var imgSind = param.imgSind;
	} else {
		var level = 20;
		var profNaim = 0;
		var profBoevik = 0;
		var levelInnerMax = 0;
		var tupeSort = 0;
		var tupeVar = 0;
		var island = 0;
		var imgSind = true
	}
	var mLevel = root.document.createElement('select');
	mLevel.id = "level";
	for (l = 17; l < 51; l++) mLevel.innerHTML += "<option value=" + l + ">" + l + "</option>";
	mLevel[level - 17].selected = true;
	var mNaim = root.document.createElement('select');
	mNaim.id = "profNaim";
	for (l = 0; l < 11; l++) mNaim.innerHTML += "<option value=" + l + ">" + l + "</option>";
	mNaim[profNaim].selected = true;
	var mBoevik = root.document.createElement('select');
	mBoevik.id = "profBoevik";
	for (l = 0; l < 11; l++) mBoevik.innerHTML += "<option value=" + l + ">" + l + "</option>";
	mBoevik[profBoevik].selected = true;
	var mLevelMaxI = root.document.createElement('select');
	mLevelMaxI.id = "levelInnerMax";
	for (l = 0; l < 51; l++) mLevelMaxI.innerHTML += "<option value=" + l + ">" + l + "</option>";
	mLevelMaxI[levelInnerMax].selected = true;
	var mTupeSort = root.document.createElement('select');
	mTupeSort.id = "tupeSort";
	mTupeSort.innerHTML = "<option value=0>Полная</option><option value=1>Синдовые</option><option value=2>Общие</option>";
	mTupeSort[tupeSort].selected = true;
	var mTupeVar = root.document.createElement('select');
	mTupeVar.id = "tupeVar";
	mTupeVar.innerHTML = "<option value=0>Полная</option><option value=1>Недвига</option>";
	mTupeVar[tupeVar].selected = true;
	var mIsland = root.document.createElement('select');
	mIsland.id = "island";
	mIsland.innerHTML = "<option value=0>G/Z</option><option value=1>G</option><option value=2>Z</option>";
	mIsland[island].selected = true;
	var mImgSind = root.document.createElement('input');
	mImgSind.id = "imgSind";
	mImgSind.type = "checkbox";
	mImgSind.checked = imgSind;
	var mSort = root.document.createElement('input');
	mSort.id = "sort";
	mSort.type = "button";
	mSort.value = "Отбор";
	mSort.addEventListener('click', function() {
		mSort.disabled = true;
		warSort(mLevel.value, mNaim.value, mBoevik.value, mLevelMaxI.value, mTupeSort.value, mImgSind.checked, mTupeVar.value, mIsland.value)
	}, true);
	var mSave = root.document.createElement('input');
	mSave.id = "save";
	mSave.type = "button";
	mSave.value = "Сохранить";
	mSave.addEventListener('click', Save, true);
	var tab = root.document.createElement('table');
	tab.border = 0;
	var tr1 = root.document.createElement('tr');
	var td11 = root.document.createElement('td');
	td11.innerHTML = "<ul><li>Уровень:</ul></li>";
	var td12 = root.document.createElement('td');
	td12.appendChild(mLevel);
	tr1.appendChild(td11);
	tr1.appendChild(td12);
	var tr2 = root.document.createElement('tr');
	var td21 = root.document.createElement('td');
	td21.innerHTML = "<ul><li>Наемник:</ul></li>";
	var td22 = root.document.createElement('td');
	td22.appendChild(mNaim);
	tr2.appendChild(td21);
	tr2.appendChild(td22);
	var tr3 = root.document.createElement('tr');
	var td31 = root.document.createElement('td');
	td31.innerHTML = "<ul><li>Боевик:</ul></li>";
	var td32 = root.document.createElement('td');
	td32.appendChild(mBoevik);
	tr3.appendChild(td31);
	tr3.appendChild(td32);
	var tr5 = root.document.createElement('tr');
	var td51 = root.document.createElement('td');
	td51.innerHTML = "<ul><li>Максимальный уровень:</ul></li>";
	var td52 = root.document.createElement('td');
	td52.appendChild(mLevelMaxI);
	tr5.appendChild(td51);
	tr5.appendChild(td52);
	var tr6 = root.document.createElement('tr');
	var td61 = root.document.createElement('td');
	td61.innerHTML = "<ul><li>Сортировка:</ul></li>";
	var td62 = root.document.createElement('td');
	td62.appendChild(mTupeSort);
	tr6.appendChild(td61);
	tr6.appendChild(td62);
	var tr9 = root.document.createElement('tr');
	var td91 = root.document.createElement('td');
	td91.innerHTML = "<ul><li>Вид боя и остров:</ul></li>";
	var td92 = root.document.createElement('td');
	td92.appendChild(mTupeVar);
	td92.appendChild(mIsland);
	tr9.appendChild(td91);
	tr9.appendChild(td92);
	var tr7 = root.document.createElement('tr');
	var td71 = root.document.createElement('td');
	td71.innerHTML = "<ul><li>Значки в синдовых:</ul></li>";
	var td72 = root.document.createElement('td');
	td72.appendChild(mImgSind);
	tr7.appendChild(td71);
	tr7.appendChild(td72);
	var tr8 = root.document.createElement('tr');
	var td81 = root.document.createElement('td');
	td81.colSpan = 2;
	td81.align = "center";
	td81.appendChild(mSort);
	td81.appendChild(mSave);
	tr8.appendChild(td81);
	var tr4 = root.document.createElement('tr');
	var td41 = root.document.createElement('td');
	td41.colSpan = 2;
	td41.align = "center";
	td41.innerHTML = 'Всего боев: <span id="allWar"></span><br>' + 'Подходящие бои: <span id="levelWar"></span><span id="testWar"></span><br>' + '<span id="dopCont"></span>';
	tr4.appendChild(td41);
	tab.appendChild(tr1);
	tab.appendChild(tr2);
	tab.appendChild(tr3);
	tab.appendChild(tr5);
	tab.appendChild(tr6);
	tab.appendChild(tr9);
	tab.appendChild(tr7);
	tab.appendChild(tr8);
	tab.appendChild(tr4);
	var divCom = root.document.getElementById("comment");
	divCom.parentNode.insertBefore(tab, divCom);

	function warSort(level, profNaim, profBoevik, levelInnerMax, tupeSort, imgSind, tupeVar, island) {
		var naim = profNaim / 2;
		var boevik = profBoevik / 2;
		if (level >= 43) {
			if (profNaim < 6) var naim = 3;
			if (profBoevik < 6) var boevik = 3
		}
		var tables = root.document.getElementsByTagName('table');
		for (var i = 0; i < tables.length; i++) {
			if (tables[i].rows[0].cells[0].textContent.indexOf("Виды боев") != -1) {
				var table = tables[i].rows[1].cells[1].firstElementChild;
				break
			}
		}
		table.setAttribute('id', 'result');
		if (table.firstElementChild.nodeName == "TABLE") {
			spisInner = new Array;
			root.document.getElementById("allWar").innerHTML = '<b>Идет запрос</b>';
			root.document.getElementById("testWar").innerHTML = '';
			table.align = "center";
			table.innerHTML = "<img src=http://www.gw-rent.h19.ru/scripts/100w92h.gif><br><font color=green><b>Загрузка ...</b></font>";
			table = reFresh();
		}
		var len = table.rows.length - 1;
		root.document.getElementById("allWar").innerHTML = '<b>' + len + '</b>';
		for (var s = 0; s < len; s++) {
			if (table.rows[s].cells[1].textContent.indexOf("[bf] ") != 0 && table.rows[s].cells[1].textContent.match(npc) == null) {
				spisInner.push(table.rows[s])
			} else if (table.rows[s].cells[1].textContent.split('vs')[1].match(/\[Soldier|\[Sergeant|\[Captain|\[Major|\[Colonel|\[General|\[Elite|\[Superb/)) {
				spisInner.push(table.rows[s]);
			} else table.rows[s].style.display = "none";
		}
		spisInner = podbor(spisInner, level, naim, boevik);
		root.document.getElementById("levelWar").innerHTML = '<b>' + spisInner.length + '</b>';
		var tabNewSinds = root.document.createElement('table');
		tabNewSinds.border = 0;
		tabNewSinds.id = 'sind';
		tabNewSinds.width = '100%';
		tabNewSinds.innerHTML = '<tr align = "center"><td colspan=2 bgcolor=#006600><font color=#f5fff5>Синдовые (<span id=sindKol>0</span>)</fonr></td></tr>';
		var tabNewObsh = root.document.createElement('table');
		tabNewObsh.border = 0;
		tabNewObsh.id = 'obsh';
		tabNewObsh.width = '100%';
		tabNewObsh.innerHTML = '<tr align = "center"><td colspan=2 bgcolor=#006600><font color=#f5fff5>Общие (<span id=obshKol>0</span>)</fonr></td></tr>';
		table = root.document.getElementById("result");
		table.innerHTML = '';
		table.appendChild(tabNewSinds);
		table.appendChild(tabNewObsh);
		proverka(0)
	}

	function podbor(boi, level, naim, boevik) {
		var spisToReturn = new Array;
		var levelInnerMax = root.document.getElementById('levelInnerMax').value;
		var tupeSort = root.document.getElementById('tupeSort').value;
		if (tupeSort == 1) {
			var levelMax = level - naim;
			var levelMin = Number(level) + Number(naim)
		} else if (tupeSort == 2) {
			var levelMax = level - boevik;
			var levelMin = Number(level) + Number(boevik)
		} else {
			if (naim > boevik) {
				var levelMax = level - naim;
				var levelMin = Number(level) + Number(naim)
			} else {
				var levelMax = level - boevik;
				var levelMin = Number(level) + Number(boevik)
			}
		}
		for (var i = 0; i < boi.length; i++) {
			var levels = boi[i].cells[1].innerHTML.match(/\[\d+\]/g).sort().toString().replace(/\[(\d+)\]/g, '$1').split(',');
			for (var zy = 0; zy < 5; zy++) {
				if (Number(levels[0]) > Number(levels[levels.length - 1])) {
					levels[0] = levels[levels.length - 1];
					levels.pop()
				} else break
			}
			var levMin = Number(levels[0]);
			var levMax = Number(levels[levels.length - 1]);
			if (level >= levMin && level <= levMax) spisToReturn.push(boi[i]);
			else if (level > levMax && levelMax <= levMax) spisToReturn.push(boi[i]);
			else if (level < levMin && levelMin >= levMin) spisToReturn.push(boi[i]);
			else {
				boi[i].style.display = "none";
				continue
			}
			if (levelInnerMax != 0 && levMax > levelInnerMax) {
				spisToReturn.pop();
				boi[i].style.display = "none";
				continue
			}
		}
		return spisToReturn
	}

	function reFresh() {
		ajaxQuery('http://www.ganjawars.ru/war/', false, function(xhr) {
			span_content.innerHTML = xhr.responseText
		}, function() {
			alert('Произошла ошибка при обновлении страницы.')
		});
		var dopInfo = root.document.getElementById("dopCont");
		var tables = span_content.getElementsByTagName('table');
		for (var i = 0; i < tables.length; i++) {
			if (tables[i].rows[0].cells[0].textContent.indexOf("Виды боев") != -1) {
				var table = tables[i].rows[1].cells[1].firstElementChild;
				break
			}
		}
		var div = span_content.getElementsByTagName('div');
		for (var i = 0; i < div.length; i++) {
			if (div[i].innerHTML.indexOf("На страницу вооружения") != -1) {
				var menuPers = div[i];
				break
			}
		}
		if (menuPers.innerHTML.indexOf("sms.gif") != -1) var sms = true;
		else var sms = false;
		if (menuPers.innerHTML.indexOf("Ваш синдикат в нападении") != -1) var napad = true;
		else var napad = false;
		var smsInfo = "<a href=/sms.php style='text-decoration:none;'><b><img src=http://images.ganjawars.ru/i/sms.gif width=18 height=11 border=0 alt='Вам пришла почта!'> Вам пришла почта!</b></a>";
		var napadInfo = "<a href='http://www.ganjawars.ru/wargroup.php?war=attacks' style='text-decoration:none;color:red;'><b>Ваш синдикат в нападении!</b></a>";
		if (sms && napad) dopInfo.innerHTML = smsInfo + "<br>" + napadInfo;
		else {
			if (sms) dopInfo.innerHTML = smsInfo;
			if (napad) dopInfo.innerHTML = napadInfo
		}
		if (!sms && !napad) dopInfo.innerHTML = "";
		return table
	}

	function proverka(i) {
		var info = false;
		var sind = root.document.getElementById("sind");
		var sindKol = root.document.getElementById("sindKol");
		var obsh = root.document.getElementById("obsh");
		var obshKol = root.document.getElementById("obshKol");
		root.document.getElementById("testWar").innerHTML = ' (' + (i + 1) + ')';
		var url = spisInner[i].getElementsByTagName('a')[0].href;
		spisInner[i].getElementsByTagName('a')[0].target = '_blank';
		ajaxQuery(url, true, function(xhr) {
			span_content.innerHTML = xhr.responseText;
			if (span_content.innerHTML.indexOf("Бой ещё не окончен.") != -1) info = infoWar(span_content);
			if (info) {
				spisInner[i].cells[1].innerHTML = info + '<br>' + spisInner[i].cells[1].innerHTML;
				if (info.length < 30) {
					obsh.appendChild(spisInner[i]);
					obshKol.innerHTML = Number(obshKol.innerHTML) + Number(1)
				} else {
					sind.appendChild(spisInner[i]);
					sindKol.innerHTML = Number(sindKol.innerHTML) + Number(1)
				}
			} else spisInner[i].style.display = "none";
			i++;
			if (spisInner[i]) root.setTimeout(function() {
				proverka(i)
			}, tm);
			else {
				mSort.disabled = false
			}
		}, function() {
			root.setTimeout(function() {
				proverka(i)
			}, tm)
		})
	}

	function infoWar(content) {
		var stroka = /(\d{2}\.\d{2}\.\d{2} \d{2}:\d{2} начался бой .*$)/m.exec(content.innerHTML)[1];
		var levels = stroka.match(/\[\d+\]/g).sort().toString().replace(/\[(\d+)\]/g, '$1').split(',');
		var levMin = Number(levels[0]);
		var levMax = Number(levels[levels.length - 1]);
		var level = root.document.getElementById("level").value;
		var naim = root.document.getElementById("profNaim").value / 2;
		var boevik = root.document.getElementById("profBoevik").value / 2;
		if (level >= 43) {
			if (root.document.getElementById("profNaim").value < 6) var naim = 3;
			if (root.document.getElementById("profBoevik").value < 6) var boevik = 3
		}
		var title = /\(Захват.*|\(Нападение.*\]\)/gi.exec(stroka);
		if (title) {
			var isl = 0;
			if (root.document.getElementById("tupeSort").value == 2) return false;
			if (level > levMax && levMax < (level - naim)) return false;
			if (level < levMin && levMin > (Number(level) + Number(naim))) return false;
			if (/Электростанция/.exec(title)) return false;
			if (/Урановый рудник/.exec(title)) {
				if (root.document.getElementById("tupeVar").value == 1) return false;
				var tupe = 0;
				var id = /#(\d+)/.exec(title)[1];
				var tip = " Урановый рудник [S] остров";
				if (G2.indexOf(id) != -1 && level > 42) return false;
				if (Z2.indexOf(id) != -1 && level > 42) return false;
				if (G2.indexOf(id) != -1) {
					tip = " Урановый рудник [G] 2 клетки";
					isl = 1
				}
				if (Z2.indexOf(id) != -1) {
					tip = " Урановый рудник [Z] 2 клетки";
					isl = 2
				}
				if (G3.indexOf(id) != -1) {
					tip = " Урановый рудник [G] 3 клетки";
					isl = 1
				}
				if (Z3.indexOf(id) != -1) {
					tip = " Урановый рудник [Z] 3 клетки";
					isl = 2
				}
			} else if (/объекта #|объект #/.exec(title)) {
				var tupe = 1;
				var id = /#(\d+)/.exec(title)[1];
				var url = 'http://www.ganjawars.ru/object.php?id=' + id;
				var tip = /\[ (.*),/.exec(title)[1];
				ajaxQuery(url, false, function(xhr) {
					span_content.innerHTML = xhr.responseText
				}, function() {
					alert('Произошла ошибка при определении острова для объекта:\n' + tip + ' ' + url + '\n' + 'Скопируйте это сообщение и отправьте Buger_man, для исправлении ошибки.')
				});
				var divs = span_content.getElementsByTagName('div');
				for (var i = 0; i < divs.length; i++) {
					if (divs[i].innerHTML.indexOf('>Рабочие места<') != -1) {
						var isl = />\[(.{1})\].*<\/a>:<\/b>/.exec(span_content.innerHTML)[1];
						tip += ' [' + isl + ']';
						if (tip.indexOf('G') != -1) isl = 1;
						else isl = 2;
						break
					}
				}
			} else if (/Захват контроля баров|/.exec(title)) {
				var tupe = 0;
				var tip = /(Захват контроля баров в \[(.{1})\].*)\) /.exec(title);
				if (tip[2].indexOf('G') != -1) isl = 1;
				else isl = 2;
				tip = tip[1]
			}
			if (isl == 1 && root.document.getElementById("island").value == 2) return false;
			if (isl == 2 && root.document.getElementById("island").value == 1) return false;
			if (content.innerHTML.indexOf("Войти в бой за") != -1) tip = "<font color=green><b>" + tip + "</b></font>";
			if (root.document.getElementById("imgSind").checked) {
				var sinds = stroka.split(/<b>vs<\/b>/i);
				var redSinds = sinds[0].match(/<\!-- s\d+ -->/g).sort().toString().replace(/<\!-- s(\d+) -->/g, '$1').split(',');
				if (/synds\/(\d+).gif/m.exec(sinds[0])) redSinds.push(/synds\/(\d+).gif/m.exec(sinds[0])[1]);
				var blueSinds = sinds[1].match(/<\!-- s\d+ -->/g).sort().toString().replace(/<\!-- s(\d+) -->/g, '$1').split(',');
				if (/synds\/(\d+).gif/m.exec(sinds[1])) blueSinds.push(/synds\/(\d+).gif/m.exec(sinds[1])[1]);
				redSinds = new Array(redSinds[0], redSinds[redSinds.length - 1]);
				blueSinds = new Array(blueSinds[0], blueSinds[blueSinds.length - 1]);
				if (redSinds[0] != redSinds[1]) var red = "<font color=red><a href=http://www.ganjawars.ru/syndicate.php?id=" + redSinds[0] + "><img src=http://images.ganjawars.ru/img/synds/" + redSinds[0] + ".gif width=20 height=14 border=0 alt='#" + redSinds[0] + "'></a>+<a href=http://www.ganjawars.ru/syndicate.php?id=" + redSinds[1] + "><img src=http://images.ganjawars.ru/img/synds/" + redSinds[1] + ".gif width=20 height=14 border=0 alt='#" + redSinds[1] + "'></a></font>";
				else var red = "<font color=red><a href=http://www.ganjawars.ru/syndicate.php?id=" + redSinds[0] + "><img src=http://images.ganjawars.ru/img/synds/" + redSinds[0] + ".gif width=20 height=14 border=0 alt='#" + redSinds[0] + "'></a></font>";
				if (blueSinds[0] != blueSinds[1]) var blue = "<font color=blue><a href=http://www.ganjawars.ru/syndicate.php?id=" + blueSinds[0] + "><img src=http://images.ganjawars.ru/img/synds/" + blueSinds[0] + ".gif width=20 height=14 border=0 alt='#" + blueSinds[0] + "'></a>+<a href=http://www.ganjawars.ru/syndicate.php?id=" + blueSinds[1] + "><img src=http://images.ganjawars.ru/img/synds/" + blueSinds[1] + ".gif width=20 height=14 border=0 alt='#" + blueSinds[1] + "'></a></font>";
				else var blue = "<font color=blue><a href=http://www.ganjawars.ru/syndicate.php?id=" + blueSinds[0] + "><img src=http://images.ganjawars.ru/img/synds/" + blueSinds[0] + ".gif width=20 height=14 border=0 alt='#" + blueSinds[0] + "'></a></font>";
				var info = "<center>" + red + " vs " + blue + " " + tip + "</center>"
			} else var info = "<center>" + tip + "</center>"
		} else {
			if (/\(Нападение/.exec(title)) return false;
			if (/>dm</.exec(stroka)) return false;
			if (/>\$\d+<\/font><\/b>/.exec(stroka)) return false;
			if (level > levMax && levMax < (level - boevik)) return false;
			if (level < levMin && levMin > (Number(level) + Number(boevik))) return false;
			var info = "<center>" + levMin + '-' + levMax + "</center>";
			if (content.innerHTML.indexOf("Войти в бой за") != -1) tip = "<font color=green id=obsh><b>" + info + "</b></font>"
		}
		return info
	}

	function Save() {
		var param = {};
		param.level = mLevel.value;
		param.profNaim = mNaim.value;
		param.profBoevik = mBoevik.value;
		param.levelInnerMax = mLevelMaxI.value;
		param.tupeSort = mTupeSort.value;
		param.tupeVar = mTupeVar.value;
		param.island = mIsland.value;
		param.imgSind = mImgSind.checked;
		localStorage.setItem('warSortParam', JSON.stringify(param))
	}
})();