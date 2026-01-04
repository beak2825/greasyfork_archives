/***************************** Megalith Tab *******************************/
// @tabversion 20180511

Tabs.Megalith = {
	tabOrder: 1140,
	tabLabel : 'Megaliths',
	tabColor : 'blue',
	myDiv : null,
	LoopCounter: 0,
	MapAjax : new CMapAjax(),
	BlockList : [],
	NumMega: 20,
	CoolDown: 30,
	MAX_BLOCKS: 10,
	Shown: false,
	MegaStatus : false,
	BoostItemList : [50000, 50001, 50002, 50003, 50004],
	Options: {
		Coords : [],
		NumMega : 20,
	},

	init : function (div) {
		var t = Tabs.Megalith;
		t.myDiv = div;

		if (!Options.MegalithOptions) {
			Options.MegalithOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.MegalithOptions.hasOwnProperty(y)) {
					Options.MegalithOptions[y] = t.Options[y];
				}
			}
		}

		uWExportFunction('btMegaRefresh', Tabs.Megalith.MegaRefresh);
		uWExportFunction('btMegaMap', Tabs.Megalith.MegaMap);
		uWExportFunction('btMegaMarch', Tabs.Megalith.MegaMarch);
		uWExportFunction('btMegaRefreshAll', Tabs.Megalith.CheckOwners);
		uWExportFunction('btMegaClearAll', Tabs.Megalith.MegaClearAll);
		uWExportFunction('btMegaPaintDataOnMap', Tabs.Megalith.PaintDataOnMap);
		uWExportFunction('btMegaBack', Tabs.Megalith.MegaBack);
		uWExportFunction('btMegaExport', Tabs.Megalith.MegaExport);
		uWExportFunction('btMegaImport', Tabs.Megalith.MegaImport);
		uWExportFunction ('btMegaAddMega', Tabs.Megalith.MapMegaAdd);
		uWExportFunction ('btMegaXChange', Tabs.Megalith.CheckForCoords);
		uWExportFunction ('btActivateWarCry', Tabs.Megalith.ActivateWarCry);
		
		// add entry to the map menu
	
		wildContext = uW.cm.ContextMenuMapController.prototype.MapContextMenus.OwnedWilderness.megalith;
		if (wildContext) wildContext.push("MEGA");
		wildContext = uW.cm.ContextMenuMapController.prototype.MapContextMenus.OwnedWildernessNoDefend.megalith;
		if (wildContext) wildContext.push("MEGA");
		wildContext = uW.cm.ContextMenuMapController.prototype.MapContextMenus.AllianceWilderness.megalith;
		if (wildContext) wildContext.push("MEGA");
		wildContext = uW.cm.ContextMenuMapController.prototype.MapContextMenus.FriendlyWilderness.megalith;
		if (wildContext) wildContext.push("MEGA");
		wildContext = uW.cm.ContextMenuMapController.prototype.MapContextMenus.EnemyWilderness.megalith;
		if (wildContext) wildContext.push("MEGA");
		wildContext = uW.cm.ContextMenuMapController.prototype.MapContextMenus.Wilderness.megalith;
		if (wildContext) wildContext.push("MEGA");

		var mod = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonInfo',
			[['default:', 'case "MEGA":' +
			'b.text = "'+tx('Add Megalith')+'"; b.color = "brown"; ' +
			'b.action = function () { ' +
			'btMegaAddMega(e);' +
			'}; ' +
			'd.push(b); break; ' +
			'default: ']]);
		mod.setEnable(true);
		
		t.paint();
	},

	paint : function () {
		var t = Tabs.Megalith;

		t.NumMega = Options.MegalithOptions.NumMega;
		
		for (var i=0;i<t.NumMega;i++) {
			if (!Options.MegalithOptions.Coords[i]) {
				Options.MegalithOptions.Coords[i] = {x:'',y:'',last:0}; 
			}
		}

		var m = '<DIV class=divHeader align=center>'+tx('RUNIC MEGALITHS')+'</div><br>';
		m += '<div style="min-height:350px;width:'+GlobalOptions.btWinSize.x+'px;overflow-x:auto;overflow-y:hidden;"><div id=btMegaTable><TABLE align=center width=98% cellpadding=0 cellspacing=0 class=xtab>';
		m += '<TR><td id=btMegaKoth align=center colspan=5>&nbsp;</td></tr>';
		m += '<TR><td style="display:none;" id=btMegaWarCryBox align=center colspan=5>&nbsp;</td></tr>';
		var boosts = '<TR><td style="display:none;" id=btMegaBoosts colspan=5 align=center><br><table cellspacing=0 cellpadding=0><tr>';
		for (var i = 0; i < t.BoostItemList.length; i++) {
//			if (uW.ksoItems[t.BoostItemList[i]].count) {
				boosts += '<td class=xtab style="width:30px;padding-right:3px;"><a onClick="cm.ItemController.use(\''+t.BoostItemList[i]+'\')"><img height=28 src="'+IMGURL+'items/70/'+t.BoostItemList[i]+'.jpg" title="'+itemTitle(t.BoostItemList[i])+'"></a></td><td style="width:80px;" class=xtab><span id="btMegaBoost_'+t.BoostItemList[i]+'" class=boldGreen></span></td>';
//			}
		}
		boosts += '</tr></table></td></tr>';
		m += boosts;
		
		m += '<TR><TH width=40 class=xtabHD><div id=btNumDiv style="display:none;"><input id="btNumMega" maxLength=3 style="width:2em;" value="'+Options.MegalithOptions.NumMega+'"></div></TH><TH width=120 align=left class=xtabHD>'+uW.g_js_strings.commonstr.coordinates+'</TH><TH align=left class=xtabHD>'+tx('Ownership')+'</TH><TH align=right class=xtabHD>'+tx('Cooldown Time')+'</TH><TH width=160 align=right class=xtabHD>'+strButton14(tx('Clear List'),'onclick="btMegaClearAll()"')+'</TH></tr>';
			
		var now = unixTime();
		var r = 0;
		for (var i=0;i<t.NumMega;i++) {
			var Mega = Options.MegalithOptions.Coords[i];
			if (!Mega) Mega = {x:'',y:'',last:0};
			
			r=r+1;
			rowClass = 'evenRow';
			var rem = (r % 2);
			if (rem == 1) rowClass = 'oddRow';
			
			m += '<TR class='+rowClass+'><td>'+(i+1)+'<td>X:&nbsp;<input id="btMegaX_'+i+'" maxLength=10 style="width:2em;" value="'+Mega.x+'" onchange="btMegaXChange('+i+');">&nbsp;Y:&nbsp;<input id="btMegaY_'+i+'" maxLength=3 style="width:2em;" value="'+Mega.y+'"></td><td><div id="btMegaDetails_'+i+'">&nbsp;</div></td><td align=right><div id="btMegaTime_'+i+'">&nbsp;</div></td><td align=right><div id="btMegaAction_'+i+'" style="display:none;">'+strButton8(tx('March+'),'onclick="btMegaMarch('+i+')"')+'&nbsp;'+strButton8(tx('Map'),'onclick="btMegaMap('+i+')"')+'&nbsp;'+strButton8(tx('Refresh'),'onclick="btMegaRefresh('+i+')"')+'</div></td></tr>';
		}
		m += '<TR><td align=center colspan=5>&nbsp;</td></tr><TR><td colspan=5>'+strButton20(tx('Refresh All'),'onclick="btMegaRefreshAll()"')+'&nbsp;'+strButton20(tx('Megalith Map'),'onclick="btMegaPaintDataOnMap()"')+'&nbsp;'+strButton20(tx('Export Coords'),'onclick="btMegaExport()"')+'&nbsp;'+strButton20(tx('Import Coords'),'onclick="btMegaImport()"')+'&nbsp;<input class=btInput id="btMegaImportCoords" title="Separate multiple co-ordinates with spaces. Valid formats include xxx,yyy (xxx_yyy) [xxx.yyy] etc..." onkeyup="ptStopProp(event);" style="width:250px;"></td></tr>';
		m += '<TR><td id=btMegaMsg align=center colspan=5>&nbsp;</td></tr></table></div>';
		m += '<div id=btMegaMapDiv style="display:none;">&nbsp;</div>';
		m += '</div><br>';

		t.myDiv.innerHTML = m;
		if (trusted) ById('btNumDiv').style.display = '';
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);

		ChangeIntegerOption('MegalithOptions','btNumMega','NumMega', 20, t.paint);
		
		for (var i=0;i<t.NumMega;i++) {
			ById('btMegaX_'+i).addEventListener('blur', function (e) { t.SetCoords(e.target); }, false);
			ById('btMegaY_'+i).addEventListener('blur', function (e) { t.SetCoords(e.target); }, false);
			if (Options.MegalithOptions.Coords[i]) {
				if (!isNaN(Options.MegalithOptions.Coords[i].x) && !isNaN(Options.MegalithOptions.Coords[i].y) && Options.MegalithOptions.Coords[i].x!='' && Options.MegalithOptions.Coords[i].y!='') {
					if (ById('btMegaAction_'+i)) { ById('btMegaAction_'+i).style.display = 'block'; }
				}
			}	
		}
		
		if (t.Shown) t.CheckOwners();
	},
	
	show : function (){
		var t = Tabs.Megalith;

		ById('btMegaWarCryBox').innerHTML = uW.g_js_strings.effects.name_505+':&nbsp;<span id=btWarCryTimer class=boldRed>'+uW.g_js_strings.koth.eventInActive+'</span>';
		
		if (Seed.is_chancellor && getMyAlliance()[0] != 0) {
			var cost = CM.WorldSettings.getSettingAsNumber("WAR_CRY_COST");
			ById('btMegaWarCryBox').innerHTML+= '&nbsp;'+strButton8(uW.g_js_strings.koth.buttonActive,'id=btWarCryButton title="'+CM.utils.format(uW.g_js_strings.koth.paytoActivateText, cost)+'" onclick="btActivateWarCry();"');
		}
		
		t.CheckTimers();
		
		if (t.Shown) return;
		t.CheckOwners();
		t.Shown = true;
	},

	CheckForCoords : function (i) {
		var t = Tabs.Megalith;
		var xValue=ById('btMegaX_'+i).value.trim();
		var xI=/^\s*([0-9]+)[\s|,|-|.]+([0-9]+)/.exec(xValue);
		if(xI) {
			ById('btMegaX_'+i).value=xI[1]
			ById('btMegaY_'+i).value=xI[2]
		}
	},
	
	MegaClearAll : function() {
		var t = Tabs.Megalith;
		for (var i=0;i<t.NumMega;i++) {
			Options.MegalithOptions.Coords[i] = {x:'',y:'',last:0};		
			if (ById('btMegaX_'+i)) { ById('btMegaX_'+i).value = ''; }
			if (ById('btMegaY_'+i)) { ById('btMegaY_'+i).value = ''; }
			if (ById('btMegaAction_'+i)) { ById('btMegaAction_'+i).style.display = 'none'; }
			if (ById('btMegaDetails_'+i)) { ById('btMegaDetails_'+i).innerHTML = '&nbsp;'; }
		}
		saveOptions();
	},

	MegaExport : function() {
		var t = Tabs.Megalith;
		var CoordList = [];
		for (var i=0;i<t.NumMega;i++) {
			var Mega = Options.MegalithOptions.Coords[i];
			if (Mega && !isNaN(Mega.x) && !isNaN(Mega.y) && Mega.x!='' && Mega.y!='') {
				CoordList.push('('+Mega.x+','+Mega.y+')');
			}
		}
		if (CoordList.length>0) {
			window.prompt(tx("Copy to clipboard: Ctrl+C"), CoordList.join(" "));
		}	
	},

	MegaImport : function() {
		var t = Tabs.Megalith;

		var NewCoords = ById('btMegaImportCoords').value;
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
				}
				else {
					CoordError = true;
				}
			}
		}

		if (CoordError) {
			msg = '<span style="color:#800;">'+tx('Invalid format')+'!</span>';
		}
		else {
			t.MegaClearAll();
			var i = 0;
			for (var a=0;a<CleanedCoordList.length;a++) {
				CoordsAdded = true;
				ListEntry = {};
				ListEntry.x = CleanedCoordList[a].x;
				ListEntry.y = CleanedCoordList[a].y;
				ListEntry.last = 0;
				Options.MegalithOptions.Coords[i] = ListEntry;
				if (ById('btMegaX_'+i)) { ById('btMegaX_'+i).value = ListEntry.x; }
				if (ById('btMegaY_'+i)) { ById('btMegaY_'+i).value = ListEntry.y; }
				if (ById('btMegaAction_'+i)) { ById('btMegaAction_'+i).style.display = 'block'; }
				if (ById('btMegaDetails_'+i)) { ById('btMegaDetails_'+i).innerHTML = '&nbsp;'; }
				i++;
				if (i>=t.NumMega) break;
			}
			saveOptions();
			if (CoordsAdded) msg = tx('Co-ordinates added');
			ById('btMegaImportCoords').value = '';
			t.CheckOwners();
		}
		ById('btMegaMsg').innerHTML = msg;
	},
	
	MapMegaAdd : function(e) {
		var t = Tabs.Megalith;
		var listspace = false;
		for (var i=0;i<t.NumMega;i++) {
			var Mega = Options.MegalithOptions.Coords[i];
			if (!Mega || (isNaN(Mega.x) && isNaN(Mega.y)) || (Mega.x=='' && Mega.y=='')) {
				listspace = true;
				var ListEntry = new Object();
				ListEntry.x = e.tile.x;
				ListEntry.y = e.tile.y;
				ListEntry.last = 0;
				Options.MegalithOptions.Coords[i] = ListEntry;
				saveOptions();
				if (ById('btMegaX_'+i)) { ById('btMegaX_'+i).value = ListEntry.x; }
				if (ById('btMegaY_'+i)) { ById('btMegaY_'+i).value = ListEntry.y; }
				if (ById('btMegaAction_'+i)) { ById('btMegaAction_'+i).style.display = 'block'; }
				if (ById('btMegaDetails_'+i)) { ById('btMegaDetails_'+i).innerHTML = '&nbsp;'; }
				t.MegaRefresh(i);
				ById('bttcMegalith').click();
				break;
			}
		}
		if (!listspace) {
			uW.Modal.showAlert('<div align="center">'+tx('No remaining space in megalith list!')+'</div>');
		}
	},
	
	MegaBack : function() {
		var t = Tabs.Megalith;
		if (ById('btMegaMapDiv')) { ById('btMegaMapDiv').style.display = 'none'; }
		if (ById('btMegaTable')) { ById('btMegaTable').style.display = 'block'; }
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
	},
	
	MegaRefresh : function(i) {
		var t = Tabs.Megalith;
		if (ById('btMegaDetails_'+i)) { ById('btMegaDetails_'+i).innerHTML = tx('Searching')+'...'; }
		t.BlockList = [];
		var Blocks = t.MapAjax.generateBlockList(parseInt(Options.MegalithOptions.Coords[i].x),parseInt(Options.MegalithOptions.Coords[i].y),1);
		var blockString = Blocks.join("%2C");
		var paramstring = [];
		paramstring.push({x:Options.MegalithOptions.Coords[i].x,y:Options.MegalithOptions.Coords[i].y,div:'btMegaDetails_'+i,found:false});
		if (blockString!="") {
			t.LookupMapTiles(blockString,paramstring);
		}	
	},
	
	MegaMap : function(i) {
		var t = Tabs.Megalith;
		var Mega = Options.MegalithOptions.Coords[i];
		if (!isNaN(Mega.x) && !isNaN(Mega.y) && Mega.x!='' && Mega.y!='') {
			GotoMapHide(Mega.x,Mega.y);
		}
	},

	MegaMarch : function(i) {
		var t = Tabs.Megalith;
		var Mega = Options.MegalithOptions.Coords[i];
		if (!isNaN(Mega.x) && !isNaN(Mega.y) && Mega.x!='' && Mega.y!='') {
			QuickMarch.MapClick(Mega.x,Mega.y);
		}
	},

	SetCoords : function (e) {
		var t = Tabs.Megalith;
		if (isNaN(e.value)) e.value="";
		if (e.value<0) e.value="";
		if (e.value>749) e.value="";
		var i = e['id'].substring(8);
		var oldX = '';
		var oldY = '';
		if (Options.MegalithOptions.Coords[i]) {
			var oldX = Options.MegalithOptions.Coords[i].x; 
			var oldY = Options.MegalithOptions.Coords[i].y; 
		}
		var XorY = e['id'].substring(6,7);
		if (!Options.MegalithOptions.Coords[i]) { Options.MegalithOptions.Coords[i] = {x:'',y:'',last:0}; }
		if (XorY=="X") { Options.MegalithOptions.Coords[i].x = e.value; }
		if (XorY=="Y") { Options.MegalithOptions.Coords[i].y = e.value; }
		saveOptions();
		if (oldX!=Options.MegalithOptions.Coords[i].x||oldY!=Options.MegalithOptions.Coords[i].y) {
			Options.MegalithOptions.Coords[i].last = 0;
			if (ById('btMegaTime_'+i)) { ById('btMegaTime_'+i).innerHTML = '&nbsp;'; }
			if (!isNaN(Options.MegalithOptions.Coords[i].x) && !isNaN(Options.MegalithOptions.Coords[i].y) && Options.MegalithOptions.Coords[i].x!='' && Options.MegalithOptions.Coords[i].y!='') {
				if (ById('btMegaAction_'+i)) { ById('btMegaAction_'+i).style.display = 'block'; }
				t.MegaRefresh(i);
			}	
			else {
				if (ById('btMegaAction_'+i)) { ById('btMegaAction_'+i).style.display = 'none'; }
				if (ById('btMegaDetails_'+i)) { ById('btMegaDetails_'+i).innerHTML = '&nbsp;'; }
			}
		}	
	},
	
	EverySecond : function () {
		var t = Tabs.Megalith;

		t.LoopCounter = t.LoopCounter + 1;

		if (tabManager.currentTab.name == 'Megalith' && Options.btWinIsOpen){
			if (t.LoopCounter%2==0) { // Check Megalith timer list every 2 seconds
				t.CheckTimers();
			}
		}	
	},

	CheckOwners : function () {
		var t = Tabs.Megalith;

		var blockString = '';	
		var paramstring = [];
		t.BlockList = [];
	
		var delayer = 0;
		for (var i=0;i<t.NumMega;i++) {
			var Mega = Options.MegalithOptions.Coords[i];
			if (Mega && !isNaN(Mega.x) && !isNaN(Mega.y) && Mega.x!='' && Mega.y!='') {
				ById('btMegaDetails_'+i).innerHTML = tx('Searching')+'...';

				var Blocks = t.MapAjax.generateBlockList(parseInt(Mega.x),parseInt(Mega.y),1);
				t.BlockList.push(Blocks);
				paramstring.push({x:Mega.x,y:Mega.y,div:'btMegaDetails_'+i,found:false});
			}	
			else {
				if (ById('btMegaDetails_'+i)) { ById('btMegaDetails_'+i).innerHTML = '&nbsp;'; }
			}
		}

		var counter = t.BlockList.length;
		if (counter > t.MAX_BLOCKS) { counter = t.MAX_BLOCKS; }

		var Blocks = [];
		for (var b=1;b<=counter;b++) {
			Blocks.push(t.BlockList.shift());
		}	
				
		blockString = Blocks.join("%2C");
		if (blockString!="") {
			t.LookupMapTiles(blockString,paramstring);
		}	
	},

	CheckTimers : function () {
		var t = Tabs.Megalith;

		if (Seed.koth) {
			if (!t.MegaStatus) {
				ById('btMegaKoth').innerHTML = CM.utils.format(uW.g_js_strings.koth.eventStatusText, "<strong>" + uW.g_js_strings.koth.eventActive + "</strong>");
				t.MegaStatus = true;
				ById('btMegaWarCryBox').style.display = '';
				ById('btMegaBoosts').style.display = '';
				ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
			}
		}
		else {
			if (t.MegaStatus) {
				ById('btMegaKoth').innerHTML = '&nbsp;';
				t.MegaStatus = false;
				ById('btMegaWarCryBox').style.display = 'none';
				ById('btMegaBoosts').style.display = 'none';
				ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
			}
		}
		
		var now = unixTime();
		for (var i=0;i<t.NumMega;i++) {
			var Mega = Options.MegalithOptions.Coords[i];
			if (Mega && !isNaN(Mega.x) && !isNaN(Mega.y && Mega.x!='' && Mega.y!='')) {
				var TimeText = '';
				var PrevTime = now-Mega.last;
				if (PrevTime<(t.CoolDown*60)) { TimeText = timestr((now - (t.CoolDown*60) - Mega.last)*(-1)); }
				if (ById('btMegaTime_'+i)) { ById('btMegaTime_'+i).innerHTML = '<span style="color:#f00;">'+TimeText+'</span>'; }
			}
			else {
				if (ById('btMegaTime_'+i)) { ById('btMegaTime_'+i).innerHTML = '&nbsp;'; }
			}
		}
		
		var BoostText = {};
		for (var i = 0; i < t.BoostItemList.length; i++) {
			BoostText[t.BoostItemList[i]] = '<span style="color:#f00"><b>'+uW.g_js_strings.commonstr.inactive+'</b></span>';
		}

		var WarCryActive = false;
		if (Seed.activeRunicBoosters) {
			for (var i in Seed.activeRunicBoosters) {
				var Boost = Seed.activeRunicBoosters[i];
				if (Boost.spellItemId==50005) {
					WarCryActive = true;
					var WarCryTime = Boost.endTimeStamp-now;
					if (WarCryTime<0) { WarCryActive = false;}
					else {
						ById('btWarCryTimer').innerHTML = timestr(WarCryTime);
						ById('btWarCryTimer').className = 'boldGreen';
					}
				}
				else {
					BoostText[Boost.spellItemId] = '<span style="color:#080"><b>'+uW.timestr(Boost.endTimeStamp-now)+'</b></span>';
				}
			}
		}
		if (!WarCryActive) {
			ById('btWarCryTimer').innerHTML = uW.g_js_strings.koth.eventInActive;
			ById('btWarCryTimer').className = 'boldRed';
		}
		for (var i = 0; i < t.BoostItemList.length; i++) {
			ById('btMegaBoost_'+t.BoostItemList[i]).innerHTML = BoostText[t.BoostItemList[i]];
		}
		
	},

	CheckAddAttackTime : function (x,y,now) {
		var t = Tabs.Megalith;
		for (var i=0;i<t.NumMega;i++) {
			var Mega = Options.MegalithOptions.Coords[i];
			if (Mega && !isNaN(Mega.x) && !isNaN(Mega.y) && Mega.x!='' && Mega.y!='') {
				if (Mega.x==x && Mega.y==y) {
					Options.MegalithOptions.Coords[i].last = now;
					saveOptions();
				}	
			}
		}
	},
	
	LookupMapTiles : function (blockString,paramstring) {
		var t = Tabs.Megalith;

		t.MapAjax.LookupMap (blockString, function(rslt) {
			if (!rslt.ok) {
				if (rslt.BotCode && rslt.BotCode==999) {
					for (var p=0;p<paramstring.length;p++) { 
						var MM = paramstring[p];
						var div = MM.div;
						ById(div).innerHTML = 'Captcha!';
					}
					return;
				}
				if (rslt.msg && rslt.msg=="invalid parameters") {
					for (var p=0;p<paramstring.length;p++) { 
						var MM = paramstring[p];
						var div = MM.div;
						ById(div).innerHTML = 'Invalid Parameters!';
					}
					return;
				}
				else { setTimeout(t.LookupMapTiles,MAP_DELAY,blockString,paramstring); }
				return;
			}
			
			var map = rslt.data;
			var uList = [];
			
			for (var p=0;p<paramstring.length;p++) {
				var MM = paramstring[p];
				for (var k in map){
					if (MM.x==map[k].xCoord && MM.y==map[k].yCoord) {
						paramstring[p].found = true;
						var uid=map[k].tileUserId;
						if (uid && uid!=0 && uid!="0") {
							uList.push(uid);
						}	
					}
				}
			}	
			
			getOnline(uList, function (online) {
				var delayer = 0;
			
				for (var p=0;p<paramstring.length;p++) {
					var MM = paramstring[p];
					var div = MM.div;
					var found = false;
					for (var k in map){
						if (MM.x==map[k].xCoord && MM.y==map[k].yCoord) {
							var m = "";
							var uid=map[k].tileUserId;
							var cid=map[k].tileCityId;
							var typeid = map[k].tileType;
							var tiletype = tileTypes[parseInt(typeid)];
							var subtype = map[k].premiumTile;
							if (typeid==50 && subtype==1) {
								m = tx('Alliance HQ')+'&nbsp;('+map[k].allianceHq.allianceName+')';
								ById(div).innerHTML = m;
							}
							else {
								var misted = map[k].misted;
								var lvl = parseIntNan(map[k].tileLevel);
								if (!uid || uid==0 || uid=="0") {
									if (typeid==51) { tiletype = tx('Barb Camp'); }
									m = tiletype;
									if (misted) {
										m = uW.g_js_strings.commonstr.level+'&nbsp;'+lvl+'&nbsp;'+m+'&nbsp;('+tx('Owner Misted')+')';
										ById(div).innerHTML = m;
									}
									else {
										if (typeid==53) {
											m += '&nbsp;'+tx('or plain');
											ById(div).innerHTML = m;
										}
										else {
											if (lvl!=0) {
												m = uW.g_js_strings.commonstr.level+'&nbsp;'+lvl+'&nbsp;'+m;
											}
											ById(div).innerHTML = m;
										}
									}
								}
								else { // lookup user
									delayer++;
									setTimeout(t.LookupUser,(250*delayer),lvl,tiletype,uid,online.data,div);
								}
							}	
							break;
						}
					}	
				}
			});

			blockString = '';
			var counter = t.BlockList.length;
			if (counter==0) {
				for (var p=0;p<paramstring.length;p++) {
					if (!paramstring[p].found) ById(paramstring[p].div).innerHTML = 'No Data';
				}
				return;
			}
			if (counter > t.MAX_BLOCKS) { counter = t.MAX_BLOCKS; }

			var Blocks = [];
			for (var b=1;b<=counter;b++) {
				Blocks.push(t.BlockList.shift());
			}	
				
			blockString += Blocks.join("%2C");
			if (blockString!="") {
				setTimeout(t.LookupMapTiles,MAP_DELAY,blockString,paramstring);
			}	
			
		},true); // ignore delay
	},
	
	LookupUser : function(lvl,tiletype,uid,p,div) {
		var t = Tabs.Megalith;
		var m = '';
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pid = uid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/viewCourt.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					m = MonitorLink(rslt.playerInfo.userId,rslt.playerInfo.displayName);
					if (rslt.playerInfo.allianceId && rslt.playerInfo.allianceId!=0) {
						m += '&nbsp;'+uW.g_js_strings.commonstr.of+'&nbsp;<span style='+DiplomacyColours(rslt.playerInfo.allianceId)+'>' + rslt.playerInfo.allianceName + '</span>';
					}
					if (p[uid])
						m += '&nbsp;<span style="color:#f00;"><b>('+uW.g_js_strings.commonstr.online.toUpperCase()+')</b></span>';
					m += '&nbsp;'+uW.g_js_strings.commonstr.level+'&nbsp;'+lvl+'&nbsp;'+tiletype;
					ById(div).innerHTML = m;
				}
			},
		});
	},
	
	PaintDataOnMap: function () {
		var t = Tabs.Megalith;
		var provMapCoordsA = {
			imgWidth: 710,
			imgHeight: 708,
			mapWidth: 670,
			mapHeight: 670,
			leftMargin: 31,
			topMargin: 19
		};
		var map = '<table align=center cellspacing=0 cellpadding=1><tr><td class=xtab align=left><DIV id=btMegalithMap style="height:' + provMapCoordsA.imgHeight + 'px; width:' + provMapCoordsA.imgWidth + 'px; background-repeat:no-repeat; background-image:url(\'' + URL_PROVINCE_MAP + '\')"></div></td></tr>';
		map += '<tr><td class=xtab align=center>'+strButton20(tx('Back'),'onclick="btMegaBack()"')+'</td></tr></table>';
		ById('btMegaMapDiv').innerHTML = map;
		if (ById('btMegaTable')) { ById('btMegaTable').style.display = 'none'; }
		if (ById('btMegaMapDiv')) { ById('btMegaMapDiv').style.display = 'block'; }
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);

		var eMap = ById('btMegalithMap');
		for (var cc = 0; cc < Seed.cities.length; cc++) {
			var city = Cities.cities[cc];
			var Xplot = parseInt((provMapCoordsA.mapWidth * city.x) / 750);
			var Yplot = parseInt((provMapCoordsA.mapHeight * city.y) / 750);
			var cf = document.createElement('div');
			cf.style.backgroundImage = "url('"+URL_CASTLE_BUT+"')";
			cf.style.backgroundSize = "16px 16px"
			cf.style.opacity = '1.0';
			cf.style.position = 'relative';
			cf.style.display = 'block';
			cf.style.width = '16px';
			cf.style.height = '16px';
			cf.style.border = '1px solid #000';
			cf.style.color = 'black';
			cf.style.fontWeight = 'bold';
			cf.style.fontSize = '10px';
			cf.style.textAlign = 'center';
			cf.style.top = (Yplot + provMapCoordsA.topMargin - (cc * 16) - 8) + 'px';
			cf.style.left = (Xplot + provMapCoordsA.leftMargin - 8) + 'px';
			cf.title = city.name+' ('+city.x+','+city.y+')';
			eMap.appendChild(cf);
			cf.innerHTML = (cc + 1) + '';
		}
		
		var Data = [];
		for (var i=0;i<t.NumMega;i++) {
			var Mega = Options.MegalithOptions.Coords[i];
			if (Mega && !isNaN(Mega.x) && !isNaN(Mega.y) && Mega.x!='' && Mega.y!='') {
				Data.push({	X: Mega.x, Y: Mega.y });
			}
		}
		for (var i = 0; i < Data.length; i++) {
			var x = parseInt(Data[i]['X']);
			var y = parseInt(Data[i]['Y']);
			var city = uW.g_js_strings.koth.eventname;
			var xplot = parseInt((provMapCoordsA.mapWidth * x) / 750);
			var yplot = parseInt((provMapCoordsA.mapHeight * y) / 750);
			var ce = document.createElement('div');
			ce.style.backgroundImage = "url('"+IMGURL+"buildings/runic_megalith_tile.png')";
			ce.style.backgroundSize = "16px 16px"
			ce.style.opacity = '1.0';
			ce.style.position = 'relative';
			ce.style.display = 'block';
			ce.style.width = '16px';
			ce.style.height = '16px';
			ce.style.top = (yplot + provMapCoordsA.topMargin - (16 * i) - ((Seed.cities.length) * 18)) + 'px';
			ce.style.left = (xplot + provMapCoordsA.leftMargin - 2) + 'px';
			ce.title = city+' ('+x+','+y+')';
			ce.innerHTML = '<a onclick="btGotoMap('+x+','+y+')">&nbsp;&nbsp;&nbsp;&nbsp;</a>';
			eMap.appendChild(ce);
		}
		if (Seed.allianceHQ) {
			var x = parseInt(Seed.allianceHQ.hq_xcoord);
			var y = parseInt(Seed.allianceHQ.hq_ycoord);
			var city = tx('Alliance HQ');
			var xplot = parseInt((provMapCoordsA.mapWidth * x) / 750);
			var yplot = parseInt((provMapCoordsA.mapHeight * y) / 750);
			var ce = document.createElement('div');
			ce.style.background = 'cyan';
			ce.style.opacity = '1.0';
			ce.style.position = 'relative';
			ce.style.display = 'block';
			ce.style.width = '4px';
			ce.style.height = '4px';
			ce.style.top = (yplot + provMapCoordsA.topMargin - (16 * Data.length) - ((Seed.cities.length) * 18)) + 'px';
			ce.style.left = (xplot + provMapCoordsA.leftMargin - 2) + 'px';
			ce.title = city+' ('+x+','+y+')';
			ce.innerHTML = '<a onclick="btGotoMap('+x+','+y+')">&nbsp;</a>';
			eMap.appendChild(ce);
			// plot alliance aura
			if (ArcanaEnabled()) {
				var auradistance = parseIntNan(Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].distance);
				var Aura = [];
				//left
				var base = parseIntNan(Seed.allianceHQ.hq_xcoord)-auradistance;
				if (base<0) { base+=750; }
				var slide = parseIntNan(Seed.allianceHQ.hq_ycoord)-auradistance;
				if (slide<0) { slide+=750; }
				for (var y=0;y<=(auradistance*2);y++) {
					var checky = slide+y;
					if (checky>750) { checky-=750; }
					for (var x=0;x<auradistance;x++) {
						var checkx = base+x;
						if (checkx>=750) { checkx-=750; }
						if (distance(checkx, checky, Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord) <= auradistance) {
							Aura.push({X:checkx,Y:checky});
							break;
						}
					}
				}
				//right
				var base = parseIntNan(Seed.allianceHQ.hq_xcoord)+auradistance;
				if (base>=750) { base-=750; }
				logit(base);
				var slide = parseIntNan(Seed.allianceHQ.hq_ycoord)-auradistance;
				if (slide<0) { slide+=750; }
				for (var y=0;y<=(auradistance*2);y++) {
					var checky = slide+y;
					if (checky>=750) { checky-=750; }
					for (var x=0;x<auradistance;x++) {
						var checkx = base-x;
						if (checkx<0) { checkx+=750; }
						if (distance(checkx, checky, Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord) <= auradistance) {
							Aura.push({X:checkx,Y:checky});
							break;
						}
					}
				}
				//top
				var base = parseIntNan(Seed.allianceHQ.hq_ycoord)-auradistance;
				if (base<0) { base+=750; }
				var slide = parseIntNan(Seed.allianceHQ.hq_xcoord)-auradistance;
				if (slide<0) { slide+=750; }
				for (var x=0;x<=(auradistance*2);x++) {
					var checkx = slide+x;
					if (checkx>=750) { checkx-=750; }
					for (var y=0;y<auradistance;y++) {
						var checky = base+y;
						if (checky>=750) { checky-=750; }
						if (distance(checkx, checky, Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord) <= auradistance) {
							Aura.push({X:checkx,Y:checky});
							break;
						}
					}
				}
				//bottom
				var base = parseIntNan(Seed.allianceHQ.hq_ycoord)+auradistance;
				if (base>=750) { base-=750; }
				var slide = parseIntNan(Seed.allianceHQ.hq_xcoord)-auradistance;
				if (slide<0) { slide+=750; }
				for (var x=0;x<=(auradistance*2);x++) {
					var checkx = slide+x;
					if (checkx>=750) { checkx-=750; }
					for (var y=0;y<auradistance;y++) {
						var checky = base-y;
						if (checky<0) { checky+=750; }
						if (distance(checkx, checky, Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord) <= auradistance) {
							Aura.push({X:checkx,Y:checky});
							break;
						}
					}
				}
				// plot
				for (var j = 0; j < Aura.length; j++) {
					var x = parseInt(Aura[j]['X']);
					var y = parseInt(Aura[j]['Y']);
					var xplot = parseInt((provMapCoordsA.mapWidth * x) / 750);
					var yplot = parseInt((provMapCoordsA.mapHeight * y) / 750);
					var ce = document.createElement('div');
					ce.style.background = 'cyan';
					ce.style.opacity = '1.0';
					ce.style.position = 'relative';
					ce.style.display = 'block';
					ce.style.width = '1px';
					ce.style.height = '1px';
					ce.style.top = (yplot + provMapCoordsA.topMargin - (j + 3) - (16 * Data.length) - ((Seed.cities.length) * 18)) + 'px';
					ce.style.left = (xplot + provMapCoordsA.leftMargin - 2) + 'px';
					ce.title = 'HQ Aura';
					eMap.appendChild(ce);
				}
			}
		}
	},
	
	ActivateWarCry : function () {
		var t = Tabs.Megalith;
		var resources = uWCloneInto(CM.AllianceHQModel.getStats());
		var amber = resources.amber;
		var cost = CM.WorldSettings.getSettingAsNumber("WAR_CRY_COST");
		if (amber >= cost) {
			jQuery("#btWarCryButton").addClass("disabled");
			var params = uW.Object.clone(uW.g_ajaxparams);
			params.iid = 50005;
			params.aid = Seed.allianceDiplomacies.allianceId;
			new MyAjaxRequest(uW.g_ajaxpath + "ajax/kothBoost.php" + uW.g_ajaxsuffix, {
				method: "post",
				parameters: params,
				onSuccess: function (rslt) {
					if (rslt.ok) {
						ById('btMegaMsg').innerHTML = tx('Alliance War Cry Activated')+'!';
						resources.amber -= cost;
						CM.AllianceHQModel.setStats(resources);
						CM.AllianceHQView.updateStat(7, resources.amber);
						jQuery("#btWarCryButton").removeClass("disabled");
						if (rslt.activeRunicInfo) {
							Seed.isRunicBoosterActive = rslt.activeRunicInfo.isRunicBoosterActive;
							Seed.activeRunicBoosters = rslt.activeRunicInfo.activeRunicBoosters;
							uW.update_boosts();
						}
					}
					else {
						ById('btMegaMsg').innerHTML = rslt.msg;
					}
				}
			},true);
		}
		else {
			ById('btMegaMsg').innerHTML = tx('Not enough amber in alliance vault')+'!';
		}
	},
	
}
