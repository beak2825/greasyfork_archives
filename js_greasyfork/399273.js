/****************************  Unit Stats Calculator Tab  ******************************/
// @tabversion 20180605

Tabs.UnitCalc = {
	tabOrder: 1130,
	tabLabel: 'UnitCalc',
	myDiv: null,
	UnitStats : {},
	Subscriber : false,
	woodGuardTable: [0,1,2,3,4,6,8,10,13,16,20,25,35],
	oreGuardTable: [0,2,4,6,8,12,16,20,26,32,40,50,65],

	init: function (div) {
		var t = Tabs.UnitCalc;

		t.Subscriber = CM.QueueModel.hasFreeQueue();

		for (var ui in uW.cm.UNIT_TYPES) {
			i = uW.cm.UNIT_TYPES[ui];
			stats = uW.unitstats['unt' + i]; // Life, Attack, Defense, Speed, Range, Load, Might, SpellPower
			var NewObj = {};
			NewObj.Type = capitalize(uW.cm.unitFrontendType[i]);
			NewObj.Name = uW.unitnamedesctranslated['unt'+i][0];
			NewObj.Life = {0:stats[0],1:stats[0]};
			NewObj.Attack = {0:stats[1],1:stats[1]};
			NewObj.Defense = {0:stats[2],1:stats[2]};
			NewObj.Speed = {0:stats[3],1:stats[3]};
			NewObj.Range = {0:stats[4],1:stats[4]};
			NewObj.Load = {0:stats[5],1:stats[5]};
			NewObj.SpellPower = {0:stats[7],1:stats[7]};
			t.UnitStats[i] = NewObj;
		}

//		for (var k in uW.fortcost) { TODO
//			fi = k.substring(3);
//			stats = uW.fortstats['unt' + fi]; // Life, Attack, Defense, Speed, Range, Space
//			var dtype = 'Field';
//			if (fi < 60 || fi==63) { dtype = 'Wall'; }
//			cost = uW.fortcost[k];
//			var name = cost[0].replace(tx('Defensive'), '');
//			name = name.replace(tx('Wall-Mounted'), '');

//			var NewObj = {};
//			NewObj.Type = dtype;
//			NewObj.Name = name;
//			NewObj.Life = {0:stats[0],1:stats[0]};
//			NewObj.Attack = {0:stats[1],1:stats[1]};
//			NewObj.Defense = {0:stats[2],1:stats[2]};
//			NewObj.Speed = {0:stats[3],1:stats[3]};
//			NewObj.Range = {0:stats[4],1:stats[4]};
//			NewObj.Load = {0:stats[5],1:stats[5]};
//			NewObj.SpellPower = {0:0,1:0};
//			t.UnitStats[fi] = NewObj;
//		}

		t.myDiv = div;

		var m = '';
		m += '<div class="divHeader" align="center">'+tx('UNIT STATS')+'</div>';
		m += '<div id=btUnitStatsDiv style="maxheight:700px; height:700px; overflow-y:scroll;"></div><br>';

		t.myDiv.innerHTML = m;

		t.paintUnitStatsCalc();
	},

	show: function (init) {
		var t = Tabs.UnitCalc;
	},

	paintUnitStatsCalc: function () {
		var t = Tabs.UnitCalc;

		var m = '<table class=xtab width=100%>';
		m += '<tr style="vertical-align:top"><td width=50%>';

		m += '<div>';

		var r=0;

		m += '<table cellpadding=1 cellspacing=0 width=100%><TR valign=bottom align=right><TH class=xtabHD>&nbsp;</th><TH class=xtabHD>'+tx('Type')+'</th><TH class=xtabHD>'+uW.g_js_strings.commonstr.life+'</th><TH class=xtabHD>'+uW.g_js_strings.commonstr.atk+'</th><TH class=xtabHD>'+tx('Def')+'</th><TH class=xtabHD>'+uW.g_js_strings.commonstr.speed+'</th><TH class=xtabHD>'+uW.g_js_strings.commonstr.range+'</th><TH class=xtabHD>'+tx('Spell')+'</th></tr>';
		for (var i in t.UnitStats) {
			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }
			m += '<tr class="'+rowClass+'"><td><b>'+TroopImage(i,"vertical-align:middle;")+t.UnitStats[i].Name+'</b></td><td align=right>'+tx(t.UnitStats[i].Type)+'</td>';
			m += '<td id="ptucTrp'+i+'Life" align=right>'+t.UnitStats[i].Life[1]+'</td>';
			m += '<td id="ptucTrp'+i+'Atk" align=right>'+t.UnitStats[i].Attack[1]+'</td>';
			m += '<td id="ptucTrp'+i+'Def" align=right>'+t.UnitStats[i].Defense[1]+'</td>';
			m += '<td id="ptucTrp'+i+'Spd" align=right>'+t.UnitStats[i].Speed[1]+'</td>';
			m += '<td id="ptucTrp'+i+'Rng" align=right>'+t.UnitStats[i].Range[1]+'</td>';
			m += '<td id="ptucTrp'+i+'Spell" align=right>'+((t.UnitStats[i].Type=="Spellcaster")?t.UnitStats[i].SpellPower[1]:"")+'</td>';
			m += '</tr>';
		}
		m += '</table></div>';
		m += '</td>';

		m += '<td width=50% style="vertical-align:top;padding-right:0px;">'
		m += '<a id=cfgMiscHdr class=divLink><div class="divHeader" align=left>'+tx('MISC ADJUSTMENTS')+'&nbsp;<img id=cfgMiscArrow height="10" src="' + DownArrow + '"></div></a>';
		m += '<div id=cfgMisc align=left class="">';
		m += '<input id=ptucDefending type=radio name=ptucDefAtk checked><b>'+tx('Defending')+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id=ptucAttacking type=radio name=ptucDefAtk>'+tx('Attacking')+'</b><br>';
		m += '&nbsp;'+tx('Knight Combat Skill')+':&nbsp;<input id="ptucKnightLevel" type=text value=300 size=4><br>';
		m += '<input id=ptucFeyAltarActive type=checkbox unchecked>'+tx('Sacrifice Active')+'&nbsp;-&nbsp;'+tx('Sacrifice Bonus')+':&nbsp;<input id=ptucFeyAltarBonus type=text value=40 size=4>&nbsp;%<br>';
		m += '<input id=ptucOrder type=checkbox '+(t.Subscriber?'checked':'')+'>'+tx('Order of the Round Table Subscriber')+'<br>&nbsp;</div>';

		m += '<a id=cfgItemsHdr class=divLink><div class="divHeader" align=left>'+tx('ITEM BOOSTS')+'&nbsp;<img id=cfgItemsArrow height="10" src="' + DownArrow + '"></div></a>';
		m += '<div id=cfgItems align=left class="">';
		m += '<table class=xtab cellpadding=2 cellspacing=0 width=100%>';
		m += '<tr class=evenRow><td><b>'+tx('Attack')+'</b></td><td><input id=ptucItemAtkNone type=radio name=ptucItemAtk checked>'+tx('None')+'</td><td><input id=ptucItemAtk20 type=radio name=ptucItemAtk >20%</td><td><input id=ptucItemAtk50 type=radio name=ptucItemAtk >50%</td></tr>';
		m += '<tr class=oddRow><td><b>'+tx('Defense')+'</b></td><td><input id=ptucItemDefNone type=radio name=ptucItemDef checked>'+tx('None')+'</td><td><input id=ptucItemDef20 type=radio name=ptucItemDef >20%</td><td><input id=ptucItemDef50 type=radio name=ptucItemDef >50%</td></tr>';
		m += '<tr class=evenRow><td><b>'+tx('Health')+'</b></td><td><input id=ptucItemLifeNone type=radio name=ptucItemLife checked>'+tx('None')+'</td><td><input id=ptucItemLife10 type=radio name=ptucItemLife >10%</td><td>&nbsp;</td></tr>';
		m += '<tr class=oddRow><td><b>'+tx('Spells')+'</b></td><td><input id=ptucItemSpellNone type=radio name=ptucItemSpell checked>'+tx('None')+'</td><td><input id=ptucItemSpell25 type=radio name=ptucItemSpell >25%</td><td>&nbsp;</td></tr>';
		m += '</table><br>&nbsp;</div>';

		m += '<a id=cfgGuardianHdr class=divLink ><div class="divHeader"  align=left>'+tx('GUARDIANS')+'&nbsp;<img id=cfgGuardianArrow height="10" src="' + DownArrow + '"></div></a>';
		m += '<div id=cfgGuardian align=left class="">';
		m += '<input id=ptucGuardSet type=checkbox unchecked>'+tx('Set Bonus Active')+'<br>';
		m += '<table class=xtab cellspacing=0 cellpadding=2 width=100%><tr><td>&nbsp;</td><td align=center><b>'+tx('Wood')+'</b></td><td align=center><b>'+tx('Ore')+'</b></td><td align=center><b>'+tx('Food')+'</b></td><td align=center><b>'+tx('Stone')+'</b></td></tr>';
		m += '<tr><td><b>'+tx('Active')+'</b></td><td align=center><input id=ptucWoodAct type=radio name=ptucGuard checked></td><td align=center><input id=ptucOreAct type=radio name=ptucGuard></td><td align=center><input id=ptucFoodAct type=radio name=ptucGuard></td><td align=center><input id=ptucStoneAct type=radio name=ptucGuard></td></tr>';
		m += '<tr><td><b>'+tx('Level')+'</b></td><td align=center><input id=ptucWood type=text value=9 size=4></td><td align=center><input id=ptucOre type=text value=9 size=4></td><td align=center><input id=ptucFood type=text value=9 size=4></td><td align=center><input id=ptucStone type=text value=9 size=4></td></tr>';
		m += '</table><br>&nbsp;</div>';

		m += '<a id=cfgFeyHdr class=divLink ><div class="divHeader"  align=left>'+tx('FEY CITY BLESSINGS')+'&nbsp;<img id=cfgFeyArrow height="10" src="' + DownArrow + '"></div></a>';
		m += '<div id=cfgFey align=left class="">';
		m += '<div><input id=ptucBloodBless type=checkbox unchecked><span title="'+uW.g_js_strings.blessingSystem.blessing_description_208+'">'+uW.g_js_strings.blessingSystem.blessing_name_208+'</span></div>';
		m += '<div><input id=ptucOreBless type=checkbox unchecked><span title="'+uW.g_js_strings.blessingSystem.blessing_description_209+'">'+uW.g_js_strings.blessingSystem.blessing_name_209+'</span></div>';
		m += '<br>&nbsp;</div>';

		m += '<a id=cfgThroneHdr class=divLink ><div class="divHeader"  align=left>'+tx('THRONE ROOM TROOP STATS')+'&nbsp;<img id=cfgThroneArrow height="10" src="' + DownArrow + '"></div></a>';
		m += '<div id=cfgThrone align=left class="">';
		m += '<table cellspacing=0 cellpadding=0 class=xtab width=100%>';
		m += '<tr><td><b>&nbsp;</b></td><td><b>Life</b></td><td><b>Atk</b></td><td><b>Def</b></td><td><b>Spd</b></td><td><b>Rng</b></td><td><b>Spell</b></td></tr>';
		m += '<tr class=oddRow><td>'+tx('General Buffs')+'</td><td><input id=ptucLifeMod type=text value=0 size=4></td><td><input id=ptucAtkMod type=text value=0 size=4></td><td><input id=ptucDefMod type=text value=0 size=4></td><td><input id=ptucSpdMod type=text value=0 size=4></td><td><input id=ptucRngMod type=text value=0 size=4></td><td>&nbsp;</td></tr>';
		m += '<tr class=evenRow><td>'+tx('Infantry Buffs')+'</td><td><input id=ptucLifeModInf type=text value=0 size=4></td><td><input id=ptucAtkModInf type=text value=0 size=4></td><td><input id=ptucDefModInf type=text value=0 size=4></td><td><input id=ptucSpdModInf type=text value=0 size=4></td><td><input id=ptucRngModInf type=text value=0 size=4></td><td>&nbsp;</td></tr>';
		m += '<tr class=oddRow><td>'+tx('Ranged Buffs')+'</td><td><input id=ptucLifeModRng type=text value=0 size=4></td><td><input id=ptucAtkModRng type=text value=0 size=4></td><td><input id=ptucDefModRng type=text value=0 size=4></td><td><input id=ptucSpdModRng type=text value=0 size=4></td><td><input id=ptucRngModRng type=text value=0 size=4></td><td>&nbsp;</td></tr>';
		m += '<tr class=evenRow><td>'+tx('Siege Buffs')+'</td><td><input id=ptucLifeModSig type=text value=0 size=4></td><td><input id=ptucAtkModSig type=text value=0 size=4></td><td><input id=ptucDefModSig type=text value=0 size=4></td><td><input id=ptucSpdModSig type=text value=0 size=4></td><td><input id=ptucRngModSig type=text value=0 size=4></td><td>&nbsp;</td></tr>';
		m += '<tr class=oddRow><td>'+tx('Horsed Buffs')+'</td><td><input id=ptucLifeModHor type=text value=0 size=4></td><td><input id=ptucAtkModHor type=text value=0 size=4></td><td><input id=ptucDefModHor type=text value=0 size=4></td><td><input id=ptucSpdModHor type=text value=0 size=4></td><td><input id=ptucRngModHor type=text value=0 size=4></td><td>&nbsp;</td></tr>';
		m += '<tr class=evenRow><td>'+tx('Spellcaster Buffs')+'</td><td><input id=ptucLifeModSpl type=text value=0 size=4></td><td><input id=ptucAtkModSpl type=text value=0 size=4></td><td><input id=ptucDefModSpl type=text value=0 size=4></td><td><input id=ptucSpdModSpl type=text value=0 size=4></td><td><input id=ptucRngModSpl type=text value=0 size=4></td><td><input id=ptucSpellModSpl type=text value=0 size=4></td></tr>';
		m += '</table><br>&nbsp;</div>';
		
		m += '<a id=cfgChampHdr class=divLink ><div class="divHeader"  align=left>'+tx('CHAMPION TROOP STATS')+'&nbsp;<img id=cfgChampArrow height="10" src="' + DownArrow + '"></div></a>';
		m += '<div id=cfgChamp align=left class="">';
		m += '<table cellspacing=0 cellpadding=0 class=xtab width=100%>';
		m += '<tr><td><b>&nbsp;</b></td><td><b>Life</b></td><td><b>Atk</b></td><td><b>Def</b></td><td><b>Spd</b></td><td><b>Rng</b></td><td><b>Spell</b></td></tr>';
		m += '<tr class=oddRow><td></td><td><input id=ptucLifeChampMod type=text value=0 size=4></td><td><input id=ptucAtkChampMod type=text value=0 size=4></td><td><input id=ptucDefChampMod type=text value=0 size=4></td><td><input id=ptucSpdChampMod type=text value=0 size=4></td><td><input id=ptucRngChampMod type=text value=0 size=4></td><td><input id=ptucSpellChampMod type=text value=0 size=4></td></tr>';
		m += '</table><br>&nbsp;</div>';
		
		m += '<a id=cfgResearchHdr class=divLink><div class="divHeader" align=left>'+tx('RESEARCH')+'&nbsp;<img id=cfgResearchArrow height="10" src="' + DownArrow + '"></div></a>';
		m += '<div id=cfgResearch align=left class="">';
		m += '<table cellspacing=0 cellpadding=0 class=xtab width=100%><tr><td valign=top width=50%><table cellspacing=0 cellpadding=2 width=100%>';
		m += '<tr><td colspan=3><b>'+tx('Research')+'</b></td></tr>';
		m += '<tr class=oddRow><td title="'+uW.techcost.tch8[10]+'">'+uW.techcost.tch8[0]+'</td><td><input id=ptucResPE type=text value="'+(Seed.tech.tch8||'')+'" size=4></td><td id=ptucResPEEff></td></tr>';
		m += '<tr class=evenRow><td title="'+uW.techcost.tch9[10]+'">'+uW.techcost.tch9[0]+'</td><td><input id=ptucResMA type=text value="'+(Seed.tech.tch9||'')+'" size=4></td><td id=ptucResMAEff></td></tr>';
		m += '<tr class=oddRow><td title="'+uW.techcost.tch12[10]+'">'+uW.techcost.tch12[0]+'</td><td><input id=ptucResAH type=text value="'+(Seed.tech.tch12||'')+'" size=4></td><td id=ptucResPAHff></td></tr>';
		m += '<tr class=evenRow><td title="'+uW.techcost.tch13[10]+'">'+uW.techcost.tch13[0]+'</td><td><input id=ptucResFL type=text value="'+(Seed.tech.tch13||'')+'" size=4></td><td id=ptucResFLEff</td></tr>';
		m += '<tr class=oddRow><td title="'+uW.techcost.tch15[10]+'">'+uW.techcost.tch15[0]+'</td><td><input id=ptucResHP type=text value="'+(Seed.tech.tch15||'')+'" size=4></td><td id=ptucResHPEff></td></tr>';
		m += '</table></td><td valign=top width=50%><table cellspacing=0 cellpadding=2 width=100%>';
		m += '<tr><td colspan=3><b>'+tx('Briton Research')+'</b></td></tr>';
		m += '<tr class=oddRow><td title="'+uW.techcost2.tch5[10]+'">'+uW.techcost2.tch5[0]+'</td><td><input id=ptucResSR type=text value="'+(Seed.tech2.tch5||'')+'" size=4></td><td id=ptucResSREff></td></tr>';
		m += '<tr class=evenRow><td title="'+uW.techcost2.tch6[10]+'">'+uW.techcost2.tch6[0]+'</td><td><input id=ptucResIF type=text value="'+(Seed.tech2.tch6||'')+'" size=4></td><td id=ptucResIFEff></td></tr>';
		m += '</table></td></tr></table><br>&nbsp;</div>';

		m += '</td></tr></table>';

		ById('btUnitStatsDiv').innerHTML = m;

		ById('cfgResearchHdr').addEventListener('click', function () {
			ToggleMainDivDisplay("UnitCalc",500, 500, "cfgResearch");
		}, false);
		ById('cfgGuardianHdr').addEventListener('click', function () {
			ToggleMainDivDisplay("UnitCalc",500, 500, "cfgGuardian");
		}, false);
		ById('cfgItemsHdr').addEventListener('click', function () {
			ToggleMainDivDisplay("UnitCalc",500, 500, "cfgItems");
		}, false);
		ById('cfgFeyHdr').addEventListener('click', function () {
			ToggleMainDivDisplay("UnitCalc",500, 500, "cfgFey");
		}, false);
		ById('cfgThroneHdr').addEventListener('click', function () {
			ToggleMainDivDisplay("UnitCalc",500, 500, "cfgThrone");
		}, false);
		ById('cfgChampHdr').addEventListener('click', function () {
			ToggleMainDivDisplay("UnitCalc",500, 500, "cfgChamp");
		}, false);
		ById('cfgMiscHdr').addEventListener('click', function () {
			ToggleMainDivDisplay("UnitCalc",500, 500, "cfgMisc");
		}, false);

		// Event listener Order of the Round Table
		ById('ptucOrder').addEventListener('change', function (e) {
			t.SubScriber = ById('ptucOrder').checked;
			t.modifyUnitResearch();
		}, false);
		// Event listener Knight Level
		ById('ptucKnightLevel').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 1;
			if (e.target.value < 1) alert('Enter positive numbers!');
			t.modifyUnitResearch();
		}, false);
		// Event listener Fey Altar
		ById('ptucFeyAltarActive').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucFeyAltarBonus').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 1;
			if (e.target.value < 1 || e.target.value > 40) alert('Enter a numbers between 1-40!');
			t.modifyUnitResearch();
		}, false);
		// Event listener Guardian
		ById('ptucWood').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			if (e.target.vale > 12) alert('Enter a number between 0-12!');
			t.modifyUnitResearch();
		}, false);
		ById('ptucOre').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			if (e.target.vale > 12) alert('Enter a number between 0-12!');
			t.modifyUnitResearch();
		}, false);
		ById('ptucFood').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			if (e.target.vale > 12) alert('Enter a number between 0-12!');
			t.modifyUnitResearch();
		}, false);
		ById('ptucStone').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			if (e.target.vale > 12) alert('Enter a number between 0-12!');
			t.modifyUnitResearch();
		}, false);
		ById('ptucWoodAct').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucOreAct').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucFoodAct').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucStoneAct').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucGuardSet').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucDefending').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucAttacking').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucOreBless').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucBloodBless').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		//Event listener Item Boosts
		ById('ptucItemAtkNone').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucItemAtk20').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucItemAtk50').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucItemDefNone').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucItemDef20').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucItemDef50').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucItemLifeNone').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucItemLife10').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucItemSpellNone').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		ById('ptucItemSpell25').addEventListener('change', function (e) {
			t.modifyUnitResearch();
		}, false);
		// Event listener Research Level
		ById('ptucResHP').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			if (e.target.value < 0 || e.target.vale > 12) alert('Enter a number between 0-12!');
			t.modifyUnitResearch();
		}, false);
		ById('ptucResPE').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			if (e.target.value < 0 || e.target.vale > 12) alert('Enter a number between 0-12!');
			t.modifyUnitResearch();
		}, false);
		ById('ptucResMA').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			if (e.target.value < 0 || e.target.vale > 12) alert('Enter a number between 0-12!');
			t.modifyUnitResearch();
		}, false);
		ById('ptucResAH').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			if (e.target.value < 0 || e.target.vale > 12) alert('Enter a number between 0-12!');
			t.modifyUnitResearch();
		}, false);
		ById('ptucResFL').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			if (e.target.value < 0 || e.target.vale > 12) alert('Enter a number between 0-12!');
			t.modifyUnitResearch();
		}, false);
		ById('ptucResSR').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			if (e.target.value < 0 || e.target.vale > 10) alert('Enter a number between 0-10!');
			t.modifyUnitResearch();
		}, false);
		ById('ptucResIF').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			if (e.target.value < 0 || e.target.vale > 10) alert('Enter a number between 0-10!');
			t.modifyUnitResearch();
		}, false);
		// Event listener Throne
		ById('ptucLifeMod').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucLifeModInf').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucLifeModRng').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucLifeModSig').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucLifeModHor').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucLifeModSpl').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucAtkMod').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucAtkModInf').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucAtkModRng').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucAtkModSig').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucAtkModHor').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucAtkModSpl').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucDefMod').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucDefModInf').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucDefModRng').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucDefModSig').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucDefModHor').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucDefModSpl').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucSpdMod').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucSpdModInf').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucSpdModRng').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucSpdModSig').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucSpdModHor').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucSpdModSpl').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucRngMod').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucRngModInf').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucRngModRng').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucRngModSig').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucRngModHor').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucRngModSpl').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucSpellModSpl').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		// Event listener Champ
		ById('ptucLifeChampMod').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucAtkChampMod').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucDefChampMod').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucSpdChampMod').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucRngChampMod').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);
		ById('ptucSpellChampMod').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			t.modifyUnitResearch();
		}, false);

		t.modifyUnitResearch();
	},
	
	modifyUnitResearch: function () {
		var t = Tabs.UnitCalc;

		var resLife = (5 * parseInt(ById('ptucResHP').value) / 100);
		var resAtk = (5 * parseInt(ById('ptucResPE').value) / 100);
		var resDef = (5 * parseInt(ById('ptucResMA').value) / 100);
		var resSpd = (5 * parseInt(ById('ptucResAH').value) / 100);
		var resRng = (5 * parseInt(ById('ptucResFL').value) / 100);
		resRng += (2 * parseInt(ById('ptucResIF').value) / 100);

		var knight = parseFloat(ById('ptucKnightLevel').value) / 200;

		var guardLife = t.woodGuardTable[parseIntNan(ById('ptucWood').value)]||0;
		var guardAtk = t.oreGuardTable[parseIntNan(ById('ptucOre').value)]||0;
		var guardLifeAct = ById('ptucWoodAct').checked ? 1 : 0;
		var guardAtkAct = ById('ptucOreAct').checked ? 1 : 0;
		var guardSetAct = ById('ptucGuardSet').checked ? 1 : 0;
		var guardOreBless = ById('ptucOreBless').checked ? 1 : 0;

		var bloodLustBlessLife = ById('ptucBloodBless').checked ? 0.75 : 1;
		var bloodLustBlessAtkSpd = ById('ptucBloodBless').checked ? 1.5 : 1;

		var defending = ById('ptucDefending').checked ? 1 : 0;

		var itemAtk = 0;
		var itemDef = 0;
		var itemLife = 0;
		var itemSpell = 0;

		var feyAltarAct = ById('ptucFeyAltarActive').checked ? 1 : 0;
		var feyAltar = parseFloat(ById('ptucFeyAltarBonus').value) / 100;

		var orderDef = 0;

		var champLife = parseFloat(ById('ptucLifeChampMod').value);
		var champAtk = parseFloat(ById('ptucAtkChampMod').value);
		var champDef = parseFloat(ById('ptucDefChampMod').value);
		var champSpd = parseFloat(ById('ptucSpdChampMod').value);
		var champRng = parseFloat(ById('ptucRngChampMod').value);
		var champSpl = parseFloat(ById('ptucSpellChampMod').value);

		if (t.Subscriber) { orderDef = 0.15; }

		if (ById('ptucItemAtk20').checked)
			itemAtk = 0.2 + itemAtk;
		if (ById('ptucItemAtk50').checked)
			itemAtk = 0.5 + itemAtk;
		if (ById('ptucItemDef20').checked)
			itemDef = 0.2 + itemDef;
		if (ById('ptucItemDef50').checked)
			itemDef = 0.5 + itemDef;
		if (ById('ptucItemLife10').checked)
			itemLife = 0.1 + itemLife;
		if (ById('ptucItemSpell25').checked)
			itemSpell = 0.25 + itemSpell;

		if (defending) { bloodLustBlessAtkSpd = 1; }

		// calculate guardian
		if (guardSetAct) { //if you have set bonus
			if (guardLifeAct && defending) { //if your want defending troop stats
				guardLife = (guardLife / 2 + guardLife) / 100;
				guardAtk = 0;
			} else if (guardAtkAct) {
				if (defending) {
					guardAtk = 0;
					guardLife = guardLife / 200;
				} else {
					guardAtk = (1.5 * guardAtk / 100) + guardOreBless * 0.15 + guardOreBless * (1.5 * guardAtk / 100);
					guardLife = 0;
				}
			} else {
				if (defending) {
					guardAtk = 0;
					guardLife = guardLife / 200;
				} else {
					guardAtk = (guardAtk / 200) + guardOreBless * 0.15 + guardOreBless * 0.15 * (guardAtk / 200);
					guardLife = 0;
				}
			}
		} else { // don't have set bonus
			if (guardLifeAct && defending) {
				guardLife = guardLife / 100;
				guardAtk = 0;
			} else if (guardAtkAct && !defending) {
				guardAtk = (guardAtk / 100) + guardOreBless * 0.15 + guardOreBless * 0.15 * (guardAtk / 100);
				guardLife = 0;
			} else {
				guardAtk = 0;
				guardLife = 0;
			}
		}

		for (var ui in uW.cm.UNIT_TYPES) {
			i = uW.cm.UNIT_TYPES[ui];
			var lifchampfeyadj = champLife + (1 + feyAltar * feyAltarAct) * uW.unitstats['unt'+i][0];
			lifchampfeyadj = Math.max(lifchampfeyadj, (1 + feyAltar * feyAltarAct) * uW.unitstats['unt'+i][0] * 0.01);

			var atkchampfeyadj = champAtk + (1 + feyAltar * feyAltarAct) * uW.unitstats['unt'+i][1];
			atkchampfeyadj = Math.max(atkchampfeyadj, (1 + feyAltar * feyAltarAct) * uW.unitstats['unt'+i][1] * 0.01);

			var defchampfeyadj = champDef + (1 + feyAltar * feyAltarAct) * uW.unitstats['unt'+i][2];
			defchampfeyadj = Math.max(defchampfeyadj, (1 + feyAltar * feyAltarAct) * uW.unitstats['unt'+i][2] * 0.01);

			var spdchampfeyadj = champSpd + (1 + feyAltar * feyAltarAct) * uW.unitstats['unt'+i][3];
			spdchampfeyadj = Math.max(spdchampfeyadj, (1 + feyAltar * feyAltarAct) * uW.unitstats['unt'+i][3] * 0.01);

			var rngchampfeyadj = champRng + (1 + feyAltar * feyAltarAct) * uW.unitstats['unt'+i][4];
			rngchampfeyadj = Math.max(rngchampfeyadj, (1 + feyAltar * feyAltarAct) * uW.unitstats['unt'+i][4] * 0.01);

			var splchampfeyadj = champSpl + (1 + feyAltar * feyAltarAct) * uW.unitstats['unt'+i][7];
			splchampfeyadj = Math.max(splchampfeyadj, (1 + feyAltar * feyAltarAct) * uW.unitstats['unt'+i][7] * 0.01);

			switch (CM.unitFrontendType[i]) {
			case "infantry":
				if (i != 13 && i != 14) {
					t.UnitStats[i].Life[1] = (1 + guardLife) * lifchampfeyadj * bloodLustBlessLife * (1 + (resLife + itemLife + t.maxBuff('Life', parseFloat(ById('ptucLifeMod').value), parseFloat(ById('ptucLifeModInf').value)) / 100));
					t.UnitStats[i].Attack[1] = (1 + guardAtk) * atkchampfeyadj * bloodLustBlessAtkSpd * (1 + (resAtk + knight + itemAtk + t.maxBuff('Attack', parseFloat(ById('ptucAtkMod').value), parseFloat(ById('ptucAtkModInf').value)) / 100));
					t.UnitStats[i].Defense[1] = defchampfeyadj * (1 + (resDef + knight + itemDef + orderDef + t.maxBuff('Defense', parseFloat(ById('ptucDefMod').value), parseFloat(ById('ptucDefModInf').value)) / 100));
					t.UnitStats[i].Speed[1] = spdchampfeyadj * (1 + (t.maxBuff('Speed', parseFloat(ById('ptucSpdMod').value), parseFloat(ById('ptucSpdModInf').value)) / 100));
					t.UnitStats[i].Range[1] = rngchampfeyadj * (1 + (t.maxBuff('Range', parseFloat(ById('ptucRngMod').value), parseFloat(ById('ptucRngModInf').value)) / 100));
				} else {
					//Trp13 - blood
					//verified on 11/30 that bloods don't use infantry buff for atk/def. other stats unknown
					//Trp14 - exec
					//verified on 11/30 that exec don't use infantry buff for atk/def. other stats unknown
					t.UnitStats[i].Life[1] = (1 + guardLife) * lifchampfeyadj * bloodLustBlessLife * (1 + (resLife + itemLife + t.maxBuff('Life', parseFloat(ById('ptucLifeMod').value), 0) / 100));
					t.UnitStats[i].Attack[1] = (1 + guardAtk) * atkchampfeyadj * bloodLustBlessAtkSpd * (1 + (resAtk + knight + itemAtk + t.maxBuff('Attack', parseFloat(ById('ptucAtkMod').value), 0) / 100));
					t.UnitStats[i].Defense[1] = defchampfeyadj * (1 + (resDef + knight + itemDef + orderDef + t.maxBuff('Defense', parseFloat(ById('ptucDefMod').value), 0) / 100));
					t.UnitStats[i].Speed[1] = spdchampfeyadj * (1 + (t.maxBuff('Speed', parseFloat(ById('ptucSpdMod').value), 0) / 100));
					t.UnitStats[i].Range[1] = rngchampfeyadj * (1 + (t.maxBuff('Range', parseFloat(ById('ptucRngMod').value), 0) / 100));
				}
				break;
			case "ranged":
				t.UnitStats[i].Life[1] = (1 + guardLife) * lifchampfeyadj * bloodLustBlessLife * (1 + (resLife + itemLife + t.maxBuff('Life', parseFloat(ById('ptucLifeMod').value), parseFloat(ById('ptucLifeModRng').value)) / 100));
				t.UnitStats[i].Attack[1] = (1 + guardAtk) * atkchampfeyadj * bloodLustBlessAtkSpd * (1 + (resAtk + knight + itemAtk + t.maxBuff('Attack', parseFloat(ById('ptucAtkMod').value), parseFloat(ById('ptucAtkModRng').value)) / 100));
				t.UnitStats[i].Defense[1] = defchampfeyadj * (1 + (resDef + knight + itemDef + orderDef + t.maxBuff('Defense', parseFloat(ById('ptucDefMod').value), parseFloat(ById('ptucDefModRng').value)) / 100));
				t.UnitStats[i].Speed[1] = spdchampfeyadj * (1 + (t.maxBuff('Speed', parseFloat(ById('ptucSpdMod').value), parseFloat(ById('ptucSpdModRng').value)) / 100));
				t.UnitStats[i].Range[1] = rngchampfeyadj * (1 + (resRng + t.maxBuff('Range', parseFloat(ById('ptucRngMod').value), parseFloat(ById('ptucRngModRng').value)) / 100));
				break;
			case "horsed":
				t.UnitStats[i].Life[1] = (1 + guardLife) * lifchampfeyadj * (1 + (resLife + itemLife + t.maxBuff('Life', parseFloat(ById('ptucLifeMod').value), parseFloat(ById('ptucLifeModHor').value)) / 100));
				t.UnitStats[i].Attack[1] = (1 + guardAtk) * atkchampfeyadj * (1 + (resAtk + knight + itemAtk + t.maxBuff('Attack', parseFloat(ById('ptucAtkMod').value), parseFloat(ById('ptucAtkModHor').value)) / 100));
				t.UnitStats[i].Defense[1] = defchampfeyadj * (1 + (resDef + knight + itemDef + orderDef + t.maxBuff('Defense', parseFloat(ById('ptucDefMod').value), parseFloat(ById('ptucDefModHor').value)) / 100));
				t.UnitStats[i].Speed[1] = spdchampfeyadj * (1 + (resSpd + t.maxBuff('Speed', parseFloat(ById('ptucSpdMod').value), parseFloat(ById('ptucSpdModHor').value)) / 100));
				t.UnitStats[i].Range[1] = rngchampfeyadj * (1 + (t.maxBuff('Range', parseFloat(ById('ptucRngMod').value), parseFloat(ById('ptucRngModHor').value)) / 100));
				if (i == 17)
					t.UnitStats[i].Speed[1] = spdchampfeyadj * (1 + (t.maxBuff('Speed', parseFloat(ById('ptucSpdMod').value), parseFloat(ById('ptucSpdModHor').value)) / 100));
				break;
			case "siege":
				t.UnitStats[i].Life[1] = (1 + guardLife) * lifchampfeyadj * (1 + (resLife + itemLife + t.maxBuff('Life', parseFloat(ById('ptucLifeMod').value), parseFloat(ById('ptucLifeModSig').value)) / 100));
				t.UnitStats[i].Attack[1] = (1 + guardAtk) * atkchampfeyadj * (1 + (resAtk + knight + itemAtk + t.maxBuff('Attack', parseFloat(ById('ptucAtkMod').value), parseFloat(ById('ptucAtkModSig').value)) / 100));
				t.UnitStats[i].Defense[1] = defchampfeyadj * (1 + (resDef + knight + itemDef + orderDef + t.maxBuff('Defense', parseFloat(ById('ptucDefMod').value), parseFloat(ById('ptucDefModSig').value)) / 100));
				t.UnitStats[i].Speed[1] = spdchampfeyadj * (1 + (resSpd + t.maxBuff('Speed', parseFloat(ById('ptucSpdMod').value), parseFloat(ById('ptucSpdModSig').value)) / 100));
				t.UnitStats[i].Range[1] = rngchampfeyadj * (1 + (resRng + t.maxBuff('Range', parseFloat(ById('ptucRngMod').value), parseFloat(ById('ptucRngModSig').value)) / 100));
				if (i == 9 || i == 11)
					t.UnitStats[i].Range[1] = rngchampfeyadj * (1 + (t.maxBuff('Range', parseFloat(ById('ptucRngMod').value), parseFloat(ById('ptucRngModSig').value)) / 100));
				if (i == 21)
					t.UnitStats[i].Speed[1] = spdchampfeyadj * (1 + (t.maxBuff('Speed', parseFloat(ById('ptucSpdMod').value), parseFloat(ById('ptucSpdModSig').value)) / 100));
				break;
			case "spellcaster":
				t.UnitStats[i].Life[1] = (1 + guardLife) * lifchampfeyadj * bloodLustBlessLife * (1 + (resLife + itemLife + t.maxBuff('Life', parseFloat(ById('ptucLifeMod').value), parseFloat(ById('ptucLifeModSpl').value)) / 100));
				t.UnitStats[i].Attack[1] = (1 + guardAtk) * atkchampfeyadj * bloodLustBlessAtkSpd * (1 + (resAtk + knight + itemAtk + t.maxBuff('Attack', parseFloat(ById('ptucAtkMod').value), parseFloat(ById('ptucAtkModSpl').value)) / 100));
				t.UnitStats[i].Defense[1] = defchampfeyadj * (1 + (resDef + knight + itemDef + orderDef + t.maxBuff('Defense', parseFloat(ById('ptucDefMod').value), parseFloat(ById('ptucDefModSpl').value)) / 100));
				t.UnitStats[i].Speed[1] = spdchampfeyadj * (1 + (t.maxBuff('Speed', parseFloat(ById('ptucSpdMod').value), parseFloat(ById('ptucSpdModSpl').value)) / 100));
				t.UnitStats[i].Range[1] = rngchampfeyadj * (1 + (resRng + t.maxBuff('Range', parseFloat(ById('ptucRngMod').value), parseFloat(ById('ptucRngModSpl').value)) / 100));
				t.UnitStats[i].SpellPower[1] = splchampfeyadj * (1 + (itemSpell + t.maxBuff('SpellPower', parseFloat(ById('ptucSpellModSpl').value), 0) / 100));
				break;
			}

			t.displayStats(1);
		}
	},

	displayStats : function (StatType) {
		var t = Tabs.UnitCalc;
	
		ById('ptucTrp'+i+'Life').innerHTML = t.round1decimals(t.UnitStats[i].Life[StatType]);
		ById('ptucTrp'+i+'Atk').innerHTML = t.round1decimals(t.UnitStats[i].Attack[StatType]);
		ById('ptucTrp'+i+'Def').innerHTML = t.round1decimals(t.UnitStats[i].Defense[StatType]);
		ById('ptucTrp'+i+'Spd').innerHTML = t.round1decimals(t.UnitStats[i].Speed[StatType]);
		ById('ptucTrp'+i+'Rng').innerHTML = t.round1decimals(t.UnitStats[i].Range[StatType]);
		if (t.UnitStats[i].Type=="Spellcaster") {
			ById('ptucTrp'+i+'Spell').innerHTML = t.round1decimals(t.UnitStats[i].SpellPower[StatType]);
		}
	},
	
	maxBuff: function (stat, a, b) {
		if (a + b > CM.thronestats.boosts[stat].Max)
			return CM.thronestats.boosts[stat].Max;
		else if (a + b < CM.thronestats.boosts[stat].Min)
			return CM.thronestats.boosts[stat].Min;
		else
			return a + b;
	},
	round1decimals: function (number) {
		return Math.round(number * 10) / 10;
	},
}