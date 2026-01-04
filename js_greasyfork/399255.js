/****wilds tab***/

Tabs.Wilds = {
	tabOrder: 1040,
	tabLabel: 'Wilds',
	mercNames : {
		0: 'None',
		1: 'Novice',
		2: 'Intermediate',
		3: 'Veteran',
	},
	myDiv: null,
	wildList: [],
	buildList: {},
	LoopCounter:0,

	init: function (div) {
		var t = Tabs.Wilds;
		t.myDiv = div;

		uWExportFunction('ptButMaxTraps', Tabs.Wilds.e_butMaxTraps);
		uWExportFunction('ptInpWildTraps', Tabs.Wilds.e_inpTraps);
		uWExportFunction('ptButWildSet', Tabs.Wilds.e_butWildSet);
		uWExportFunction('ptButAbandon', Tabs.Wilds.e_abandon);

		t.myDiv.innerHTML = '<DIV id=wildContent style="max-height:700px; height:700px; overflow-y:auto">';
	},

	show: function () {
		var t = Tabs.Wilds;
		m = '<DIV class=divHeader align=center>'+tx('WILDERNESS MANAGEMENT')+'</DIV><br>';
		m += '<TABLE align=center cellpadding=0 cellspacing=0 width=98%><TR><TD class=xtab colspan=7>'+strButton20(tx('Refresh Display'), 'id=ptwref')+'</td><TD class=xtab width=120><B>'+tx('All Traps')+':&nbsp;</b><a id=ptwx_all class="inlineButton btButton brown8"><span>'+uW.g_js_strings.commonstr.max+'</span></a></td><td class=xtab width=120><B>'+tx('All Mercs')+':</b>&nbsp;'+htmlSelector(t.mercNames, 0, 'class="btInput" id=ptwm_all')+'&nbsp;</td></tr></table>';
		for (var c = 0; c < Cities.numCities; c++) {
			var city = Cities.cities[c];
			var cWilds = Seed.wilderness['city' + city.id];
			t.wildList[c] = [];
			var castle = getMaxWilds(city.id);
			var totw = 0;
			if (matTypeof(cWilds) == 'object') {
				for (var k in cWilds)
				++totw;
			}
			m += '<br><DIV class=divHeader><TABLE width=100% cellspacing=0><TR><TD class=xtab width=100>&nbsp;</td><TD class=xtab align=center>' + city.name.toUpperCase() + '&nbsp;(' + city.x + ',' + city.y + ')</td><TD class=xtab width=100 align=right>'+tx('Wilds')+': ' + totw + ' '+uW.g_js_strings.commonstr.of+' ' + castle + '&nbsp;</TD></tr></table></div>';
			m += '<TABLE align=center cellpadding=0 cellspacing=0 width=98%>';
			var row = 0;
			var sortem = [];
			if (totw != 0) {
				m += '<TR><TD class=xtabHD width=24>&nbsp;</td><TD class=xtabHD>'+tx('Wild Type')+'</td><TD class=xtabHD width=50 align=center>'+tx('Co-ords')+'</td><TD class=xtabHD width=80 align=center>'+uW.g_js_strings.commonstr.traps+'</td><TD class=xtabHD width=80 align=center>'+tx('Mercs')+'</td><TD class=xtabHD width=100 align=center>'+uW.g_js_strings.commonstr.abandon+'</td><TD class=xtabHD width=15>&nbsp;</td><TD class=xtabHD colspan=2 class=entry>'+htmlTitleLine(tx('Change Defences'))+'</td></tr>';
				for (var k in Seed.wilderness['city' + city.id]) {
					sortem.push(Seed.wilderness['city' + city.id][k]);
				}
				sortem.sort(function (a, b) {
					var x;
					if ((x = b.tileLevel - a.tileLevel) != 0) return x;
					return a.tileType - b.tileType;
				});
				for (var i = 0; i < sortem.length; i++) {
					var wild = sortem[i];
					var wildDef = Seed.wildDef['t' + wild.tileId];
					if (wildDef == undefined || !wildDef)
						wildDef = { fort60Count: 0, mercLevel: 0 };
					var maxTraps = parseInt(wild.tileLevel) * 100;
					var maxBuild = maxTraps - parseInt(wildDef.fort60Count);
//					var maxCost = maxBuild*200;
					var maxCost = 0;
					t.wildList[c][i] = [wild.tileId, maxBuild];

					m += '<TR '+(row++ %2?'class=evenRow':'class=oddRow')+'><TD class=xtab>'+TileImage(wild.tileType,wild.tileLevel)+'</td><TD class=xtab>'+uW.g_js_strings.commonstr.level+' '+wild.tileLevel+' '+tileTypes[wild.tileType]+'</td>';
					m += '<TD class=xtab align=center><A class=xlink onclick="btGotoMap(' + wild.xCoord + ',' + wild.yCoord + ')">' + wild.xCoord + ',' + wild.yCoord + '</a></td>';
					m += '<TD class=xtab align=center><B>' + wildDef.fort60Count + '</b></td><TD class=xtab align=center><B>' + t.mercNames[wildDef.mercLevel] + '</b></td><TD class=xtab align=center>' + strButton8(uW.g_js_strings.commonstr.abandon, 'onclick="ptButAbandon(' + wild.tileId + ',' + wild.xCoord + ',' + wild.yCoord + ',' + city.id + ')" id=tileId_' + wild.tileId) + '</td>';
					m += '<TD class=xtab>&nbsp;</td><TD align=left class=xtab width=120><B>'+tx('Build Traps')+':&nbsp;</b><INPUT class="btInput" onchange="ptInpWildTraps(this)" id=ptwt_' + c + '_' + i + (maxBuild == 0 ? ' DISABLED ' : '') + ' style="margin:0px; padding:0px" type=text size=3 maxlength=4>&nbsp;';
					if (wildDef.fort60Count < maxTraps)
						m += '<a id=ptwx_'+c+'_'+i+' class="inlineButton btButton brown8 btWildMax" onclick="ptButMaxTraps(this)"><span>'+uW.g_js_strings.commonstr.max+'</span></a></td>';
					else
						m += '</td>';
					m += '<TD align=right class=xtab width=120><B>'+tx('Mercs')+':</b>&nbsp;'+htmlSelector(t.mercNames, wildDef.mercLevel, 'class="btInput btWildMerc" id=ptwm_' + c + '_' + i)+'&nbsp;</td></tr>';
				}
				m += '<TR><TD class=xtab colspan=6>&nbsp;</td><TD class=xtab>&nbsp;</td><TD class=xtab align=right colspan=2><TABLE width=100%><TR><TD width=25 class=xtab align=left>'+ResourceImage(GoldImage,uW.g_js_strings.commonstr.gold)+'</td><td class=xtab align=right>'+tx('Total')+':&nbsp;<br>'+tx('Cost')+':&nbsp;</td><td class=xtab align=left><SPAN id=ptwgt_' + c + '>0</span><br><SPAN id=ptwgc_' + c + '>'+addCommas(maxCost)+'</span></td>';
				m += '<TD class=xtab align=right>' + strButton20(tx("Set Defences"), 'onclick="ptButWildSet(' + c + ')"') + '</td></tr></table></td></tr>';
			} else {
				m += '<TR><TD class=xtab colspan=8 align=center><br>'+tx('No wilds')+'</td></tr>';
			}
			m += '</table>';
		}
		ById('wildContent').innerHTML = m;
		ById('ptwref').addEventListener('click', t.show, false);
		ById('ptwm_all').addEventListener('change', function (e) {
			var wm = ByCl('btWildMerc');
			for (var m in wm) {
				if (wm[m].id) {	wm[m].value = e.target.value; }
			}
		}, false);
		ById('ptwx_all').addEventListener('click', function (e) {
			var wx = ByCl('btWildMax');
			for (var x in wx) {
				if (wx[x].id) { t.e_butMaxTraps(wx[x]);	}
			}
		}, false);
		t.updateGold();
	},

	e_abandon: function (tileId, xCoord, yCoord, cityId) {
		var t = Tabs.Wilds;
		AbandonWild(tileId, xCoord, yCoord, cityId, t.show);
	},

	e_butWildSet: function (c) {
		var t = Tabs.Wilds;
		var totTraps = 0;
		var cid = Cities.cities[c].id;
		t.buildList = { cityId: cid, list: [] };
		for (var w = 0; w < t.wildList[c].length; w++) {
			var wild = Seed.wilderness['city' + cid]['t' + t.wildList[c][w][0]];
			var wildDef = Seed.wildDef['t' + t.wildList[c][w][0]];
			if (wildDef == undefined || !wildDef)
				wildDef = { fort60Count: 0, mercLevel: 0 };
			var numTraps = parseInt(ById('ptwt_' + c + '_' + w).value, 10);
			if (isNaN(numTraps)) numTraps = 0;
			totTraps += numTraps;
			if (numTraps > 0) t.buildList.list.push(['T', wild.tileId, numTraps]);
			var mercId = ById('ptwm_' + c + '_' + w).value;
			if (wildDef.mercLevel != mercId) t.buildList.list.push(['M', wild.tileId, mercId, wildDef.mercLevel]);
		}
		var totCost = totTraps * 200;
		if (totCost > parseInt(Seed.citystats['city' + cid].gold[0])) {
			ById('ptwgc_' + c).innerHTML = '<SPAN class=boldRed>' + addCommasInt(totCost) + '</span>';
			return;
		}
		if (t.buildList.list.length == 0)
			return;
		t.setCurtain(true);
		var popDiv = t.setPopup(true);
		popDiv.innerHTML = '<TABLE class=xtab width=100% height=100%><TR><TD align=center>\
			<DIV class=divHeader>'+tx('Setting Wilderness Defences')+'</div>\
			<DIV id=ptWildBuildDiv style="padding:10px; height:225px; max-height:225px; overflow-y:auto"></div>\
			</td></tr><TR><TD align=center>' + strButton20(uW.g_js_strings.commonstr.cancel, 'id=ptWildCancel') + '</td></tr></table>';
		ById('ptWildCancel').addEventListener('click', t.e_Cancel, false);
		t.processQue(null);
	},
	e_Cancel: function () {
		var t = Tabs.Wilds;
		t.setCurtain(false);
		t.setPopup(false);
		t.show();
	},
	processQue: function (errMsg) {
		var t = Tabs.Wilds;
		var what = t.buildList.list.shift();
		var div = ById('ptWildBuildDiv');
		if (what == null || errMsg) {
			if (errMsg)
				div.innerHTML += '<BR><SPAN style="white-space:normal;" class=boldRed>ERROR: ' + errMsg + '</span>';
			else
				div.innerHTML += tx('Done')+'.<BR>';
			ById('ptWildCancel').firstChild.innerHTML = uW.g_js_strings.commonstr.close;
			return;
		}
		if (div.innerHTML != '')
			div.innerHTML += tx('Done')+'.<BR>';
		var wild = Seed.wilderness['city' + t.buildList.cityId]['t' + what[1]];
		if (what[0] == 'T') {
			div.innerHTML += Cities.byID[t.buildList.cityId].name+': '+tx('Building')+' '+what[2]+' '+tx('traps on wilderness at')+' '+wild.xCoord+','+wild.yCoord+' ... ';
			t.postBuyTraps(t.buildList.cityId, what[1], what[2], t.processQue);
		} else {
			div.innerHTML += Cities.byID[t.buildList.cityId].name+': '+tx('Setting')+' '+t.mercNames[what[2]]+' '+tx('Mercenaries on wilderness at')+' '+wild.xCoord+','+wild.yCoord+' ... ';
			t.postHireMercs(t.buildList.cityId, what[1], what[2], what[3], t.processQue);
		}
	},
	setPopup: function (onoff) {
		var t = Tabs.Wilds;
		if (onoff) {
			var div = document.createElement('div');
			div.id = 'ptWildPop';
			div.style.backgroundColor = Options.Colors.Panel;
			div.style.zindex = mainPop.div.zIndex + 2;
			div.style.opacity = '1';
			div.style.border = '3px outset black';
			div.style.width = (GlobalOptions.btWinSize.x-200)+'px';
			div.style.height = '300px';
			div.style.display = 'block';
			div.style.position = 'absolute';
			div.style.top = '100px';
			div.style.left = '100px';
			t.myDiv.appendChild(div);
			return div;
		} else {
			t.myDiv.removeChild(ById('ptWildPop'));
		}
	},
	setCurtain: function (onoff) {
		var t = Tabs.Wilds;
		if (onoff) {
			var off = getAbsoluteOffsets(t.myDiv);
			var curtain = document.createElement('div');
			curtain.id = 'ptWildCurtain';
			curtain.style.zindex = mainPop.div.zIndex + 1;
			curtain.style.backgroundColor = "#000000";
			curtain.style.opacity = '0.5';
			curtain.style.width = (t.myDiv.clientWidth+4) + 'px';
			curtain.style.height = (t.myDiv.clientHeight+4) + 'px';
			curtain.style.display = 'block';
			curtain.style.position = 'absolute';
			curtain.style.top = off.top + 'px';
			curtain.style.left = off.left + 'px';
			t.myDiv.appendChild(curtain);
		} else {
			t.myDiv.removeChild(ById('ptWildCurtain'));
		}
	},
	e_butMaxTraps: function (e) {
		var t = Tabs.Wilds;
		var c = e.id.substr(5, 1);
		var w = e.id.substr(7);
		var inp = ById('ptwt_' + c + '_' + w);
		inp.value = t.wildList[c][w][1];
		t.e_inpTraps(inp);
	},
	e_inpTraps: function (e) {
		var t = Tabs.Wilds;
		var c = e.id.substr(5, 1);
		var w = e.id.substr(7);
		if (isNaN(e.value) || e.value < 0 || e.value > t.wildList[c][w][1]) {
			e.value = '';
			e.style.backgroundColor = '#ff8888';
		}
		else {
			e.style.backgroundColor = null;
		}
		var tot = 0;
		for (var i = 0; i < t.wildList[c].length; i++) {
			var val = parseInt(ById('ptwt_' + c + '_' + i).value, 10);
			if (isNaN(val))	val = 0;
			tot += val;
		}
		ById('ptwgc_' + c).innerHTML = addCommasInt(tot * 200);
	},
	updateGold: function () {
		var t = Tabs.Wilds;
		for (var c = 0; c < Cities.numCities; c++) {
			var e = ById('ptwgt_' + c + '');
			if (e) {
				e.innerHTML = addCommasInt(Seed.citystats['city' + Cities.cities[c].id].gold[0]);
			}
		}
	},
	postBuyTraps: function (cid, tid, quant, notify) {
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cid;
		params.tid = tid;
		params.quant = quant;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/buyWildTraps.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					if (!Seed.wildDef["t" + tid])
						Seed.wildDef["t" + tid] = uWCloneInto({
							tileId: tid,
							fort60Count: 0,
							mercLevel: 0
						});
					Seed.wildDef["t" + tid].fort60Count = parseInt(Seed.wildDef["t" + tid].fort60Count) + parseInt(quant);
				}
				if (notify)
					notify(rslt.errorMsg);
			},
			onFailure: function () {
				if (notify)
					notify('AJAX ERROR');
			},
		});
	},
	postHireMercs: function (cid, tid, newLevel, oldLevel, notify) {
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cid;
		params.tid = tid;
		params.lv = newLevel;
		params.olv = oldLevel;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/hireWildMerc.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					if (!Seed.wildDef["t" + tid])
						Seed.wildDef["t" + tid] = uWCloneInto({
							tileId: tid,
							fort60Count: 0,
							mercLevel: 0
						});
					Seed.wildDef["t" + tid].mercLevel = newLevel;
				}
				if (notify)
					notify(rslt.errorMsg);
			},
			onFailure: function () {
				if (notify)
					notify('AJAX ERROR');
			},
		});
	},

	EverySecond : function () {
		var t = Tabs.Wilds;

		if (tabManager.currentTab.name == 'Wilds' && Options.btWinIsOpen){
			t.LoopCounter = t.LoopCounter + 1;

			if (t.LoopCounter >= 5) { // refresh display every 5 seconds
				t.LoopCounter = 0;
				t.updateGold();
			}
		}

	},
}
