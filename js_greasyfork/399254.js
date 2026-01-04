/**spells tab**/
Tabs.Spells = {
	tabLabel: 'Spells',
	tabOrder: 2100,
	tabColor : 'brown',
	myDiv: null,
	timer: null,
	LoopCounter: 0,
	intervalSecs : 2,
	autodelay : 0,
	Squire:0,
	Knight:0,
	Guinevere:0,
	Morgana:0,
	Arthur:0,
	Merlin:0,
	Divine:0,
	Epic:0,
	Legendary:0,
	ItemList : [1, 2, 3, 4, 5, 6, 7, 8, 10],
	ItemTrans : ["SH","KH","GH","MH","AH","RH","DH","EH","LH"],
	Options: {
		Running: false,
		Enabled : {1:true,2:true,3:true,4:true,5:true,6:true,7:true,8:true},
		UseLH : false,
		UseEH : false,
		UseDH : false,
		UseRH : false,
		UseAH : false,
		UseMH : false,
		UseGH : false,
		UseKH : false,
		UseSH : false,
		UseOverride : false,
		OverrideItem : 0,
		OverrideHours : 0,
		OverrideMinutes : 1,
		Toggle : false,
	},

	init: function (div) {
		var t = Tabs.Spells;
		t.myDiv = div;

		if (!Options.SpellOptions) {
			Options.SpellOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.SpellOptions.hasOwnProperty(y)) {
					Options.SpellOptions[y] = t.Options[y];
				}
			}
		}

		uWExportFunction('speedupSpell', Tabs.Spells.speedupSpell);

		if (Options.SpellOptions.Toggle) AddSubTabLink('AutoSpell',t.toggleAutoSpellState, 'SpellToggleTab');
		SetToggleButtonState('Spell',Options.SpellOptions.Running,'Spell');

		var m = '<DIV class=divHeader align=center>'+tx('BATTLE SPELLS')+'</div>';
		m += '<div align="center">';

		m += '<table width=100% class=xtab><tr><td width=30%><INPUT id=btSpellToggle type=checkbox '+ (Options.SpellOptions.Toggle?'CHECKED ':'') +'/>&nbsp;'+tx("Add toggle button to main screen header")+'</td><td colspan=2 align=center><INPUT id=btAutoSpellState type=submit value="'+tx("AutoSpell")+' = '+ (Options.SpellOptions.Running?'ON':'OFF')+'"></td><td width=30% align=right>&nbsp;</td></tr></table>';

		m += '<br><DIV id=btSpellOverviewDiv style="width:'+GlobalOptions.btWinSize.x+'px;overflow-x:auto;">';

		m += '<TABLE width=98% class=xtab cellpadding=1 cellspacing=0 align=center style="font-size:'+Options.OverviewOptions.OverviewFontSize+'px;"><TR valign=bottom><td width=20>&nbsp;</td><td width=40>&nbsp;</td>';

		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD style="font-size:11px;" align=center width=100><span id="btSpellCity_'+i+'"><B>'+Cities.cities[i-1].name.substring(0, 12)+'</b></span></td>';
		}
		m += "<td>&nbsp;</td>"; // spacer
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 align=right><b>'+tx('Active')+'&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><INPUT class='+i+' id="btSpellAutoCity_'+i+'" type=checkbox '+(Options.SpellOptions.Enabled[i]?'CHECKED':'')+'></div></td>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 align=right><b>'+uW.g_js_strings.commonstr.faction+'&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><span id="btSpellFactionCity_'+i+'">&nbsp;</span></div></td>';
		}
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 align=right><b>'+tx('Battle Spell')+'&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><span id="btSpellNameCity_'+i+'">&nbsp;</span></div></td>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 align=right style="padding-top:2px;vertical-align:top;padding-left:0px;"><b>'+uW.g_js_strings.commonstr.status+'&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div align=center class=xtabBorder style="height:60px;"><span id="btSpellStatusCity_'+i+'">&nbsp;</span></div></td>';
		}

		m += '</tr></table></div></div>';

		m += '<div class="divHeader" align="center">'+tx('USE AUTO-SPEEDUPS')+'</div>';

		m += '<table width=100% class=xtab><tr><td><div align=center>';

		var Boosts = '<table width=95% class=xtab align=center cellpadding=0 cellspacing=0><tr style="vertical-align:top;">';
		for (var i = 0; i < t.ItemList.length; i++) {
			Boosts += '<td width=30 rowspan=2><img height=28 src="'+IMGURL+'items/70/'+t.ItemList[i]+'.jpg" title="'+itemTitle(t.ItemList[i],true)+'\n'+tx(HourGlassHint[i])+'" /></td><td>(<span id=pbspellUse'+t.ItemTrans[i]+'Label>' + parseIntNan(uW.ksoItems[t.ItemList[i]].count) + '</span>)</td>';
		}
		Boosts += '<td width=70 rowspan=2 align=right><INPUT id=pbSpellHelp type=submit value="'+tx('HELP')+'!"></td>';
		Boosts += '</tr><tr style="vertical-align:top;">';
		for (var i = 0; i < t.ItemList.length; i++) {
			Boosts += '<td><input type=checkbox id="pbspell'+t.ItemTrans[i]+'" '+(Options.SpellOptions["Use"+t.ItemTrans[i]]?"CHECKED" : "")+'></td>';
		}
		Boosts += '</tr></table></td></tr>';
		Boosts += '<tr><td><div align=center><table width=95% class=xtab align=center cellpadding=0 cellspacing=0><tr><td><input type=checkbox id=pbspellOV ' + (Options.SpellOptions.UseOverride ? "CHECKED" : "") + '>'+tx('Override above by always using')+' '+htmlSelector(HourGlassName,Options.SpellOptions.OverrideItem, 'id=pbspellOVItem') + ' '+tx('when more than')+' ';
		Boosts += '<INPUT style="width: 30px;text-align:right;" id="pbspellOVHours" type=text maxlength=4 value="'+Options.SpellOptions.OverrideHours+'">&nbsp;'+uW.g_js_strings.timestr.timehr+'&nbsp;<INPUT style="width: 30px;text-align:right;" id="pbspellOVMinutes" type=text maxlength=4 value="'+Options.SpellOptions.OverrideMinutes+'">&nbsp;'+uW.g_js_strings.timestr.timemin+' '+tx('remaining')+'.</td></tr></table></div></td></tr>';

		m += Boosts+'</table></div><br>';

		div.innerHTML = m;

		for (var i = 1; i <= Cities.numCities; i++) {
			ById('btSpellAutoCity_'+i).addEventListener('click', function(e){
				var citynum = e.target['className'];
				Options.SpellOptions.Enabled[citynum] = e.target.checked;
				if (Options.SpellOptions.Enabled[citynum]) {
					t.timer = setTimeout(function () { t.doAutoLoop(Number(citynum));}, 0);
				}
				saveOptions();
			}, false);
		}

		ToggleOption('SpellOptions','btSpellToggle','Toggle');

		ToggleOption('SpellOptions','pbspellSH','UseSH');
		ToggleOption('SpellOptions','pbspellKH','UseKH');
		ToggleOption('SpellOptions','pbspellGH','UseGH');
		ToggleOption('SpellOptions','pbspellMH','UseMH');
		ToggleOption('SpellOptions','pbspellAH','UseAH');
		ToggleOption('SpellOptions','pbspellRH','UseRH');
		ToggleOption('SpellOptions','pbspellDH','UseDH');
		ToggleOption('SpellOptions','pbspellEH','UseEH');
		ToggleOption('SpellOptions','pbspellLH','UseLH');
		ToggleOption('SpellOptions','pbspellOV','UseOverride');
		ChangeIntegerOption('SpellOptions','pbspellOVItem','OverrideItem');
		ChangeIntegerOption('SpellOptions','pbspellOVHours','OverrideHours');
		ChangeIntegerOption('SpellOptions','pbspellOVMinutes','OverrideMinutes');

		ById ('pbSpellHelp').addEventListener ('click', t.helpPop, false);

		ById('btAutoSpellState').addEventListener('click', function(){
			t.toggleAutoSpellState(this);
		}, false);

		// start autocraft loop timer to start in 15 seconds...

		if (Options.SpellOptions.Running) {
			t.timer = setTimeout(function () { t.doAutoLoop(1);}, (15 * 1000));
		}
	},

	toggleAutoSpellState: function(obj){
		var t = Tabs.Spells;
		obj = ById('btAutoSpellState');
		if (Options.SpellOptions.Running == true) {
			Options.SpellOptions.Running = false;
			obj.value = tx("AutoSpell = OFF");
		}
		else {
			Options.SpellOptions.Running = true;
			obj.value = tx("AutoSpell = ON");
			t.timer = setTimeout(function () { t.doAutoLoop(1);}, 0);
		}
		saveOptions();
		SetToggleButtonState('Spell',Options.SpellOptions.Running,'Spell');
		t.PaintOverview();
	},

	show: function (init) {
		var t = Tabs.Spells;
		t.PaintOverview();
	},

	helpPop : function (){
		var t = Tabs.Spells;
		var helpText = '<br>'+tx("Using Speedups for Spells");
		helpText += '<p>'+tx('Speedups will be used in the following order if they are selected, and the required criteria is met')+' :-</p>';
		helpText += '<TABLE class=xtab><TR><TD><b>'+uW.g_js_strings.commonstr.item+'</b></td><TD><b>'+uW.g_js_strings.commonstr.time+'</b></td><TD><b>'+tx('Criteria')+'</b></td></tr>';
		helpText += '<TR><TD>'+uW.itemlist.i10.name+'</td><TD>4 days</td><TD>'+tx('More than 3 days and 12 hours remaining')+'</td></tr>';
		helpText += '<TR><TD>'+uW.itemlist.i8.name+'</td><TD>2.5 days</td><TD>'+tx('More than 48 hours remaining')+'</td></tr>';
		helpText += '<TR><TD>'+uW.itemlist.i7.name+'</td><TD>24 hrs</td><TD>'+tx('More than 23 hours 30 minutes remaining')+'</td></tr>';
		helpText += '<TR><TD>'+uW.itemlist.i6.name+'</td><TD>15 hrs</td><TD>'+tx('More than 14 hours 30 minutes remaining')+'</td></tr>';
		helpText += '<TR><TD>'+uW.itemlist.i5.name+'</td><TD>8 hrs</td><TD>'+tx('More than 7 hours 30 minutes remaining')+'</td></tr>';
		helpText += '<TR><TD>'+uW.itemlist.i4.name+'</td><TD>2.5 hrs</td><TD>'+tx('More than 2 hours remaining')+'</td></tr>';
		helpText += '<TR><TD>'+uW.itemlist.i3.name+'</td><TD>1 hr</td><TD>'+tx('More than 45 minutes remaining')+'</td></tr>';
		helpText += '<TR><TD>'+uW.itemlist.i2.name+'</td><TD>15 mins</td><TD>'+tx('More than 5 minutes remaining')+'</td></tr>';
		helpText += '<TR><TD>'+uW.itemlist.i1.name+'</td><TD>1 min</td><TD>'+tx('More than 30 seconds remaining')+'</td></tr>';
		helpText += '</table>';
		helpText += '<p>'+tx('If the override box is ticked, then the override rule specified will take priority')+'.</p><br>';

		var pop = new CPopup ('BotHelp', 0, 0, 460, 360, true);
		pop.centerMe (mainPop.getMainDiv());
		pop.getMainDiv().innerHTML = helpText;
		pop.getTopDiv().innerHTML = '<CENTER><B>'+tx("PowerBot+ Help")+': '+tx("Speedups")+'</b></center>';
		pop.show (true);
	},

	EverySecond : function () {
		var t = Tabs.Spells;

		t.LoopCounter = t.LoopCounter + 1;

		if (t.LoopCounter%2==0) { // refresh overview display every 2 seconds
			if (tabManager.currentTab.name == 'Spells' && Options.btWinIsOpen){ t.PaintOverview(); }
		}
	},

	PaintOverview : function () {
		var t = Tabs.Spells;

		t.Squire = parseIntNan(Seed.items.i1);
		t.Knight = parseIntNan(Seed.items.i2);
		t.Guinevere = parseIntNan(Seed.items.i3);
		t.Morgana = parseIntNan(Seed.items.i4);
		t.Arthur = parseIntNan(Seed.items.i5);
		t.Merlin = parseIntNan(Seed.items.i6);
		t.Divine = parseIntNan(Seed.items.i7);
		t.Epic = parseIntNan(Seed.items.i8);
		t.Legendary = parseIntNan(Seed.items.i10);

		ById('pbspellUseSHLabel').innerHTML = t.Squire;
		ById('pbspellUseKHLabel').innerHTML = t.Knight;
		ById('pbspellUseGHLabel').innerHTML = t.Guinevere;
		ById('pbspellUseMHLabel').innerHTML = t.Morgana;
		ById('pbspellUseAHLabel').innerHTML = t.Arthur;
		ById('pbspellUseRHLabel').innerHTML = t.Merlin;
		ById('pbspellUseDHLabel').innerHTML = t.Divine;
		ById('pbspellUseEHLabel').innerHTML = t.Epic;
		ById('pbspellUseLHLabel').innerHTML = t.Legendary;

		var now = unixTime();
		var q;

		for (var i = 0; i < Cities.numCities; i++) {
			citynum = i+1;
			cityId = Cities.cities[i].id;

			var spells = getSpellData(cityId);
			var faction = spells.faction;

			var SpellName = 'none';
			var SpellActivity = 'n/a';
			if (spells.spellavailable) {
				SpellName = '<span class=boldMagenta>'+uW.g_js_strings.spells["name_"+SpellTypes[faction]]+'</span>';
				var spellstyle = 'color:#080;';
				SpellActivity = '<span style="'+spellstyle+'"><b>'+tx('Ready')+'!</b></span>';

				if (spells.cooldownactive) {
					spellstyle = 'color:#800;';
					SpellActivity = '<b><span id=CoolTime style="'+spellstyle+'">'+spells.cooldown+'</span></b>';

					var Speedups = '';
					Speedups += t.dspHG(cityId, faction, 1, t.Squire);
					Speedups += t.dspHG(cityId, faction, 2, t.Knight);
					Speedups += t.dspHG(cityId, faction, 3, t.Guinevere);
					Speedups += t.dspHG(cityId, faction, 4, t.Morgana);
					Speedups += t.dspHG(cityId, faction, 5, t.Arthur);
					Speedups += '</tr><tr>';
					Speedups += t.dspHG(cityId, faction, 6, t.Merlin);
					if (Speedups != "") Speedups = "<table align=left cellspacing=0 cellpadding=0><tr>" + Speedups + "</tr></table>";
					SpellActivity = SpellActivity+'<div>'+Speedups+'</div>';
				}
			}

			var CityFaction = tx('Not ascended');
			var ascended = getAscensionValues(cityId);
			if (faction != 0) {
				CityFaction = getFactionName(faction) + '&nbsp('+ascended.prestigeLevel+')';
			}

			ById("btSpellFactionCity_"+citynum).innerHTML = CityFaction;
			ById("btSpellNameCity_"+citynum).innerHTML = SpellName;
			ById("btSpellStatusCity_"+citynum).innerHTML = SpellActivity;
		}
	},

	dspHG : function (cityId, faction, item, count) {
		var t = Tabs.Spells;
		var n = '';
		if (count>0) {
			n += '<td class=xtab style="padding-right:2px"><a onClick="speedupSpell('+cityId+', '+item+', '+SpellTypes[faction]+')"><img height=18 class="btTop btFaint" src="'+IMGURL+'items/70/'+item+'.jpg" title="'+itemTitle(item)+'"></a></td>';
		}
		return n;
	},

	doAutoLoop : function (idx) {
		var t = Tabs.Spells;
		clearTimeout(t.timer);
		if (!Options.SpellOptions.Running) return;

		var cityId = Cities.cities[idx-1].id;
		if (idx==1) { t.loopaction = false; } // reset loop action indicator for first city
		t.autodelay = 0; // no delay if no action taken!

		// check spell status and speedup if on cooldown

		var spells = getSpellData(cityId);
		var faction = spells.faction;
		if (spells.spellavailable && spells.cooldownactive) {
			t.autoSpeedup (cityId,SpellTypes[faction]);
		}

		if (idx == Cities.numCities) {
			if (!t.loopaction) { t.autodelay = t.intervalSecs; } // if no action this loop, apply delay anyway...
			t.timer = setTimeout(function () { t.doAutoLoop(1); }, (t.autodelay * 1000));
		}
		else {
			t.timer = setTimeout(function () { t.doAutoLoop(idx+1); }, (t.autodelay * 1000));
		}
	},

	autoSpeedup: function (cityId,spell) {
		var t = Tabs.Spells;
		var now = unixTime();
		var item = 0;
		totTime = parseInt(Seed.cityData.city[cityId].spells[spell].endDate) - now;

		if (totTime > 0) {
			if (Options.SpellOptions.UseOverride && Options.SpellOptions.OverrideItem != 0) {
				var THRESHOLD_SECONDS = (parseIntNan(Options.SpellOptions.OverrideMinutes)*60)+(parseIntNan(Options.SpellOptions.OverrideHours)*60*60);
				if (totTime >= THRESHOLD_SECONDS && uW.ksoItems[Options.SpellOptions.OverrideItem].count > 0) { item = Options.SpellOptions.OverrideItem; }
			}
			if (item==0 && totTime >= HGLimit[8] && Options.SpellOptions.UseLH && uW.ksoItems[10].count > 0) { item = 10; }
			if (item==0 && totTime >= HGLimit[7] && Options.SpellOptions.UseEH && uW.ksoItems[8].count > 0) { item = 8; }
			if (item==0 && totTime >= HGLimit[6] && Options.SpellOptions.UseDH && uW.ksoItems[7].count > 0) { item = 7; }
			if (item==0 && totTime >= HGLimit[5] && Options.SpellOptions.UseRH && uW.ksoItems[6].count > 0) { item = 6; }
			if (item==0 && totTime >= HGLimit[4] && Options.SpellOptions.UseAH && uW.ksoItems[5].count > 0) { item = 5; }
			if (item==0 && totTime >= HGLimit[3] && Options.SpellOptions.UseMH && uW.ksoItems[4].count > 0) { item = 4; }
			if (item==0 && totTime >= HGLimit[2] && Options.SpellOptions.UseGH && uW.ksoItems[3].count > 0) { item = 3; }
			if (item==0 && totTime >= HGLimit[1] && Options.SpellOptions.UseKH && uW.ksoItems[2].count > 0) { item = 2; }
			if (item==0 && totTime >= HGLimit[0] && Options.SpellOptions.UseSH && uW.ksoItems[1].count > 0) { item = 1; }
		}

		if (item != 0) {
			t.autodelay = t.intervalSecs;
			t.loopaction = true;
			t.speedupSpell(cityId,item,spell);
		}
	},

	speedupSpell : function (cityId,item,spell) {
		var t = Tabs.Spells;

		var citynum = Cities.byID[cityId].idx+1;
		jQuery('#btSpellCity_'+citynum).css('color', 'magenta');
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.iid = item;
		params.sid = spell;
		params.apothecary = false;

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/speedupBattleSpellCooldown.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					if (rslt.endDate) {
						Seed.cityData.city[cityId].spells = uWCloneInto({});
						Seed.cityData.city[cityId].spells[spell] = uWCloneInto({ endDate : rslt.endDate });
					}
					Seed.items["i"+item] = Number(parseInt(Seed.items["i"+item])-1);
					uW.ksoItems[item].subtract();
					if (cityId == uW.currentcityid) uW.update_queue();
					if (ById('QMSpell')) QuickMarch.BuildSpellSelect();
					actionLog(Cities.byID[cityId].name+': Spell cooldown speedup applied','SPELLS');
				}
				else {
					if (rslt.msg) {
						actionLog(Cities.byID[cityId].name+': Spell cooldown speedup failed ('+rslt.msg+')','SPELLS');
					}
					else {
						actionLog(Cities.byID[cityId].name+': Spell cooldown speedup failed ('+rslt.error_code+')','SPELLS');
					}
				}
				jQuery('#btSpellCity_'+citynum).css('color', 'rgb('+HEXtoRGB(Options.Colors.PanelText).r+','+HEXtoRGB(Options.Colors.PanelText).g+','+HEXtoRGB(Options.Colors.PanelText).b+')');
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name+': Spell cooldown speedup failed (AJAX Error)','SPELLS');
				jQuery('#btSpellCity_'+citynum).css('color', 'rgb('+HEXtoRGB(Options.Colors.PanelText).r+','+HEXtoRGB(Options.Colors.PanelText).g+','+HEXtoRGB(Options.Colors.PanelText).b+')');
			},
		},true);
	},
}
