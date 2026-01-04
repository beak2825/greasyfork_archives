/***Reference Tab***/
Tabs.Reference = {
	tabOrder: 1120,
	tabLabel: 'Reference',
	unitsaccuracy: [],
	z: null,
	keyz: null,
	myDiv: null,
	UniqueTRItems : null,
	UniqueCHItems : null,
	MultiFaction : [30230,30231,30240,30241,30250,30251,30261,30262,30263,30264,30265,30266],
	TechBoosts : {1:0.1,2:0.1,3:0.1,4:0.1,5:0.1,6:0,8:0.05,9:0.05,10:0.1,11:0.1,12:0.05,13:0.05,14:0.1,15:0.05,16:0.1,17:0.01},
	BritonTechBoosts : {1:0.05,2:0.01,3:0.05,4:0.05,5:0.02,6:0.02},
	JewelQuality: [],
	chSorted : false,
	chSortArray : [],
	trSorted : false,
	trSortArray : [],
	GloryResetTime : 0,

	init: function (div) {
		var t = Tabs.Reference;

		uWExportFunction('btShowAccuracyPop',Tabs.Reference.AccuracyPop);

		t.z = CM.WorldSettings.getSettingAsObject("UNIT_ACCURACY_MODIFIER");
		t.keyz = uW.Object.keys(uWCloneInto(t.z));

		// accuracy matrix only has certain troops and defences

		t.unitsaccuracy = [];
		for (var ui=0;ui<t.keyz.length;ui++) {
			if (t.keyz[ui]) {
				var i = CM.UNIT_TYPES[t.keyz[ui]];
				if (i==null) {
					if (t.keyz[ui]=="FORTIFICATION_TYPE_ARCHERTOWER") { i = 53; }
					else if (t.keyz[ui]=="FORTIFICATION_TYPE_GREEK_FIRE") { i = 63; }
					else if (t.keyz[ui]=="VIRTUAL_UNIT_TYPE_DEFENSIVE_TOWER") { i = 100; }
					else if (t.keyz[ui]=="VIRTUAL_UNIT_TYPE_DEFENSIVE_TOWER_REDOUBT") { i = 99; }
					else { i = 0; } // no idea what this is, but we need it in the array
				}
				t.unitsaccuracy.push(i);
			}
		}

		for (var J=0;J<=4;J++) {
			t.JewelQuality.push(uW.g_js_strings.jewel["quality_"+J]);
		}

		var UniqueItems = {};
		eval(GM_getResourceText("champion_uniques"));
		t.UniqueCHItems = JSON.parse(JSON.stringify(UniqueItems));

		for (var i=28001;i<29000;i++) {
			if (!uW.itemlist['i'+i]) continue;
			if (!t.UniqueCHItems[i]) {
				t.UniqueCHItems[i] = {Id:i,Name:uW.itemlist['i'+i].name, Effects:[],Faction:0,Type:0};
			}
			var CHCard = t.BuildChampCard(i,0);
			uW.ksoItems[i].description = t.DisplayCHCard(CHCard,false);
		}

		UniqueItems = {};
		UniqueItems = CM.WorldSettings.getSettingAsObject("TR_UNIQUE_ITEMS");
		for (var k in UniqueItems) {
			var throne_item = UniqueItems[k];
			if (parseInt(throne_item.Id) < 29000) delete UniqueItems[k];
			throne_item.Name = uW.itemlist["i"+throne_item.Id].name;
			if (t.MultiFaction.indexOf(parseInt(throne_item.Id))!=-1) {
				throne_item.Name = throne_item.Name + ' ('+uW.g_js_strings.commonstr[cardFaction[throne_item.Faction-1]]+')';
			}
		}
		t.UniqueTRItems = JSON.parse(JSON.stringify(UniqueItems));
		for (var i in t.UniqueTRItems) {
			if (!uW.itemlist['i'+i]) continue;
			var TRCard = t.BuildThroneCard(i,1);
			uW.ksoItems[i].description = t.DisplayTRCard(TRCard,false);
		}

		t.myDiv = div;

		var ag = ByCl('avatarGlory')[0];
		if (ag) {
			ag.addEventListener('mouseover',t.checkGloryReset,false);
			t.checkGloryReset();
		}
	},

	checkGloryReset : function () {
		var t = Tabs.Reference;
		var now = unixTime();
		var ag = ByCl('avatarGlory')[0];
		if (ag) {
			if (t.GloryResetTime < now) {
				var params = uW.Object.clone(uW.g_ajaxparams);
				params.perPage = 10;
				params.type = "glory";
				params.page = 'X';
				new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserLeaderboard.php" + uW.g_ajaxsuffix, {
					method: "post",
					parameters: params,
					onSuccess: function (rslt) {
						if (rslt.gloryResetTime) {
							t.GloryResetTime = rslt.gloryResetTime;
							ag.title = tx('Glory resets in '+timestr(t.GloryResetTime-now));
						}
					},
				});
			}
			else {
				ag.title = tx('Glory resets in '+timestr(t.GloryResetTime-now));
			}
		}
	},

	show: function () {
		var t = Tabs.Reference;
		var troopa, troopb;

		dt = new Date();
		dt.setTime(Seed.player.datejoinUnixTime * 1000);

		m = '<div>';
		m += '<div class="divHeader" align="center">'+tx('REFERENCE SECTION')+'</div>';
		m += '<div align="center">';
		m += '<table align=center>';
		m += '<TR><TD class=xtab>&nbsp;</td><td align=right class=xtab>'+uW.g_js_strings.commonstr.nametx+':</td><td class=xtab><b>'+Seed.player.name+'</b></td><td class=xtab align=right>'+uW.g_js_strings.commonstr.alliance+':</td><td class=xtab><b>'+getMyAlliance()[1]+'</b></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><td align=right class=xtab>'+tx("UID")+':</td><td class=xtab><b>'+uW.tvuid+'</b></td><td align=right class=xtab>'+tx('FBUID')+':</td><td class=xtab><b>'+uW.user_id+'</b></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><td align=right class=xtab>'+uW.g_js_strings.commonstr.domain+':</td><td class=xtab><b>'+uW.domainName+'</b></td><td class=xtab align=right>'+tx('Playing Since')+':</td><td class=xtab><b>'+dt.toLocaleDateString()+'</b></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><td align=right class=xtab>'+tx('Camelot Version')+':</td><td class=xtab><b>'+anticd.getKOCversion()+'</b></td><td class=xtab align=right>'+tx('PowerBot+ Version')+':</td><td class=xtab><b>'+Version+'</b></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><td align=right class=xtab>'+tx('Browser')+':</td><td class=xtab><b>'+FFVersion.Browser+' '+FFVersion.Version+'</b></td><td class=xtab align=right>'+GMVersion.Handler+':</td><td class=xtab><b>'+GMVersion.Version+'</b></td></tr>';
		m += '</table><br></div>';

		// links

		m += '<a id=btLinkLink class=divLink ><div class="divHeader" align="left"><img id=btLinkArrow height="10" src="'+RightArrow+'">&nbsp;'+tx('USEFUL LINKS')+'</div></a>';
		m += '<div id=btLink class=divHide>';

		m += '<TABLE align=center cellpadding=1 cellspacing=0>';
		m += '<TR><TD class=xtabHD width="300px">'+tx('Scripts')+'</td><TD class=xtabHD width="300px">'+tx('Information sites')+'</td></tr>';
		m += '<TR><TD class=xtab><a class=xlink href="https://www.facebook.com/PowerBotPlus" target="_blank">'+tx('Power Bot Plus (Facebook Page)')+'</a></td>';
		m += '<TD class=xtab><a class=xlink href="http://www.slideshare.net/Aderik/documents" target="_blank">'+tx('Aderik\'s Tutorials')+'</a></td></tr>';
		m += '<TR><TD class=xtab><a class=xlink href="https://greasyfork.org/en/scripts/889-koc-additional-throne-monitor" target="_blank">'+tx('Additional Throne Monitor (Greasyfork)')+'</a></td>';
		m += '<TD class=xtab><a class=xlink href="https://www.facebook.com/groups/SolarsKOCinfoPage/" target="_blank">'+tx('KOC Information (Facebook Group)')+'</a></td></tr>';
		m += '<TR><TD class=xtab><a class=xlink href="https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/versions/?page=1#version-1.15.1-signed" target="_blank">'+tx('Greasemonkey (Version 1.15)')+'</a></td>';
		m += '<TD class=xtab><a class=xlink href="https://www.facebook.com/groups/1467954843521680/" target="_blank">'+tx('Elements of KOC (Facebook Group)')+'</a></td></tr>';
		m += '<TR><TD class=xtab><a class=xlink href="http://tampermonkey.net/" target="_blank">Tampermonkey (Chrome, Opera, Safari etc)</a></td>';
		m += '<TD class=xtab><a class=xlink href="http://basickoc.weebly.com/" target="_blank">'+tx('KOC Basics')+'</a></td></tr>';
		m += '<TR><TD class=xtab><a class=xlink href="https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/" target="_blank">ViolentMonkey (Firefox)</a></td>';
		m += '<TD class=xtab><a class=xlink href="http://koc.wikia.com/wiki/" target="_blank">'+tx('KofC Wiki')+'</a></td></tr>';
		m += '<TR><TD class=xtab><a class=xlink href="https://addons.mozilla.org/en/firefox/addon/scriptish/versions/" target="_blank">Scriptish</a></td>';
		m += '<TD class=xtab><a class=xlink href="http://f89kocguide.weebly.com/" target="_blank">'+tx('F89 Unofficial KOC Guide')+'</a></td></tr>';
		m += '<TR><TD class=xtab><a class=xlink href="https://chrome.google.com/webstore/detail/clean-on-refresh/moogoheinbbibflghkinbcmgkncleoid" target="_blank">'+tx('Clean on Refresh (Chrome)')+'</a></td>';
		m += '<TD class=xtab><a class=xlink href="http://koc.weezeewig.com/index.sjs?f=ListServers" target="_blank">'+tx('KofC Mapper')+'</a></td></tr>';
		m += '</table><BR></div>';

		// map

		m += '<a id=btMapLink class=divLink ><div class="divHeader" align="left"><img id=btMapArrow height="10" src="'+RightArrow+'">&nbsp;'+tx('MAP')+'</div></a>';
		m += '<div id=btMap class=divHide>';

		m += '<BR><TABLE align=center cellpadding=1 cellspacing=0>';
		m += '<TR><TD colspan=2 class=xtab align=left><DIV id=ptProvMap style="height:' + provMapCoords.imgHeight + 'px; width:' + provMapCoords.imgWidth + 'px; background-repeat:no-repeat; background-image:url(\'' + URL_PROVINCE_MAP + '\')"></div></td></tr>';
		m += '<TR><TD colspan=2 class=xtab align=center><DIV style="color:#000;font-size:14px; border: 1px solid; background-color:white; margin:20px 3px 3px 0px; padding:4px" id=ptdistout>&nbsp;</div></td></tr>';
		m += '<TR><TD class=xtab align=left><B>'+tx('First Location')+': </b></td><TD class=xtab>&nbsp;X:&nbsp;<INPUT id=calcX type=text\>&nbsp;Y:&nbsp;<INPUT id=calcY type=text\> '+tx('Or, choose city')+': <SPAN id=ptloc1></span></td></tr>';
		m += '<TR><TD class=xtab align=left><B>'+tx('Second Location')+': </b></td><TD class=xtab>&nbsp;X:&nbsp;<INPUT id=calcX2 type=text\>&nbsp;Y:&nbsp;<INPUT id=calcY2 type=text\> '+tx('Or, choose city')+': <SPAN id=ptloc2></span></td></tr></table>';
		m += '<br></div>';

		// unit information

		var rownum = 1;

		m += '<a id=btUnitInfoLink class=divLink ><div class="divHeader" align="left"><img id=btUnitInfoArrow height="10" src="'+RightArrow+'">&nbsp;'+tx('UNIT INFORMATION')+'</div></a>';
		m += '<div id=btUnitInfo class=divHide>';

		var u = '<TABLE align=center cellpadding=1 cellspacing=0>';
		var ch = '<TR align=center><TD class=xtab></td><TD class=xtab></td><TD class=xtabHL colspan=8><B>'+tx('Base Stats')+'</b></td><TD class=xtabHL colspan=5><B>'+tx('Cost to Build')+'</b></td><TD class=xtabHL><B>'+tx('Upkeep')+'</b></td></tr>\
			<TR valign=bottom align=right><TD class=xtab></td><TD class=xtab></td><TD class=xtabHL>'+uW.g_js_strings.commonstr.might+'</td><TD class=xtabH>'+uW.g_js_strings.commonstr.life+'</td><TD class=xtabH>'+uW.g_js_strings.commonstr.atk+'</td><TD class=xtabH>'+tx('Def')+'</td><TD class=xtabH>'+uW.g_js_strings.commonstr.speed+'</td><TD class=xtabH>'+uW.g_js_strings.commonstr.range+'</td><TD class=xtabH>'+uW.g_js_strings.modal_barracks_train.load+'</td><TD class=xtabH>'+tx('Spell')+'</td>\
			<TD class=xtabHL>'+uW.g_js_strings.commonstr.food+'</td><TD class=xtabH>'+uW.g_js_strings.commonstr.wood+'</td><TD class=xtabH>'+uW.g_js_strings.commonstr.stone+'</td><TD class=xtabH>'+uW.g_js_strings.commonstr.ore+'</td><TD class=xtabH>'+tx('Pop')+'</td><TD class=xtabHL>'+uW.g_js_strings.commonstr.food+'</td></tr>\
			<TR style="height:1px;"><TD style="padding:0px; spacing:0px; height:1px; border-color:black; border-width: 1px; border-style: none none solid none" colspan=16></td></tr>';
		u += ch;
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (++rownum % 2) { rsty = 'evenRow'; }
			else { rsty = 'oddRow'; }
			cost = uW.unitcost['unt' + i]; // NAME, Food, Wood, Stone, Ore, ?, IdlePop, Time
			stats = uW.unitstats['unt' + i]; // Life, Attack, Defense, Speed, Range, Load, Might, SpellPower
			food = uW.unitupkeeps[i];
			might = uW.unitmight['unt' + i];
			u += '<TR class="'+rsty+'" align=right><TD class=xtab align=left><B>'+TroopImage(i,"vertical-align:middle;")+cost[0].substr(0,20)+'</b></td><TD class=xtab align=right>'+capitalize(CM.unitFrontendType[i])+'</td>';
			u += '<TD class=xtabL>'+might+'</td><TD class=xtab>'+stats[0]+'</td><TD class=xtab>'+stats[1]+'</td><TD class=xtab>'+stats[2]+'</td><TD class=xtab>'+stats[3]+'</td><TD class=xtab>'+stats[4]+'</td><TD class=xtab>'+stats[5]+'</td><TD class=xtab>'+(stats[7]?stats[7]:"")+'</td>';
			if (!CM.BarracksUnitsTypeMap.isUnitType(i, "rare")) {
				u+= '<TD class=xtabL>'+cost[1]+'</td><TD class=xtab>'+cost[2]+'</td><TD class=xtab>'+cost[3]+'</td><TD class=xtab>'+cost[4]+'</td><TD class=xtab>'+cost[6]+'</td>';
			}
			else {
				u+= '<TD colspan=5 class=xtabL align=center><span style="opacity:0.6;"><i>'+uW.g_js_strings.modal_openBarracks.rarettl+'</i></span></td>';
			}
			u += '<TD class=xtabL>'+food+'</td></tr>';
		}
		u += '<TR class=xtabLine><TD colspan=16 class=xtabLine></td></tr>';
		u += ch;
		for (var k in uW.fortcost) {
			if (++rownum % 2) { rsty = 'evenRow'; }
			else { rsty = 'oddRow'; }
			cost = uW.fortcost[k]; // NAME, Food, Wood, Stone, Ore, ?, IdlePop, Time
			fi = k.substring(3);
			stats = uW.fortstats['unt' + fi]; // Life, Attack, Defense, Speed, Range, Space
			food = 0;
			might = fortmight['f' + fi];
			var name = cost[0].replace(tx('Defensive'), '');
			name = name.replace(tx('Wall-Mounted'), '');
			var dtype = tx('Field');
			if (fi < 60 || fi==63) { dtype = tx('Wall'); }
			u += '<TR class="'+rsty+'" align=right><TD align=left class=xtab><B>'+TroopImage(fi,"vertical-align:middle;")+name+'</b></td><TD class=xtab>'+dtype+'</td><TD class=xtabL>'+might+'</td>\
				<TD class=xtab>'+stats[0]+'</td><TD class=xtab>'+stats[1]+'</td><TD class=xtab>'+stats[2]+'</td><TD class=xtab>'+stats[3]+'</td>\
				<TD class=xtab>'+stats[4]+'</td><TD class=xtab>'+stats[5]+'</td><TD class=xtab>'+(stats[7]?stats[7]:"")+'</td><TD class=xtabL>'+cost[1]+'</td><TD class=xtab>'+cost[2]+'</td>\
				<TD class=xtab>'+cost[3]+'</td><TD class=xtab>'+cost[4]+'</td><TD class=xtab>'+(cost[6]||'')+'</td><TD class=xtabL>&nbsp;</td></tr>';
		}
		u += '<TR class=xtabLine><TD colspan=16 class=xtabLine></td></tr>';

		m += u + '</table><BR></div>';

		// research

		var rownum = 1;

		m += '<a id=btResearchInfoLink class=divLink ><div class="divHeader" align="left"><img id=btResearchInfoArrow height="10" src="'+RightArrow+'">&nbsp;'+tx('RESEARCH LEVELS')+'</div></a>';
		m += '<div id=btResearchInfo class=divHide>';

		m += '<TABLE width=95% align=center class=xtab><TR valign=top align=center><td><table class=xtab border=1px cellpadding=2 cellspacing=0><TR valign=top align=left><td><b>'+uW.g_js_strings.commonstr.research+'</b></td><td align=center><b>'+uW.g_js_strings.commonstr.level+'</b></td><td align=right><b>'+tx('Bonus')+'</b></td></tr>';
		for (var i in uW.techcost) {
			if (++rownum % 2) { rsty = 'evenRow'; }
			else { rsty = 'oddRow'; }
			var csty = '<span>';
			var ui = i.split("tch")[1];
			if (Seed.tech[i] == uW.Research.Methods.maxLevel(ui, 1)) csty = '<span style="color:#080">';
			if (Seed.tech[i] == 0) csty = '<span style="color:#800">';
			m += '<tr class="'+rsty+'"><TD style="width:150px;" title="'+uW.techcost[i][10]+'">' + uW.techcost[i][0] + '</td><TD align=center style="width:50px; max-width:150px;">'+csty+Seed.tech[i]+'</span></td><TD align=right style="width:50px; max-width:150px;">'+csty+(t.TechBoosts[ui]!=0?parseInt(parseIntNan(Seed.tech[i])*t.TechBoosts[ui]*100)+'%':'')+'</span></td></tr>';
		}
		m += '</table></td>';
		m += '<td><table class=xtab border=1px cellpadding=2 cellspacing=0><TR valign=top align=left><td><b>'+tx('Briton Research')+'</b></td><td align=center><b>'+uW.g_js_strings.commonstr.level+'</b></td><td align=right><b>'+tx('Bonus')+'</b></td></tr>';
		rownum = 1;
		for (var i in uW.techcost2) {
			if (++rownum % 2) { rsty = 'evenRow'; }
			else { rsty = 'oddRow'; }
			var csty = '<span>';
			var ui = i.split("tch")[1];
			if (Seed.tech2[i] == uW.Research.Methods.maxLevel(ui, 2)) csty = '<span style="color:#080">';
			if (Seed.tech2[i] == 0) csty = '<span style="color:#800">';
			m += '<tr class="'+rsty+'"><TD style="width:150px;" title="'+uW.techcost2[i][10]+'">' + uW.techcost2[i][0] + '</td><TD align=center style="width:50px; max-width:150px;">'+csty+Seed.tech2[i]+'</span></td><TD align=right style="width:50px; max-width:150px;">'+csty+(t.BritonTechBoosts[ui]!=0?parseInt(parseIntNan(Seed.tech2[i])*t.BritonTechBoosts[ui]*100)+'%':'')+'</span></td></tr>';
			m += '</td></tr>';
		}
		m += '</table></td></tr></table></div>';

		// tr Caps

		m += '<a id=btRefCapsLink class=divLink ><div class="divHeader" align="left"><img id=btRefCapsArrow height="10" src="'+RightArrow+'">&nbsp;'+tx('THRONE ROOM CAPS')+'</div></a>';
		m += '<div id=btRefCaps class=divHide>';

		var caps = '<br><TABLE class=xtab align=center border=1px cellspacing=0 cellpadding=2>';
		caps += '<TR><TD width="200px"><B>'+tx('Effect Name')+'</b></td><TD width="50px"><B>'+uW.g_js_strings.commonstr.max+'</b></td><TD width="50px"><B>'+tx('Min')+'</b></td><TD style="border:0;width:10px">&nbsp;</td><TD width="200px"><B>'+tx('Effect Name')+'</b></td><TD width="50px"><B>'+uW.g_js_strings.commonstr.max+'</b></td><TD width="50px"><B>'+tx('Min')+'</b></td></tr>';

		var boosts = [];
		for (var k in uW.cm.thronestats.boosts) {
			if (uW.cm.thronestats.boosts[k].BoostName) {
				boosts.push(uW.cm.thronestats.boosts[k]);
			}
		}
		boosts.sort(function(a, b){ return a.BoostName > b.BoostName});

		var counter = 0;
		var rownum = 0;
		caps += '<TR class=oddRow>';
		for (var k in boosts) {
			counter++
			var boost = boosts[k]
			if (boost.BoostName) {
				caps += '<TD>'+boost.BoostName+'</td><TD>'+boost.Max+'<SPAN id=capmaxPerc_'+k+'></span></div></td><TD>'+boost.Min+'<SPAN id=capminPerc_'+k+'></span></div>';
				if (counter % 2 == 0) {
					if (++rownum % 2) { rsty = 'evenRow'; }
					else { rsty = 'oddRow'; }
					caps += '<TR class="'+rsty+'">';
				}
				else { caps += '</td><TD style="border:0">'; }
			}
		}
		m += caps + '</table><br></div>';

		// ch Caps

		m += '<a id=btRefChCapsLink class=divLink ><div class="divHeader" align="left"><img id=btRefChCapsArrow height="10" src="'+RightArrow+'">&nbsp;'+tx('CHAMPION HALL CAPS')+'</div></a>';
		m += '<div id=btRefChCaps class=divHide>';

		var caps = '<br><TABLE class=xtab align=center border=1px cellspacing=0 cellpadding=2>';
		caps += '<TR><TD width="200px"><B>'+tx('Effect Name')+'</b></td><TD width="50px"><B>'+uW.g_js_strings.commonstr.max+'</b></td><TD width="50px"><B>'+tx('Min')+'</b></td><TD style="border:0;width:10px">&nbsp;</td><TD width="200px"><B>'+tx('Effect Name')+'</b></td><TD width="50px"><B>'+uW.g_js_strings.commonstr.max+'</b></td><TD width="50px"><B>'+tx('Min')+'</b></td></tr>';

		var boosts = [];
		for (var k in CE_EFFECT_TIERS) {
			if (CE_EFFECT_TIERS[k].Id_Tier && (CE_EFFECT_TIERS[k].Max != 0 || CE_EFFECT_TIERS[k].Min !=0)) {
				effsplit=CE_EFFECT_TIERS[k]["Id_Tier"].split(",");
				if (effsplit[1]==1) { // caps are at tier 1 (?)
					var boost = {};
					boost.BoostName = CM.ChampionManager.getEffectName(effsplit[0]);
					boost.Effect = effsplit[0];
					boost.Max = CE_EFFECT_TIERS[k].Max;
					boost.Min = CE_EFFECT_TIERS[k].Min;
					boosts.push(boost);
				}
			}
		}
		boosts.sort(function(a, b){ return a.BoostName > b.BoostName});

		var counter = 0;
		var rownum = 0;
		caps += '<TR class=oddRow>';
		for (var k in boosts) {
			counter++
			var boost = boosts[k]
			if (boost.BoostName) {
				caps += '<TD>'+boost.BoostName+'</td><TD>'+boost.Max+'<SPAN id=chcapmaxPerc_'+k+'></span></div></td><TD>'+boost.Min+'<SPAN id=chcapminPerc_'+k+'></span></div>';
				if (counter % 2 == 0) {
					if (++rownum % 2) { rsty = 'evenRow'; }
					else { rsty = 'oddRow'; }
					caps += '<TR class="'+rsty+'">';
				}
				else { caps += '</td><TD style="border:0">'; }
			}
		}
		m += caps + '</table><br></div>';

		// glory icons

		m += '<a id=btRefIconsLink class=divLink ><div class="divHeader" align="left"><img id=btRefIconsArrow height="10" src="'+RightArrow+'">&nbsp;'+tx('GLORY ICONS')+'</div></a>';
		m += '<div id=btRefIcons class=divHide>';

		var icons = '<br><TABLE class=xtab align=center style="background:'+Options.Colors.Panel+';border:2px;">';
		icons += '<TR><TD width="50px" align=right><B>'+tx('Icon')+'</b></td><TD width="200px"><B>'+uW.g_js_strings.commonstr.glory+'</b></td><TD style="border:0;width:10px">&nbsp;</td><TD width="50px" align=right><B>'+tx('Icon')+'</b></td><TD width="200px"><B>'+uW.g_js_strings.commonstr.glory+'</b></td></tr><TR>';
		var iconarray = [];
		for (var k in Seed.gloryChatMapping) {
			iconarray.push(k);
		}
		var counter = 0;
		for (var k=0;k<iconarray.length;k++) {
			counter++
			var start = addCommas(iconarray[k]);
			if (k<iconarray.length-1) { var end = ' - '+addCommas(iconarray[k+1]-1); }
			else { var end = ' +'; }
			icons += '<TD align=right><img src="'+IMGURL+'chat_'+Seed.gloryChatMapping[iconarray[k]]+'.png"></td><TD>'+start+end+'</td>';
			if (counter % 2 == 0) { icons += '</tr><TR>'; }
			else { icons += '<TD style="border:0">&nbsp;</td>'; }
		}
		m += icons + '</tr></table><br></div>';

		// throne uniques

		m += '<a id=btRefTRUniqueLink class=divLink ><div class="divHeader" align="left"><img id=btRefTRUniqueArrow height="10" src="'+RightArrow+'">&nbsp;'+tx('UNIQUE THRONE ROOM CARDS')+'</div></a>';
		m += '<div id=btRefTRUnique class=divHide></div>';

		// champ uniques

		m += '<a id=btRefCHUniqueLink class=divLink ><div class="divHeader" align="left"><img id=btRefCHUniqueArrow height="10" src="'+RightArrow+'">&nbsp;'+tx('UNIQUE CHAMPION CARDS')+'</div></a>';
		m += '<div id=btRefCHUnique class=divHide></div>';

		// accuracy

		m += '<a id=btRefAccuracyLink class=divLink ><div class="divHeader" align="left"><img id=btRefAccuracyArrow height="10" src="'+RightArrow+'">&nbsp;'+tx('ACCURACY MATRIX')+'</div></a>';
		m += '<div id=btRefAccuracy class=divHide>';
		m += '<DIV style="padding-top:4px;max-height:750px;overflow-y:scroll;width:'+GlobalOptions.btWinSize.x+'px";overflow-x:scroll;">'+strButton8(tx('Show Full Table'), 'onclick="btShowAccuracyPop();"');
		m += t.BuildAccuracyTable()+'</div><br></div></br>';

		t.myDiv.innerHTML = m;

		t.PaintTRUniques(ById('btRefTRUnique'));
		t.PaintCHUniques(ById('btRefCHUnique'));

		if (!OpenDiv["Reference"]) { OpenDiv["Reference"] = ""; }
		if (OpenDiv["Reference"] != "") {
			var LastOpenDiv = OpenDiv["Reference"];
			OpenDiv["Reference"] = "";
			ToggleMainDivDisplay("Reference",100,GlobalOptions.btWinSize.x,LastOpenDiv,true);
		}


		ById('btRefCapsLink').addEventListener ('click', function () {ToggleMainDivDisplay("Reference",100,GlobalOptions.btWinSize.x,"btRefCaps",true)}, false);
		ById('btRefChCapsLink').addEventListener ('click', function () {ToggleMainDivDisplay("Reference",100,GlobalOptions.btWinSize.x,"btRefChCaps",true)}, false);
		ById('btRefTRUniqueLink').addEventListener ('click', function () {ToggleMainDivDisplay("Reference",100,GlobalOptions.btWinSize.x,"btRefTRUnique",true)}, false);
		ById('btRefCHUniqueLink').addEventListener ('click', function () {ToggleMainDivDisplay("Reference",100,GlobalOptions.btWinSize.x,"btRefCHUnique",true)}, false);
		ById('btRefAccuracyLink').addEventListener ('click', function () {ToggleMainDivDisplay("Reference",100,GlobalOptions.btWinSize.x,"btRefAccuracy",true)}, false);
		ById('btRefIconsLink').addEventListener ('click', function () {ToggleMainDivDisplay("Reference",100,GlobalOptions.btWinSize.x,"btRefIcons",true)}, false);
		ById('btUnitInfoLink').addEventListener ('click', function () {ToggleMainDivDisplay("Reference",100,GlobalOptions.btWinSize.x,"btUnitInfo",true)}, false);
		ById('btResearchInfoLink').addEventListener ('click', function () {ToggleMainDivDisplay("Reference",100,GlobalOptions.btWinSize.x,"btResearchInfo",true)}, false);
		ById('btLinkLink').addEventListener ('click', function () {ToggleMainDivDisplay("Reference",100,GlobalOptions.btWinSize.x,"btLink",true)}, false);
		ById('btMapLink').addEventListener ('click', function () {ToggleMainDivDisplay("Reference",100,GlobalOptions.btWinSize.x,"btMap",true)}, false);

		for (var k in boosts) {
			var boost = boosts[k]
			if (boost.CapType == "percent") {
				if (boost.Max != "none") { ById('capmaxPerc_' + k).innerHTML = '%'; }
				if (boost.Min != "none") { ById('capminPerc_' + k).innerHTML = '%'; }
			}
		}

		for (var c = 0; c < Cities.numCities; c++)
			PlotCityImage(c, ById('ptProvMap'));
		if (Seed.allianceHQ) {
			PlotAllianceHQ(ById('ptProvMap'),[]);
		}
		new CdispCityPicker('ptloc1', ById('ptloc1'), true, t.eventLocChanged).bindToXYboxes(ById('calcX'), ById('calcY'));
		new CdispCityPicker('ptloc2', ById('ptloc2'), true, t.eventLocChanged).bindToXYboxes(ById('calcX2'), ById('calcY2'));
		t.eventLocChanged(Cities.cities[0], Cities.cities[0].x, Cities.cities[0].y);
	},

	AccuracyPop: function () {
		var t = Tabs.Reference;
		var helpText = '<div>'+t.BuildAccuracyTable()+'<br>&nbsp;</div>';

		var pop = new CPopup ('BotAccuracy', 0, 0, 800, 800, true);
		pop.centerMe (mainPop.getMainDiv());
		pop.getMainDiv().innerHTML = helpText;
		pop.getTopDiv().innerHTML = '<CENTER><B>'+tx("Accuracy Matrix")+'</b></center>';
		pop.show (true);
		ResetFrameSize('BotAccuracy',800,800);
	},

	BuildAccuracyTable: function () {
		var t = Tabs.Reference;

		var main = '<TABLE cellpadding=0 cellspacing=0 align=left><TR>';
		main += '<TD class=xtab></td><TD align=center colspan='+ (t.unitsaccuracy.length+1) +' class=xtab><b>'+uW.g_js_strings.commonstr.target+'</b></td></tr>';
		main += '<TR><TD class=xtabHD>&nbsp;</td>';

		for (var iu=0;iu<t.unitsaccuracy.length;iu++) {
			var u = t.unitsaccuracy[iu];
			if (u!=0) {
				if (u==99) main += '<TD width=30 class=xtabHD align=center><img style="vertical-align:middle;" src="'+IMGURL+'units/redoubt_30.jpg" title="'+uW.buildingcost.bdg31[0]+'" width=30></td>';
				else if (u==100) main += '<TD width=30 class=xtabHD align=center><img style="vertical-align:middle;" src="'+IMGURL+'units/tower_30.jpg" title="'+uW.buildingcost.bdg30[0]+'" width=30></td>';
				else {
					main += '<TD width=30 class=xtabHD align=center>' + TroopImageBig(u) + '</td>';
				}
			}
		}
		main += '</tr>';

		var r = 0;
		for (var ui=0;ui<t.unitsaccuracy.length;ui++) {
			var u = t.unitsaccuracy[ui];
			if (u != 0) {
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				main += '<TR class="'+rowClass+'">';
				if (u<51) {
					main += '<TD class=xtab align=right><b>' + uW.unitcost['unt'+u][0] + '</b></td>';
				}
				else {
					if (u==99) rowtext = uW.g_js_strings.redoubt.redoubt
					else if (u==100) rowtext = uW.g_js_strings.tower.towerName
					else {
						var rowtext = uW.fortcost['frt'+u][0];
						if (u==53) { rowtext = tx('Crossbows'); } // "Wall Mounted Crossbows" is pointlessly long!
					}
					main += '<TD class=xtab align=right><b>' + rowtext + '</b></td>';
				}
				troopa = t.keyz[ui];
				for (var uj=0;uj<t.unitsaccuracy.length;uj++) {
					var cellstyle = '';
					if (ui==uj) { cellstyle = 'style="background: rgba(0,0,0,0.10);"'; }
					troopb = t.keyz[uj];
					if (!t.z[troopa] || !t.z[troopa][troopb])
						main += '<TD class=xtab align=center '+cellstyle+'>??</td>';
					else
						main += '<TD class=xtab align=center '+cellstyle+'>' + t.z[troopa][troopb] + '</td>';
				}
				main += '</tr>';
			}
		}
		main += '</table>';
		return main;
	},

	plotMapImg: function (markNum, eMap, x, y) {
		var t = Tabs.Reference;
		var xplot = parseInt((provMapCoords.mapWidth * x) / 750);
		var yplot = parseInt((provMapCoords.mapHeight * y) / 750);
		if (ById('plotmap_' + markNum) == null) {
			var ce = document.createElement('div');
			ce.style.background = 'black';
			ce.id = 'plotmap_' + markNum;
			ce.style.opacity = '1.0';
			ce.style.position = 'relative';
			ce.style.display = 'block';
			ce.style.width = '16px';
			ce.style.height = '16px';
			ce.style.border = '1px solid #fff';
			ce.style.color = 'white';
			ce.style.textAlign = 'center';
		} else {
			ce = ById('plotmap_' + markNum);
		}
		ce.style.top = (yplot + provMapCoords.topMargin - ((Cities.numCities + markNum) * 16) - 8) + 'px';
		ce.style.left = (xplot + provMapCoords.leftMargin - 8) + 'px';
		ce.title = "("+x+','+y+')';
		eMap.appendChild(ce);
		ce.innerHTML = (markNum + 1) + '';
	},
	eventLocChanged: function (city, x, y) {
		var t = Tabs.Reference;
		var x1 = parseInt(ById('calcX').value);
		var y1 = parseInt(ById('calcY').value);
		if (!isNaN(x1) && !isNaN(y1)) {
			t.plotMapImg(0, ById('ptProvMap'), x1, y1);
		}
		var x2 = parseInt(ById('calcX2').value);
		var y2 = parseInt(ById('calcY2').value);
		if (!isNaN(x2) && !isNaN(y2)) {
			t.plotMapImg(1, ById('ptProvMap'), x2, y2);
		}
		if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
			var m = tx('The distance from')+' ' + x1 + ',' + y1 + ' '+tx('to')+' ' + x2 + ',' + y2 + ' '+tx('is')+': &nbsp;<B>' + distance(x1, y1, x2, y2).toFixed(2) + '</b>';
			ById('ptdistout').innerHTML = m;
		}
	},

	PaintTRUniques: function (div) {
		var t = Tabs.Reference;
		var maxlevel = CM.MAX_MASTERS_TOKEN_LEVEL;
		var selectedCard1 = 0;
		var selectedCard2 = 0;
		var selectedType1 = 0;
		var selectedType2 = 0;
		uWExportFunction('pbrefreshuniques', Tabs.Reference.GetInventory);

		t.trSortArray = [];
		for (var k in t.UniqueTRItems) {
			t.trSortArray.push(t.UniqueTRItems[k]);
		}
		if (t.trSorted) {
			t.trSortArray.sort(function(a, b){ if (a.Name<b.Name) return -1; if (a.Name>b.Name) return 1; return 0; });
		}

		var m = '<div align=center style="height:480px;overflow-y:auto;">';
		m += '<TABLE width=90% class=xtabBR>';
		m += '<tr align=center><td width=50%/></td><td width=50%/><div align=right><INPUT id=bttrUniqueSort type=checkbox '+(t.trSorted?"CHECKED" : "")+'/>&nbsp;'+tx("Sort Alphabetically")+'</div></td></tr>';

		m += '<tr><td><div style="max-width:100%;"><b>'+uW.g_js_strings.commonstr.type+':&nbsp;</b><select id="bttrUniqueType1">';
		m += '<option value="0">-- '+tx('ALL')+' --</option>';
		for (var type_index = 0; type_index < trTypes.length; ++type_index) {
			m += '<option value="' + trTypes[type_index] + '">' + uW.g_js_strings.throneRoom[trTypes[type_index]] + '</option>';
		}
		m += '</select></div></td>';

		m += '<td><div style="max-width:100%;"><b>'+uW.g_js_strings.commonstr.type+':&nbsp;</b><select id="bttrUniqueType2">';
		m += '<option value="0">-- '+tx('ALL')+' --</option>';
		for (var type_index = 0; type_index < trTypes.length; ++type_index) {
			m += '<option value="' + trTypes[type_index] + '">' + uW.g_js_strings.throneRoom[trTypes[type_index]] + '</option>';
		}
		m += '</select></div></td>';

		m += '<tr><td><div style="max-width:100%;"><b>'+uW.g_js_strings.commonstr.item+':&nbsp;</b><select id="bttrUnique1">';
		m += '<option value="0">-- '+uW.g_js_strings.commonstr.items+' --</option>';
		for (var k=0;k<t.trSortArray.length;k++) {
			var throne_item = t.trSortArray[k];
			if (throne_item == null || !throne_item) continue;
			var style = '';
			if (throne_item.Faction == 0) style = 'style="color:#aaa;"';
			m += '<option '+style+' value="' + throne_item.Id + '">' + throne_item.Name + ' </option>';
		}
		m += '</select></div></td>';

		m += '<td><div style="max-width:100%;"><b>'+uW.g_js_strings.commonstr.item+':&nbsp;</b><select id="bttrUnique2">';
		m += '<option value="0">-- '+uW.g_js_strings.commonstr.items+' --</option>';
		for (var k=0;k<t.trSortArray.length;k++) {
			var throne_item = t.trSortArray[k];
			if (throne_item == null || !throne_item) continue;
			var style = '';
			if (throne_item.Faction == 0) style = 'style="color:#aaa;"';
			m += '<option '+style+' value="' + throne_item.Id + '">' + throne_item.Name + ' </option>';
		}
		m += '</select></div></td>';

		m += '<tr><td><div style="max-width:100%;"><b>'+uW.g_js_strings.commonstr.level+':&nbsp;</b><select id="bttrUniqueLevel1">';
		m += '<option value="1" selected>1</option>';
		for (var type_index = 2; type_index < maxlevel + 1; ++type_index) {
			m += '<option value="' + type_index + '">' + type_index + '</option>';
		}
		m += '</select></div></td>';
		m += '<td><div style="max-width:100%;"><b>'+uW.g_js_strings.commonstr.level+':&nbsp;</b><select id="bttrUniqueLevel2">';
		m += '<option value="1" selected>1</option>';
		for (var type_index = 2; type_index < maxlevel + 1; ++type_index) {
			m += '<option value="' + type_index + '">' + type_index + '</option>';
		}
		m += '</select></div></td></tr>';

		m += '<tr>';
		m += '<td id="bttrUniqueItem1" style="overflow: visible; width: auto; height: auto;"/>';
		m += '<td id="bttrUniqueItem2" style="overflow: visible; width: auto; height: auto;"/>';
		m += '</tr>';
		m += '<tr>';
		m += '<td id="bttrUniqueInv1" style="overflow: visible; width: auto; height: auto;"/>';
		m += '<td id="bttrUniqueInv2" style="overflow: visible; width: auto; height: auto;"/>';
		m += '</tr>';

		m += '</TABLE>';
		m += '</div>';

		div.innerHTML = m;

		ById('bttrUniqueSort').addEventListener('click', function (e) {
			t.trSorted = e.target.checked;
			t.PaintTRUniques(div);
		},false)

		jQuery("#bttrUniqueType1").change(function () {
			var trType = ById('bttrUniqueType1').value;
			var trList = ById('bttrUnique1');
			if (selectedType1 != trType && trType != 0) {
				selectedCard1 = 0;
			}
			jQuery("#bttrUnique1").empty();
			var trOption = document.createElement('option');
			trOption.text = '-- '+uW.g_js_strings.commonstr.items+' --';
			trOption.value = 0;
			trList.add(trOption);
			for (var k=0;k<t.trSortArray.length;k++) {
				var throne_item = t.trSortArray[k];
				if (throne_item == null || !throne_item) continue;
				if (trTypes[parseInt(throne_item.Type)-1] == trType || trType == 0) {
					var trOption = document.createElement('option');
					trOption.text = throne_item.Name;
					trOption.value = throne_item.Id;
					trList.add(trOption);
				}
			}

			if (selectedCard1 != 0) {
				jQuery("#bttrUnique1").val(selectedCard1);
			}

		});

		jQuery("#bttrUniqueType2").change(function () {
			var trType = ById('bttrUniqueType2').value;
			var trList = ById('bttrUnique2');
			if (selectedType2 != trType && trType != 0) {
				selectedCard2 = 0;
			}
			jQuery("#bttrUnique2").empty();
			var trOption = document.createElement('option');
			trOption.text = '-- '+uW.g_js_strings.commonstr.items+' --';
			trOption.value = 0;
			trList.add(trOption);
			for (var k=0;k<t.trSortArray.length;k++) {
				var throne_item = t.trSortArray[k];
				if (throne_item == null || !throne_item) continue;
				if (trTypes[parseInt(throne_item.Type)-1] == trType || trType == 0) {
					var trOption = document.createElement('option');
					trOption.text = throne_item.Name;
					trOption.value = throne_item.Id;
					trList.add(trOption);
				}
			}

			if (selectedCard2 != 0) {
				jQuery("#bttrUnique2").val(selectedCard2);
			}
		});

		jQuery("#bttrUnique1").change(function () { changeUnique1(this); });

		jQuery("#bttrUnique1").keyup(function (event) { changeUnique1(this); });

		function changeUnique1(thisObj) {
			var trID = jQuery(thisObj).val();
			var trDisplay = ById('bttrUniqueItem1');
			var trLevel = ById('bttrUniqueLevel1');
			selectedCard1 = 0;
			ConvertToCard(trID,trDisplay,trLevel);
			t.GetInventory(trID,'bttrUniqueInv1');
			selectedCard1 = trID;
			selectedType1 = trTypes[parseInt(t.UniqueTRItems[trID].Type)-1];
		}

		jQuery("#bttrUnique2").change(function () { changeUnique2(this); });

		jQuery("#bttrUnique2").keyup(function (event) { changeUnique2(this); });

		function changeUnique2(thisObj) {
			var trID = jQuery(thisObj).val();
			var trDisplay = ById('bttrUniqueItem2');
			var trLevel = ById('bttrUniqueLevel2');
			selectedCard2 = 0;
			ConvertToCard(trID,trDisplay,trLevel);
			t.GetInventory(trID,'bttrUniqueInv2');
			selectedCard2 = trID;
			selectedType2 = trTypes[parseInt(t.UniqueTRItems[trID].Type)-1];
		}

		jQuery("#bttrUniqueLevel1").keyup(function (event) { changeLevel1(); });

		jQuery("#bttrUniqueLevel1").change(function () { changeLevel1(); });

		function changeLevel1() {
			if (selectedCard1 != 0) {
				var trID = selectedCard1;
				var trDisplay = ById('bttrUniqueItem1');
				var trLevel = ById('bttrUniqueLevel1');
				trDisplay.innerHTML = '';
				ConvertToCard(trID,trDisplay,trLevel);
			}
		}

		jQuery("#bttrUniqueLevel2").keyup(function (event) { changeLevel2(); });

		jQuery("#bttrUniqueLevel2").change(function () { changeLevel2(); });

		function changeLevel2() {
			if (selectedCard2 != 0) {
				var trID = selectedCard2;
				var trDisplay = ById('bttrUniqueItem2');
				var trLevel = ById('bttrUniqueLevel2');
				trDisplay.innerHTML = '';
				ConvertToCard(trID,trDisplay,trLevel);
			}
		}

		function ConvertToCard (trID,div,lvl) {
			div.innerHTML = '';
			var TRCard = t.BuildThroneCard(trID,parseIntNan(lvl.value));
			div.innerHTML = t.DisplayTRCard(TRCard,true);
		};

	},

	BuildThroneCard : function (trID,lvl) {
		var t = Tabs.Reference;
		var TRCard = {};
		TRCard = t.UniqueTRItems[trID];
		TRCard.id = TRCard.Id;
		TRCard.name = uW.itemlist["i"+trID].name;
		if (TRCard.Faction != 0) {
			TRCard.faction = cardFaction[TRCard.Faction-1];
			TRCard.type = trTypes[parseInt(TRCard.Type)-1].toLowerCase();
		}
		else {
			TRCard.faction = 'unknown';
			TRCard.type = 'unknown';
			TRCard.unknown = true;
		}
		TRCard.unique = TRCard.id;
		TRCard.level = lvl;
		TRCard.quality = 6;
		TRCard.createPrefix = function () { return ""; };
		TRCard.createSuffix = function () { return ""; };
		TRCard.effects = {};
		var effects = eval(TRCard.Effects);
		var slot = 0;

		for (var k in effects) {
			slot++
			TRCard.effects["slot"+slot] = {};
			TRCard.effects["slot"+slot].id = effects[k].type;
			TRCard.effects["slot"+slot].tier = effects[k].tier;

			if (slot==6) {
				var qual = 5; // assume bright jewel
				if (UniqueJewels && UniqueJewels.hasOwnProperty(TRCard.id)) { // some uniques don't have bright jewels...
					qual = UniqueJewels[TRCard.id];
				}
				TRCard.effects["slot"+slot].quality = qual;
				TRCard.effects["slot"+slot].fromJewel = true;

				TRCard.jewel = {};
				TRCard.jewel.valid = true;
				TRCard.jewel.id = TRCard.effects["slot"+slot].id;
				TRCard.jewel.quality = qual;
				TRCard.jewel.tier = TRCard.effects["slot"+slot].tier;
				TRCard.jewel.fromJewel = true;
				TRCard.jewel.gift = false;
				TRCard.jewel.quantity = 1;
			}
		}
		return TRCard;
	},

	GetInventory : function (trID,div) {
		var t = Tabs.Reference;
		div.innerHTML = '';
		var m = '<br><b>'+uW.g_js_strings.commonstr.throneroom+'</b><br>';
		var tritem = {};
		for (var k in uW.kocThroneItems) {
			var throne_item = uW.kocThroneItems[k];
			if (throne_item.unique == trID) {
				if (tritem[throne_item.level]) {tritem[throne_item.level]++} else {tritem[throne_item.level] = 1;}
			}
		}
		var gotitem = false;
		for (var l in tritem) {
			gotitem = true;
			m += tx('You have')+' '+tritem[l]+' '+tx('at level')+' '+l+'<br>';
		}
		if (!gotitem) m += tx('You have none in your throne room')+'.<br>';
		else {
			//if (t.UniqueTRItems[trID].Faction == 0) {
				m += '<a class=xlink id=pbgenstats'+trID+'>Generate Stats</a><br>';
			//}
		}

		m += '<br><b>'+uW.g_js_strings.commonstr.inventory+'</b><br>';
		var inv = uW.seed.items['i'+trID];
		m += tx('You have')+' '+(inv?inv:uW.g_js_strings.commonstr.none)+' '+tx('in your inventory')+'.';
		if ((inv?inv:0) != 0 && !gotitem) {
			m += '<br><a class=xlink onClick="cm.ItemController.use(\''+trID+'\');setTimeout(function(){pbrefreshuniques('+trID+',\''+div+'\')},2000);">'+tx('Add to Throne Room')+'</a>';
		}
		ById(div).innerHTML = m;
		if (ById('pbgenstats'+trID)) {
			ById('pbgenstats'+trID).addEventListener('click',function () { window.prompt(tx("Copy to clipboard: Ctrl+C"), GenerateStats(trID)); } , false);
		}

		function GenerateStats(trID) {
			for (var k in uW.kocThroneItems) {
				var throne_item = uW.kocThroneItems[k];
				if (throne_item.unique == trID) {
					var Results = 'UniqueItems["'+trID+'"] = {Id:'+trID+',Name:"'+throne_item.name+'", Effects:[';
					var firsteffect = true;
					for (var e in throne_item.effects) {
						if (!firsteffect) Results += ',';
						Results += '{type:'+throne_item.effects[e].id+',tier:'+throne_item.effects[e].tier+'}';
						firsteffect = false;
					}
					Results += '],Faction:'+(cardFaction.indexOf(throne_item.faction)+1)+',Type:'+(trTypes.indexOf(throne_item.type)+1)+'};';
					break;
				}
			}
			return Results;
		}
	},

	DisplayTRCard : function (throne_item,Links,ScaleFactor) {
		var t = Tabs.Reference;
		var D = [];
		if (throne_item == null) {
			D.push("<div>");
			D.push("</div>");
			return D.join("");
		}

		if (!ScaleFactor) { ScaleFactor = 1; }
		var CardWidth = Math.floor(200*ScaleFactor);
		var BigFont = Math.floor(14*ScaleFactor);
		var ImageSize = Math.floor(70*ScaleFactor);
		var SmallFont = Math.floor(11*ScaleFactor);

		var E = []; // copy to clip/post to chat array

		D.push("<div style='overflow: hidden; position: relative; left: 0px; top: 0px;'>");
		D.push(" <div id='throneInventoryItemTooltip'>");
		D.push("<div class='section' style='overflow:visible;width:"+CardWidth+"px;' id='idsection'>");
		D.push(" <div class='title " + throne_item.createPrefix().toLowerCase() + "' style='color:#3F2300;text-transform:capitalize;font-size:"+BigFont+"px;'> ");
		D.push(throne_item.name + (throne_item.unique ? " +" + throne_item.level : ""));
		D.push(" </div> ");
		D.push(" <div class='description'> ");
		var uniquestyle = "";
		if (throne_item.isBroken) {
			uniquestyle = 'width:'+ImageSize+'px;height:'+ImageSize+'px;background:transparent url('+BrokenIcon+'); top left no-repeat; background-size:'+ImageSize+'px '+ImageSize+'px;';
		}
		else {
			if (throne_item.unique > 29000) {
				uniquestyle = 'width:'+ImageSize+'px;height:'+ImageSize+'px;background:transparent url('+IMGURL+'throne/icons/70/'+throne_item.faction+'_'+throne_item.type+'_unique_'+throne_item.unique + '.png); top left no-repeat; background-size:'+ImageSize+'px '+ImageSize+'px;';
				if (throne_item.unique == 30262 || throne_item.unique == 30264 || throne_item.unique == 30266) { uniquestyle = 'width:'+ImageSize+'px;height:'+ImageSize+'px;background:transparent url('+IMGURL+'throne/icons/70/christmas_advisor_normal_1.png); top left no-repeat; background-size:'+ImageSize+'px '+ImageSize+'px;'; }
				if (throne_item.unique == 30261 || throne_item.unique == 30263 || throne_item.unique == 30265) { uniquestyle = 'width:'+ImageSize+'px;height:'+ImageSize+'px;background:transparent url('+IMGURL+'throne/icons/70/christmas_candelabrum_normal_1.png); top left no-repeat; background-size:'+ImageSize+'px '+ImageSize+'px;'; }
				if (throne_item.unique == 30230 || throne_item.unique == 30240 || throne_item.unique == 30250) { uniquestyle = 'width:'+ImageSize+'px;height:'+ImageSize+'px;background:transparent url('+IMGURL+'throne/icons/70/halloween_table_normal_1.png); top left no-repeat; background-size:'+ImageSize+'px '+ImageSize+'px;'; }
				if (throne_item.unique == 30231 || throne_item.unique == 30241 || throne_item.unique == 30251) { uniquestyle = 'width:'+ImageSize+'px;height:'+ImageSize+'px;background:transparent url('+IMGURL+'throne/icons/70/halloween_chair_normal_1.png); top left no-repeat; background-size:'+ImageSize+'px '+ImageSize+'px;'; }
			}
			else {
				uniquestyle = 'width:'+ImageSize+'px;height:'+ImageSize+'px;background:transparent url('+IMGURL+'throne/icons/70/'+throne_item.faction+'_'+throne_item.type+'_normal_1_'+throne_item.quality+'.png); top left no-repeat; background-size:'+ImageSize+'px '+ImageSize+'px;';
			}
		}

		D.push("<div class='portrait " + throne_item.faction + " " + throne_item.type + "' style='"+uniquestyle+"'> </div> ");
		D.push("<ul style='margin-top:0px;'>");
		D.push("<li style='float:none;margin:0px;font-size:"+SmallFont+"px;'> " + uW.g_js_strings.commonstr.faction + ": " + uW.g_js_strings.commonstr[throne_item.faction] + "</li>");
		D.push("<li style='float:none;margin:0px;font-size:"+SmallFont+"px;'> " + uW.g_js_strings.commonstr.quality + ": " + CardQuality(throne_item.quality,throne_item.unique) + "</li>");
		D.push("<li style='float:none;margin:0px;font-size:"+SmallFont+"px;'> " + uW.g_js_strings.commonstr.type + ": " + uW.g_js_strings.throneRoom[throne_item.type] + "</li>");
		D.push("<li style='float:none;margin:0px;font-size:"+SmallFont+"px;'> " + uW.g_js_strings.commonstr.level + ": " + throne_item.level + "</li>");
		D.push("<li style='float:none;margin:0px;font-size:"+SmallFont+"px;'> " + uW.g_js_strings.commonstr.might + ": " + CardMight(throne_item) + "</li>");

		if (throne_item.jewel && throne_item.jewel.valid) { D.push("<li style='float:none;margin:0px;font-size:"+SmallFont+"px;'> " + uW.g_js_strings.commonstr.jewel + ": " + t.JewelQuality[throne_item.jewel.quality-1] + "</li>"); }

		D.push("</ul>");
		D.push(" </div> ");
		D.push(" <ul> ");

		E.push(throne_item.name.replace(/\'/g, "") + (throne_item.unique ? " +" + throne_item.level : ""));
		E.push(uW.g_js_strings.commonstr.faction + ": " + uW.g_js_strings.commonstr[throne_item.faction]);
		E.push(uW.g_js_strings.commonstr.quality + ": " + CardQuality(throne_item.quality,throne_item.unique));
		E.push(uW.g_js_strings.commonstr.type + ": " + uW.g_js_strings.throneRoom[throne_item.type]);
//		E.push(uW.g_js_strings.commonstr.level + ": " + throne_item.level);
		E.push(uW.g_js_strings.commonstr.might + ": " + CardMight(throne_item));
		if (throne_item.jewel && throne_item.jewel.valid) { E.push(uW.g_js_strings.commonstr.jewel + ": " + t.JewelQuality[throne_item.jewel.quality-1]); }

		if (throne_item.unknown) {
			if (Links) {
				D.push(" <li style='font-size:"+BigFont+"px;' class='effect'><center>"+tx("Unknown")+"</center></li> ");
				D.push(" <li style='font-size:"+BigFont+"px;' class='effect'><div style='font-size:"+SmallFont+"px;'><center>"+tx("If you have one in your Throne Room please click the 'Generate Stats' link below and send the results to the script developer")+".</center></div></li>");
			}
		}
		else {
			for (var slot in throne_item.effects) {
				try {
					var N = throne_item.effects[slot];
					tier = parseInt(N.tier);
					effect = getThroneEffectName(N.id,tier);
					p = uW.cm.thronestats.tiers[N.id][tier];
					while (!p && (tier > 0)) { tier--; p = uW.cm.thronestats.tiers[N.id][tier]; }
					if (!p) continue; // can't find stats for tier

					var base = +p.base || 0;
					var level = +throne_item.level || 0;
					var growth = +p.growth || 0;
					if (slot == 'slot6') { //if it has a slot 6, it automatically has a jewel
						JewelQuality = throne_item["effects"]['slot6'].quality;
						GrowthLimit = uW.cm.thronestats.jewelGrowthLimit[JewelQuality];
						if (GrowthLimit <= level) level = GrowthLimit
					}
					percent = Number(base + ((level * level + level) * growth * 0.5));
					var wholeNumber = false;
					if (Math.round(parseFloat(percent)) == parseFloat(percent)) wholeNumber = true;
					percent = (percent > 0) ? "+" + percent : +percent;
					if (wholeNumber)
						percent = parseFloat(percent).toFixed(0);
					else
						percent = parseFloat(percent).toFixed(2);
					css = (slot % 2 === 0) ? "even" : "odd";
					B = +(slot.split("slot")[1]);
					percent = (percent > 0) ? "+" + percent : percent;
					if (B <= throne_item.quality) {
						D.push(" <li class='effect " + css + "' style='float:none;margin:0px;font-size:"+BigFont+"px;'> " + percent + "% " + effect + " </li> ");
					} else {
						D.push(" <li class='effect disabled " + css + "' style='float:none;margin:0px;font-size:"+BigFont+"px;'> " + percent + "% " + effect + " </li> ");
					}
					E.push("Row " + B + ": " + percent + "% " + effect);
				}
				catch (e) { }
			}
		}
		D.push(" </ul> ");
		D.push(" </div> ");
		D.push(" </ul> ");
		D.push(" </div> ");
		D.push(" </div> ");

		var cText = ":::. |" + E.join('||');
		var clipText = E.join('	 ');

		if (Links) {
			D.push('<table width="210" class=xtab><tr><td><a class=xlink onClick="window.prompt(\''+tx("Copy to clipboard: Ctrl+C")+'\', \''+clipText+'\');">'+tx("Copy to Clipboard")+'</a></td><td align=right><a class=xlink onClick="Chat.sendChat(\''+cText+'\')">'+tx("Post to Chat")+'</a></td></tr></table>');
		}
		return D.join("");
	},

	PaintCHUniques: function (div) {
		var t = Tabs.Reference;
		var maxlevel = CM.CHAMPION.MAX_LEVELS;
		var itemTypes = { weapon: 0, chest: 1, helm: 2, boots: 3, shield: 4, ring: 5, pendant: 7, cloak: 8 };
		var selectedCard1 = 0;
		var selectedCard2 = 0;
		var selectedType1 = 0;
		var selectedType2 = 0;
		uWExportFunction('pbrefreshchuniques', Tabs.Reference.GetCHInventory);

		t.chSortArray = [];
		for (var k in t.UniqueCHItems) {
			t.chSortArray.push(t.UniqueCHItems[k]);
		}
		if (t.chSorted) {
			t.chSortArray.sort(function(a, b){ var x=a.Set-b.Set; var y=0; if (a.name<b.name) y=-1; if (a.name>b.name) y=1; return (x==0)?y:x; });
		}

		var m = '<div align=center style="height:480px;overflow-y:auto;">';
		m += '<TABLE width=90% class=xtabBR>';
		m += '<tr align=center><td width=50%/></td><td width=50%/><div align=right><INPUT id=btchUniqueSort type=checkbox '+(t.chSorted?"CHECKED" : "")+'/>&nbsp;'+tx("Sort by Champion Set")+'</div></td></tr>';

		m += '<tr><td><div style="max-width:100%;"><b>'+uW.g_js_strings.commonstr.type+':&nbsp;</b><select id="btchUniqueType1">';
		m += '<option value="0">-- '+tx('ALL')+' --</option>';
		for (var type in itemTypes) {
			m += '<option value="' + type + '">' + uW.g_js_strings.champ[type] + '</option>';
		}
		m += '</select></div></td>';

		m += '<td><div style="max-width:100%;"><b>'+uW.g_js_strings.commonstr.type+':&nbsp;</b><select id="btchUniqueType2">';
		m += '<option value="0">-- '+tx('ALL')+' --</option>';
		for (var type in itemTypes) {
			m += '<option value="' + type + '">' + uW.g_js_strings.champ[type] + '</option>';
		}
		m += '</select></div></td>';

		m += '<tr><td><div style="max-width:100%;"><b>'+uW.g_js_strings.commonstr.item+':&nbsp;</b><select id="btchUnique1">';
		m += '<option value="0">-- '+uW.g_js_strings.commonstr.items+' --</option>';
		for (var k=0;k<t.chSortArray.length;k++) {
			var champ_item = t.chSortArray[k];
			if (champ_item == null || !champ_item) continue;
			var style = '';
			if (champ_item.Faction == 0) style = 'style="color:#aaa;"';
			m += '<option '+style+' value="' + champ_item.Id + '">' + uW.itemlist["i"+champ_item.Id].name + ' </option>';
		}
		m += '</select></div></td>';

		m += '<td><div style="max-width:100%;"><b>'+uW.g_js_strings.commonstr.item+':&nbsp;</b><select id="btchUnique2">';
		m += '<option value="0">-- '+uW.g_js_strings.commonstr.items+' --</option>';
		for (var k=0;k<t.chSortArray.length;k++) {
			var champ_item = t.chSortArray[k];
			if (champ_item == null || !champ_item) continue;
			var style = '';
			if (champ_item.Faction == 0) style = 'style="color:#aaa;"';
			m += '<option '+style+' value="' + champ_item.Id + '">' + uW.itemlist["i"+champ_item.Id].name + ' </option>';
		}
		m += '</select></div></td>';

		m += '<tr><td><div style="max-width:100%;"><b>'+uW.g_js_strings.commonstr.level+':&nbsp;</b><select id="btchUniqueLevel1">';
		m += '<option value="0" selected>0</option>';
		for (var type_index = 1; type_index < maxlevel + 1; ++type_index) {
			m += '<option value="' + type_index + '">' + type_index + '</option>';
		}
		m += '</select></div></td>';
		m += '<td><div style="max-width:100%;"><b>'+uW.g_js_strings.commonstr.level+':&nbsp;</b><select id="btchUniqueLevel2">';
		m += '<option value="0" selected>0</option>';
		for (var type_index = 1; type_index < maxlevel + 1; ++type_index) {
			m += '<option value="' + type_index + '">' + type_index + '</option>';
		}
		m += '</select></div></td></tr>';

		m += '<tr>';
		m += '<td id="btchUniqueItem1" style="overflow: visible; width: auto; height: auto;"/>';
		m += '<td id="btchUniqueItem2" style="overflow: visible; width: auto; height: auto;"/>';
		m += '</tr>';
		m += '<tr>';
		m += '<td id="btchUniqueInv1" style="overflow: visible; width: auto; height: auto;"/>';
		m += '<td id="btchUniqueInv2" style="overflow: visible; width: auto; height: auto;"/>';
		m += '</tr>';

		m += '</TABLE>';
		m += '</div>';

		div.innerHTML = m;

		ById('btchUniqueSort').addEventListener('click', function (e) {
			t.chSorted = e.target.checked;
			t.PaintCHUniques(div);
		},false)

		jQuery("#btchUniqueType1").change(function () {
			var chType = ById('btchUniqueType1').value;
			var chList = ById('btchUnique1');
			if (selectedType1 != chType && chType != 0) {
				selectedCard1 = 0;
			}
			jQuery("#btchUnique1").empty();
			var chOption = document.createElement('option');
			chOption.text = '-- '+uW.g_js_strings.commonstr.items+' --';
			chOption.value = 0;
			chList.add(chOption);
			for (var k=0;k<t.chSortArray.length;k++) {
				var champ_item = t.chSortArray[k];
				if (champ_item == null || !champ_item) continue;
				if (chTypeStrings[parseInt(champ_item.Type)-1] == chType || chType == 0) {
					var chOption = document.createElement('option');
					chOption.text = uW.itemlist["i"+champ_item.Id].name;
					chOption.value = champ_item.Id;
					if (champ_item.Faction == 0) chOption.style = 'color:#aaa;';
					chList.add(chOption);
				}
			}

			if (selectedCard1 != 0) {
				jQuery("#btchUnique1").val(selectedCard1);
			}

		});

		jQuery("#btchUniqueType2").change(function () {
			var chType = ById('btchUniqueType2').value;
			var chList = ById('btchUnique2');
			if (selectedType2 != chType && chType != 0) {
				selectedCard2 = 0;
			}
			jQuery("#btchUnique2").empty();
			var chOption = document.createElement('option');
			chOption.text = '-- '+uW.g_js_strings.commonstr.items+' --';
			chOption.value = 0;
			chList.add(chOption);
			for (var k=0;k<t.chSortArray.length;k++) {
				var champ_item = t.chSortArray[k];
				if (champ_item == null || !champ_item) continue;
				if (chTypeStrings[parseInt(champ_item.Type)-1] == chType || chType == 0) {
					var chOption = document.createElement('option');
					chOption.text = uW.itemlist["i"+champ_item.Id].name;
					chOption.value = champ_item.Id;
					if (champ_item.Faction == 0) chOption.style = 'color:#aaa;';
					chList.add(chOption);
				}
			}

			if (selectedCard2 != 0) {
				jQuery("#btchUnique2").val(selectedCard2);
			}

		});

		jQuery("#btchUnique1").change(function () { changeUnique1(this); });

		jQuery("#btchUnique1").keyup(function (event) { changeUnique1(this); });

		function changeUnique1(thisObj) {
			var chID = jQuery(thisObj).val();
			var chDisplay = ById('btchUniqueItem1');
			var chLevel = ById('btchUniqueLevel1');
			selectedCard1 = 0;
			ConvertToCard(chID,chDisplay,chLevel);
			t.GetCHInventory(chID,'btchUniqueInv1');
			selectedCard1 = chID;
			selectedType1 = chTypeStrings[parseInt(t.UniqueCHItems[chID].Type)-1];

		}

		jQuery("#btchUnique2").change(function () { changeUnique2(this); });

		jQuery("#btchUnique2").keyup(function (event) { changeUnique2(this); });

		function changeUnique2(thisObj) {
			var chID = jQuery(thisObj).val();
			var chDisplay = ById('btchUniqueItem2');
			var chLevel = ById('btchUniqueLevel2');
			selectedCard2 = 0;
			ConvertToCard(chID,chDisplay,chLevel);
			t.GetCHInventory(chID,'btchUniqueInv2');
			selectedCard2 = chID;
			selectedType2 = chTypeStrings[parseInt(t.UniqueCHItems[chID].Type)-1];
		}

		jQuery("#btchUniqueLevel1").keyup(function (event) { changeLevel1(); });

		jQuery("#btchUniqueLevel1").change(function () { changeLevel1(); });

		function changeLevel1() {
			if (selectedCard1 != 0) {
				var chID = selectedCard1;
				var chDisplay = ById('btchUniqueItem1');
				var chLevel = ById('btchUniqueLevel1');
				chDisplay.innerHTML = '';
				ConvertToCard(chID,chDisplay,chLevel);
			}
		}

		jQuery("#btchUniqueLevel2").keyup(function (event) { changeLevel2(); });

		jQuery("#btchUniqueLevel2").change(function () { changeLevel2(); });

		function changeLevel2() {
			if (selectedCard2 != 0) {
				var chID = selectedCard2;
				var chDisplay = ById('btchUniqueItem2');
				var chLevel = ById('btchUniqueLevel2');
				chDisplay.innerHTML = '';
				ConvertToCard(chID,chDisplay,chLevel);
			}
		}

		function ConvertToCard (chID,div,lvl) {
			div.innerHTML = '';
			var CHCard = t.BuildChampCard(chID,parseIntNan(lvl.value));
			div.innerHTML = t.DisplayCHCard(CHCard,true);
		};
	},

	BuildChampCard : function (chID,lvl) {
		var t = Tabs.Reference;
		var CHCard = {};
		CHCard = t.UniqueCHItems[chID];
		CHCard.uniqueCompare = true;
		CHCard.id = CHCard.Id;
		CHCard.name = uW.itemlist["i"+chID].name;
		if (CHCard.Faction != 0) {
			CHCard.faction = CHCard.Faction;
			CHCard.type = CHCard.Type;
		}
		else {
			CHCard.unknown = true;
		}
		CHCard.unique = CHCard.id;
		CHCard.level = lvl;
		CHCard.rarity = 5;
		CHCard.createPrefix = function () { return ""; };
		CHCard.createSuffix = function () { return ""; };
		CHCard.effects = {};
		var effects = eval(CHCard.Effects);
		var slot = 0;
		for (var k in effects) {
			slot++
			CHCard.effects["slot"+slot] = {};
			CHCard.effects["slot"+slot].id = effects[k].type;
			CHCard.effects["slot"+slot].tier = effects[k].tier;
		}
		return CHCard;
	},

	isBroken : function(champ_item) {
		if (champ_item.status) {
			return (champ_item.status < 0 || champ_item.status == 2 || champ_item.status == 3);
		}
	},

	GetCHInventory : function (chID,div) {
		var t = Tabs.Reference;
		div.innerHTML = '';
		var m = '<br><b>'+uW.g_js_strings.champ.title+'</b><br>';
		var chitem = {};
		for (var k in uW.kocChampionItems) {
			var champ_item = uW.kocChampionItems[k];
			if (champ_item.unique == chID) {
				if (chitem[champ_item.level]) {chitem[champ_item.level]++} else {chitem[champ_item.level] = 1;}
			}
		}
		var gotitem = false;
		for (var l in chitem) {
			gotitem = true;
			m += tx('You have')+' '+chitem[l]+' '+tx('at level')+' '+l+'<br>';
		}
		if (!gotitem) m += tx('You have none in your champion hall')+'.<br>';
		else {
			if (t.UniqueCHItems[chID].Faction == 0) {
				m += '<a class=xlink id=pbgenchstats'+chID+'>Generate Stats</a><br>';
			}
		}

		m += '<br><b>'+uW.g_js_strings.commonstr.inventory+'</b><br>';
		var inv = uW.seed.items['i'+chID];
		m += tx('You have')+' '+(inv?inv:uW.g_js_strings.commonstr.none)+' '+tx('in your inventory')+'.';
		if ((inv?inv:0) != 0) {
			m += '<br><a class=xlink onClick="cm.ItemController.use(\''+chID+'\');setTimeout(function(){pbrefreshchuniques('+chID+',\''+div+'\')},2000);">'+tx('Add to Champion Hall')+'</a>';
		}
		ById(div).innerHTML = m;
		if (ById('pbgenchstats'+chID)) {
			ById('pbgenchstats'+chID).addEventListener('click',function () { window.prompt(tx("Copy to clipboard: Ctrl+C"), GenerateStats(chID)); } , false);
		}

		function GenerateStats(chID) {
			for (var k in uW.kocChampionItems) {
				var champ_item = uW.kocChampionItems[k];
				if (champ_item.unique == chID) {
					var Results = 'UniqueItems["'+chID+'"] = {Id:'+chID+',Name:"'+champ_item.subtype+'", Effects:[';
					var firsteffect = true;
					for (var e in champ_item.effects) {
						if (!firsteffect) Results += ',';
						Results += '{type:'+champ_item.effects[e].id+',tier:'+champ_item.effects[e].tier+'}';
						firsteffect = false;
					}
					Results += '],Faction:'+champ_item.faction+',Type:'+champ_item.type+',Set:'+champ_item.set+'};';
					break;
				}
			}
			return Results;
		}
	},

	DisplayCHCard : function (champ_item,Links,ScaleFactor,showChamp) {
		var t = Tabs.Reference;
		var D = [];
		if (champ_item == null) {
			D.push("<div>");
			D.push("</div>");
			return D.join("");
		}

		if (!ScaleFactor) { ScaleFactor = 1; }
		var CardWidth = Math.floor(220*ScaleFactor);
		var BigFont = Math.floor(14*ScaleFactor);
		var ImageSize = Math.floor(70*ScaleFactor);
		var SmallFont = Math.floor(12*ScaleFactor);

		if (champ_item.rarity) champ_item.quality = parseIntNan(champ_item.rarity);
		if (!champ_item.Type) champ_item.Type = parseIntNan(champ_item.type);

		var E = []; // copy to clip/post to chat array

		D.push("<div style='overflow: hidden; position: relative; left: 0px; top: 0px;'>");
		D.push("<div id='throneInventoryItemTooltip'>");
		D.push("<div class='section' style='overflow:visible;background:#E7E3D6;width:"+CardWidth+"px;color:#3f2300;' id='idsection'>");
		D.push("<div class='title " + champ_item.createPrefix().toLowerCase() + "' style='text-transform:capitalize;background:#E7E3D6;border-bottom:2px solid #A4753A;font-size:"+BigFont+"px;'> ");
		D.push(champ_item.name + (champ_item.uniqueCompare ? " +" + champ_item.level : ""));
		D.push("</div>");
		D.push("<div class='description' style='border-bottom:2px solid #A4753A;'>");
		var uniquestyle = "";
		if (t.isBroken(champ_item)) {
			uniquestyle = 'width:'+ImageSize+'px;height:'+ImageSize+'px;background:transparent url('+BrokenIcon+'); top left no-repeat; background-size:'+ImageSize+'px '+ImageSize+'px;';
		}
		else {
			if (champ_item.unique != 0) { uniquestyle = 'width:'+ImageSize+'px;height:'+ImageSize+'px;background:transparent url('+IMGURL+'champion_hall/unique_'+champUniqueImageTypes[champ_item.Type-1]+'_'+cardFaction[champ_item.faction-1]+'_70x70_'+champ_item.unique + '.png); top left no-repeat; background-size:'+ImageSize+'px '+ImageSize+'px;'; }
			else { uniquestyle = 'width:'+ImageSize+'px;height:'+ImageSize+'px;background:transparent url('+IMGURL+'champion_hall/'+cardQuality[champ_item.rarity].toLowerCase()+'_'+champImageTypes[champ_item.Type-1]+'_'+cardFaction[champ_item.faction-1]+'_70x70.png); top left no-repeat; background-size:'+ImageSize+'px '+ImageSize+'px;'; }
		}
		D.push("<div class='portrait " + champ_item.faction + " " + champ_item.type + "' style='border:none;margin-left:3px;margin-top:8px;"+uniquestyle+"'> </div> ");
		D.push("<ul>");
		D.push("<li style='float:none;margin:0px;color:#A4753A;font-size:"+SmallFont+"px;'> " + uW.g_js_strings.commonstr.faction + ": " + (champ_item.unknown?"Unknown":uW.g_js_strings.commonstr[cardFaction[champ_item.faction-1]]) + "</li>");
		D.push("<li style='float:none;margin:0px;color:#A4753A;font-size:"+SmallFont+"px;'> " + uW.g_js_strings.commonstr.quality + ": " + CardQuality(champ_item.rarity,champ_item.unique) + "</li>");
		D.push("<li style='float:none;margin:0px;color:#A4753A;font-size:"+SmallFont+"px;'> " + uW.g_js_strings.commonstr.type + ": " + (champ_item.unknown?"Unknown":uW.g_js_strings.champ[chTypeStrings[champ_item.type-1]]) + "</li>");
		D.push("<li style='float:none;margin:0px;color:#A4753A;font-size:"+SmallFont+"px;'> " + uW.g_js_strings.commonstr.level + ": " + champ_item.level + "</li>");
		D.push("<li style='float:none;margin:0px;color:#A4753A;font-size:"+SmallFont+"px;'> " + uW.g_js_strings.commonstr.might + ": " + CardMight(champ_item,true) + "</li>");
		if (showChamp && champ_item.equippedTo) {
			for (var y in Seed.champion.champions) {
				var chkchamp = Seed.champion.champions[y];
				if (chkchamp.championId && chkchamp.championId==champ_item.equippedTo) {
					D.push("<li style='float:none;margin:0px;color:#A4753A;font-size:"+SmallFont+"px;'> " + tx('Equipped') + ": " + chkchamp.name + "</li>");
					break;
				}
			}
		}
		D.push("</ul>");
		D.push("</div>");
		D.push("<ul>");

		E.push(champ_item.name.replace(/\'/g, "") + (champ_item.uniqueCompare ? " +" + champ_item.level : ""));
		E.push(uW.g_js_strings.commonstr.faction + ": " + (champ_item.unknown?"Unknown":uW.g_js_strings.commonstr[cardFaction[champ_item.faction-1]]));
		E.push(uW.g_js_strings.commonstr.quality + ": " + CardQuality(champ_item.rarity,champ_item.unique));
		E.push(uW.g_js_strings.commonstr.type + ": " + (champ_item.unknown?"Unknown":uW.g_js_strings.commonstr[cardFaction[champ_item.faction-1]]));
//		E.push(uW.g_js_strings.commonstr.level + ": " + champ_item.level);
		E.push(uW.g_js_strings.commonstr.might + ": " + CardMight(champ_item,true));

		if (champ_item.unknown) {
			if (Links) {
				D.push(" <li style='font-size:"+BigFont+"px;' class='effect'><center>"+tx("Unknown")+"</center></li> ");
				D.push(" <li style='font-size:"+BigFont+"px;' class='effect'><div style='font-size:"+SmallFont+"px;'><center>"+tx("If you have one in your Champions Hall please click the 'Generate Stats' link below and send the results to the script developer")+".</center></div></li>");
			}
		}
		else {
			for (var slot in champ_item.effects) {
				try {
					var N = champ_item.effects[slot];
					effect = uW.g_js_strings.effects["name_"+N.id];

					tier = parseInt(N.tier);
					p = ChampionStatTiers[N.id][tier];
					while (!p && (tier > 0)) { tier--; p = ChampionStatTiers[N.id][tier]; }
					if (!p) continue; // can't find stats for tier

					var base = +p.base || 0;
					var level = +champ_item.level || 0;
					var growth = +p.growth || 0;
					percent = Number(base + ((level * level + level) * growth * 0.5));
					if (N.id>=300) {
						percent = Number(base + (level * growth));
						if (N.id<400) percent = percent*100;
					}
					var wholeNumber = false;
					if (Math.round(parseFloat(percent)) == parseFloat(percent)) wholeNumber = true;
					percent = (percent > 0) ? percent : +percent;
					if (wholeNumber)
						percent = parseFloat(percent).toFixed(0);
					else
						percent = parseFloat(percent).toFixed(2);
					css = (slot % 2 === 0) ? "even" : "odd";
					B = +(slot.split("slot")[1]);
					if (!B) B = slot;
					percent = (N.id>=300)?percent+'%':percent;
					if (B <= champ_item.rarity) {
						if (N.id < 200) {
							D.push(" <li title='tier "+tier+"' class='effect " + css + "' style='float:none;margin:0px;color: #1751A5;font-size:"+BigFont+"px;'> " + percent + " " + effect + " </li> ");
						}
						else {
							if (N.id >= 400) {
								D.push(" <li title='tier "+tier+"' class='effect " + css + "' style='float:none;margin:0px;color: #f80;font-size:"+BigFont+"px;'> " + percent + " " + effect + " </li> ");
							}
							else {
								if (N.id >= 300) {
									D.push(" <li title='tier "+tier+"' class='effect " + css + "' style='float:none;margin:0px;color: #808;font-size:"+BigFont+"px;'> " + percent + " " + effect + " </li> ");
								}
								else {
									D.push(" <li title='tier "+tier+"' class='effect " + css + "' style='float:none;margin:0px;font-size:"+BigFont+"px;'> " + percent + " " + effect + " </li> ");
								}
							}
						}
					} else {
						D.push(" <li title='tier "+tier+"' class='effect disabled " + css + "' style='float:none;margin:0px;font-size:"+BigFont+"px;'> " + percent + " " + effect + " </li> ");
					}
					E.push("Row " + B + ": " + percent + " " + effect);
				}
				catch (e) { }
			}
		}
		D.push(" </ul> ");
		D.push(" </div> ");
		D.push(" </ul> ");
		D.push(" </div> ");
		D.push(" </div> ");

		var cText = ":::. |" + E.join('||');
		var clipText = E.join('	 ');
		if (Links) {
			D.push('<table width="210" class=xtab><tr><td><a class=xlink onClick="window.prompt(\''+tx("Copy to clipboard: Ctrl+C")+'\', \''+clipText+'\');">'+tx("Copy to Clipboard")+'</a></td><td align=right><a class=xlink onClick="Chat.sendChat(\''+cText+'\')">'+tx("Post to Chat")+'</a></td></tr></table>');
		}
		return D.join("");
	},
}
