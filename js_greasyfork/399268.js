/*********************************  Raid Tab ***********************************/
// @tabversion 20171101

Tabs.Raid = {
	tabDisabled : false,
	tabOrder : 8000,
	tabColor : 'brown',
	myDiv : null,
	tabLabel : unsafeWindow.g_js_strings.commonstr.raid,
	rallypointlevel:null,
	knt:{},
	Troops:{},
	city:0,
	raidtimer:null,
	rslt:{},
	save:{},
	stopping:false,
	resuming:false,
	deleting:false,
	stopprogress:0,
	stopcount:0,
	activecount:0,
	count:0,
	Options : {
		RemoveDeleteTab : false,
		foodreport : false,
		MsgInterval : 1, 
		LastReport : 0,
		raidbtns : false,
		Foodstatus   : {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0},
	},
  
	init : function (div){
		var t = Tabs.Raid;
		t.myDiv = div;

		if (!Options.RaidOptions) {
			Options.RaidOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.RaidOptions.hasOwnProperty(y)) {
					Options.RaidOptions[y] = t.Options[y];
				}	
			}
		}

		setInterval(t.lookup, 2500);
		setInterval(t.sendreport, 1*60*1000);
  
		if(Options.RaidOptions.raidbtns) {
			AddMainTabLink('Raids: S', 'pboldraidtab', t.StopAllRaids);
			AddMainTabLink('R', 'pboldraidtabRes', t.ResumeAllRaids);
			if (!Options.RaidOptions.RemoveDeleteTab) AddMainTabLink('D', 'pboldraidtabDel', t.DeleteAllRaids);
			document.getElementById('pboldraidtabRes').style.marginLeft = '0px';
			if (!Options.RaidOptions.RemoveDeleteTab) document.getElementById('pboldraidtabDel').style.marginLeft = '0px';
			document.getElementById('pboldraidtab').title = 'Click to Stop Active Raids';
			document.getElementById('pboldraidtabRes').title = 'Click to Resume Stopped Raids';
			if (!Options.RaidOptions.RemoveDeleteTab) document.getElementById('pboldraidtabDel').title = 'Click to Delete Stopped Raids';
		};
    
		var m = '<DIV class=divHeader align=center>RAID FUNCTIONS</div><TABLE width=100% height=0% class=xtab><TR align="center">';
		m += '<TD>&nbsp;</td>';
		m += '<TD><INPUT id=pbRaidBut type=checkbox '+ (Options.RaidOptions.raidbtns?'CHECKED ':'') +'/></td><TD>'+translate("Raid toggle buttons on top of screen")+'</td><TD><INPUT id=pbDeleteTab type=checkbox '+ (Options.RaidOptions.RemoveDeleteTab?'CHECKED':'') +'\> Remove Delete Tab ';
		m += '<TD><INPUT id=pbsendraidreport type=checkbox '+ (Options.RaidOptions.foodreport?'CHECKED':'') +'\> Send raid report every ';
		m += '<INPUT id=pbsendreportint value='+ Options.RaidOptions.MsgInterval +' type=text size=3 \> hours </td>';
		m += '</tr></table></div>';
		m += '<DIV class=divHeader align=center>ACTIVE RAIDS</div><TABLE width=100% height=0% class=xtab><TR align="center">';
		m += '<TD><DIV style="margin-bottom:10px;"><span id=ptRaidCity></span></div></td></tr>';
		m +='<TR><TD><DIV style="margin-bottom:10px;"><span id=ptRaidTimer></span></div></td></tr></table>';
		m += '<DIV id=PaintRaids></div>';
		m += '<DIV class=divHeader align=center>SAVED RAIDS</div><TABLE width=100% height=0% class=xtab><TR align="center">';
		m += '<DIV id=SavedRaids></div>';
		t.myDiv.innerHTML = m;
    
		t.from = new CdispCityPicker ('ptRaidpicker', document.getElementById('ptRaidCity'), true, t.clickCitySelect, 0);

		document.getElementById('pbRaidBut').addEventListener('change', function(){
			Options.RaidOptions.raidbtns = document.getElementById('pbRaidBut').checked;
			saveOptions();
		}, false);
		document.getElementById('pbDeleteTab').addEventListener('change', function(){
			Options.RaidOptions.RemoveDeleteTab = document.getElementById('pbDeleteTab').checked;
			saveOptions();
		}, false);
		document.getElementById('pbsendraidreport').addEventListener('change', function(){
			Options.RaidOptions.foodreport = document.getElementById('pbsendraidreport').checked;
			saveOptions();
		}, false);
		document.getElementById('pbsendreportint').addEventListener('change', function(){
			Options.RaidOptions.MsgInterval = parseInt(document.getElementById('pbsendreportint').value);
			saveOptions();
		}, false);
    
		var serverID = getServerId();
		t.save = GM_getValue ('SavedRaids_'+unsafeWindow.tvuid+'_'+serverID);
		if (t.save == null) t.save = GM_getValue ('SavedRaids_'+serverID);
		if (t.save != undefined) t.save = JSON2.parse (t.save);
    
		setInterval (t.paint,1000);
	},
    
	lookup : function (){
		var t = Tabs.Raid;
		t.activecount=0;
		t.stopcount=0;
		for (c=0; c< Seed.cities.length;c++) {
			cityID = 'city' + Seed.cities[c][0];    
			for (b in Seed.queue_atkp[cityID]){
				destinationUnixTime = Seed.queue_atkp[cityID][b]['destinationUnixTime'];
				MarchStatus = Seed.queue_atkp[cityID][b]['marchStatus'];
				MarchType = Seed.queue_atkp[cityID][b]['marchType'];
				botMarchStatus = Seed.queue_atkp[cityID][b]['botMarchStatus'];
				if (MarchType == 9 &&  (MarchStatus == 3 || MarchStatus==10)) t.stopcount++;
				else if (MarchType == 9) t.activecount++;
			}
		}

		if(!Options.RaidOptions.raidbtns)return; 	
		if (t.resuming == false && t.stopping == false && t.deleting == false && t.activecount != 0)
			document.getElementById('pboldraidtab').innerHTML = '<span style="color: #ff6">Raids: S ('+ t.activecount + ')</span>'
		else if (t.resuming == false && t.stopping == false && t.deleting == false)
			document.getElementById('pboldraidtab').innerHTML = '<span style="color: #CCC">Raids: S ('+ t.activecount + ')</span>'
		if (t.resuming == false && t.resuming == false && t.deleting == false && t.stopcount !=0)
			document.getElementById('pboldraidtabRes').innerHTML = '<span style="color: #ff6">R ('+ t.stopcount + ')</span>'
		else if (t.resuming == false && t.stopping == false && t.deleting == false)
            document.getElementById('pboldraidtabRes').innerHTML = '<span style="color: #CCC">R ('+ t.stopcount + ')</span>'
		if (!Options.RaidOptions.RemoveDeleteTab) {
			if (t.resuming == false && t.stopping == false && t.deleting == false && t.stopcount !=0)
				document.getElementById('pboldraidtabDel').innerHTML = '<span style="color: #ff6">D ('+ t.stopcount + ')</span>'
			else if (t.resuming == false && t.stopping == false && t.deleting == false)
				document.getElementById('pboldraidtabDel').innerHTML = '<span style="color: #CCC">D ('+ t.stopcount + ')</span>'
		}		
	},
       
	paint : function ()    {
		var t = Tabs.Raid;
		var botMarchStat = {0:'Inactive',
							1:'Raiding',
							2:'Returning',
							3:'Stopped',
							4:'Resting',
							5:'Unknown',
							7:'Situation Changed',
							8:'Returning',
							9:'Aborting'};
		var botStat = {	0:'Undefined',
						1:'Marching',
						2:'Returning',
						3:'Stopped',
						4:'Insufficient Troops',
						5:'Max Raids Exceeded',
						7:'Timed out',
						8:'Resting'};
		var o = '';
		if (t.rslt.settings != undefined) o+= '<FONT size=2px><B>Raid Timer: '+ timestr( 86400 - ( unixTime() - t.rslt.settings.lastUpdated )) +'</b></font>';
		document.getElementById('ptRaidTimer').innerHTML = o;
      
		var z ='<TABLE class=xtab><TR><TD width=60px align=center><A onclick="pbStopAll('+t.cityId+')">STOP</a></td><TD width=70px>Time</td><TD width=85px>Coords</td><TD width=50px>Level</td><TD width=50px></td><TD width=50px><A onclick="pbDeleteAll('+t.cityId+')">DELETE</a></td></TR>';
		if (t.rslt['queue'] != ""){
			for (y in t.rslt['queue']) {
				if (t.rslt['queue'][y]['botMarches'] != undefined) {
					for (k in Seed.queue_atkp['city' + t.cityId]){
						if (Seed.queue_atkp['city' + t.cityId][k]['marchId'] == t.rslt['queue'][y]['botMarches']['marchId']) {
							botMarchStatus = Seed.queue_atkp['city' + t.cityId][k]['botMarchStatus'];
							MarchStatus = Seed.queue_atkp['city' + t.cityId][k]['marchStatus'];
							restPeriod = (Seed.queue_atkp['city' + t.cityId][k]['restPeriod']/60);
							destinationUnixTime = Seed.queue_atkp['city' + t.cityId][k]['destinationUnixTime'];
							returnUnixTime = Seed.queue_atkp['city' + t.cityId][k]['returnUnixTime']
							now = unixTime();
							z+='<TR>';
							if (MarchStatus ==1) z+='<TD align=center><img src='+IMGURL+'attacking.jpg></td>';
							else if (MarchStatus ==8 && (destinationUnixTime - now) <= 0 && botMarchStatus !=3 && returnUnixTime > now) z+='<TD align=center><img src='+IMGURL+'returning.jpg></td>';
							else if (MarchStatus == 3) z+='<TD align=center><img src='+IMGURL+'autoAttack/raid_stopped_desat.png></td>';
							else if (MarchStatus == 4 || (returnUnixTime < now  && botMarchStatus !=3)) z+='<TD align=center><img src='+IMGURL+'autoAttack/raid_resting.png></td>';
							else z+='<TD align=center><img src='+IMGURL+'autoAttack/raid_stopped_desat.png></td>';
                          
							if (destinationUnixTime >= now) z+='<TD>'+ timestr(Seed.queue_atkp['city' + t.cityId][k]['destinationUnixTime'] - unixTime())+'</td>';
							if (destinationUnixTime <= now) {
								if ((destinationUnixTime - now) <= 0 && returnUnixTime > now) z+='<TD>'+ timestr(returnUnixTime - now)+'</td>';
								if (returnUnixTime <= now) z+='<TD>'+ timestr(now - returnUnixTime)+'</td>';
							}
						}
					}
					z+='<TD>('+ t.rslt['queue'][y]['botMarches']['toXCoord'] +','+ t.rslt['queue'][y]['botMarches']['toYCoord']+')</td>';
					z+='<TD align=center>'+ t.rslt['queue'][y]['botMarches']['toTileLevel'] +'</td>';
					if (botMarchStatus == 3) z+='<TD><A onclick="pbEditRaid('+ y +')">Edit</a></td>';
					else z+='<TD><FONT COLOR= "CCCCCC">Edit</font></td>';
					if (botMarchStatus == 3) z+='<TD align=center><A onclick="pbDeleteRaid('+ t.rslt['queue'][y]['botMarches']['marchId']+')">Delete</a></td>';
					else z+='<TD align=center><FONT COLOR= "CCCCCC">Delete</font></td>';
					z +='<TD width=25px></td><TD>Rest Time: '+ timestr(restPeriod) +'</td>';
					z+='</tr>';
				}
			}
		}
		z+='</table>';
		if (t.rslt['queue'] == "") z ='<TABLE class=xtab><TR><TD>No Raids in city!</td></TR>';
		document.getElementById('PaintRaids').innerHTML = z;
      
		var check = true;
		if (t.save != ""){
			var a ='<TABLE class=xtab><TR><TD width=60px></td><TD width=70px></td><TD width=85px>Coords</td><TD width=50px>Level</td><TD width=50px></td><TD width=50px></td></tr>';
			for (y in t.save){
				if (t.save[y] != undefined && t.cityId == t.save[y]['cityId']){
					a +='<TR><TD align=center><A onclick="pbDeleteSavedRaid('+ t.save[y]['marchId'] +')">X</a></td>';
					a +='<TD></td><TD><FONT COLOR= "CC0000">('+t.save[y]['toXCoord']+','+t.save[y]['toYCoord']+')</font></td>';
					a +='<TD align=center>'+t.save[y]['toTileLevel']+'</td>';
					a +='<TD><A onclick="pbEditSavedRaid('+ y +')">Edit</a></td>';
					a +='<TD align=center><A onclick="pbAddRaid('+ t.save[y]['marchId']+')">Add</a></td></tr>';
					check = false;
				}    
			}
			m+='</table>';
		}
          
		if (check) a ='<TABLE class=xtab><TR><TD>No Saved Raids in city!</td></TR>';
      
		document.getElementById('SavedRaids').innerHTML = a;      
      
		unsafeWindow.pbDeleteRaid = t.DeleteRaid;
		unsafeWindow.pbEditRaid = t.EditRaid;
		unsafeWindow.pbAddRaid = t.AddRaid;
		unsafeWindow.pbDeleteSavedRaid = t.DeleteSavedRaid;
		unsafeWindow.pbEditSavedRaid = t.EditSavedRaid;
		unsafeWindow.pbStopAll = t.StopCityRaids;
		unsafeWindow.pbDeleteAll = t.DeleteCityRaids;
	},
  
	DeleteSavedRaid : function (Id){
		var t = Tabs.Raid;
		for (yy=0;yy<t.save.length;yy++){
			if (t.save[yy]['marchId'] == Id){
				t.save.splice (yy,1);
			}    
		}
		var serverID = getServerId();
		setTimeout (function (){GM_setValue ('SavedRaids_'+unsafeWindow.tvuid+'_'+serverID, JSON2.stringify(t.save));}, 0);
		t.paint();
	},
  
	EditSavedRaid : function (y){
		var t = Tabs.Raid;
		var pop = new CPopup ('pbEditRaid', 0,0, 750,350, true);
		if (t.popFirst){
			pop.centerMe (mainPop.getMainDiv());  
			t.popFirst = false;
		}
		pop.getTopDiv().innerHTML = '<CENTER><B>Edit Saved Raid</b></center>';
		cityId =  t.save[y]['cityId'];
      
		var m = '<BR><TABLE id=pbRaidAdd height=0% class=xtab><TR align="center">';
		m+='<TR></tr><TR><TD width=25px>X= <INPUT id=toXCoord type=text size=3 maxlength=3 value='+t.save[y]['toXCoord']+'></td>';
		m+='<TD width=10px></td><TD widht=25px>Y= <INPUT id=toYCoord type=text size=3 maxlength=3 value='+ t.save[y]['toYCoord'] +'></td>';
		m+='<TD width=25px></td><TD>Round Trip: '+ timestr((t.save[y]['returnUnixTime'] - t.save[y]['destinationUnixTime'])*2)+ '</td></tr></table>';

		m += '<BR><TABLE id=pbRaidAdd width=100% height=0% class=xtab><TR align="center">';

		var rowcounter = 0;
		for (var ui in unsafeWindow.cm.UNIT_TYPES){
			var i = unsafeWindow.cm.UNIT_TYPES[ui];
			
			rowcounter++;
			if (rowcounter > 4) {
				m += '</tr><tr align="center">';
				rowcounter = 1;
			}
				
			m += '<td><table class=xtab><tr><td rowspan=2><img src="'+IMGURL+'units/unit_'+i+'_50.jpg?6545"></td><td>'+ addCommas(Seed.units['city'+cityId]['unt'+i]) +'</td></tr><tr><td><INPUT id=Unit'+i+' type=text size=6 maxlength=6 value="'+t.save[y]['unit'+i+'Count']+'"></td></tr></table></td>';
		}
		m += '</tr></table>';
          
		m += '<BR><CENTER><SELECT id=AddKnights type=list></select></center>';
		m+= '<BR><CENTER>'+ strButton20('Save', 'id=pbSaveRaid') +'</center>';
            
		pop.getMainDiv().innerHTML = m;
      
		t.getKnights(cityId);
      
		document.getElementById ('AddKnights').value =  t.save[y]['knightId'];
		document.getElementById ('pbSaveRaid').addEventListener ('click', function(){
			t.save[y]['knightId'] = parseInt(document.getElementById ('AddKnights').value);
			t.save[y]['toXCoord'] = parseInt(document.getElementById ('toXCoord').value);
			t.save[y]['toYCoord'] = parseInt(document.getElementById ('toYCoord').value);
			for (var ui in unsafeWindow.cm.UNIT_TYPES){
				var i = unsafeWindow.cm.UNIT_TYPES[ui];
				t.save[y]['unit'+i+'Count'] = parseInt(document.getElementById ('Unit'+i).value);
			}	
			var serverID = getServerId();
			setTimeout (function (){GM_setValue ('SavedRaids_'+unsafeWindow.tvuid+'_'+serverID, JSON2.stringify(t.save));}, 0);
			pop.show (false);
		}, false);
      
		pop.show (true);      
	},
      
	EditRaid : function (y){
		var t = Tabs.Raid;
		var pop = new CPopup ('pbEditRaid', 0,0, 750,430, true);
		if (t.popFirst){
			pop.centerMe (mainPop.getMainDiv());  
			t.popFirst = false;
		}
		pop.getTopDiv().innerHTML = '<CENTER><B>Edit Raid</b></center>';
		cityId = t.rslt['queue'][y]['botMarches']['cityId'];
        
		var m = '<BR><TABLE id=pbRaidAdd height=0% class=xtab><TR align="center">';
		m+='<TR></tr><TR><TD width=25px>X= <INPUT id=toXCoord type=text size=3 maxlength=3 value='+t.rslt['queue'][y]['botMarches']['toXCoord']+'></td>';
		m+='<TD width=10px></td><TD widht=25px>Y= <INPUT id=toYCoord type=text size=3 maxlength=3 value='+ t.rslt['queue'][y]['botMarches']['toYCoord'] +'></td>';
		m+='<TD width=25px></td><TD>Round Trip: '+ timestr((t.rslt['queue'][y]['botMarches']['returnUnixTime'] - t.rslt['queue'][y]['botMarches']['destinationUnixTime'])*2)+ '</td></tr></table>';

		m += '<BR><TABLE id=pbRaidAdd width=100% height=0% class=xtab><TR align="center">';

		var rowcounter = 0;
		for (var ui in unsafeWindow.cm.UNIT_TYPES){
			var i = unsafeWindow.cm.UNIT_TYPES[ui];
			
			rowcounter++;
			if (rowcounter > 4) {
				m += '</tr><tr align="center">';
				rowcounter = 1;
			}
				
			m += '<td><table class=xtab><tr><td rowspan=2><img src="'+IMGURL+'units/unit_'+i+'_50.jpg?6545"></td><td>'+ addCommas(Seed.units['city'+cityId]['unt'+i]) +'</td></tr><tr><td><INPUT id=Unit'+i+' type=text size=6 maxlength=6 value="'+t.rslt['queue'][y]['botMarches']['unit'+i+'Count']+'"></td></tr></table></td>';
		}
		m += '</tr></table>';
            
		m += '<BR><CENTER><SELECT id=AddKnights type=list></select></center>';
		m+= '<BR><CENTER>'+ strButton20('Save', 'id=pbRaidSave') +'</center>';
              
		pop.getMainDiv().innerHTML = m;
        
		t.getKnights(cityId);
		
		document.getElementById ('AddKnights').value =  t.rslt['queue'][y]['botMarches']['knightId'];
		document.getElementById ('pbRaidSave').addEventListener ('click', function(){
			var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
                              
			params.pf = 0;
			params.ctrl = 'BotManager';
			params.action = 'editMarch';
			params.settings = {};
			params.settings.cityId = t.rslt['queue'][y]['botMarches']['fromCityId'];
			params.queue = {0:{botMarches:{botMarchStatus:1,botState:1},cityMarches:{}}};        
			params.queue[0].cityMarches.knightId = parseInt(document.getElementById ('AddKnights').value);
			params.queue[0].cityMarches.toXCoord =  parseInt(document.getElementById ('toXCoord').value);
			params.queue[0].cityMarches.toYCoord =  parseInt(document.getElementById ('toYCoord').value);
			params.queue[0].cityMarches.unit0Count = 0; //document.getElementById ('Unit0').value;
			for (var ui in unsafeWindow.cm.UNIT_TYPES){
				var i = unsafeWindow.cm.UNIT_TYPES[ui];
				params.queue[0]['cityMarches']['unit'+i+'Count'] = parseIntNan(document.getElementById ('Unit'+i).value);
			}	
			params.queue[0].cityMarches.marchId =  t.rslt['queue'][y]['botMarches']['marchId'];
				
			new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/_dispatch.php" + unsafeWindow.g_ajaxsuffix, {
				method: "post",
				parameters: params,
				loading: true,
				onSuccess: function(rslt){
					if (rslt.ok) {
						pop.show (false);
						unsafeWindow.cityinfo_army();
						setTimeout(unsafeWindow.update_seed_ajax, 250);
						setTimeout(t.GetRaids, (750),Seed.cities[i][0]);
					}
				},
			},true);
		}, false);
        
		pop.show (true);      
	},
  
	DeleteRaid : function (Id){
		var t = Tabs.Raid;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
      
		for (y in t.rslt['queue']) {
			if (t.rslt['queue'][y]['botMarches'] != undefined) {
				if (t.rslt['queue'][y]['botMarches']['marchId'] == Id) {
					marchId = t.rslt['queue'][y]['botMarches']['marchId'];
					cityId = t.rslt['queue'][y]['botMarches']['cityId'];
					knightId = t.rslt['queue'][y]['botMarches']['knightId'];
					toTileLevel = t.rslt['queue'][y]['botMarches']['toTileLevel'];
					returnUnixTime = t.rslt['queue'][y]['botMarches']['returnUnixTime'];
					destinationUnixTime = t.rslt['queue'][y]['botMarches']['destinationUnixTime'];
					toXCoord = t.rslt['queue'][y]['botMarches']['toXCoord'];
					toYCoord = t.rslt['queue'][y]['botMarches']['toYCoord'];
					var units = {};
					for (var ui in unsafeWindow.cm.UNIT_TYPES){
						var i = unsafeWindow.cm.UNIT_TYPES[ui];
						units[i] = t.rslt['queue'][y]['botMarches']['unit'+i+'Count'];
					}	
				}
			}
		}    
      
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'deleteMarch';
		params.marchId = marchId;
		params.settings = {};
		params.settings.cityId = cityId;
      
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/_dispatch.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function(rslt){
				if (rslt.ok) {
					var serverID = getServerId();
					t.save = GM_getValue ('SavedRaids_'+unsafeWindow.tvuid+'_'+serverID);
					if (t.save == null) t.save = GM_getValue ('SavedRaids_'+serverID);
					if (t.save == undefined) t.save =new Array();
					else t.save = JSON2.parse (t.save);
					var RaidObj = {};
					RaidObj.marchId = marchId;
					RaidObj.cityId = cityId;
					RaidObj.knightId = knightId;
					RaidObj.toTileLevel = toTileLevel;
					RaidObj.returnUnixTime = destinationUnixTime;
					RaidObj.returnUnixTime = returnUnixTime;
					RaidObj.toXCoord =  toXCoord;
					RaidObj.toYCoord = toYCoord;
					for (var ui in unsafeWindow.cm.UNIT_TYPES){
						var i = unsafeWindow.cm.UNIT_TYPES[ui];
						RaidObj['unit'+i+'Count'] = units[i];
					}
				  
					t.save.push (RaidObj);
					for (u in Seed.queue_atkp['city' + cityId]){
						if (Seed.queue_atkp['city' + cityId][u]['marchId'] == marchId){
							delete Seed.queue_atkp['city' + cityId][u];
							if (Object.keys(Seed.queue_atkp['city' + cityId]).length == 0) {
								Seed.queue_atkp['city' + cityId] = uWCloneInto([]);
							}
							break;
						}
					}
                     
					for (u in Seed.knights['city' + cityId]){
						if (Seed.knights['city' + cityId][u]['knightId'] == knightId){
							Seed.knights['city' + cityId][u]["knightStatus"] = 1;
							break;
						}
					}
                                                     
					GM_setValue ('SavedRaids_'+unsafeWindow.tvuid+'_'+serverID, JSON2.stringify(t.save));
					unsafeWindow.cityinfo_army();
					setTimeout(unsafeWindow.update_seed_ajax, 250);
					t.GetRaids(cityId);
				}
			},
		},true);
	},
  
	StopCityRaids : function (cityId){
		var t = Tabs.Raid;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
        
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'stopAll';
		params.settings = {};

		params.settings.cityId = cityId;
                  
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/_dispatch.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function(rslt){
				if (rslt.ok) {
				}
			},
		},true);   
		setTimeout(t.GetRaids, (750), cityId);     
	},
  
	StopAllRaids : function (){
		var t = Tabs.Raid;
		if (t.stopping == true || t.resuming == true || t.deleting == true) return;
		if (t.activecount == 0) return;
		t.stopping = true;     
		for (i=0;i<Seed.cities.length;i++){
			setTimeout(t.DoAllStop, (i*1500),i);
		}
	},
   
	ResumeAllRaids : function (){
		var t = Tabs.Raid;
		if (t.stopping == true || t.resuming == true || t.deleting == true) return;
		if (t.stopcount == 0) return;
		t.resuming = true;
		for (i=0;i<Seed.cities.length;i++){
			setTimeout(t.DoAllResume, (i*1500),i);
		}
	},
   
	DeleteAllRaids : function (){
		var t = Tabs.Raid;
		if (t.stopping == true || t.resuming == true || t.deleting == true) return;
		if (t.stopcount == 0) return;
		t.deleting = true;
		count=0;
		t.count = t.stopcount;
		for (d=0; d< Seed.cities.length;d++) {
			var cityId = Seed.cities[d][0];
			var city_atkp = Seed.queue_atkp['city'+cityId];
			for (var e in city_atkp){
				destinationUnixTime = city_atkp[e]['destinationUnixTime'];
				MarchId = city_atkp[e]['marchId'];
				MarchStatus = city_atkp[e]['marchStatus'];
				MarchType = city_atkp[e]['marchType'];
				botMarchStatus = city_atkp[e]['botMarchStatus'];
				if (MarchType == 9 && botMarchStatus == 3 && MarchStatus == 10) {
					count++;
					setTimeout(t.DoAllDelete, (count*1250), MarchId,d,count);
				}	
			}
		}
	},
  
	DoAllStop: function(i) {
		var t = Tabs.Raid;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'stopAll';
		params.settings = {};
		params.settings.cityId = Seed.cities[i][0];
                  
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/_dispatch.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function(rslt){
				if (rslt.ok) {
					t.stopprogress = t.stopprogress + (100/Seed.cities.length);
					actionLog('Stopping: '+ Seed.cities[i][1],'RAIDS');
					t.updatebotbutton('Stopping: '+ t.stopprogress.toFixed(0) + '%', 'pboldraidtab');
					if (t.stopprogress.toFixed(0) == 100) {
						t.stopprogress = 0;
						setTimeout(function(){t.updatebotbutton('Raids: S ('+ t.activecount + ')', 'pboldraidtab');t.stopping = false;}, (5000));
					}        
				}
				else {
					if (rslt.msg == "The system is busy, please try again later") setTimeout (t.DoAllStop, (2000),i);
					else {
						t.stopprogress = t.stopprogress + (100/Seed.cities.length);
						actionLog('Stopping: '+ Seed.cities[i][1] + ' - ' + rslt.msg,'RAIDS');
						t.updatebotbutton('Stopping: '+ t.stopprogress.toFixed(0) + '%', 'pboldraidtab')
						if (t.stopprogress.toFixed(0) == 100) {
							t.stopprogress = 0;
							setTimeout(function(){t.updatebotbutton('Raids: S ('+ t.activecount + ')', 'pboldraidtab');t.stopping = false;}, (5000));
						}
					}
				}
			},
		},true);  
	},

	DoAllResume: function(i) {
		var t = Tabs.Raid;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'resumeAll';
		params.settings = {};
		params.settings.cityId = Seed.cities[i][0];
                  
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/_dispatch.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function(rslt){
				if (rslt.ok) {
					t.stopprogress = t.stopprogress + (100/Seed.cities.length);
					actionLog('Resuming: '+ Seed.cities[i][1],'RAIDS');
					t.updatebotbutton('Resuming: '+ t.stopprogress.toFixed(0) + '%', 'pboldraidtab');
					if (t.stopprogress.toFixed(0) == 100) {
						t.stopprogress = 0;
						setTimeout(function(){t.updatebotbutton('Raids: S ('+ t.activecount + ')', 'pboldraidtab');t.resuming = false;}, (5000));
					}        
				}
				else {
					if (rslt.msg == "The system is busy, please try again later") setTimeout (t.DoAllResume, (2000),i);
					else {
						t.stopprogress = t.stopprogress + (100/Seed.cities.length);
						actionLog('Resuming: '+ Seed.cities[i][1]  + ' - ' + rslt.msg,'RAIDS');
						t.updatebotbutton('Resuming: '+ t.stopprogress.toFixed(0) + '%', 'pboldraidtab')
						if (t.stopprogress.toFixed(0) == 100) {
							t.stopprogress = 0;
							setTimeout(function(){t.updatebotbutton('Raids: S ('+ t.activecount + ')', 'pboldraidtab');t.resuming = false;}, (5000));
						}    
					}
				}
			},
		},true);  
	},
  
	DoAllDelete : function (Id,city,count){
		var t = Tabs.Raid;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
        
		cityID = 'city'+ Seed.cities[city][0];
        
		for (f in Seed.queue_atkp[cityID]){
			if (Seed.queue_atkp[cityID][f]['marchId'] == Id) {
				marchId = Seed.queue_atkp[cityID][f]['marchId'];
				cityId = Seed.queue_atkp[cityID][f]['cityId'];
				knightId = Seed.queue_atkp[cityID][f]['knightId'];
				toTileLevel = Seed.queue_atkp[cityID][f]['toTileLevel'];
				returnUnixTime = Seed.queue_atkp[cityID][f]['returnUnixTime'];
				destinationUnixTime = Seed.queue_atkp[cityID][f]['destinationUnixTime'];
				toXCoord = Seed.queue_atkp[cityID][f]['toXCoord'];
				toYCoord = Seed.queue_atkp[cityID][f]['toYCoord'];
				var units = {};
				for (var ui in unsafeWindow.cm.UNIT_TYPES){
					var i = unsafeWindow.cm.UNIT_TYPES[ui];
					units[i] = Seed.queue_atkp[cityID][f]['unit'+i+'Count'];
				}	
			}
		}
        
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'deleteMarch';
		params.marchId = marchId;
		params.settings = {};
		params.settings.cityId = cityId;
        
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/_dispatch.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function(rslt){
				if (rslt != "") {
					var serverID = getServerId();
					t.save = GM_getValue ('SavedRaids_'+unsafeWindow.tvuid+'_'+serverID, "[]");
					if (t.save == undefined) t.save = GM_getValue ('SavedRaids_'+serverID, "[]");
					if (t.save != undefined) t.save = JSON2.parse (t.save);
					if (t.save == undefined) t.save =new Array();
					var RaidObj = {};
					RaidObj.marchId = marchId;
					RaidObj.cityId = cityId;
					RaidObj.knightId = knightId;
					RaidObj.toTileLevel = toTileLevel;
					RaidObj.returnUnixTime = destinationUnixTime;
					RaidObj.returnUnixTime = returnUnixTime;
					RaidObj.toXCoord =  toXCoord;
					RaidObj.toYCoord = toYCoord;
					for (var ui in unsafeWindow.cm.UNIT_TYPES){
						var u = unsafeWindow.cm.UNIT_TYPES[ui];
						RaidObj['unit'+u+'Count'] = units[u];
					}
					  
					t.save.push (RaidObj);

					for (u in Seed.queue_atkp['city' + cityId]){
						if (Seed.queue_atkp['city' + cityId][u]['marchId'] == marchId){
							delete Seed.queue_atkp['city' + cityId][u];
							if (Object.keys(Seed.queue_atkp['city' + cityId]).length == 0) {
								Seed.queue_atkp['city' + cityId] = uWCloneInto([]);
							}
							break;
						}
					}
                     
					for (u in Seed.knights['city' + cityId]){
						if (Seed.knights['city' + cityId][u]['knightId'] == knightId){
							Seed.knights['city' + cityId][u]["knightStatus"] = 1;
							break;
						}
					}
					
					setTimeout (function (){GM_setValue ('SavedRaids_'+unsafeWindow.tvuid+'_'+serverID, JSON2.stringify(t.save));}, 0);
					unsafeWindow.cityinfo_army();      
					setTimeout(unsafeWindow.update_seed_ajax, 250);
				}
			},
		},true);
		t.stopprogress = count * (100/t.count);
		actionLog('Deleting: '+ Seed.cities[city][1],'RAIDS');
		t.updatebotbutton('Deleting: '+ t.stopprogress.toFixed(0) + '%', 'pboldraidtab');
		if (t.stopprogress.toFixed(0) == 100) {
			t.stopprogress = 0;
			setTimeout(function(cid){t.GetRaids(cid); t.updatebotbutton('Raids: S ('+ t.activecount + ')', 'pboldraidtab');t.deleting = false; }, 5000, cityId);
		}    
         
	},
      
	DeleteCityRaids : function (cityId){
		var t = Tabs.Raid;
		if (t.stopping == true || t.resuming == true || t.deleting == true) return;
		count=0;
		for (d=0; d< Seed.cities.length;d++) {
			if (Seed.cities[d][0]==cityId) {
				var cityId = Seed.cities[d][0];
				var city_atkp = Seed.queue_atkp['city'+cityId];
				for (var e in city_atkp){
					destinationUnixTime = city_atkp[e]['destinationUnixTime'];
					MarchStatus = city_atkp[e]['marchStatus'];
					MarchType = city_atkp[e]['marchType'];
					botMarchStatus = city_atkp[e]['botMarchStatus'];
					if (MarchType == 9 && botMarchStatus == 3 && MarchStatus == 10) {
						count++;
					}	
				}	
			}	
		}
		t.count = count;
		if (t.count == 0) return;
		t.deleting = true;
		count=0;
		for (d=0; d< Seed.cities.length;d++) {
			if (Seed.cities[d][0]==cityId) {
				var cityId = Seed.cities[d][0];
				var city_atkp = Seed.queue_atkp['city'+cityId];
				for (var e in city_atkp){
					destinationUnixTime = city_atkp[e]['destinationUnixTime'];
					MarchId = city_atkp[e]['marchId'];
					MarchStatus = city_atkp[e]['marchStatus'];
					MarchType = city_atkp[e]['marchType'];
					botMarchStatus = city_atkp[e]['botMarchStatus'];
					if (MarchType == 9 && botMarchStatus == 3 && MarchStatus == 10) {
						count++;
						setTimeout(t.DoAllDelete, (count*1250), MarchId,d,count);
					}
				}	
			}	
		}
	},
        
	AddRaid : function (Id){
		var t = Tabs.Raid;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
		update = {};
        
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'saveMarch';
		params.settings = {};
		params.queue = {0:{botMarches:{botMarchStatus:1,botState:1},cityMarches:{}}};
        
		for (y in t.save){
			if (t.save[y]['marchId'] == Id){
				params.settings.cityId = t.save[y]['cityId'];
				params.queue[0].cityMarches.knightId = t.save[y]['knightId']; //parseInt(document.getElementById('AddKnights').value);
				params.queue[0].cityMarches.toXCoord = t.save[y]['toXCoord'];
				params.queue[0].cityMarches.toYCoord = t.save[y]['toYCoord'];
				params.queue[0].cityMarches.unit0Count = 0;
				for (var ui in unsafeWindow.cm.UNIT_TYPES){
					var i = unsafeWindow.cm.UNIT_TYPES[ui];
					params.queue[0]['cityMarches']['unit'+i+'Count'] = t.save[y]['unit'+i+'Count'];
				}	
			}
		}    
         
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/_dispatch.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function(rslt){
				if (rslt.ok) {
					t.GetRaids(params.settings.cityId);
					unsafeWindow.cityinfo_army();
					setTimeout(unsafeWindow.update_seed_ajax, 250);
					for (yy=0;yy<t.save.length;yy++){
						if (t.save[yy]['marchId'] == Id){
							t.save.splice (yy,1);
						}    
					}
					var serverID = getServerId();
					setTimeout (function (){GM_setValue ('SavedRaids_'+unsafeWindow.tvuid+'_'+serverID, JSON2.stringify(t.save));}, 0);
					t.paint();
				} else {
					alert('Error: '+ rslt.msg);      
				}
			},
		},true);        
	},
        
	getKnights : function(cityId){
		var t = Tabs.Raid;
		var knt = new Array();
		var status ="";
		for (k in Seed.knights['city' + cityId]){
			if ( Seed.leaders['city' + cityId]["resourcefulnessKnightId"] != Seed.knights['city' + cityId][k]["knightId"] && Seed.leaders['city' + cityId]["politicsKnightId"] != Seed.knights['city' + cityId][k]["knightId"] && Seed.leaders['city' + cityId]["combatKnightId"] != Seed.knights['city' + cityId][k]["knightId"] && Seed.leaders['city' + cityId]["intelligenceKnightId"] != Seed.knights['city' + cityId][k]["knightId"]){
				if (Seed.knights['city' + cityId][k]["knightStatus"] == 1 ) status = "Free";
				else status = "Marching";
				knt.push ({
					Name:   Seed.knights['city' + cityId][k]["knightName"],
					Combat:    parseInt(Seed.knights['city' + cityId][k]["combat"]),
					ID:        Seed.knights['city' + cityId][k]["knightId"],
					Status: status,
				});
			}
		}
		knt = knt.sort(function sort(a,b) {a = a['Combat'];b = b['Combat'];return a == b ? 0 : (a > b ? -1 : 1);});
		document.getElementById('AddKnights').options.length=0;
		var o = document.createElement("option");
		o.text = '--Choose a Knight--';
		o.value = 0;
		document.getElementById("AddKnights").options.add(o);
		for (k in knt){
			if (knt[k]["Name"] !=undefined){
				var o = document.createElement("option");
				o.text = (knt[k]["Name"] + ' (' + knt[k]["Combat"] +') (' + knt[k]["Status"] +')');
				o.value = knt[k]["ID"];
				document.getElementById("AddKnights").options.add(o);
			}
		}
	},
    
	clickCitySelect : function (city){
		var t = Tabs.Raid;
		t.cityId = city['id'];
		t.GetRaids(t.cityId);
	},
  
	GetRaids : function(cityId){
		var t = Tabs.Raid;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
                    
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'getMarches';
		params.settings = {};
		params.settings.cityId = cityId;
          
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/_dispatch.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function(rslt){
				if (rslt.ok) {
					t.rslt = rslt;
					t.paint();
					unsafeWindow.cityinfo_army();
					setTimeout(unsafeWindow.update_seed_ajax, 250);
				}
			},
		},true);
	},
  
	resetRaids : function(cityId,cityName){
		var t = Tabs.Raid;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
                    
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'resetRaidTimer';
		params.settings = {};
		params.settings.cityId = cityId;
          
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/_dispatch.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function(rslt){
				if (rslt.ok) {
					unsafeWindow.cityinfo_army();
					setTimeout(unsafeWindow.update_seed_ajax, 250);
					t.citiesdone += cityName + ' ';
				}
			},
		},true);
	},
  
	sendreport: function(){
		var t = Tabs.Raid;
		if(!Options.RaidOptions.foodreport) return;
		var now = new Date().getTime()/1000.0;
		now = now.toFixed(0);
		if (now < (parseInt(Options.RaidOptions.LastReport)+(Options.RaidOptions.MsgInterval*60*60))) return;
    
		var total = 0;
		var message = 'Raid Stats: %0A';
		message += '%0A Food Gain (for '+ Options.RaidOptions.MsgInterval +' hour of raiding) %0A';
		for (q=1;q<=Seed.cities.length;q++){
			var cityID = 'city' + Seed.cities[q-1][0];
			var gain = parseInt(Seed.resources[cityID]['rec1'][0] / 3600) - parseIntNan(Options.RaidOptions.Foodstatus[q]);
			message+= Seed.cities[q-1][1] + ': Start: ' + addCommas(parseIntNan(Options.RaidOptions.Foodstatus[q])) + ' End :' + addCommas(parseInt(Seed.resources[cityID]['rec1'][0] / 3600)) + ' Gain: ';
			message += addCommas(gain)  + '%0A';
			total += gain;
			Options.RaidOptions.Foodstatus[q] = parseIntNan(Seed.resources[cityID]['rec1'][0] / 3600);
		}
		message += '%0A Total food gain : '+addCommas(total)+'%0A';
    
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
		params.emailTo = Seed.player['name'];
		params.subject = "Raid Overview";
		params.message = message;
		params.requestType = "COMPOSED_MAIL";
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/getEmail.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					DeleteLastMessage();
				} else {
				}
			},
			onFailure: function () {
			},
		},true);
    
		Options.RaidOptions.LastReport = now;
		saveOptions();
	},
  
	hide : function (){
	},

	show : function (){
	},

	updatebotbutton : function (text, id) {
		var but=document.getElementById(id);
		but.innerHTML = '<span style="color: #ff6">'+text+'</span>';
	},

};
