/**************************** Research Tab ****************************************/
// @tabversion 20180605

Tabs.Research = {
	tabLabel: 'Research',
	tabOrder: 2065,
	tabColor : 'brown',
	myDiv: null,
	timer: null,
	LoopCounter: 0,
	intervalSecs : 5,
	autodelay : 0,
	citydelay: {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0},
	loopaction : false,
	researchspeed : 0,
	researchcost : 0,
	totgold : 0,
	noAlchemy : [],
	noBriton : [],
	alchemylabs : [],
	workshops : [],
	tableau : [],
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
	researchinfo : {},
	britoninfo : {},
	CombatOrder : [13,8,9,15,10,11,12,6,14,16,5,17,4,1,3,2],
	BritonCombatOrder : [6,5,4,1,3,2],
	Options: {
		Running: false,
		ThroneCheck: false,
		ResearchSpeed: 0,
		MinGold : 5000,
		Enabled : {1:true,2:true,3:true,4:true,5:true,6:true,7:true,8:true},
		ResearchNumbers : {},
		BritonNumbers : {},
		help : false,
		ResearchPriority : 1, // 0 - none, 1 - shortest time, 2 - combat types
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
		var t = Tabs.Research;
		t.myDiv = div;

		if (!Options.ResearchOptions) {
			Options.ResearchOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.ResearchOptions.hasOwnProperty(y)) {
					Options.ResearchOptions[y] = t.Options[y];
				}
			}
		}

		uWExportFunction('speedupResearch', Tabs.Research.speedupResearch);

		for(var j in uW.techcost) {
			var h = j.split("tch")[1];
			t.researchinfo[h] = {};
			t.researchinfo[h].name = uW.techcost[j][0];
			t.researchinfo[h].description = uW.techcost[j][10];
		}

		for(var j in uW.techcost2) {
			var h = j.split("tch")[1];
			t.britoninfo[h] = {};
			t.britoninfo[h].name = uW.techcost2[j][0];
			t.britoninfo[h].description = uW.techcost2[j][10];
		}

		for(i=0; i<Cities.numCities; i++) {
			t.alchemylabs.push(getUniqueCityBuilding(Cities.cities[i].id,11));
			t.workshops.push(getUniqueCityBuilding(Cities.cities[i].id,27));
		}
		
		var ResearchHourGlassName = {};
		for (var h=0;h<HourGlasses.length;h++) { ResearchHourGlassName[HourGlasses[h]] = uW.itemlist['i'+HourGlasses[h]].name; }

		for (var cid in Cities.byID){
			var x = Cities.byID[cid].idx+1;
			t.noAlchemy[x] = (getCityBuilding(cid, 11).count>0)?false: true;
			t.noBriton[x] = (getCityBuilding(cid, 27).count>0)?false: true;
		}

		if (Options.ResearchOptions.Toggle) AddSubTabLink('AutoResearch',t.toggleAutoResearchState, 'ResearchToggleTab');
		SetToggleButtonState('Research',Options.ResearchOptions.Running,'Research');

		var m = '<DIV class=divHeader align=center>'+tx('AUTOMATED TECHNOLOGICAL RESEARCH')+'</div>';
		m += '<div align="center">';

		m += '<table width=100% class=xtab><tr><td width=30%><INPUT id=btResearchToggle type=checkbox />&nbsp;'+tx("Add toggle button to main screen header")+'</td><td colspan=2 align=center><INPUT id=btAutoResearchState type=submit value="'+tx("AutoResearch")+' = '+ (Options.ResearchOptions.Running?'ON':'OFF')+'"></td><td width=30% align=right>'+tx('Current Research Speed')+':&nbsp;<span id=btResearchCurrTR></span>&nbsp;&nbsp;</td></tr></table>';
		m += '<table width=100% class=xtab><tr><td colspan=2 align=left><INPUT id=btResearchTR type=checkbox > '+tx('Only research when research speed is at least')+' <INPUT id=btResearchTRSpeed type=text size=3 maxlength=4 >&nbsp;%</td>';
		m += '<td colspan=2 align=right>'+tx('Current Research Cost')+':&nbsp;<span id=btResearchCostTR></span>&nbsp;&nbsp;</td></td></tr>';
		m += '<tr><TD colspan=2 align=left><INPUT id=pbResearchHelpRequest type=checkbox \>&nbsp;'+tx("Ask for help")+'</td><td colspan=2 align=right>'+tx('Minimum Gold')+':&nbsp;<input type=text size=9 maxlength=10 id=btResearchMinGold></td></tr>';
		m += '<tr><td colspan=2 align=left>&nbsp;</td><TD colspan=2 align=right>'+tx("Research Priority")+':&nbsp;'+ htmlSelector({0:tx('None'),1:tx('Shortest time'),2:tx('Combat Types')},Options.ResearchOptions.ResearchPriority, 'id=pbResearchPriority')+'</td></tr>';
		m += '</table>';

		m += '<br><DIV id=btResearchOverviewDiv style="width:'+GlobalOptions.btWinSize.x+'px;overflow-x:auto;">';

		m += '<TABLE width=100% class=xtab cellpadding=1 cellspacing=0 align=center style="font-size:'+Options.OverviewOptions.OverviewFontSize+'px;"><TR valign=bottom><td width=20>&nbsp;</td><td width=100>&nbsp;</td>';

		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD style="font-size:11px;" align=center width=100><span id="btResearchCity_'+i+'"><B>'+Cities.cities[i-1].name.substring(0, 12)+'</b></span></td>';
		}
		m += '<td>&nbsp;</td>';
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 align=right><b>'+tx('Active')+'&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><INPUT class='+i+' id="btResearchAutoCity_'+i+'" type=checkbox '+(Options.ResearchOptions.Enabled[i]?'CHECKED':'')+'></div></td>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 align=right style="padding-top:2px;vertical-align:top;padding-left:0px;"><b>'+tx('Facilities')+'&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div align=center class=xtabBorder style="height:45px;"><span id="btResearchAlchemyCity_'+i+'">&nbsp;</span></div></td>';
		}
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 align=right style="padding-top:2px;vertical-align:top;padding-left:0px;"><b>'+tx('Research')+'&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div align=center class=xtabBorder style="height:70px;"><span id="btResearchActivityCity1_'+i+'">&nbsp;</span></div></td>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 align=right style="padding-top:2px;vertical-align:top;padding-left:0px;"><b>'+tx('Briton')+'&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div align=center class=xtabBorder style="height:70px;"><span id="btResearchActivityCity2_'+i+'">&nbsp;</span></div></td>';
		}

		m += '</tr><TR align=right class="evenRow"><TD style="padding-left: 0px;"><img height=18 src="'+GoldImage+'" title="'+uW.g_js_strings.commonstr.gold+'"></td><td><div id=btTotResGold class="totalCell xtabBorder">&nbsp;</div></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div align=center class=xtabBorder><span id="btResearchGoldCity_'+i+'">&nbsp;</span></div></td>';
		}
		
		m += '</tr></table></div></div>';

		m += '<div class="divHeader" align="center">'+tx('USE AUTO-SPEEDUPS')+'</div>';

		m += '<table width=100% class=xtab><tr><td><div align=center>';

		var Boosts = '<table width=95% class=xtab align=center cellpadding=0 cellspacing=0><tr style="vertical-align:top;">';
		for (var i = 0; i < t.ItemList.length; i++) {
			Boosts += '<td width=30 rowspan=2><img height=28 src="'+IMGURL+'items/70/'+t.ItemList[i]+'.jpg" title="'+itemTitle(t.ItemList[i],true)+'\n'+tx(HourGlassHint[i])+'" /></td><td>(<span id=pbresearchUse'+t.ItemTrans[i]+'Label>' + parseIntNan(uW.ksoItems[t.ItemList[i]].count) + '</span>)</td>';
		}
		Boosts += '<td width=70 rowspan=2 align=right><INPUT id=pbResearchHelp type=submit value="'+tx('HELP')+'!"></td>';
		Boosts += '</tr><tr style="vertical-align:top;">';
		for (var i = 0; i < t.ItemList.length; i++) {
			Boosts += '<td><input type=checkbox id="pbresearch'+t.ItemTrans[i]+'" '+(Options.ResearchOptions["Use"+t.ItemTrans[i]]?"CHECKED" : "")+'></td>';
		}
		Boosts += '</tr></table></td></tr>';
		Boosts += '<tr><td><div align=center><table width=95% class=xtab align=center cellpadding=0 cellspacing=0><tr><td><input type=checkbox id=pbresearchOV >'+tx('Override above by always using')+' '+htmlSelector(ResearchHourGlassName,Options.ResearchOptions.OverrideItem, 'id=pbresearchOVItem') + ' '+tx('when more than')+' ';
		Boosts += '<INPUT style="width: 30px;text-align:right;" id="pbresearchOVHours" type=text maxlength=4 >&nbsp;'+uW.g_js_strings.timestr.timehr+'&nbsp;<INPUT style="width: 30px;text-align:right;" id="pbresearchOVMinutes" type=text maxlength=4 >&nbsp;'+uW.g_js_strings.timestr.timemin+' '+tx('remaining')+'.</td></tr></table></div></td></tr>';

		m += Boosts+'</table></div>';

		m += '<div class="divHeader" align="center">'+tx('RESEARCH LIST')+'</div>';

		m += '<div id=btResearchList style="width:'+GlobalOptions.btWinSize.x+'px;">';

		m += '<TABLE cellpadding=1 cellspacing=0 width=100% class=xtab align=center><TR><td width=50% valign=top><div align=center><b>'+tx('Research')+'</b></div>';
		m += '<table cellspacing=0 class=xtab width=100%><tr><th width=25 class=xtabHD>&nbsp;</th><th class=xtabHD>'+uW.g_js_strings.commonstr.technology+'</th><th width=40 class=xtabHD>'+tx('Next Level')+'</th><th width=40 class=xtabHD>'+tx('Auto')+'</th>';
		var r = 0;
		for (var h in t.researchinfo) {
			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }
			m += '<tr style="height:25px;" class="'+rowClass+'"><td><img src="'+IMGURL+'tech/'+h+'_s33.png" title="'+t.researchinfo[h].description+'" width=25></td><td id="btRsc_desc'+h+'" title="'+t.researchinfo[h].description+'" align=center>'+t.researchinfo[h].name+'</td><td align=center id="btRscLevel'+h+'" class=tooldesc>&nbsp;</td><td align=center><INPUT id="btRsc_Auto'+h+'" class='+h+' type=checkbox '+(Options.ResearchOptions.ResearchNumbers[h]?'CHECKED':'')+'></td></tr>';
		}
		m += '</table></td><td width=50% valign=top><div align=center><b>'+tx('Briton Research')+'</b></div>';

		m += '<table cellspacing=0 class=xtab width=100%><tr><th width=25 class=xtabHD>&nbsp;</th><th class=xtabHD>'+uW.g_js_strings.commonstr.technology+'</th><th width=40 class=xtabHD>'+tx('Next Level')+'</th><th width=40 class=xtabHD>'+tx('Auto')+'</th>';
		var r = 0;
		for (var h in t.britoninfo) {
			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }
			m += '<tr style="height:25px;" class="'+rowClass+'"><td><img src="'+IMGURL+'tech2/'+h+'_s33.png" title="'+t.britoninfo[h].description+'" width=25></td><td id="btRbt_desc'+h+'" title="'+t.britoninfo[h].description+'" align=center>'+t.britoninfo[h].name+'</td><td align=center id="btRbtLevel'+h+'" class=tooldesc>&nbsp;</td><td align=center><INPUT id="btRbt_Auto'+h+'" class='+h+' type=checkbox '+(Options.ResearchOptions.BritonNumbers[h]?'CHECKED':'')+'></td></tr>';
		}
		m += '</table>';
		m += '<div align=center><div style="position:absolute;bottom:0px;width:'+parseInt(GlobalOptions.btWinSize.x/2)+'px;"><br><hr>';
		m += '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">\
				<input type="hidden" name="cmd" value="_s-xclick">\
				<input type="hidden" name="hosted_button_id" value="8VEDPV3X9X82L">\
				<input type="image" src="https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online!">\
				<img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">\
				</form>';
		m += '<br><div class=wrap>'+tx('This additional tab has been provided free of charge for the benefit of players. Please donate to help with future support and development of this and other features')+'.<br>'+tx('Thanks')+',&nbsp;Barbarossa.<br>&nbsp;</div></div></div>';
		
		m += '</td></tr></TABLE></div></div>';

		m += '</div><br>';

		div.innerHTML = m;

		for (var i = 1; i <= Cities.numCities; i++) {
			ById('btResearchAutoCity_'+i).addEventListener('click', function(e){
				var citynum = e.target['className'];
				Options.ResearchOptions.Enabled[citynum] = e.target.checked;
				if (Options.ResearchOptions.Enabled[citynum]) {
					t.citydelay[i] = 0;
					t.timer = setTimeout(function () { t.doAutoLoop(Number(citynum));}, 0);
				}
				saveOptions();
			}, false);
		}

		ToggleOption('ResearchOptions','btResearchToggle','Toggle');

		ToggleOption('ResearchOptions','pbresearchSH','UseSH');
		ToggleOption('ResearchOptions','pbresearchKH','UseKH');
		ToggleOption('ResearchOptions','pbresearchGH','UseGH');
		ToggleOption('ResearchOptions','pbresearchMH','UseMH');
		ToggleOption('ResearchOptions','pbresearchAH','UseAH');
		ToggleOption('ResearchOptions','pbresearchRH','UseRH');
		ToggleOption('ResearchOptions','pbresearchDH','UseDH');
		ToggleOption('ResearchOptions','pbresearchEH','UseEH');
		ToggleOption('ResearchOptions','pbresearchLH','UseLH');
		ToggleOption('ResearchOptions','pbresearchOV','UseOverride');
		ChangeIntegerOption('ResearchOptions','pbresearchOVItem','OverrideItem');
		ChangeIntegerOption('ResearchOptions','pbresearchOVHours','OverrideHours');
		ChangeIntegerOption('ResearchOptions','pbresearchOVMinutes','OverrideMinutes');

		ToggleOption('ResearchOptions','pbResearchHelpRequest','help');
		ChangeOption('ResearchOptions','pbResearchPriority','ResearchPriority',t.PaintResearch);
		ChangeIntegerOption('ResearchOptions','btResearchMinGold','MinGold');

		ById('pbResearchHelp').addEventListener ('click', t.helpPop, false);

		ById('btAutoResearchState').addEventListener('click', function(){
			t.toggleAutoResearchState(this);
		}, false);

		ToggleOption('ResearchOptions','btResearchTR','ThroneCheck');
		ChangeIntegerOption('ResearchOptions','btResearchTRSpeed','ResearchSpeed');

		for (var h in t.researchinfo) {
			ById('btRsc_Auto'+h).addEventListener('change', function(e){
				var resnum = e.target['className'];
				Options.ResearchOptions.ResearchNumbers[resnum] = e.target.checked;
				saveOptions();
			}, false);
		}
		
		for (var h in t.britoninfo) {
			ById('btRbt_Auto'+h).addEventListener('change', function(e){
				var resnum = e.target['className'];
				Options.ResearchOptions.BritonNumbers[resnum] = e.target.checked;
				saveOptions();
			}, false);
		}
		
		// start autoresearch loop timer to start in 10 seconds...

		if (Options.ResearchOptions.Running) {
			t.timer = setTimeout(function () { t.doAutoLoop(1,false);}, (10 * 1000));
		}
	},

	createToolTip : function (elem) {
		var t = Tabs.Research;
		var h = elem.id.substring(10);
		var typ = elem.id.substring(2,5);

		var cost = Math.abs(CM.ThroneController.getBoundedEffect(100));
		cost = (100 - cost) / 100;
		
		if (typ=="Rsc") {
			var slot = 1;
			var briton = false;
			var nxt = parseIntNan(Seed.tech["tch"+h])+1;
			var max = uW.Research.Methods.maxLevel(h, 1);
			var name = t.researchinfo[h].name;
			var description = t.researchinfo[h].description;
			var food = parseInt(uW.techcost["tch"+h][1]*nxt*cost);
			var wood = parseInt(uW.techcost["tch"+h][2]*nxt*cost);
			var stone = parseInt(uW.techcost["tch"+h][3]*nxt*cost);
			var ore = parseInt(uW.techcost["tch"+h][4]*nxt*cost);
			var gold = parseInt(uW.techcost["tch"+h][5]*nxt*cost);
			var buildings = uW.techcost["tch"+h][8];
			var research = uW.techcost["tch"+h][9];
		}
		else {
			var slot = 2;
			var briton = true;
			var name = t.britoninfo[h].name;
			var description = t.britoninfo[h].description;
			var nxt = parseIntNan(Seed.tech2["tch"+h])+1;
			var max = uW.Research.Methods.maxLevel(h, 2);
			var food = parseInt(uW.techcost2["tch"+h][1]*nxt*cost);
			var wood = parseInt(uW.techcost2["tch"+h][2]*nxt*cost);
			var stone = parseInt(uW.techcost2["tch"+h][3]*nxt*cost);
			var ore = parseInt(uW.techcost2["tch"+h][4]*nxt*cost);
			var gold = parseInt(uW.techcost2["tch"+h][5]*nxt*cost);
			var buildings = uW.techcost2["tch"+h][8];
			var research = uW.techcost2["tch"+h][9];
		}

		var validcities = [];
		for (var i = 1; i <= Cities.numCities; i++) {
			var cityId = Cities.cities[i-1].id;
			if (t.checkRequirements(h,cityId,i,slot)) {
				validcities.push(i);
			}
		}
		
		var ingredients = '';
		if (food!=0) { ingredients += '<span>' + uW.g_js_strings.commonstr.food +' : '+addCommas(food)+'</span><br>'; }
		if (wood!=0) { ingredients += '<span>' + uW.g_js_strings.commonstr.wood +' : '+addCommas(wood)+'</span><br>'; }
		if (stone!=0) { ingredients += '<span>' + uW.g_js_strings.commonstr.stone +' : '+addCommas(stone)+'</span><br>'; }
		if (ore!=0) { ingredients += '<span>' + uW.g_js_strings.commonstr.ore +' : '+addCommas(ore)+'</span><br>'; }
		if (gold!=0) { ingredients += '<span>' + uW.g_js_strings.commonstr.gold +' : '+addCommas(gold)+'</span><br>'; }

		if (ingredients != '') ingredients = '<b>'+tx('Resources')+'</b><br>' + ingredients + '<br>';

		var researchreq = '';

		var k = Object.keys(research);
		if (research.length == null) {
			for (var i = 0; i < k.length; i++) {
				var p = k[i].split("t")[1];
				var got = parseIntNan(Seed.tech["tch"+p]);
				if (parseInt(research[k[i]][0]) == 1) {
					var req = parseInt(research[k[i]][1]);
				} else {
					var req = nxt + parseInt(research[k[i]][1]);
				}
				var span = '<span>';
				if (got<req) span = '<span style="color:#f00">';
				researchreq += span+uW.g_js_strings.commonstr.lv+req+"&nbsp;"+uW.techcost["tch"+p][0]+'</span><br>';
			}
		}

		if (researchreq != '') researchreq = '<b>'+tx('Research')+'</b><br>' + researchreq + '<br>';
		
		var buildreq = '';
		
		var k = Object.keys(buildings);
		if (buildings.length == null) {
			for (var i = 0; i < k.length; i++) {
				var p = k[i].split("b")[1];
				if (parseInt(buildings[k[i]][0]) == 1) {
					var req = parseInt(buildings[k[i]][1]);
				} else {
					var req = Math.min(uW.buildingmaxlvl[p], nxt+parseInt(buildings[k[i]][1]));
				}
				var v = [9, 15, 16, 17],
				K = [5, 9, 12, 14];
				if (K.indexOf(parseInt(h)) != -1 && v.indexOf(parseInt(p)) != -1 && parseInt(nxt) == 11) {
					req--
				} else {
					if (parseInt(p) == 11) {
						req = Math.max(req, nxt)
					}
				}

				var span = '<span>';
				buildreq += span+uW.g_js_strings.commonstr.lv+req+"&nbsp;"+uW.buildingcost["bdg"+p][0]+'</span><br>';
			}
		}

		if (buildreq != '') buildreq = '<b>'+tx('Buildings')+'</b><br>' + buildreq + '<br>';

		var cities = '';
		if (validcities.length>0) {
			for (var i=0;i<validcities.length;i++) {
				cities += '<INPUT class="castleBut castleButNon" value="'+ (validcities[i]) +'" type=submit \>';
			}
		}
		else {
			cities = '<i>'+tx('none')+'</i><br>';
		}
		
		cities = '<b>'+tx('Cities')+'</b><br>'+ cities;
		if (t.checkResearching(h,briton)!=0) {
			cities = '<i>'+tx('Researching')+'</i>';
		}
		
		if (nxt<=max) {
			jQuery('#'+elem.id).children("span").remove();
			jQuery('#'+elem.id).append('<span class="tooltip">'+researchreq+buildreq+ingredients+cities+'</span>');
		}
	},

	toggleAutoResearchState: function(obj){
		var t = Tabs.Research;
		obj = ById('btAutoResearchState');
		if (Options.ResearchOptions.Running == true) {
			Options.ResearchOptions.Running = false;
			obj.value = tx("AutoResearch = OFF");
		}
		else {
			Options.ResearchOptions.Running = true;
			obj.value = tx("AutoResearch = ON");
			t.citydelay = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0};
			t.timer = setTimeout(function () { t.doAutoLoop(1,false);}, 0);
		}
		saveOptions();
		SetToggleButtonState('Research',Options.ResearchOptions.Running,'Research');
		t.PaintOverview();
	},

	show: function (init) {
		var t = Tabs.Research;

		t.PaintOverview();
		t.PaintResearch();
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
	},

	helpPop : function (){
		var t = Tabs.Research;
		var helpText = '<br>'+tx("Using Speedups for Research");
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

		var pop = new CPopup ('BotHelp', 0, 0, 500, 420, true);
		pop.centerMe (mainPop.getMainDiv());
		pop.getMainDiv().innerHTML = helpText;
		pop.getTopDiv().innerHTML = '<CENTER><B>'+tx("PowerBot+ Help")+': '+tx("Speedups")+'</b></center>';
		pop.show (true);
	},

	EverySecond : function () {
		var t = Tabs.Research;

		t.LoopCounter = t.LoopCounter + 1;

		if (t.LoopCounter%2==0) { // refresh research speed and overview display every 2 seconds
			t.researchspeed = Math.floor(equippedthronestats(80));
			t.researchcost = Math.floor(equippedthronestats(100));
			if (tabManager.currentTab.name == 'Research' && Options.btWinIsOpen){
				t.PaintOverview();
			}
		}

		if (t.LoopCounter >= 5) { // refresh alchemy labs and workshops display every 5 seconds
			t.LoopCounter = 0;
			for(i=0; i<Cities.numCities; i++) {
				t.alchemylabs[i] = getUniqueCityBuilding(Cities.cities[i].id,11); 
				t.workshops[i] = getUniqueCityBuilding(Cities.cities[i].id,27); 
			}
			if (tabManager.currentTab.name == 'Research' && Options.btWinIsOpen){ t.PaintResearch(); }
		}
	},

	PaintOverview : function () {
		var t = Tabs.Research;

		t.Squire = parseIntNan(Seed.items.i1);
		t.Knight = parseIntNan(Seed.items.i2);
		t.Guinevere = parseIntNan(Seed.items.i3);
		t.Morgana = parseIntNan(Seed.items.i4);
		t.Arthur = parseIntNan(Seed.items.i5);
		t.Merlin = parseIntNan(Seed.items.i6);
		t.Divine = parseIntNan(Seed.items.i7);
		t.Epic = parseIntNan(Seed.items.i8);
		t.Legendary = parseIntNan(Seed.items.i10);

		ById('pbresearchUseSHLabel').innerHTML = t.Squire;
		ById('pbresearchUseKHLabel').innerHTML = t.Knight;
		ById('pbresearchUseGHLabel').innerHTML = t.Guinevere;
		ById('pbresearchUseMHLabel').innerHTML = t.Morgana;
		ById('pbresearchUseAHLabel').innerHTML = t.Arthur;
		ById('pbresearchUseRHLabel').innerHTML = t.Merlin;
		ById('pbresearchUseDHLabel').innerHTML = t.Divine;
		ById('pbresearchUseEHLabel').innerHTML = t.Epic;
		ById('pbresearchUseLHLabel').innerHTML = t.Legendary;

		var now = unixTime();
		t.totgold=0;
		var q;

		for (var i = 0; i < Cities.numCities; i++) {
			citynum = i+1;
			cityId = Cities.cities[i].id;

			var citygold = parseIntNan(Seed.citystats["city" + cityId]['gold'][0]);
			t.totgold = t.totgold+citygold;
			var span = '<span>';
			if (citygold < Options.ResearchOptions.MinGold) { span = '<span class=boldRed>'; }
			ById("btResearchGoldCity_"+citynum).innerHTML = span+addCommas(citygold)+'</span>';
			
			var blvl = [];
			for (bpos in Seed.buildings["city"+cityId]) {
				var btype = parseInt(Seed.buildings["city"+cityId][bpos][0]);
				if (btype == 11 || btype == 27) {
					var bname = uW.buildingcost['bdg' + Seed.buildings["city"+cityId][bpos][0]][0];
					blvl.push(bname+'<br />(Lv.' + Seed.buildings["city"+cityId][bpos][1]+')');
				}
			}
			var str = '';
			if (blvl.join('<br>')=='') { str = '<SPAN class=boldRed><B>'+tx('No')+'<br>'+uW.buildingcost.bdg11[0]+'</b></span>'; }
			else { str = blvl.join('<br>'); }
			ById('btResearchAlchemyCity_'+citynum).innerHTML = str;

			// paint currently researching
			var q1 = Seed.queue_tch["city"+cityId];
			var u = '';
			if (q1 != null && q1.length > 0) {
				u = q1[0];
				str = '<table cellpadding=0 cellspacing=0 width=100% style="padding-right:0px;"><tr><td class=xtab align=center >'+uW.techcost["tch"+u[0]][0]+'<br>('+uW.g_js_strings.commonstr.level+'&nbsp;'+u[1]+')<br />';
				if (parseInt(u[3]) > now) {
					str += '('+timestr(parseInt(u[3])-now)+')</td></tr>';
					var Speedups = '';
					Speedups += t.paintSpeedup(cityId,u[0],1,1,t.Squire);
					Speedups += t.paintSpeedup(cityId,u[0],1,2,t.Knight);
					Speedups += t.paintSpeedup(cityId,u[0],1,3,t.Guinevere);
					Speedups += t.paintSpeedup(cityId,u[0],1,4,t.Morgana);
					Speedups += t.paintSpeedup(cityId,u[0],1,5,t.Arthur);
					Speedups += '</tr><tr>';
					Speedups += t.paintSpeedup(cityId,u[0],1,6,t.Merlin);
					Speedups += t.paintSpeedup(cityId,u[0],1,7,t.Divine);
					Speedups += t.paintSpeedup(cityId,u[0],1,8,t.Epic);
					Speedups += t.paintSpeedup(cityId,u[0],1,10,t.Legendary);

					if (Speedups != "") Speedups = '<tr><td style="padding-right:0px;padding-bottom:2px;"><table align=left cellspacing=0 cellpadding=0><tr>' + Speedups + '</tr></table></td></tr>';
					str = str+Speedups+'</table>';
				} else {
					str += '(done)';
					if (cityId != uW.currentcityid) {
						Seed.queue_tch["city"+cityId].splice(0,1);
					}
				}
				str += '</td></tr></table>';
			} else {
				if (t.citydelay[citynum] > 0) { str = '<SPAN class=boldRed><B>'+tx('Busy')+'!</b></span>'; }
				else {
					if (Options.BuildOptions && Options.BuildOptions.AscensionReady[citynum]) { str = '<SPAN>'+tx('Ascension')+'!</span>'; }
					else { str = ''; }
				}
			}
			ById('btResearchActivityCity1_'+citynum).innerHTML = str;

			// briton research
			var q2 = Seed.queue_tch2["city"+cityId];
			var u = '';
			if (q2 != null && q2.length > 0) {
				u = q2[0];
				str = '<table cellpadding=0 cellspacing=0 width=100% style="padding-right:0px;"><tr><td class=xtab align=center >'+uW.techcost2["tch"+u[0]][0]+'<br>('+uW.g_js_strings.commonstr.level+'&nbsp;'+u[1]+')<br />';
				if (parseInt(u[3]) > now) {
					str += '(' + timestr(parseInt(u[3]) - now) + ')</td></tr>';
					var Speedups = '';
					Speedups += t.paintSpeedup(cityId,u[0],2,1,t.Squire);
					Speedups += t.paintSpeedup(cityId,u[0],2,2,t.Knight);
					Speedups += t.paintSpeedup(cityId,u[0],2,3,t.Guinevere);
					Speedups += t.paintSpeedup(cityId,u[0],2,4,t.Morgana);
					Speedups += t.paintSpeedup(cityId,u[0],2,5,t.Arthur);
					Speedups += '</tr><tr>';
					Speedups += t.paintSpeedup(cityId,u[0],2,6,t.Merlin);
					Speedups += t.paintSpeedup(cityId,u[0],2,7,t.Divine);
					Speedups += t.paintSpeedup(cityId,u[0],2,8,t.Epic);
					Speedups += t.paintSpeedup(cityId,u[0],2,10,t.Legendary);

					if (Speedups != "") Speedups = '<tr><td style="padding-right:0px;padding-bottom:2px;"><table align=left cellspacing=0 cellpadding=0><tr>' + Speedups + '</tr></table></td></tr>';
					str = str+Speedups+'</table>';
				} else {
					str += '(done)';
					if (cityId != uW.currentcityid) {
						Seed.queue_tch2["city"+cityId].splice(0,1);
					}
				}
				str += '</td></tr></table>';
			} else {
				if (t.citydelay[citynum] > 0) { str = '<SPAN class=boldRed><B>'+tx('Busy')+'!</b></span>'; }
				else {
					if (Options.BuildOptions && Options.BuildOptions.AscensionReady[citynum]) { str = '<SPAN>'+tx('Ascension')+'!</span>'; }
					else { str = ''; }
				}
			}
			ById('btResearchActivityCity2_'+citynum).innerHTML = str;
		}

		ById('btTotResGold').innerHTML = addCommas(t.totgold);
		
		if (Options.ResearchOptions.ThroneCheck && (t.researchspeed < Number(Options.ResearchOptions.ResearchSpeed))) {
			ts = '<span class=boldRed><b>'+t.researchspeed+'%</b></span>';
		}
		else { ts = t.researchspeed+'%'; }
		ById("btResearchCurrTR").innerHTML = ts;
		ById("btResearchCostTR").innerHTML = t.researchcost+'%';
	},

	PaintResearch : function () {
		var t = Tabs.Research;

		for (var h in t.researchinfo) {
			var nxt = parseIntNan(Seed.tech["tch"+h])+1;
			var csty = '<div>';
			if (nxt > uW.Research.Methods.maxLevel(h, 1)) {
				nxt = tx('Max');
				csty = '<div style="color:#080;font-weight:bold">';
				ById('btRsc_Auto'+h).style.display = 'none';
			}
			if (t.checkResearching(h,false)!=0) {
				nxt = tx('Researching');
				csty = '<div style="color:#800;font-weight:bold">';
			}
			ById('btRscLevel'+h).innerHTML = csty+nxt+'</div>';
		}

		for (var h in t.britoninfo) {
			var nxt = parseIntNan(Seed.tech2["tch"+h])+1;
			var csty = '<div>';
			if (nxt > uW.Research.Methods.maxLevel(h, 2)) {
				nxt = tx('Max');
				csty = '<div style="color:#080;font-weight:bold">';
				ById('btRbt_Auto'+h).style.display = 'none';
			}
			if (t.checkResearching(h,true)!=0) {
				nxt = tx('Researching');
				csty = '<div style="color:#800;font-weight:bold">';
			}
			ById('btRbtLevel'+h).innerHTML = csty+nxt+'</div>';
		}

		var cItems = ById('btResearchList').getElementsByClassName('tooldesc');
		for (var i = 0; i < cItems.length; i++) { t.createToolTip(cItems[i]); }
	},

	getResearchTime : function (cityId,tech,type) {
		var t = Tabs.Research;
		var L = 0;
		var n = Seed.knights["city" + cityId];
		if (n) {
			n = n["knt" + Seed.leaders["city" + cityId].intelligenceKnightId];
			if (n) {
				L = parseInt(n.intelligence);
				L = ((parseInt(n.intelligenceBoostExpireUnixtime) - uW.unixtime()) > 0) ? (L * 1.25) : L
			}
		}
		var D = 0;
		if (type==1) {
			var D = parseIntNan(Seed.tech["tch"+tech]) + 1;
			var base = parseInt(uW.techcost["tch"+tech][7]);
		}
		if (type==2) {
			var D = parseIntNan(Seed.tech2["tch"+tech]) + 1;
			var base = parseInt(uW.techcost2["tch"+tech][7]);
		}
		if (type==1 && tech != 17) { D = Math.min(D, 11); }
		var y = Math.pow(2, (D - 1));
		var h = CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().SCIENTIFIC_METHODOLOGIES, cityId, uWCloneInto({}));
		if (typeof C !== "number" || C !== 2 || typeof h !== "number") { h = 1; }
		var trBoost = CM.ThroneController.effectBonus(80);
		if (trBoost > Number(CM.thronestats.boosts.ResearchSpeed.Max)) {
			trBoost = Number(CM.thronestats.boosts.ResearchSpeed.Max);
		}
		var B = parseInt(base * y * h * (1 / (1 + 0.005 * L)));
		B = Math.round(B / (1 + trBoost / 100));

		return B;
	},

	checkResearching : function (id,briton) {
		var rslt = 0;
		var t = Tabs.Research;
		if (briton) { var qres = Seed.queue_tch2; }
		else { var qres = Seed.queue_tch; }
		
		if (qres) {
			for (var i = 0; i < Cities.numCities; i++) {
				citynum = i+1;
				cityId = Cities.cities[i].id;
				var q1 = qres["city"+cityId];
				var u = '';
				if (q1 != null && q1.length > 0) {
					u = q1[0];
					var now = unixTime();
					if (parseInt(u[3]) > now) {
						if (u[0]==id) {
							rslt = citynum;
							break;
						}
					}
				}
			}
		}
		return rslt;
	},
	
	paintSpeedup : function (cityId, qitem, i, item, count) {
		var t = Tabs.Research;
		var n = '';
		if (count>0) {
			n += '<td class=xtab style="padding-right:2px"><a onClick="speedupResearch('+cityId+','+item+','+qitem+','+i+')"><img height=18 class="btTop btFaint" src="'+IMGURL+'items/70/'+item+'.jpg" title="'+itemTitle(item)+'"></a></td>';
		}
		return n;
	},

	doAutoLoop : function (idx,briton) {
		var t = Tabs.Research;
		clearTimeout(t.timer);
		if (!Options.ResearchOptions.Running) return;

		var cityId = Cities.cities[idx-1].id;
		if (idx==1) { t.loopaction = false; } // reset loop action indicator for first city
		t.autodelay = 0; // no delay if no action taken!

		// first check if city is idle (or busy)

		var now = unixTime();
		if (briton) { var qres = Seed.queue_tch2["city"+cityId]; var slot=2; }
		else { var qres = Seed.queue_tch["city"+cityId]; var slot=1; }
		var len = qres.length;
		if ((len==0 || (qres[len-1][3] - now) < 0)) {
			if (!Options.ResearchOptions.ThroneCheck || (t.researchspeed >= Options.ResearchOptions.ResearchSpeed)) { 
				var ascensionok = (!Options.BuildOptions || !Options.BuildOptions.AscensionReady[idx]);
				if (Options.ResearchOptions.Enabled[idx] && ascensionok) {
					if (t.citydelay[idx] > 0) { t.citydelay[idx]--; } // city being delayed due to error, reduce delay number and skip city
					else {
						var AlchemyLevel = t.alchemylabs[idx-1].maxLevel;
						if (briton) { AlchemyLevel = t.workshops[idx-1].maxLevel; }
						if (AlchemyLevel > 0) {
							t.eventSelectResearch(cityId,idx,slot);
						}
					}
				}
			}
		}
		else {
			if (len!=0) {
				t.autoSpeedup (cityId,qres[len-1],slot);
			}
		}
		
		if (!briton) {
			var BritWorkshop = false;
			if (Seed.cityData.city[cityId].isPrestigeCity && parseIntNan(Seed.cityData.city[cityId].prestigeInfo.prestigeType)==3) { // briton
				BritWorkshop = (getUniqueCityBuilding(cityId,27).maxLevel>0);
			}
			if (BritWorkshop) { // check briton research
				t.timer = setTimeout(function () { t.doAutoLoop(idx,true); }, (t.autodelay * 1000));
				return;
			}
		}
		
		if (idx == Cities.numCities) {
			if (!t.loopaction) { t.autodelay = t.intervalSecs; } // if no action this loop, apply delay anyway...
			t.timer = setTimeout(function () { t.doAutoLoop(1,false); }, (t.autodelay * 1000));
		}
		else {
			t.timer = setTimeout(function () { t.doAutoLoop(idx+1,false); }, (t.autodelay * 1000));
		}
	},

	eventSelectResearch : function (cityId,idx,slot) {
		var t = Tabs.Research;

		t.tableau = [];

		if (slot==1) {
			for (var h in Options.ResearchOptions.ResearchNumbers) {
				if (t.checkRequirements(h,cityId,idx,slot)) {
					t.tableau.push({tid:h,combat:t.CombatOrder.indexOf(parseInt(h)),time:t.getResearchTime(cityId,h,1)});
				}
			}
		}
		else {
			for (var h in Options.ResearchOptions.BritonNumbers) {
				if (t.checkRequirements(h,cityId,idx,slot)) {
					t.tableau.push({tid:h,combat:t.BritonCombatOrder.indexOf(parseInt(h)),time:t.getResearchTime(cityId,h,2)});
				}
			}
		}

		if (t.tableau.length == 0) return ; // nothing can be researched

		// sort tableau
		
		if (parseIntNan(Options.ResearchOptions.ResearchPriority)==1) {
			t.tableau.sort(function(a, b){ var x = a.time - b.time; return x; });
		}
		if (parseIntNan(Options.ResearchOptions.ResearchPriority)==2) {
			t.tableau.sort(function(a, b){ var x = a.combat - b.combat; return x; });
		}

		// do research!

		t.autodelay = t.intervalSecs;
		t.loopaction = true;
		t.Research(cityId, idx, slot, t.tableau[0].tid);
	},

	checkRequirements : function(h,cityId,idx,slot) {
		var t = Tabs.Research;
		
		if (slot==1) {
			var nxt = parseIntNan(Seed.tech["tch"+h])+1;
			var res = uW.techcost["tch"+h];
		}
		if (slot==2) {
			var nxt = parseIntNan(Seed.tech2["tch"+h])+1;
			var res = uW.techcost2["tch"+h];
		}

		var Buildings = getCityBuildings(cityId);
		
		var valid = (t.checkResearching(h,(slot==2))==0);
		if (valid) {
			if (nxt <= uW.Research.Methods.maxLevel(h, slot)) {
				var ResearchOK = true;
				var research = res[9];
					
				var k = Object.keys(research);
				if (research.length == null) {
					for (var i = 0; i < k.length; i++) {
						var p = k[i].split("t")[1];
						var got = parseIntNan(Seed.tech["tch"+p]);
						if (parseInt(research[k[i]][0]) == 1) {
							var req = parseInt(research[k[i]][1]);
						} else {
							var req = nxt + parseInt(research[k[i]][1]);
						}
						if (got<req) {
							ResearchOK = false;
							break;
						}
					}
				}

				if (ResearchOK) {
					var ResourceOK = true;
					var cost = Math.abs(CM.ThroneController.getBoundedEffect(100));
					cost = (100 - cost) / 100;
					
					var AvailGold = parseIntNan(Seed.citystats["city" + cityId].gold[0]) - parseIntNan(Options.ResearchOptions.MinGold);
					if (AvailGold > 0) {
						if ((res[1]*nxt*cost) > parseIntNan(Seed.resources["city" + cityId]['rec1'][0]) / 3600) ResourceOK = false;
						if ((res[2]*nxt*cost) > parseIntNan(Seed.resources["city" + cityId]['rec2'][0]) / 3600) ResourceOK = false;
						if ((res[3]*nxt*cost) > parseIntNan(Seed.resources["city" + cityId]['rec3'][0]) / 3600) ResourceOK = false;
						if ((res[4]*nxt*cost) > parseIntNan(Seed.resources["city" + cityId]['rec4'][0]) / 3600) ResourceOK = false;
						if ((res[5]*nxt*cost) > parseIntNan(Seed.citystats["city" + cityId]['gold'][0])) ResourceOK = false;
					}
					else {
						ResourceOK = false;
					}
					
					if (ResourceOK) {
						var BuildingsOK = true;
						var buildings = res[8];
						var k = Object.keys(buildings);
						if (buildings.length == null) {
							for (var i = 0; i < k.length; i++) {
								var p = k[i].split("b")[1];
								var got = Buildings[p].maxLevel;
								if (parseInt(buildings[k[i]][0]) == 1) {
									var req = parseInt(buildings[k[i]][1]);
								} else {
									var req = Math.min(uW.buildingmaxlvl[p], nxt+parseInt(buildings[k[i]][1]));
								}
								var v = [9, 15, 16, 17],
								K = [5, 9, 12, 14];
								if (K.indexOf(parseInt(h)) != -1 && v.indexOf(parseInt(p)) != -1 && parseInt(nxt) == 11) {
									req--
								} else {
									if (parseInt(p) == 11) {
										req = Math.max(req, nxt)
									}
								}
								if (got<req) {
									BuildingsOK = false;
									break;
								}
							}
						}
						if (BuildingsOK) {
							return true;
						}
					}
				}
			}
		}
		return false;
	},
	
	autoSpeedup: function (cityId,q,slot) {
		var t = Tabs.Research;
		var now = unixTime();
		var item = 0;
		totTime = q[3] - now;

		if (totTime > 0) {
			if (Options.ResearchOptions.UseOverride && Options.ResearchOptions.OverrideItem != 0) {
				var THRESHOLD_SECONDS = (parseIntNan(Options.ResearchOptions.OverrideMinutes)*60)+(parseIntNan(Options.ResearchOptions.OverrideHours)*60*60);
				if (totTime >= THRESHOLD_SECONDS && uW.ksoItems[Options.ResearchOptions.OverrideItem].count > 0) { item = Options.ResearchOptions.OverrideItem; }
			}
			if (item==0 && totTime >= HourGlassThreshold[8] && Options.ResearchOptions.UseLH && uW.ksoItems[10].count > 0) { item = 10; }
			if (item==0 && totTime >= HourGlassThreshold[7] && Options.ResearchOptions.UseEH && uW.ksoItems[8].count > 0) { item = 8; }
			if (item==0 && totTime >= HourGlassThreshold[6] && Options.ResearchOptions.UseDH && uW.ksoItems[7].count > 0) { item = 7; }
			if (item==0 && totTime >= HourGlassThreshold[5] && Options.ResearchOptions.UseRH && uW.ksoItems[6].count > 0) { item = 6; }
			if (item==0 && totTime >= HourGlassThreshold[4] && Options.ResearchOptions.UseAH && uW.ksoItems[5].count > 0) { item = 5; }
			if (item==0 && totTime >= HourGlassThreshold[3] && Options.ResearchOptions.UseMH && uW.ksoItems[4].count > 0) { item = 4; }
			if (item==0 && totTime >= HourGlassThreshold[2] && Options.ResearchOptions.UseGH && uW.ksoItems[3].count > 0) { item = 3; }
			if (item==0 && totTime >= HourGlassThreshold[1] && Options.ResearchOptions.UseKH && uW.ksoItems[2].count > 0) { item = 2; }
			if (item==0 && totTime >= HourGlassThreshold[0] && Options.ResearchOptions.UseSH && uW.ksoItems[1].count > 0) { item = 1; }
		}

		if (item != 0) {
			t.autodelay = t.intervalSecs;
			t.loopaction = true;
			t.speedupResearch(cityId,item,q[0],slot,true);
		}
	},

	speedupResearch : function (cityId,item,cid,slotNum,noretry) {
		var t = Tabs.Research;
		var citynum = Cities.byID[cityId].idx+1;
		jQuery('#btResearchCity_'+citynum).css('color', 'magenta');

		var ajaxaddress = "ajax/speedupResearch.php";
		if (slotNum == 2) { ajaxaddress = "ajax/speedupResearchWorkshop.php"; }
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.iid = item;
		params.tid = cid;
		if (slotNum == 2) { params.workshop = true; }
		new MyAjaxRequest(uW.g_ajaxpath + ajaxaddress + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var reduced = CM.intelligentOrdering.getReduceTime(item);
					Seed.items["i" + item] = parseInt(Seed.items["i" + item]) - 1;
					uW.ksoItems[item].subtract();
					var qloc = 0;
					var timered = 0;

					if (slotNum == 1) {
						var utstart = parseInt(Seed.queue_tch["city" + cityId][0][2]);
						var uteta = parseInt(Seed.queue_tch["city" + cityId][0][3]);
						var queue = Seed.queue_tch;
					}
					if (slotNum == 2) {
						var utstart = parseInt(Seed.queue_tch2["city" + cityId][0][2]);
						var uteta = parseInt(Seed.queue_tch2["city" + cityId][0][3]);
						var queue = Seed.queue_tch2;
					}

					timered = SpeedupArray[parseInt(item) - 1];

					if (slotNum == 1) {
						Seed.queue_tch["city" + cityId][0][2] = utstart - timered;
						Seed.queue_tch["city" + cityId][0][3] = uteta - timered;
					}
					if (slotNum == 2) {
						Seed.queue_tch2["city" + cityId][0][2] = utstart - timered;
						Seed.queue_tch2["city" + cityId][0][3] = uteta - timered;
					}

					if (Seed.player.usedSpeedup && Seed.player.usedSpeedup == 0) {
						Seed.player.usedSpeedup = 1;
					}

					if (cityId == uW.currentcityid) uW.update_queue();
				}
				else {
					if (rslt.msg) {
						actionLog(Cities.byID[cityId].name+': Research speedup failed ('+rslt.msg+')','RESEARCH');
					}
					else {
						actionLog(Cities.byID[cityId].name+': Research speedup failed ('+rslt.error_code+')','RESEARCH');
					}
				}
				jQuery('#btResearchCity_'+citynum).css('color', 'rgb('+HEXtoRGB(Options.Colors.PanelText).r+','+HEXtoRGB(Options.Colors.PanelText).g+','+HEXtoRGB(Options.Colors.PanelText).b+')');
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name+': Research speedup failed (AJAX Error)','RESEARCH');
				jQuery('#btResearchCity_'+citynum).css('color', 'rgb('+HEXtoRGB(Options.Colors.PanelText).r+','+HEXtoRGB(Options.Colors.PanelText).g+','+HEXtoRGB(Options.Colors.PanelText).b+')');
			},
		},noretry);
	},
	
	Research : function (cityId, idx, slotNum, h) {
		var t = Tabs.Research;
		var citynum = Cities.byID[cityId].idx+1;
		
		// double check research requirements?

		var lvl = parseIntNan(Seed.tech["tch"+h])+1;
		if (slotNum == 2) { lvl = parseIntNan(Seed.tech2["tch"+h])+1; }
		var saveCityId = uW.currentcityid;
		uW.currentcityid = cityId;
		var chk = uW.checkreq("tch", h, lvl, (slotNum==2)?slotNum:undefined); //check if all requirements are met
		uW.currentcityid = saveCityId;
		for (var c = 0; c < chk[3].length; c++) {
			if (chk[3][c] == 0) {
				t.citydelay[citynum] = 10; // delay 10 loops
				if (slotNum==2) {
					actionLog(Cities.byID[cityId].name+': Final researcb check failed ('+uW.techcost2['tch'+h][0]+' Level '+lvl+')','RESEARCH');
				}
				else {
					actionLog(Cities.byID[cityId].name+': Final researcb check failed ('+uW.techcost['tch'+h][0]+' Level '+lvl+')','RESEARCH');
				}
				return;
			}
		}
		
		jQuery('#btResearchCity_'+citynum).css('color', 'green');

		var ajaxaddress = "ajax/research.php";
		if (slotNum == 2) { ajaxaddress = "ajax/researchWorkshop.php"; }
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.lv = lvl;
		params.tid = h;
		params.pay_for_an_additional_queue = 0; 

		new MyAjaxRequest(uW.g_ajaxpath + ajaxaddress + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var time = rslt.timeNeeded;
					if (slotNum==2) {
						actionLog(Cities.byID[cityId].name+': Researching '+uW.techcost2['tch'+h][0]+' Level '+params.lv,'RESEARCH');
					}
					else {
						actionLog(Cities.byID[cityId].name+': Researching '+uW.techcost['tch'+h][0]+' Level '+params.lv,'RESEARCH');
					}
					t.AddSeedQueueEntry(cityId, h, params.lv, uW.unixtime(), uW.unixtime() + time, 0, time, slotNum);

					if (Options.ResearchOptions.help && time > 59) t.bot_gethelp(h, slotNum, cityId, time, 1);

					if (params.cid == uW.currentcityid) {
						if (jQuery("#queue_head_research").hasClass("sel") ) {
							uW.queue_changetab_research();
						}
					}
				} else {
					if (rslt.msg) { actionLog(Cities.byID[cityId].name+': '+rslt.msg,'RESEARCH'); }
					else { actionLog(Cities.byID[cityId].name+': Research failed ('+rslt.error_code+')','RESEARCH'); }
					
					if (rslt.error_code==111) { // already researching
						if (slotNum==2) {
							uW.techcost2["tch666"] = uWCloneInto(["Researching...", 0, 0, 0, 0, 0, 0, 0, [], [], ""]);
						}
						else {
							uW.techcost2["tch666"] = uWCloneInto(["Researching...", 0, 0, 0, 0, 0, 0, 0, [], [], ""]);
						}
						t.AddSeedQueueEntry(cityId, 666, 666, uW.unixtime(), uW.unixtime() + 90, 0, 90, slotNum);
					}
				}
				jQuery('#btResearchCity_'+citynum).css('color', 'rgb('+HEXtoRGB(Options.Colors.PanelText).r+','+HEXtoRGB(Options.Colors.PanelText).g+','+HEXtoRGB(Options.Colors.PanelText).b+')');
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name+': Research failed (AJAX Error)','RESEARCH');
				jQuery('#btResearchCity_'+citynum).css('color', 'rgb('+HEXtoRGB(Options.Colors.PanelText).r+','+HEXtoRGB(Options.Colors.PanelText).g+','+HEXtoRGB(Options.Colors.PanelText).b+')');
			},
		},true);
	},
	
	AddSeedQueueEntry : function(cityId,rtype,lvl,start,end,zero,duration,slotNum) {
		var t = Tabs.Research;

		var k = uWCloneInto([]);
		k.push(rtype);
		k.push(lvl);
		k.push(start);
		k.push(end);
		k.push(zero);
		k.push(duration);
		if (slotNum==1) {
			Seed.queue_tch["city"+cityId].push(k);
		}
		if (slotNum==2) {
			Seed.queue_tch2["city"+cityId].push(k);
		}
	},
	
	bot_gethelp: function (f, slot, cid, time, retry) {
		var t = Tabs.Research;
		if (retry>3) return; //dont want to get stuck in a loop of failures
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.rid = f;
		params.rtype = null;
		if (slot==2) { params.rtype = 1; }
		params.ctrl = 'AskForHelp';
		params.action = 'getHelpData';
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok && rslt.data) {
					uW.handleHelpCallback(uWCloneInto(rslt.data));
					//only post research to FB if they take at least half an hour
					if (time > 1800) {
						var a = Seed.queue_tch["city" + cid];
						if (slot==2) a = Seed.queue_tch2["city" + cid];
						var d = 0;
						for (var c = 0; c < a.length; c++) {
							if (parseInt(a[c][2]) == parseInt(f)) {
								d = parseInt(a[c][1]);
								break
							}
						}
						var b = new Array();
						b.push(["REPLACE_LeVeLiD", d]);
						b.push(["REPLACE_AsSeTiD", f]);
						if (slot==2) {
							b.push(["REPLACE_TeChNaMe", uW.techcost2["tch"+f][0]]);
							var profileid = 400;
						}
						else {
							b.push(["REPLACE_TeChNaMe", uW.techcost["tch"+f][0]]);
							var profileid = 107;
						}
						uW.common_postToProfile(profileid, uWCloneInto(b));
					}
				}
				else {
					if (rslt.errorMsg) { actionLog(Cities.byID[cid].name+': '+rslt.errorMsg,'RESEARCH'); }
					else { actionLog(Cities.byID[cid].name+': Research help request failure','RESEARCH'); }
				}
			},
			onFailure: function () {
				actionLog(Cities.byID[cid].name+': Research help request failure','RESEARCH');
				t.bot_gethelp(f, slot, cid, time, retry+1);
				return;
			},
		},true);
	},
	
}
