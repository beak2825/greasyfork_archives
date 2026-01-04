/***fortify tab***/

Tabs.Fort = {
	tabLabel: 'Fortify',
	tabOrder: 2010,
	tabColor : 'brown',
	myDiv: null,
	timer:null,
	LoopCounter:0,
	DefTotal:0,
	ModelCity: null,
	ModelCityId: 0,
	serverwait: false,
	MaxDefTrain: 0,
	wall: {},
	isBusy: false,
	QueLength: 0,
	limitingFactor: null,
	autodelay: 0,
	typeDelay: 5, // 5 seconds between each type
	intervalSecs: 30, // 30 seconds between each loop
	typearray: {1:[0,1,2,3,4],2:[0,1,2,3,4],3:[0,1,2,3,4],4:[0,1,2,3,4],5:[0,1,2,3,4],6:[0,1,2,3,4],7:[0,1,2,3,4],8:[0,1,2,3,4]}, // change the sort order each time, so every type gets a fair shout
	LastAuto: -1,
	Options: {
		Running: true,
		packetAmount: 50,
		doTraps:	{1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false},
		doCaltrops:	{1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false},
		doSpikes:	{1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false},
		doXbows:	{1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false},
		doTrebs:	{1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false},
		doGreek:	{1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false},
		Toggle:		false,
	},

	init: function (div) {
		var t = Tabs.Fort;
		t.myDiv = div;

		if (!Options.FortOptions) {
			Options.FortOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.FortOptions.hasOwnProperty(y)) {
					Options.FortOptions[y] = t.Options[y];
				}
			}
		}

		uWExportFunction('cancelFort',Tabs.Fort.cancelFort);
		uWExportFunction('btDefCancelAll',Tabs.Fort.cancelAll);

		if (Options.FortOptions.Toggle) AddSubTabLink('AutoFort',t.toggleAutoFortState, 'FortifyToggleTab');
		SetToggleButtonState('Fortify',Options.FortOptions.Running,'Fortify');

		var m = '<DIV class=divHeader align=center>'+tx('WALL DEFENCE OVERVIEW')+'</div>';
		m += '<div align="center">';
		m += '<table width=100% height=0% class=xtab><tr><td width=30%><INPUT id=btFortToggle type=checkbox '+ (Options.FortOptions.Toggle?'CHECKED ':'') +'/>&nbsp;'+tx("Add toggle button")+'</td><td colspan=2 align=center><INPUT id=btAutoFortState type=submit value="'+tx("AutoBuild")+' = '+ (Options.FortOptions.Running?'ON':'OFF')+'"></td><td width=30% align=right>&nbsp;</td></tr></table>';
		m += '<DIV id=btDefOverviewDiv style="width:'+GlobalOptions.btWinSize.x+'px;overflow-x:auto;">&nbsp;</div></div><HR>';
		m += '<br><DIV style="text-align:center; margin-bottom:5px;">'+uW.g_js_strings.commonstr.city+':&nbsp;<span id=ptdefcity></span></div>';

		m += '<a id=btDefOptionLink class=divLink><div class="divHeader" align="left"><img id=btDefOptionArrow height="10" src="'+DownArrow+'">&nbsp;'+tx('SET DEFENCES')+'</div></a>';
		m += '<div id=btDefOption>';

		m += '<TABLE align=center cellpadding=0 cellspacing=0 class=xtab width=98%><TR><TD valign=top width=49%>';
		m += '<TABLE class=xtab><tr><td colspan=3>&nbsp;</td></tr><tr><TD align=right>'+tx('Defence Type')+':&nbsp;</td><TD colspan=2>';
		m += '<SELECT id=btDefType>';
		for (var a in uW.fortcost) {
			var f = parseInt(a.split("frt")[1]);
			m += '<option value='+f+'>'+uW.fortcost[a][0]+'</option>';
		}
		m += '</select></td></tr><tr><td>&nbsp;</td><td colspan=2>(<span id=btDefMax>&nbsp;</span>)</td></tr>';
		m += '<TR><TD align=right>'+tx('Number to build')+':&nbsp;</td><TD><INPUT id=btDefNumPerSlot size=5 type=text value=0\></td>';
		m += '<TD><a id=btDefMaxPerSlotButton class="inlineButton btButton brown8"><span>Max</span></a>&nbsp;('+uW.g_js_strings.commonstr.max;
		m += ':&nbsp;<span id=btDefMaxPerSlot>0</span>)</td></tr>';
		m += '<TR><TD align=right>'+tx('Number of slots to use')+':&nbsp;</td>';
		m += '<TD><INPUT id=btDefNumSlots size=2 type=text value=1\></td>';
		m += '<TD><a id=btDefMaxSlotsButton class="inlineButton btButton brown8"><span>Max</span></a>&nbsp;('+uW.g_js_strings.commonstr.max;
		m += ':&nbsp;<span id=btDefMaxSlots>0</span>)</td></tr>';
		m += '<TR><TD align=right>'+tx('Speedup')+':&nbsp;</td><td colspan=2><SELECT id=btDefBoost>';
		m += '<option value="0">-- '+uW.g_js_strings.commonstr.select+' --</center></option>';
		m += '<option value="26">'+uW.itemlist.i26.name+' ('+(Seed.items.i26?Seed.items.i26:0)+')</option></select></td></tr>';
		m += '<tr><td>&nbsp;</td><td colspan=2><INPUT id=btDefButton type=button value="'+uW.g_js_strings.modal_openWalls.builddefenses+'"\></td></tr></table>';
		m += '</TD><TD valign=top width=49%><TABLE class=xtab><tr><td><b>'+uW.g_js_strings.commonstr.requirements+':-</b></td></tr>';
		m += '<tr><td valign=top id="btDefRequirements">&nbsp;</td></tr>';
		m += '</table>';

		m += '</td></tr><tr><td colspan=2><div id=btDefMessages align=center>&nbsp;</div></td></tr></table></div>';

		m += '<a id=btDefAutoLink class=divLink><div class="divHeader" align="left"><img id=btDefAutoArrow height="10" src="'+RightArrow+'">&nbsp;'+tx('AUTO BUILD')+'</div></a>';
		m += '<div id=btDefAuto class=divHide>';

		m += '<table class=xtab align=center>';
		m += '<tr style="vertical-align:top;"><td width=30 rowspan=2><img src="'+IMGURL+'units/unit_60_30.jpg" /></td><td width=15%>'+tx('Traps')+'</td>';
		m += '<td width=30 rowspan=2><img src="'+IMGURL+'units/unit_61_30.jpg" /></td><td width=15%>'+tx('Caltrops')+'</td>';
		m += '<td width=30 rowspan=2><img src="'+IMGURL+'units/unit_62_30.jpg" /></td><td width=15%>'+tx('Spikes')+'</td>';
		m += '<td width=30 rowspan=2><img src="'+IMGURL+'units/unit_53_30.jpg" /></td><td width=15%>'+tx('Crossbows')+'</td>';
		m += '<td width=30 rowspan=2><img src="'+IMGURL+'units/unit_55_30.jpg" /></td><td width=15%>'+tx('Trebuchet')+'</td>';
		m += '<td width=30 rowspan=2><img src="'+IMGURL+'units/unit_63_30.jpg" /></td><td width=15%>'+tx('Greek Fire')+'</td></tr>';

		m += '<tr style="vertical-align:top;"><td><INPUT type=CHECKBOX id=chkDoTraps></td><td><INPUT type=CHECKBOX id=chkDoCaltrops></td>';
		m += '<td><INPUT type=CHECKBOX id=chkDoSpikes></td><td><INPUT type=CHECKBOX id=chkDoXbows></td><td><INPUT type=CHECKBOX id=chkDoTrebs></td><td><INPUT type=CHECKBOX id=chkDoGreek></td></tr>';
		m += '<tr><td colspan=9 align=left>('+tx('Will queue')+'&nbsp;<INPUT class=btInput id=btDefPacket type=text size=10 maxlength=7 value="'+Options.FortOptions.packetAmount+'"\>&nbsp;'+tx('units at a time until all available wall/field space used')+')</td>';
		m += '<td colspan=3 align=right><a class=xlink id=btDefAutoCopy>'+tx('Copy settings to all cities')+'</a>&nbsp;&nbsp;</td></tr></table></div>';

		m += '<a id=btDefQueueLink class=divLink><div class="divHeader" align="left"><table cellpadding=0 cellspacing=0 width=100%><tr><td class=xtab><img id=btDefQueueArrow height="10" src="'+DownArrow+'">&nbsp;'+tx('DEFENCE QUEUE')+'</td><td class=xtab align=right id=btDefQueueStats>&nbsp;</td></tr></table></div></a>';
		m += '<div id=btDefQueue style="max-height:200px;overflow-y:scroll;"></div><br>';

		div.innerHTML = m;

		t.ModelCity = new CdispCityPicker('ptdef', ById('ptdefcity'), true, t.clickCitySelect, null);

		ById('btAutoFortState').addEventListener('click', function(){
			t.toggleAutoFortState(this);
		}, false);

		ToggleOption('FortOptions','btFortToggle','Toggle');

		ById('btDefAutoCopy').addEventListener('click', function(e){
			var citynum = Cities.byID[t.ModelCityId].idx+1;
			t.CopyAutoFortSettings(citynum);
			saveOptions();
			ById('btDefMessages').innerHTML = 'Auto-fortify settings copied to all cities';
		}, false);

		ById('btDefOptionLink').addEventListener ('click', function () {ToggleMainDivDisplay("Defence",100,GlobalOptions.btWinSize.x,"btDefOption",false)}, false);
		ById('btDefAutoLink').addEventListener ('click', function () {ToggleMainDivDisplay("Defence",100,GlobalOptions.btWinSize.x,"btDefAuto",false)}, false);
		ById('btDefQueueLink').addEventListener ('click', function () {ToggleMainDivDisplay("Defence",100,GlobalOptions.btWinSize.x,"btDefQueue",false)}, false);

		ById('btDefType').addEventListener('change', t.PaintCityInfo, false);

		ById('btDefMaxPerSlotButton').addEventListener('click', function () {
			var slots = Math.max(parseIntNan(ById('btDefNumSlots').value),0);
			ById('btDefNumPerSlot').value = parseIntNan(t.MaxDefTrain / slots);
			t.paintRequirements(ById('btDefType').value);
		} ,false);

		ById('btDefNumPerSlot').addEventListener('change', function () {
			t.paintRequirements(ById('btDefType').value);
		}, false);

		ById('btDefNumSlots').addEventListener('change', function () {
			var slots = Math.max(parseIntNan(ById('btDefNumSlots').value),0);
			if (slots < 1) { slots = 1; }
			if (slots > t.wall.wallLevel-t.wall.Queued) { slots = t.wall.wallLevel-t.wall.Queued; }
			ById('btDefNumSlots').value = slots;
			ById('btDefMaxPerSlot').innerHTML = parseIntNan(t.MaxDefTrain / slots);
		} ,false);

		ById('btDefMaxSlotsButton').addEventListener('click', function () {
			ById('btDefNumSlots').value = Math.max(t.wall.wallLevel-t.wall.Queued,0);
			var slots = Math.max(parseIntNan(ById('btDefNumSlots').value),0);
			ById('btDefMaxPerSlot').innerHTML = parseIntNan(t.MaxDefTrain / slots);
		} ,false);

		ChangeIntegerOption('FortOptions','btDefPacket','packetAmount',50);

		ById('btDefButton').addEventListener ('click', t.setDefences, false);

		ById('chkDoTraps').addEventListener('change', t.clickCheckDoTraps, false);
		ById('chkDoCaltrops').addEventListener('change', t.clickCheckDoCaltrops, false);
		ById('chkDoSpikes').addEventListener('change', t.clickCheckDoSpikes, false);
		ById('chkDoXbows').addEventListener('change', t.clickCheckDoXbows, false);
		ById('chkDoTrebs').addEventListener('change', t.clickCheckDoTrebs, false);
		ById('chkDoGreek').addEventListener('change', t.clickCheckDoGreek, false);

		// start autotrain loop timer to start in 30 seconds...

		if (Options.FortOptions.Running) {
			t.timer = setTimeout(function () { t.doAutoLoop(1,0);}, (30 * 1000));
		}
	},

	toggleAutoFortState: function(obj){
		var t = Tabs.Fort;
		obj = ById('btAutoFortState');
		if (Options.FortOptions.Running == true) {
			Options.FortOptions.Running = false;
			obj.value = tx("AutoBuild = OFF");
		}
		else {
			Options.FortOptions.Running = true;
			obj.value = tx("AutoBuild = ON");
			t.timer = setTimeout(function () { t.doAutoLoop(1,0);}, 0);
		}
		saveOptions();
		SetToggleButtonState('Fortify',Options.FortOptions.Running,'Fortify');
		t.PaintOverview();
	},

	show: function (init) {
		var t = Tabs.Fort;
		var DispCityId = uW.currentcityid;
		if (init) { DispCityId = InitialCityId; }
		if (t.ModelCityId!=DispCityId) {
			t.ModelCity.selectBut(Cities.byID[DispCityId].idx);
		}
		t.PaintOverview();
		t.UpdateDefenceOptions();
		t.PaintCityInfo();
	},

	EverySecond : function () {
		var t = Tabs.Fort;

		if (tabManager.currentTab.name == 'Fort' && Options.btWinIsOpen){
			t.LoopCounter = t.LoopCounter + 1;

			if (t.LoopCounter%2==0) { // refresh queue display every 2 seconds
				t.PaintCityInfo();
			}

			if (t.LoopCounter >= 6) { // refresh overview display every 6 seconds
				t.LoopCounter = 0;
				t.PaintOverview();
			}
		}
	},

	clickCitySelect: function (city) {
		var t = Tabs.Fort;
		t.ModelCityId = city.id;
		t.LastQueue = 'x';
		t.UpdateDefenceOptions();
		t.PaintCityInfo();
	},

	CopyAutoFortSettings : function (citynum) {
		var t = Tabs.Fort;
		for (var i = 1; i <= Cities.numCities; i++) {
			if (i!=citynum) {
				Options.FortOptions.doTraps[i] = Options.FortOptions.doTraps[citynum];
				Options.FortOptions.doCaltrops[i] = Options.FortOptions.doCaltrops[citynum];
				Options.FortOptions.doSpikes[i] = Options.FortOptions.doSpikes[citynum];
				Options.FortOptions.doXbows[i] = Options.FortOptions.doXbows[citynum];
				Options.FortOptions.doTrebs[i] = Options.FortOptions.doTrebs[citynum];
				Options.FortOptions.doGreek[i] = Options.FortOptions.doGreek[citynum];
			}
		}
	},

	setDefences: function () {
		var t = Tabs.Fort;

		if (t.isBusy) {
			t.isBusy = false;
			ById('btDefMessages').innerHTML = '<span style="color:#800;">'+tx('Cancelled')+'!</span>';
			ById('btDefButton').value = uW.g_js_strings.modal_openWalls.builddefenses;
			return;
		}

		var cityId = t.ModelCityId;
		var unitId = ById('btDefType').value;
		var perSlot = parseIntNan(ById('btDefNumPerSlot').value);
		var numSlots = parseIntNan(ById('btDefNumSlots').value);
		var siege = ById('btDefBoost').value;

		if (perSlot < 1) { return; }
		if (numSlots < 1) { return; }

		if (perSlot * numSlots > t.MaxDefTrain) {
			ById('btDefMessages').innerHTML = '<span style="color:#800;">'+uW.g_js_strings.modal_attack.maxtroops+': '+t.MaxDefTrain + '</span>';
			return;
		}
		if (numSlots > t.wall.wallLevel-t.wall.Queued) {
			ById('btDefMessages').innerHTML = '<span style="color:#800;">'+tx('Maximum number of slots exceeded')+'!</span>';
			return;
		}

		var que = [];
		for (var i = 0; i < numSlots; i++) {
			que.push(['T', unitId, perSlot, siege]);
		}
		t.QueLength = que.length;
		t.isBusy = true;
		ById('btDefButton').value = uW.g_js_strings.commonstr.cancel;
		t.nextqueue(que);
	},

	nextqueue : function (que){
		var t = Tabs.Fort;
		if(!t.isBusy) { return; }

		var cmd = que.shift();

		if (cmd[0] == 'T') {
			if (t.QueLength == 1) {
				ById('btDefMessages').innerHTML = 'Building '+cmd[2]+' '+uW.fortcost['frt'+cmd[1]][0]+' at '+Cities.byID[t.ModelCityId].name;
			}
			else {
				ById('btDefMessages').innerHTML = 'Building '+cmd[2]+' '+uW.fortcost['frt'+cmd[1]][0]+' at '+Cities.byID[t.ModelCityId].name + ' (Slot '+parseIntNan(t.QueLength-que.length)+' of '+t.QueLength+')';
			}
			t.Fortify (t.ModelCityId, cmd[3], cmd[1], cmd[2], function (rslt) {
				if (rslt.ok) {
					if (parseIntNan(que.length)==0) {
						ById('btDefMessages').innerHTML = 'Completed!';
						ById('btDefButton').value = uW.g_js_strings.modal_openWalls.builddefenses;
						t.isBusy = false;
						return;
					}
					setTimeout(function () { t.nextqueue(que) }, 2000); }
				else {
					if (rslt.msg) {
						ById('btDefMessages').innerHTML = '<span style="color:#800;">'+rslt.msg+'</span>';
					}
					else {
						ById('btDefMessages').innerHTML = '<span style="color:#800;">Error setting defences ('+rslt.error_code+')</span>';
					}
					ById('btDefButton').value = uW.g_js_strings.modal_openWalls.builddefenses;
					t.isBusy = false;
					return;
				}
			});
		}
	},

	clickCheckDoTraps: function () {
		var t = Tabs.Fort;
		var cityNo = Cities.byID[t.ModelCityId].idx + 1;
		Options.FortOptions.doTraps[cityNo] = (ById('chkDoTraps').checked);
		saveOptions();
		if (Options.FortOptions.doTraps[cityNo]) {
			t.doAutoLoop(cityNo,0);
		}
	},

	clickCheckDoCaltrops: function () {
		var t = Tabs.Fort;
		var cityNo = Cities.byID[t.ModelCityId].idx + 1;
		Options.FortOptions.doCaltrops[cityNo] = (ById('chkDoCaltrops').checked);
		saveOptions();
		if (Options.FortOptions.doCaltrops[cityNo]) {
			t.doAutoLoop(cityNo,1);
		}
	},

	clickCheckDoSpikes: function () {
		var t = Tabs.Fort;
		var cityNo = Cities.byID[t.ModelCityId].idx + 1;
		Options.FortOptions.doSpikes[cityNo] = (ById('chkDoSpikes').checked);
		saveOptions();
		if (Options.FortOptions.doSpikes[cityNo]) {
			t.doAutoLoop(cityNo,2);
		}
	},

	clickCheckDoXbows: function () {
		var t = Tabs.Fort;
		var cityNo = Cities.byID[t.ModelCityId].idx + 1;
		Options.FortOptions.doXbows[cityNo] = (ById('chkDoXbows').checked);
		saveOptions();
		if (Options.FortOptions.doXbows[cityNo]) {
			t.doAutoLoop(cityNo,3);
		}
	},

	clickCheckDoTrebs: function () {
		var t = Tabs.Fort;
		var cityNo = Cities.byID[t.ModelCityId].idx + 1;
		Options.FortOptions.doTrebs[cityNo] = (ById('chkDoTrebs').checked);
		saveOptions();
		if (Options.FortOptions.doTrebs[cityNo]) {
			t.doAutoLoop(cityNo,4);
		}
	},

	clickCheckDoGreek: function () {
		var t = Tabs.Fort;
		var cityNo = Cities.byID[t.ModelCityId].idx + 1;
		Options.FortOptions.doGreek[cityNo] = (ById('chkDoGreek').checked);
		saveOptions();
		if (Options.FortOptions.doGreek[cityNo]) {
			t.doAutoLoop(cityNo,5);
		}
	},

	doAutoLoop : function (idx,typ) {
		var t = Tabs.Fort;
		clearTimeout(t.timer);
		if (!Options.FortOptions.Running) return;

		var cityId = Cities.cities[idx - 1].id;
		t.autodelay = 0;

		var ascensionok = (!Options.BuildOptions || !Options.BuildOptions.AscensionReady[idx]);

		if (t.typearray[idx][typ]==0) {
			if (Options.FortOptions.doTraps[idx] && t.CheckCanBuild(60,cityId) && ascensionok) { t.doAutoDefence(60,cityId,typ); }
		}
		if (t.typearray[idx][typ]==1) {
			if (Options.FortOptions.doCaltrops[idx] && t.CheckCanBuild(61,cityId) && ascensionok) { t.doAutoDefence(61,cityId,typ); }
		}
		if (t.typearray[idx][typ]==2) {
			if (Options.FortOptions.doSpikes[idx] && t.CheckCanBuild(62,cityId) && ascensionok) { t.doAutoDefence(62,cityId,typ); }
		}
		if (t.typearray[idx][typ]==3) {
			if (Options.FortOptions.doXbows[idx] && t.CheckCanBuild(53,cityId) && ascensionok) { t.doAutoDefence(53,cityId,typ); }
		}
		if (t.typearray[idx][typ]==4) {
			if (Options.FortOptions.doTrebs[idx] && t.CheckCanBuild(55,cityId) && ascensionok) { t.doAutoDefence(55,cityId,typ); }
		}
		if (t.typearray[idx][typ]==5) {
			if (Options.FortOptions.doGreek[idx] && t.CheckCanBuild(63,cityId) && ascensionok) { t.doAutoDefence(63,cityId,typ); }
		}

		if (typ<5) {
			t.timer = setTimeout(function () { t.doAutoLoop(idx,typ+1); }, (t.autodelay * 1000));
		}
		else {
			// if training happened in this city during this loop, change type order of this city for next time so every type gets a fair go..
			if (t.LastAuto != -1) {
				for (var v=0; v<=6; v++) {
					t.LastAuto++;
					if (t.LastAuto > 5) { t.LastAuto = 0; }
					t.typearray[idx][v] = t.LastAuto;
				}
				t.LastAuto = -1;
			}
			if (idx == Cities.numCities) {
				t.timer = setTimeout(function () { t.doAutoLoop(1,0); }, (t.intervalSecs * 1000));
			}
			else {
				t.timer = setTimeout(function () { t.doAutoLoop(idx+1,0); }, (t.autodelay * 1000));
			}
		}
	},

	doAutoDefence: function (defType,cityId,typ) {
		var t = Tabs.Fort;
		var numberToTrain = t.getMaxDefence(defType,cityId,true);
		if (numberToTrain > 0) {
			if (numberToTrain > Options.FortOptions.packetAmount) {
				numberToTrain = Options.FortOptions.packetAmount;
			}
			t.Fortify(cityId, 0, defType, numberToTrain);
			t.autodelay = t.typeDelay;
			t.LastAuto = typ;
		}
	},

	getMaxDefence: function (defType,cityId,auto) {
		var t = Tabs.Fort;
		var numberToTrain = 0;
		t.limitingFactor = null;
		var wall = {};
		getWallInfo(cityId, wall);
		if (defType<60 || defType==63) { var availableSpace = wall.wallSpace - wall.wallSpaceUsed - wall.wallSpaceQueued; }
		else { var availableSpace = wall.fieldSpace - wall.fieldSpaceUsed - wall.fieldSpaceQueued; }
		var MaxSlots = wall.wallLevel;
		if (auto && MaxSlots > 5) MaxSlots = 5; // only allow auto build to occupy 5 slots
		if (availableSpace > 0 && wall.slotsBusy < MaxSlots) {
			var availableSlots = MaxSlots - wall.slotsBusy;
			var unitSpace = parseInt(uW.fortstats["unt" + defType][5]);

			var food = parseIntNan(Seed.resources['city' + cityId].rec1[0] / 3600);
			var wood = parseIntNan(Seed.resources['city' + cityId].rec2[0] / 3600);
			var stone = parseIntNan(Seed.resources['city' + cityId].rec3[0] / 3600);
			var ore = parseIntNan(Seed.resources['city' + cityId].rec4[0] / 3600);

			// change these numbers for auto if in the future you want KEEP resource values in city.
			var foodRes = 0;
			var woodRes = 0;
			var stoneRes = 0;
			var oreRes = 0;

			var availFood = food - foodRes;
			var availWood = wood - woodRes;
			var availStone = stone - stoneRes;
			var availOre = ore - oreRes;

			var unitFood = parseInt(uW.fortcost['frt'+defType][1]);
			var unitWood = parseInt(uW.fortcost['frt'+defType][2]);
			var unitStone = parseInt(uW.fortcost['frt'+defType][3]);
			var unitOre = parseInt(uW.fortcost['frt'+defType][4]);

			if (defType == 63) var unitMedian = uW.fortcost['frt'+defType][11]["34002"];
			var median = parseIntNan(Seed.items.i34002); // greek fire requires median oil

			numberToTrain = 9999999999;
			if ((availFood / unitFood) < numberToTrain) {
				t.limitingFactor = uW.resourceinfo['rec1'];
				numberToTrain = parseInt(availFood / unitFood);
			}
			if ((availWood / unitWood) < numberToTrain) {
				t.limitingFactor = uW.resourceinfo['rec2'];
				numberToTrain = parseInt(availWood / unitWood);
			}
			if ((availStone / unitStone) < numberToTrain) {
				t.limitingFactor = uW.resourceinfo['rec3'];
				numberToTrain = parseInt(availStone / unitStone);
			}
			if ((availOre / unitOre) < numberToTrain) {
				t.limitingFactor = uW.resourceinfo['rec4'];
				numberToTrain = parseInt(availOre / unitOre);
			}

			if (defType == 63) {
				if ((median / unitMedian) < numberToTrain) {
					t.limitingFactor = 'median';
					numberToTrain = parseInt(median / unitMedian);
				}
			}

			if (availableSpace >= unitSpace && availableSlots > 0) {
				if (availFood > unitFood && availWood > unitWood & availStone > unitStone & availOre > unitOre) {
					if ((availableSpace / unitSpace) < numberToTrain) {
						numberToTrain = parseInt(availableSpace / unitSpace);
					}
				}
				else {
					numberToTrain = 0;
				}
			}
			else {
				numberToTrain = 0;
			}
		}
		return numberToTrain;
	},

	CheckCanBuild : function (defType,cityId) {
		var t = Tabs.Fort;
		var Result = true;
		var Buildings = getCityBuildings(cityId);
		var fc = uW.fortcost['frt'+defType];
		if (matTypeof(fc[8]) == 'object'){
			for (var k in fc[8]){
				var b = Buildings[k.substr(1)];
				if (b.maxLevel < fc[8][k][1]){
					Result = false;
					break;
				}
			}
		}
		if (matTypeof(fc[9]) == 'object'){
			for (var k in fc[9]){
				if (parseInt(Seed.tech['tch'+k.substr(1)]) < fc[9][k][1]){
					Result = false;
					break;
				}
			}
		}
		return Result;
	},

	PaintOverview : function () {
		var t = Tabs.Fort;
		var rownum = 0;
		var irows = [];
		var	rows = [];

		function _row(name, row, noTotal, icon) {
			var t = Tabs.Fort;
			if (rownum++ % 2) { style = ' class="evenRow"'; }
			else { style = ' class="oddRow"'; }
			var tot = 0;
			var m = [];
			m.push('<TR align=right');
			m.push(style);
			if (noTotal) {
				m.push('><TD colspan=2');
			}
			else {
				m.push('><TD');
			}
			m.push(' style="padding-left: 0px;"');
			m.push('>');
			if (icon) {
				m.push(icon);
			}
			else {
				m.push('<B>'+name+'&nbsp;</B>');
			}
			m.push('</td>');
			if (!noTotal) {
				for (var i = 0; i < row.length; i++)
					tot += row[i];
				m.push('<TD><div class="totalCell xtabBorder">');
				t.DefTotal[name] = tot;
				m.push(addCommas(tot));
				m.push('</div></td>');
			}
			for (var i = 0; i < row.length; i++) {
				m.push('<TD');
				m.push(style);
				m.push('><div class=xtabBorder>');
				m.push(addCommas(row[i]));
				m.push('</div></td>');
			}
			m.push('</tr>');
			return m.join('');
		}

		var m = '<TABLE width=98% class=xtab cellpadding=1 cellspacing=0 align=center style="font-size:'+Options.OverviewOptions.OverviewFontSize+'px;"><TR valign=bottom><td width=20>&nbsp;</td><td align=right width=100><b>&nbsp;</b></td>';

		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD style="font-size:11px;" align=center width=100><span id="btDefCity_'+i+'"><B>'+Cities.cities[i-1].name.substring(0, 12)+'</b></span></td>';
		}

		m += "<td>&nbsp;</td></tr>"; // spacer

		irows = [];
		irows[0] = []; // wall level
		irows[1] = []; // Defensive Tower Level
		irows[2] = []; // Wall Space
		irows[3] = []; // Field Space
		irows[4] = []; // Defence Queue
		irows[5] = []; // Redoubt Tower Level

		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			var wall = {};
			getWallInfo(cityId,wall);

			irows[0][i] = uW.g_js_strings.commonstr.level+' '+wall.wallLevel;
			if (wall.wallLevel==0) { irows[0][i] = '<SPAN class=boldRed><B>'+tx('None')+'!</b></span>'; }

			var tower = Seed.buildings['city'+cityId].pos99;
			if (tower) tower = parseInt(Seed.buildings['city'+cityId].pos99[1])
			if (!tower)
				irows[1][i] = '<SPAN class=boldRed><B>'+tx('None')+'!</b></span>';
			else
				irows[1][i] = uW.g_js_strings.commonstr.level+' '+tower;

			var tower = Seed.buildings['city'+cityId].pos98;
			if (tower) tower = parseInt(Seed.buildings['city'+cityId].pos98[1])
			if (!tower)
				irows[5][i] = '<SPAN class=boldRed><B>'+tx('None')+'!</b></span>';
			else
				irows[5][i] = uW.g_js_strings.commonstr.level+' '+tower;

			irows[2][i] = wall.wallSpaceUsed+' / '+wall.wallSpace;
			if (wall.wallSpaceUsed < wall.wallSpace) { irows[2][i] = '<SPAN class=boldRed><B>'+irows[2][i]+'</b></span>'; }
			irows[3][i] = wall.fieldSpaceUsed+' / '+wall.fieldSpace;
			if (wall.fieldSpaceUsed < wall.fieldSpace) { irows[3][i] = '<SPAN class=boldRed><B>'+irows[3][i]+'</b></span>'; }

			var totTime = 0;
			var now = unixTime();
			var q = Seed.queue_fort['city'+cityId];
			if (q != null && q.length > 0)
				totTime = q[q.length - 1][3] - now;
			if (totTime < 0)
				totTime = 0;
			if (totTime < 1 && (wall.wallSpaceUsed < wall.wallSpace - 4 || wall.fieldSpaceUsed < wall.fieldSpace - 4))
				irows[4][i] = '<SPAN class=boldRed><B>' + timestr(totTime) + '</b></span>';
			else
				irows[4][i] = timestr(totTime);
		}

		m += _row(tx('Wall Space'), irows[2], true);
		rows = [];
		var r = 0;
		for (var a in uW.fortcost) {
			var f = parseInt(a.split("frt")[1]);
			if (f<60 || f==63) {
				rows[r] = [];
				for (var i = 0; i < Cities.numCities; i++) {
					cityId = Cities.cities[i].id;
					rows[r][i] = parseIntNan(Seed.fortifications["city" + cityId]["fort"+f]);
				}
				m += _row(uW.fortcost[a],rows[r],false,TroopImage(f));
				r++;
			}
		}
		m += _row(tx('Field Space'), irows[3], true);
		for (var a in uW.fortcost) {
			var f = parseInt(a.split("frt")[1]);
			if (f>=60 && f!=63) {
				rows[r] = [];
				for (var i = 0; i < Cities.numCities; i++) {
					cityId = Cities.cities[i].id;
					rows[r][i] = parseIntNan(Seed.fortifications["city" + cityId]["fort"+f]);
				}
				m += _row(uW.fortcost[a],rows[r],false,TroopImage(f));
				r++;
			}
		}

		m += '<TR><TD>&nbsp;</td></tr>';

		m += _row(tx('Walls'), irows[0], true);
		m += _row(tx('Def. Tower'), irows[1], true);
		m += _row(tx('Redoubt Tower'), irows[5], true);
		m += _row(tx('Defence Queue'), irows[4], true);

		m += '</table>';

		ById('btDefOverviewDiv').innerHTML = m;
	},

	fixQueTimes: function (q) {
		// fix KofC bugs ....
		// if first start time > now, make it now
		// if any end time != next start time then fix it
		var now = unixTime();
		if (q[0][2] > now) { q[0][2] = now; }
		for (var i = 0; i < q.length; i++) {
			if (q[i + 1] != null && q[i + 1][2] != q[i][3]) { q[i][3] = q[i + 1][2]; }
		}
	},

	expireTheQueue: function (q) {
		if (q == null) return;
		var now = unixTime();
		while (q.length > 0 && (q[0][3] - now) < 1) q.shift();
	},

	UpdateDefenceOptions : function () {
		var t = Tabs.Fort;

		ById('chkDoTraps').checked = Options.FortOptions.doTraps[Cities.byID[t.ModelCityId].idx + 1];
		ById('chkDoCaltrops').checked = Options.FortOptions.doCaltrops[Cities.byID[t.ModelCityId].idx + 1];
		ById('chkDoSpikes').checked = Options.FortOptions.doSpikes[Cities.byID[t.ModelCityId].idx + 1];
		ById('chkDoXbows').checked = Options.FortOptions.doXbows[Cities.byID[t.ModelCityId].idx + 1];
		ById('chkDoTrebs').checked = Options.FortOptions.doTrebs[Cities.byID[t.ModelCityId].idx + 1];
		ById('chkDoGreek').checked = Options.FortOptions.doGreek[Cities.byID[t.ModelCityId].idx + 1];
	},

	PaintCityInfo : function () {
		var t = Tabs.Fort;
		var cityId = t.ModelCityId;

		if (cityId==0) { return; }
		if (t.serverwait) { return; }

		// paint the Queue...

		var now = unixTime();
		t.wall = {};
		getWallInfo(cityId, t.wall);
		t.wall.Queued = 0;
		var totTime = 0;
		var q = Seed.queue_fort['city' + cityId];
		t.expireTheQueue(q);

		var qs = q.toString();
		if (q != null && q.length > 0) {
			totTime = q[q.length - 1][3] - now;
			t.wall.Queued = q.length;
		}
		if (qs == t.LastQueue) { // queue hasn't changed, just update the time of the current item
			if (q != null && q.length > 0) {
				var cur = q[0][3] - now;
				ById('btDefQueueRemaining').innerHTML = timestr(cur, true);
			}
			else {
				m = '<br><div align=center style="opacity:0.3;">'+tx('No Defence Units Under Construction')+'</div>';
				ById('btDefQueue').innerHTML = m;
			}
		} else {
			t.LastQueue = qs;
			if (q != null && q.length > 0) {
				m = '<TABLE width=98% cellspacing=0 align=center class=xtab><tr><th class=xtabHD align=left>'+uW.g_js_strings.commonstr.type+'</th><th class=xtabHD align=right>'+uW.g_js_strings.commonstr.amount+'</th><th class=xtabHD align=right>'+tx('Total Time')+'</th><th class=xtabHD align=right>'+tx('Remaining')+'</th><th class=xtabHD align=right><a id=btDefCancelAllButton class="inlineButton btButton red14" onclick="btDefCancelAll('+cityId+')"><span>'+tx('Cancel All')+'</span></a></th></tr>';
				t.fixQueTimes(q);
				first = true;
				var lastEnd = now;
				var r = 0;

				for (var i = 0; i < q.length; i++) {
					start = q[i][2];
					end = q[i][3];
					actual = end - lastEnd;
					if (actual < 0) { actual = 0; }

					rowClass = 'evenRow';
					if (r % 2 == 1) rowClass = 'oddRow';
					if (first) rowClass += ' highRow';

					m += '<TR class="'+rowClass+'"><TD align=left>'+TroopImage(q[i][0])+uW.fortcost["frt"+q[i][0]][0]+'</td><td align=right>'+addCommas(q[i][1])+'</td><td align=right>';
					if (first) { m += timestr(end - start, true) + '</td><TD align=right><SPAN id=btDefQueueRemaining>' + timestr(actual, true) + '</span></td>'; }
					else { m += timestr(actual, true) + '</td><td align=right>&nbsp;</td>'; }
					m += '<td align=right><A class="inlineButton btButton brown11" onclick="cancelFort(' + q[i][0] + ',' + q[i][1] + ',' + q[i][2] + ',' + q[i][3] + ',' + q[i][5] + ',' + q[i][6] + ',' + cityId + ',' + i + ')"><span>'+uW.g_js_strings.commonstr.cancel+'</span></a></td></tr>'
					lastEnd = end;
					first = false;
					r++;
				}
				m += '</table><div align=center id=btDefQueueMessage>&nbsp;</div>';
			}
			else {
				m = '<br><div align=center style="opacity:0.3;">'+tx('No Defence Units Under Construction')+'</div>';
			}
			ById('btDefQueue').innerHTML = m;
			ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);

		}
		m = t.wall.Queued+' '+uW.g_js_strings.commonstr.of+' '+t.wall.wallLevel;
		if (totTime > 0)
			m += ', ' + uW.timestr(totTime);
		ById('btDefQueueStats').innerHTML = m;

		// paint info into the city panel...

		var unitId = ById('btDefType').value;
		var defOwned = parseInt(Seed.fortifications['city' + cityId]['fort' + unitId]);
		t.MaxDefTrain = 0;
		if (t.CheckCanBuild(unitId,cityId)) {
			t.MaxDefTrain = t.getMaxDefence(unitId,cityId);
		}

		ById('btDefMax').innerHTML = uW.g_js_strings.commonstr.max + ':&nbsp;' + t.MaxDefTrain + ',&nbsp;' + uW.g_js_strings.commonstr.owned + ':&nbsp;' + defOwned;
		ById('btDefMaxSlots').innerHTML = t.wall.wallLevel-t.wall.Queued;
		var slots = Math.max(parseIntNan(ById('btDefNumSlots').value),0);
		ById('btDefMaxPerSlot').innerHTML = parseIntNan(t.MaxDefTrain / slots);

		// paint the requirements...

		t.paintRequirements(unitId);
	},

	paintRequirements : function (unitId) {
		var t = Tabs.Fort;
		var cityId = t.ModelCityId;
		var Buildings = getCityBuildings(cityId);

		var m = '';
		if (uW.fortcost['frt'+unitId][8] && matTypeof(uW.fortcost['frt'+unitId][8]) === "object") {
			for (var b in uW.fortcost['frt'+unitId][8]) {
				var bid = b.split("b")[1];
				var reqlevel = uW.fortcost['frt'+unitId][8][b][1];
				var blvl = Buildings[bid].maxLevel;
				var linestyle = '<span>';
				if (blvl < reqlevel) {
					linestyle = '<span style="color:#800;"><b>';
					m += linestyle+'Level '+reqlevel+' '+uW.buildingcost['bdg'+bid][0]+'</b></span><br>';
				}
			}
		}

		if (uW.fortcost['frt'+unitId][9] && matTypeof(uW.fortcost['frt'+unitId][9]) === "object") {
			for (var r in uW.fortcost['frt'+unitId][9]) {
				var rid = r.split("t")[1];
				var reqlevel = uW.fortcost['frt'+unitId][9][r][1];
				var rlvl = Seed.tech['tch'+rid];
				var linestyle = '<span>';
				if (rlvl < reqlevel) {
					linestyle = '<span style="color:#800;"><b>';
					m += linestyle+'Level '+reqlevel+' '+uW.techcost['tch'+rid][0]+'</b></span><br>';
				}
			}
		}

		m += '<table class=xtab cellpadding=0 cellspacing=0 width=100%>';

		for (var r = 1; r < 5; r++) {
			if (uW.fortcost['frt'+unitId][r] != 0) {
				m += '<tr><td>';
				if (r==1) { m += ResourceImage(FoodImage,uW.g_js_strings.commonstr.food); }
				else {
					if (r==2) { m += ResourceImage(WoodImage,uW.g_js_strings.commonstr.wood); }
					else {
						if (r==3) { m += ResourceImage(StoneImage,uW.g_js_strings.commonstr.stone);	}
						else {
							if (r==4) { m += ResourceImage(OreImage,uW.g_js_strings.commonstr.ore);	}
						}
					}
				}
				var reqlevel = uW.fortcost['frt'+unitId][r]*parseIntNan(ById('btDefNumPerSlot').value);
				var rlvl = parseIntNan(Seed.resources['city'+cityId]['rec'+r][0]/3600);
				var linestyle = '<span>';
				if ((rlvl <= reqlevel) || (t.limitingFactor==uW.resourceinfo['rec'+r])) {
					linestyle = '<span style="color:#800;"><b>';
				}
				m += '</td><td>'+linestyle+addCommas(reqlevel)+' / '+addCommas(rlvl)+'</b></span></td></tr>';
			}
		}

		if (uW.fortcost['frt'+unitId][11] && matTypeof(uW.fortcost['frt'+unitId][11]) === "object") {
			for (var r in uW.fortcost['frt'+unitId][11]) {
				var iid = r;
				var reqlevel = uW.fortcost['frt'+unitId][11][r]*parseIntNan(ById('btDefNumPerSlot').value);
				var ilvl = parseIntNan(Seed.items['i'+iid]);
				var linestyle = '<span>';
				if ((ilvl <= reqlevel) || (iid==34002 && t.limitingFactor=="median")) {
					linestyle = '<span style="color:#800;"><b>';
				}
				m += '<tr><td>'+ResourceImage(getItemImageURL(iid),uW.itemlist['i'+iid].name)+'</td><td>';
				m += linestyle+reqlevel+' / '+ilvl+'</b></span></td></tr>';
			}
		}

		m += '</table>';

		var perSlot = parseIntNan(ById('btDefNumPerSlot').value);
		if (perSlot!=0) {
			var time = t.getFortifyTime(cityId,unitId,perSlot);
			if (ById('btDefBoost').value==26) { time=parseInt(time*0.7); }
			m += '<br>'+tx('Estimated Time')+':&nbsp;'+timestr(time);
		}

		ById('btDefRequirements').innerHTML = m;
	},

	cancelAll: function (cityId,silent) {
		var t = Tabs.Fort;

		jQuery('#btDefCancelAllButton').addClass("disabled");
		var delayer = 0;
		var q = Seed.queue_fort['city' + cityId];
		for (var i = q.length-1; i >= 0; i--) {
			delayer = delayer + 1;
			setTimeout (t.cancelFort,(1000*delayer),q[i][0],q[i][1],q[i][2],q[i][3],q[i][5],q[i][6],cityId,i,silent); // spread them out ...
		}
		delayer = delayer + 1;
		setTimeout (function () { jQuery('#btDefCancelAllButton').removeClass("disabled"); },(1000*delayer));
	},

	cancelFort: function (typefrt, numtrpfrt, frtTmp, frtETA, frtNeeded, frtid, cityId, queueId, silent) {
		var t = Tabs.Fort;
		t.serverwait = true;
		if (!silent) ById('btDefQueueMessage').innerHTML = 'Cancelling Queued Item...';
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pf = 0;
		params.requestType = "CANCEL_FORTIFICATIONS";
		params.cityId = cityId;
		params.typefrt = typefrt;
		params.numtrpfrt = numtrpfrt;
		params.frtETA = frtETA;
		params.frtTmp = frtTmp;
		params.frtNeeded = frtNeeded;
		params.frtid = frtid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/cancelFortifications.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var k = 0;
					for (var j = 0; j < Seed.queue_fort["city" + cityId].length; j++) {
						if (j > queueId) {
							Seed.queue_fort["city" + cityId][j][2] = parseInt(rslt.dateFortifications[k]["start"]);
							Seed.queue_fort["city" + cityId][j][3] = parseInt(rslt.dateFortifications[k]["end"]);
							k++;
						}
					}
					Seed.queue_fort["city" + cityId].splice(queueId, 1);
					for (var i = 1; i < 5; i++) {
						var totalReturn = parseInt(uW.fortcost["frt" + typefrt][i]) * parseInt(numtrpfrt) * 3600 / 2;
						Seed.resources["city" + cityId]["rec" + i][0] = parseInt(Seed.resources["city" + cityId]["rec" + i][0]) + totalReturn;
					}
					t.PaintCityInfo();
				}
				else {
					if (rslt.msg) { if (!silent) { ById('btDefQueueMessage').innerHTML = '<span style="color:#f00">'+rslt.msg+'</span>'; }}
					else { if (!silent) { ById('btDefQueueMessage').innerHTML = '<span style="color:#f00">Error cancelling defence queue item</span>'; }}
				}
				t.serverwait = false;
			},
			onFailure: function () {
				if (!silent) { ById('btDefQueueMessage').innerHTML = '<span style="color:#f00;">AJAX Error!</span>'; }
				t.serverwait = false;
			},
		},true);
	},

	getFortifyTime : function (cityId,unitId,num) {
		var b=parseInt(parseInt(uW.fortcost["frt"+unitId][7]));
		var f=1;
		f+=0.1*parseInt(Seed.tech.tch16);
		var a=0;
		var c=Seed.knights["city"+cityId];
		if(c){
			c=c["knt"+Seed.leaders["city"+cityId].politicsKnightId];
			if(c){
				a=parseInt(c.combat);
				newkntlv=((parseInt(c.politicsBoostExpireUnixtime)-uW.unixtime())>0)?(a*1.25):a;
// removed because this is not in server calculation
//				f=f+(0.005*newkntlv)
			}
		}

		if(Seed.tech2 && Seed.tech2.tch3){
			f+=parseFloat(Seed.tech2.tch3)*0.05
		}

		b=Math.max(1,(b/f));
		return b*num;
	},

	Fortify : function (cityId, siege, unitId, num, notify) {
		var t = Tabs.Fort;
		var citynum = Cities.byID[cityId].idx+1;
		jQuery('#btDefCity_'+citynum).css('color', 'green');
		var time = t.getFortifyTime(cityId,unitId,num);
		if (siege==26) { time=parseInt(time*0.7); }

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.type = unitId;
		params.quant = num;
		params.items = siege;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fortify.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					uW.seed.queue_fort["city" + cityId].push(uWCloneInto([unitId, num, rslt.initTS, parseInt(rslt.initTS) + rslt.timeNeeded, 0, rslt.timeNeeded, rslt.fortifyId]));
					if (siege==26) {
						Seed.items.i26 = parseInt(Seed.items.i26)-1;
						uW.ksoItems[26].subtract();
					}
					if (unitId==63) {
						Seed.items.i34002 = parseInt(Seed.items.i34002)-num;
						uW.ksoItems[34002].subtract(num);
					}
					actionLog(Cities.byID[cityId].name+': Building '+num+' '+uW.fortcost['frt'+unitId][0],'DEFENCE');
					t.PaintCityInfo();
				}
				else {
					if (rslt.msg) {
						actionLog(Cities.byID[cityId].name+': Failed to build '+num+' '+uW.fortcost['frt'+unitId][0]+' ('+rslt.msg+')','DEFENCE');
					}
					else {
						actionLog(Cities.byID[cityId].name+': Failed to build '+num+' '+uW.fortcost['frt'+unitId][0]+' ('+rslt.error_code+')','DEFENCE');
					}
				}
				jQuery('#btDefCity_'+citynum).css('color', 'rgb('+HEXtoRGB(Options.Colors.PanelText).r+','+HEXtoRGB(Options.Colors.PanelText).g+','+HEXtoRGB(Options.Colors.PanelText).b+')');
				if (notify) { notify(rslt); }
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name+': Failed to build '+num+' '+uW.fortcost['frt'+unitId][0]+' (Ajax Error)','DEFENCE');
				jQuery('#btDefCity_'+citynum).css('color', 'rgb('+HEXtoRGB(Options.Colors.PanelText).r+','+HEXtoRGB(Options.Colors.PanelText).g+','+HEXtoRGB(Options.Colors.PanelText).b+')');
				if (notify) { notify({msg: 'AJAX error'}); }
			},
		},true); // noretry
	},

}
