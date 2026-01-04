/**************************** Bulk Attack ****************************************/
// @tabversion 20180613

Tabs.BulkAttack = {
	tabLabel: 'Attack List',
	tabOrder: 2080,
	tabColor : 'brown',
	timer: null,
	cityreason : '',
	Options: {
		AttackCity: 0,
		SkipErrors: true,
		Attack:false,
		AttackPreset:false,
		AllCities:false,
		ClosestCity:false,
		QuickScout:false,
		CoordList:[],
		On:false,
		Toggle : false,
		KnightPriority : 0, // 0 - highest combat (default), 1 - lowest combat, 2 - highest experience, 3 - lowest experience, 4 - no knight
		SendChamp : 0, // 0 - never (default), 1 - always, 2 - if available
		FreeRallySlots : 2,
		intervalSecs  : 5,
		OverrideAP : false,
	},
	myDiv: null,

	init: function(div) {
		var t = Tabs.BulkAttack;

		t.myDiv = div;

		if (!Options.BulkAttackOptions) {
			Options.BulkAttackOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.BulkAttackOptions.hasOwnProperty(y)) {
					Options.BulkAttackOptions[y] = t.Options[y];
				}
			}
		}

		if (Options.BulkAttackOptions.Toggle) AddSubTabLink('BulkAttack',t.e_toggleswitch, 'BulkAttackToggleTab');
		SetToggleButtonState('BulkAttack',Options.BulkAttackOptions.On,'BulkAttack');

		// strip out any co-ords not ticked - this will be unpopular, but it will avoid the list endlessly growing!

		var b = Options.BulkAttackOptions.CoordList.length;
		while (b--) {
			if (!Options.BulkAttackOptions.CoordList[b].chk) {
				Options.BulkAttackOptions.CoordList.splice(b,1);
			}
		}

		uWExportFunction('btRemoveBulkAttackList', Tabs.BulkAttack.RemoveEntry);
		uWExportFunction('pbattackclick', Tabs.BulkAttack.ToggleEntry);

		// start autoattack loop timer to start in 10 seconds...

		if (Options.BulkAttackOptions.On) {
			t.timer = setTimeout(function () { t.doAutoLoop(Options.BulkAttackOptions.AttackCity);}, (10 * 1000));
		}
	},

	show: function (init) {
		var t = Tabs.BulkAttack;
		if (!Options.BulkAttackOptions.On) {  // reset to current city on show if not already attacking
			if (init) {
				Options.BulkAttackOptions.AttackCity = Cities.byID[InitialCityId].idx;
			}
			else {
				Options.BulkAttackOptions.AttackCity = Cities.byID[uW.currentcityid].idx;
			}
		}

		var m = '<DIV class=divHeader align=center>'+translate('BULK ATTACK LIST')+'</div><div align=center>';
		m += '<table width=100% class=xtab><tr><td width=30%><INPUT id=btBulkAttackToggle type=checkbox '+ (Options.BulkAttackOptions.Toggle?'CHECKED ':'') +'/>&nbsp;'+translate("Add toggle button to main screen header")+'</td><td colspan=2 align=center><INPUT id=BulkAttackButton type=submit value="'+translate("BulkAttack")+' = '+ (Options.BulkAttackOptions.On?'ON':'OFF')+'"></td><td width=30% align=right>&nbsp;</td></tr></table>';
		m += '<br></div><DIV class=divHeader align=center>'+translate('OPTIONS')+'</div><br>';
		m += '<TABLE width=98% align=center cellpadding=0 cellspacing=0 class=xtab><TR width=50%><td><TABLE cellpadding=1 cellspacing=0 class=xtab>';
		m += '<TR><td colspan=2>'+translate("Keep")+' <INPUT id=btbafreerallyslots type=text size=2 maxlength=2 value="'+Options.BulkAttackOptions.FreeRallySlots+'"\> '+translate("free rally point slots")+'</td></tr>';
		m += '<TR><td colspan=2>'+translate("March Interval")+': <INPUT id=btbamarchinterval type=text size=2 maxlength=2 value="'+Options.BulkAttackOptions.intervalSecs+'"\> '+translate("seconds")+'</td></tr>';
		m += '<TR><td colspan=2>'+translate("March from")+': <span id=pbaAttackCitypick> </span></td></tr>';
		m += '<TR><td><input type=checkbox id="pbaclosest"></td><td>'+translate("or select the closest city")+'</td></tr>';
		m += '<TR><td><input type=checkbox id="pbaskip"></td><td>'+translate("Skip targets when errors occur")+'</td></tr>';
		m += '<TR><td><input type=checkbox id="pbaallcities"></td><td>'+translate("Use all cities (not under Ascension Protection!)")+'</td></tr>';
		m += '<TR><td><input type=checkbox id="pbaoverrideap"></td><td>'+tx("Allow marches from cities under Ascension Protection")+'&nbsp;<span class=boldRed>('+tx('BEWARE!')+')</span></td></tr>';
		m += '<TR><td><input type=checkbox id="pbaquick"></td><td>'+translate("Fetch march target details (QuickScout)")+'</td></tr>';
		m += '<TR><td style="height:20px;">&nbsp;</td><td style="vertical-align:bottom;">'+translate("Attack Preset")+'&nbsp;<span id=pbapresetspan>';
		var MarchPresets = {0:"-- Select --"};
		for (var PN in Options.QuickMarchOptions.MarchPresets) {
			MarchPresets[PN] = Options.QuickMarchOptions.MarchPresets[PN][0];
		}
		m += htmlSelector(MarchPresets, Options.BulkAttackOptions.AttackPreset, 'id=pbaattackpreset class=btInput style="vertical-align:text-bottom;"');
		m += '</span></div></td></tr>';
		m += '<TR><td style="height:20px;">&nbsp;</td><td id=pbaknightcell>'+translate('Knight priority')+':&nbsp;'+htmlSelector({0:tx('Highest Combat Skill'), 1:tx('Lowest Combat Skill'), 2:tx('Highest Experience'), 3:tx('Lowest Experience'), 4:tx('No Knight! (Megaliths)')}, Options.BulkAttackOptions.KnightPriority, ' class=btInput id=pbaknight')+'</td></tr>';
		m += '<TR><td style="height:20px;">&nbsp;</td><td id=pbachampcell>'+translate('Send Champion')+':&nbsp;'+htmlSelector({0:translate('Never'), 1:translate('Always'), 2:translate('If Available')}, Options.BulkAttackOptions.SendChamp, ' class=btInput id=pbachamp')+'</td></tr></table>';

        m += '</td><td width=50%>';
        m += '<DIV>'+translate("Co-ordinates")+':</div>';
        m += '<DIV><textarea id=pbBulkAttackcoords rows=7 cols=40 onkeyup="ptStopProp(event);" title="Separate multiple co-ordinates with spaces.\nValid formats include xxx,yyy (xxx_yyy) [xxx.yyy] etc..."></textarea></div>';
		m += '<DIV>'+strButton20('Add to Attack List', 'id=pbAddBulkAttack')+'</div>';
        m += '</td></tr><tr><td height=20 id=pbBulkAttackmsg align=center colspan=2>&nbsp;</td></tr></table>';

		m += '</div><DIV class=divHeader align=center>'+translate('ATTACK QUEUE')+'</div><br>';
        m += '<DIV id=btBulkAttackList style="height:220px; overflow-y:auto;"></div><br>';

		t.myDiv.innerHTML = m;
		t.PaintList('');

		new CdispCityPicker ('pbBulkAttackPick', ById('pbaAttackCitypick'), true, function(c,x,y){ Options.BulkAttackOptions.AttackCity = c.idx; }, Options.BulkAttackOptions.AttackCity);

		ById('BulkAttackButton').addEventListener('click', function() {
			t.e_toggleswitch(this)
		}, false);

		ById('btBulkAttackToggle').addEventListener ('change', function() {
			Options.BulkAttackOptions.Toggle = this.checked;
			saveOptions();
        }, false);

		ById('btbafreerallyslots').addEventListener ('change', function(e){
			if (isNaN(e.target.value)) { e.target.value = 0; }
			Options.BulkAttackOptions.FreeRallySlots = parseIntNan(e.target.value);
            saveOptions ();
		},false);

		ById('btbamarchinterval').addEventListener('keyup', function () {
			if (parseIntNan(ById('btbamarchinterval').value)<1) { ById('btbamarchinterval').value = 5; }
			if (parseIntNan(ById('btbamarchinterval').value)<2) { ById('btbamarchinterval').value = 2; }
			Options.BulkAttackOptions.intervalSecs = parseIntNan(ById('btbamarchinterval').value);
			saveOptions();
		}, false);

		ToggleOption('BulkAttackOptions','pbaclosest','ClosestCity');
		ToggleOption('BulkAttackOptions','pbaskip','SkipErrors');
		ToggleOption('BulkAttackOptions','pbaallcities','AllCities');
		ToggleOption('BulkAttackOptions','pbaoverrideap','OverrideAP');
		ToggleOption('BulkAttackOptions','pbaquick','QuickScout');

		ById('pbAddBulkAttack').addEventListener('click', t.AddCoords, false);

		ById('pbaattackpreset').addEventListener('change', function() {
			Options.BulkAttackOptions.AttackPreset = ById('pbaattackpreset').value;
			saveOptions();
		}, false);

		ById('pbaknight').addEventListener('change', function(){
			Options.BulkAttackOptions.KnightPriority = ById('pbaknight').value;
			saveOptions();
		}, false);

		ById('pbachamp').addEventListener('change', function(){
			Options.BulkAttackOptions.SendChamp = ById('pbachamp').value;
			saveOptions();
		}, false);
    },

	hide: function () { },

	e_toggleswitch: function(obj) {
		var t = Tabs.BulkAttack;
		obj = ById('BulkAttackButton');
		if (Options.BulkAttackOptions.On) {
			if (obj) obj.value = "BulkAttack = OFF";
			Options.BulkAttackOptions.On = false;
		} else {
			if (obj) obj.value = "BulkAttack = ON";
			Options.BulkAttackOptions.On = true;
			t.timer = setTimeout(function () { t.doAutoLoop(Options.BulkAttackOptions.AttackCity);}, 0);
		}
		saveOptions();
		SetToggleButtonState('BulkAttack',Options.BulkAttackOptions.On,'BulkAttack');
	},

	PaintList : function (msg) {
		var t = Tabs.BulkAttack;

		var z = '';
		var r = 0;
		var logshow = false;
		var sel = 0;

		var z = '<div align="center">';
		z += '<TABLE width=98% align=center cellpadding=0 cellspacing=0 class=xtab><TR><TD colspan=4 align=right id=pbamarchinfo>&nbsp;</td></tr><tr><TH class=xtabHD width=15><input type=checkbox id=pbamarch_All /></th><TH width=100 class=xtabHD>'+translate('Co-ords')+'</th><th class=xtabHD>'+translate('Details')+'</th><th align=right class=xtabHD>'+strButton14(tx('Export'),'id=btExportBulkAttackList')+'&nbsp;'+strButton14(tx('Clear List'),'id=btClearBulkAttackList')+'</th></tr>';
		for(i = 0; i < Options.BulkAttackOptions.CoordList.length; i++){
			logshow = true;
			r=r+1;
			rowClass = 'evenRow';
			var rem = (r % 2);
			if (rem == 1) rowClass = 'oddRow';

			z += '<TR class="'+rowClass+'"><TD align=center width=15><input type=checkbox name=pbamarchchk id="pbamarchchk_'+Options.BulkAttackOptions.CoordList[i].x+'_'+Options.BulkAttackOptions.CoordList[i].y+'" value="'+Options.BulkAttackOptions.CoordList[i].x+'_'+Options.BulkAttackOptions.CoordList[i].y+'" '+(Options.BulkAttackOptions.CoordList[i].chk?'CHECKED':'')+' onclick="pbattackclick(\''+Options.BulkAttackOptions.CoordList[i].x+'_'+Options.BulkAttackOptions.CoordList[i].y+'\')" /></td><TD align=center>'+coordLink(Options.BulkAttackOptions.CoordList[i].x,Options.BulkAttackOptions.CoordList[i].y)+'</td><TD align=left id="pbamarchdetails_'+Options.BulkAttackOptions.CoordList[i].x+'_'+Options.BulkAttackOptions.CoordList[i].y+'">'+(Options.BulkAttackOptions.CoordList[i].Details?Options.BulkAttackOptions.CoordList[i].Details:'')+'<td align=right><a id="pbamarchdelete'+Options.BulkAttackOptions.CoordList[i].x+'_'+Options.BulkAttackOptions.CoordList[i].y+'" class="inlineButton btButton brown8" onclick="btRemoveBulkAttackList(\''+Options.BulkAttackOptions.CoordList[i].x+'_'+Options.BulkAttackOptions.CoordList[i].y+'\')"><span>Remove</span></a></td></tr>';

			if (Options.BulkAttackOptions.CoordList[i].chk) sel++;
		}

		if (!logshow) {
			z += '<tr><td colspan=4 class=xtab><div align="center"><br><br>No list entries</div></td></tr>';
		}

		z += '</table></div>';

		ById('btBulkAttackList').innerHTML = z;
		ById('pbBulkAttackmsg').innerHTML = msg;
		ById('pbamarchinfo').innerHTML = '('+sel+'/'+Options.BulkAttackOptions.CoordList.length+')';
		ById('btClearBulkAttackList').addEventListener ('click', function() {t.ClearList();}, false);
		ById('btExportBulkAttackList').addEventListener ('click', function() {t.ExportList();}, false);

		ById('pbamarch_All').addEventListener('change', function(){
			var sel = 0;
			for(k in document.getElementsByName('pbamarchchk'))
				document.getElementsByName('pbamarchchk')[k].checked = ById('pbamarch_All').checked;
			for (var b in Options.BulkAttackOptions.CoordList) {
				Options.BulkAttackOptions.CoordList[b].chk = ById('pbamarch_All').checked;
				if (Options.BulkAttackOptions.CoordList[b].chk) sel++;
			}
			saveOptions();
			ById('pbamarchinfo').innerHTML = '('+sel+'/'+Options.BulkAttackOptions.CoordList.length+')';
		}, false);
	},

	ClearList : function () {
		var t = Tabs.BulkAttack;
		Options.BulkAttackOptions.CoordList = [];
		saveOptions();
		t.PaintList('Attack List Cleared');
	},

	ExportList : function () {
		var t = Tabs.BulkAttack;
		var CoordList = [];
		for(i = 0; i < Options.BulkAttackOptions.CoordList.length; i++){
			CoordList.push('('+Options.BulkAttackOptions.CoordList[i].x+','+Options.BulkAttackOptions.CoordList[i].y+')');
		}
		if (CoordList.length>0) {
			window.prompt(tx("Copy to clipboard: Ctrl+C"), CoordList.join(" "));
		}
	},

	RemoveEntry : function (c) {
		var t = Tabs.BulkAttack;
		var Coord = [];
		Coord = c.split("_");
		for (var b in Options.BulkAttackOptions.CoordList) {
			if (Options.BulkAttackOptions.CoordList[b].x==Coord[0] && Options.BulkAttackOptions.CoordList[b].y==Coord[1]) {
				Options.BulkAttackOptions.CoordList.splice(b,1);
				break;
			}
		}
		saveOptions();
		t.PaintList('Entry deleted');
	},

	ToggleEntry : function (c) {
		var t = Tabs.BulkAttack;
		var Coord = [];
		Coord = c.split("_");
		var sel = 0;
		for (var b in Options.BulkAttackOptions.CoordList) {
			if (Options.BulkAttackOptions.CoordList[b].x==Coord[0] && Options.BulkAttackOptions.CoordList[b].y==Coord[1]) {
				Options.BulkAttackOptions.CoordList[b].chk = !Options.BulkAttackOptions.CoordList[b].chk;
				saveOptions();
			}
			if (Options.BulkAttackOptions.CoordList[b].chk) sel++;
		}
		ById('pbamarchinfo').innerHTML = '('+sel+'/'+Options.BulkAttackOptions.CoordList.length+')';
	},

	UnselectEntry : function (x,y) {
		var t = Tabs.BulkAttack;
		for (var b in Options.BulkAttackOptions.CoordList) {
			if (Options.BulkAttackOptions.CoordList[b].x==x && Options.BulkAttackOptions.CoordList[b].y==y) {
				Options.BulkAttackOptions.CoordList[b].chk = false;
				saveOptions();
			}
		}
		if (ById('pbamarchchk_'+x+'_'+y)) {
			ById('pbamarchchk_'+x+'_'+y).checked = false;
		}
	},

	AddCoords : function () {
		var t = Tabs.BulkAttack;

		var NewCoords = ById('pbBulkAttackcoords').value;
		NewCoords = replaceAll(NewCoords,"(", " ");
		NewCoords = replaceAll(NewCoords,")", " ");
		NewCoords = replaceAll(NewCoords,"[", " ");
		NewCoords = replaceAll(NewCoords,"]", " ");
		NewCoords = replaceAll(NewCoords,"_", ",");
		NewCoords = replaceAll(NewCoords,".", ",");
		var NewCoordList = [];
		var CleanedCoordList = [];
		var Coord = [];
		var ListEntry = new Object();
		var msg = '';

		if (NewCoords.trim() != "") {
			NewCoordList = NewCoords.split(" ");
		}
		CoordError = false;
		CoordsAdded = false;
		for (var a=0;a<NewCoordList.length;a++) {
			var c = NewCoordList[a];
			if (c.trim() != "") {
				Coord = c.split(",");
				if (Coord[0] && !isNaN(Coord[0]) && Coord[1] && !isNaN(Coord[1])) {
					// look like coords?
					CleanedCoordList.push({x:Coord[0],y:Coord[1]});
					// avoid duplicates by deleting existing entry for these coords
					for (var b=0;b<Options.BulkAttackOptions.CoordList.length;b++) {
						if (Options.BulkAttackOptions.CoordList[b].x==Coord[0] && Options.BulkAttackOptions.CoordList[b].y==Coord[1]) {
							Options.BulkAttackOptions.CoordList.splice(b,1);
							break;
						}
					}
				}
				else {
					CoordError = true;
				}
			}
		}

		if (CoordError) {
			msg = '<span style="color:#800;">Invalid format!</span>';
		}
		else {
			for (var a=0;a<CleanedCoordList.length;a++) {
				CoordsAdded = true;
				ListEntry = {};
				ListEntry.chk = true;
				ListEntry.x = CleanedCoordList[a].x;
				ListEntry.y = CleanedCoordList[a].y;
				ListEntry.details = '';
				Options.BulkAttackOptions.CoordList.push(ListEntry);
			}
			if (CoordsAdded) msg = 'Co-ordinates added';
			ById('pbBulkAttackcoords').value = '';
		}
		saveOptions();
		t.PaintList(msg);
	},

	ImportCoords : function(CoordList) {
		var t = Tabs.BulkAttack;
		CoordsAdded = false;
		for (var a=0;a<CoordList.length;a++) {
			var c = CoordList[a];
			if (c.trim() != "") {
				Coord = c.split(",");
				for (var b=0;b<Options.BulkAttackOptions.CoordList.length;b++) {
					if (Options.BulkAttackOptions.CoordList[b].x==Coord[0] && Options.BulkAttackOptions.CoordList[b].y==Coord[1]) {
						Options.BulkAttackOptions.CoordList.splice(b,1);
						break;
					}
				}
				ListEntry = {};
				ListEntry.chk = true;
				ListEntry.x = Coord[0];
				ListEntry.y = Coord[1];
				ListEntry.details = '';
				Options.BulkAttackOptions.CoordList.push(ListEntry);
				CoordsAdded = true;
			}
		}

		if (CoordsAdded) { ById('bttcBulkAttack').click(); }
	},

	doAutoLoop : function (idx) {
		var t = Tabs.BulkAttack;
		clearTimeout(t.timer);
		if (ById('pbBulkAttackmsg')) { ById('pbBulkAttackmsg').innerHTML = ''; }

		var cityId = Cities.cities[idx].id;

		// get next attack entry, if none, then switch off.

		var entry = null;
		for(var i = 0; i < Options.BulkAttackOptions.CoordList.length; i++){
			if (Options.BulkAttackOptions.CoordList[i].chk) {
				entry = Options.BulkAttackOptions.CoordList[i];
				break;
			}
		}

		if (!entry) {
			Options.BulkAttackOptions.On = false;
			saveOptions();
			if (ById('BulkAttackButton')) { ById('BulkAttackButton').value = "BulkAttack = OFF"; }
			SetToggleButtonState('BulkAttack',Options.BulkAttackOptions.On,'BulkAttack');
			t.PaintList(translate('Attacking Completed'));
			return;
		}
		else {
			if (!Options.BulkAttackOptions.On) {
				t.UpdateDetails(entry.x,entry.y,translate('Attacking Cancelled'));
				return;
			}
			if (!Options.BulkAttackOptions.AttackPreset || Options.BulkAttackOptions.AttackPreset=="0") {
				t.UpdateDetails(entry.x,entry.y,translate('No Attack Preset'));
				return;
			}
			t.UpdateDetails(entry.x,entry.y,translate('Sending')+'...');
		}

		if (Options.BulkAttackOptions.ClosestCity) { // select closest city
			var idx = t.SelectClosest(entry.x,entry.y);
			var cityId = Cities.cities[idx].id;
		}

		// check currently selected city is suitable for the march.

		var citysuitable = t.CheckCitySuitable(cityId,true);

		if (!citysuitable) {
			if (Options.BulkAttackOptions.AllCities) { // check other cities
				var newidx = t.GetNextSuitableCity(idx);
				if (newidx!=idx) {
					idx = newidx;
					var cityId = Cities.cities[idx].id;
					citysuitable=true;
					actionLog('Changing city to ' + Cities.cities[idx].name,'BULKATTACK')
				}
			}
		}

		if (!citysuitable) {
			t.UpdateDetails(entry.x,entry.y,t.cityreason+'...',true);
			actionLog(t.cityreason,'BULKATTACK')
			// 1 min delay... no suitable cities at the moment...
			if (!Options.BulkAttackOptions.ClosestCity || Options.BulkAttackOptions.AllCities) {
				t.timer = setTimeout(function () { t.doAutoLoop(Options.BulkAttackOptions.AttackCity);}, (60 * 1000));
			}
			else {
				// move co-ords to end of list and try next, because the next entry could be for another city
				Options.BulkAttackOptions.CoordList.push(Options.BulkAttackOptions.CoordList.splice(i,1)[0]);
				t.timer = setTimeout(function () { t.doAutoLoop(idx);}, (Options.BulkAttackOptions.intervalSecs * 1000));
			}
			return;
		}

		// Send the attack, and loop back once sent...

		t.sendAttack(entry.x, entry.y, cityId, function () { var t = Tabs.BulkAttack; t.timer = setTimeout(function () { t.doAutoLoop(idx); }, (Options.BulkAttackOptions.intervalSecs * 1000)); });
	},

	SelectClosest : function (x2,y2) {
		var t = Tabs.BulkAttack;
		var closestdist = 999999;
		var closestcity;

		if(isNaN(x2) || isNaN(y2)) return;

		for (var i = 0; i < Cities.numCities; i++) {
			var	cityId = Cities.cities[i].id;
			var ascensionok = (!uW.cm.PrestigeCityPlayerProtectionController.isActive(cityId) || Options.BulkAttackOptions.OverrideAP); // don't select city under AP!
			if (ascensionok) {
				var x1 = parseInt(Cities.cities[i].x);
				var y1 = parseInt(Cities.cities[i].y);
				if (x1 != x2 || y1 != y2) { // if one of your cities, pick the nearest other city!
					var dist = distance(x1, y1, x2, y2);
					if (dist < closestdist) {
						closestdist = dist;
						closestcity = i;
					}
				}
			}
		}
		return closestcity;
	},

	GetNextSuitableCity : function (idx) {
		var t = Tabs.BulkAttack;
		var oldidx = idx;
		do {
			idx++;
			if (idx >= Number(Cities.numCities)) idx = 0;
			cityId = Cities.cities[idx].id;
		}
		while (!t.CheckCitySuitable(cityId) && (idx != oldidx))
		return idx;
	},

	CheckCitySuitable : function (cityId,reason) {
		var t = Tabs.BulkAttack;

		var troopsok = true;
		var CheckArray = [];
		for (var ui in uW.cm.UNIT_TYPES) {
			var i = uW.cm.UNIT_TYPES[ui];
			if (Options.QuickMarchOptions.MarchPresets[Options.BulkAttackOptions.AttackPreset][i]) {
				CheckArray[i] = parseIntNan(Options.QuickMarchOptions.MarchPresets[Options.BulkAttackOptions.AttackPreset][i]);
			}
		}
		for (var ui in uW.cm.UNIT_TYPES) {
			var i = uW.cm.UNIT_TYPES[ui];
			if (CheckArray[i] && CheckArray[i] > parseIntNan(Seed.units['city' + cityId]['unt'+i])) {
				troopsok = false;
				break;
			}
		}

		var knightok = true;
		var knt = getAvailableKnights(cityId);
		if (!knt[0]) { knightok = false; }

		var marches = parseIntNan(March.getMarchSlots(cityId));
		var maxmarches = parseIntNan(March.getTotalSlots(cityId));
		var keepfree = Number(Options.BulkAttackOptions.FreeRallySlots); // use highest of bulk attack keep rally free or general keep rally free
		if (keepfree < Number(Options.FreeRallySlots)) { keepfree = Number(Options.FreeRallySlots); }
		var rallyok = ((marches+keepfree) < maxmarches);
		var towerok = (!Options.TowerOptions || !Options.TowerOptions.SaveCityState[cityId] || Options.TowerOptions.SaveCityState[cityId].AllowMarches);
		var ascensionok = (!uW.cm.PrestigeCityPlayerProtectionController.isActive(cityId) || Options.BulkAttackOptions.OverrideAP);

		var champok = true;
		if (parseIntNan(Options.BulkAttackOptions.SendChamp)==1) {
			var champ = false;
			for (var c in Seed.champion.champions) {
				citychamp = Seed.champion.champions[c];
				var champstatus = citychamp.status;
				if (citychamp.assignedCity == cityId && champstatus != "10") {
					champ = true;
					break;
				}
			}
			champok = champ;
		}
		if (reason) {
			t.cityreason = translate('Waiting for rally point to clear!');
			if (rallyok) {
				if (!knightok) t.cityreason = translate('Waiting for an available knight!');
				else if (!champok) t.cityreason = translate('No Champion available!');
				else if (!troopsok) t.cityreason = translate('Waiting for available troops!');
				else if (!towerok) t.cityreason = translate('Source city is under attack - waiting for all clear!');
				else if (!ascensionok) t.cityreason = translate('Source city is under ascension protection - cannot march from here!');
			}
		}

		return (troopsok && knightok && rallyok && towerok && ascensionok && champok);
	},

	UpdateDetails : function(x,y,msg,perm) {
		var t = Tabs.BulkAttack;
		var el = 'pbamarchdetails_'+x+'_'+y;
		var elem = ById(el);
		if (elem) { elem.innerHTML = msg; }
		if (perm) {
			for (var b in Options.BulkAttackOptions.CoordList) {
				if (Options.BulkAttackOptions.CoordList[b].x==x && Options.BulkAttackOptions.CoordList[b].y==y) {
					Options.BulkAttackOptions.CoordList[b].Details = msg;
					saveOptions();
				}
			}
		}
	},

	sendAttack : function(x, y, cid, notify){
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cid;
		params.kid = 0;
		params.xcoord = x;
		params.ycoord = y;
		var knt = getAvailableKnights(cid);
		if (knt[0]) {
			if (Options.BulkAttackOptions.KnightPriority==1) { // lowest combat skill
				knt = knt.sort(function sort(a,b) {a = a['Combat'];b = b['Combat'];return a == b ? 0 : (a < b ? -1 : 1);});
			};
			if (Options.BulkAttackOptions.KnightPriority==2) { // highest experience
				knt = knt.sort(function sort(a,b) {a = a['Experience'];b = b['Experience'];return a == b ? 0 : (a > b ? -1 : 1);});
			};
			if (Options.BulkAttackOptions.KnightPriority==3) { // lowest experience
				knt = knt.sort(function sort(a,b) {a = a['Experience'];b = b['Experience'];return a == b ? 0 : (a < b ? -1 : 1);});
			};
			if (Options.BulkAttackOptions.KnightPriority!=4) { // no knight - megaliths!
				params.kid=knt[0].ID; // will fail if no knights
			}
		}
		params.type = 4;

		for (var ui in uW.cm.UNIT_TYPES) {
			var i = uW.cm.UNIT_TYPES[ui];
			params["u"+i] = 0;
			if (Options.QuickMarchOptions.MarchPresets[Options.BulkAttackOptions.AttackPreset][i]) {
				params["u"+i] = parseIntNan(Options.QuickMarchOptions.MarchPresets[Options.BulkAttackOptions.AttackPreset][i]);
			}
		}

		var iused = new Array();
		for (var i = 0; i < QuickMarch.ItemList.length; i++) {
			if (Options.QuickMarchOptions.MarchPresets[Options.BulkAttackOptions.AttackPreset]["item"+QuickMarch.ItemList[i]] == true && Seed.items["i"+QuickMarch.ItemList[i]]) {
				iused.push(QuickMarch.ItemList[i]);
			}
		}
		params.items = iused.join(",");

		params.gold = 0;
		params.r1 = 0;
		params.r2 = 0;
		params.r3 = 0;
		params.r4 = 0;
		params.r5 = 0;

		params.champid = 0;
		if (parseIntNan(Options.BulkAttackOptions.SendChamp)!=0) {
			for (var c in Seed.champion.champions) {
				citychamp = Seed.champion.champions[c];
				if (citychamp.assignedCity == cid) {
					var champstatus = citychamp.status;
					if (champstatus != "10") { params.champid = citychamp.championId; }
					break;
				}
			}
		}

		March.addMarch(params, function(rslt){
			var t = Tabs.BulkAttack;
			if (rslt.ok) {
				var extrainfo = '';
				if (cid!=Cities.cities[Options.BulkAttackOptions.AttackCity].id || Options.BulkAttackOptions.ClosestCity) { extrainfo += ' from '+Cities.byID[cid].name; }
				t.UpdateDetails(x,y,translate('Attack sent')+extrainfo+'!',true);
				t.UnselectEntry(x,y);
				if (Options.BulkAttackOptions.QuickScout) {
					ChatStuff.fetchmarch(rslt.marchId,t.QuickScoutResults);
				}
			}
			else {
				var msg = translate('March failed to send!');
				if (rslt.msg) msg = rslt.msg;
				if (rslt.error_code == 208 || rslt.error_code == 207 || rslt.error_code == 104) { // will never be able to send
					t.UpdateDetails(x,y,msg);
					t.UnselectEntry(x,y);
					// update search tab if coords exist and it's misted and target it truced..
					if(rslt.error_code == 208) {
						if (Tabs.Search && Tabs.Search.mapDat) {
							var numRows = Tabs.Search.mapDat.length;
							for (var i=0; i<numRows; i++){
								if (Tabs.Search.mapDat[i][0] == x && Tabs.Search.mapDat[i][1] == y) {
									if (Tabs.Search.mapDat[i][13]) {
										Tabs.Search.mapDat[i][6] = 0;
										Tabs.Search.mapDat[i][8] = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Target is truced - Cannot attack!</span>';
									}
									break;
								}
							}
						}
					}
				}
				else {
					if (Options.BulkAttackOptions.SkipErrors) {
						t.UpdateDetails(x,y,msg,true);
						t.UnselectEntry(x,y);
					} else {
						t.UpdateDetails(x,y,msg+' '+translate('Retrying')+'...',true);
					}
				}
			}
			if (notify) {notify();}
		});
	},

	QuickScoutResults : function (rslt,rslt2,march) {
		var t = Tabs.BulkAttack;

		var a = march;
		var totile = tileTypes[parseInt(a["toTileType"])];
		if (a["toTileType"] == 51) {
			if (!a["toPlayerId"]) { totile = "???"; }
			else { if (a["toPlayerId"] == 0) totile = 'Barb Camp'; }
		}
		totile = 'Lvl '+a["toTileLevel"]+' '+totile;

		if (rslt2 && rslt2.userInfo) {
			u2 = rslt2.userInfo[0];
			var alli2 = 'None';
			if (u2.allianceName)
				alli2 = u2.allianceName + FormatDiplomacy(u2.allianceId);

			t.UpdateDetails(march.toXCoord,march.toYCoord,totile+' - Name: '+PlayerLink(a.toPlayerId,u2.genderAndName)+', Alliance: '+alli2,true);
		}
		else {
			t.UpdateDetails(march.toXCoord,march.toYCoord,totile,true);
		}

		// update misted search if it exists
		if (Tabs.Search && Tabs.Search.mapDat) {
			var numRows = Tabs.Search.mapDat.length;
			for (var i=0; i<numRows; i++){
				if (Tabs.Search.mapDat[i][0] == march.toXCoord && Tabs.Search.mapDat[i][1] == march.toYCoord) {
					if (Tabs.Search.mapDat[i][13]) {
						if (!rslt2) {
							QuickScout.FillSearchDiv({errorMsg:"plain"},march);
						}
						else {
							QuickScout.FillSearchDiv(rslt2,march);
						}
					}
					break;
				}
			}
		}
	},
}