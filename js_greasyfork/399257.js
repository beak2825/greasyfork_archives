/******************* Portal Time! ****************/
// @tabversion 20180427

Tabs.PortalTime = {
	tabOrder: 8000,
	tabLabel: 'AutoPort',
	tabColor : 'brown',
	myDiv: null,
	cityId: 0,
	inc:0,
	resettimer:null,
	doveavailable:false,
	porttype: 0,
	triggered:false,
	reason: '',
	MapAjax : new CMapAjax(),
	Blocks : [],
	plain : {},
	checklist : [],

	Options : {
		Running: false,
		OnScout: false,
		OnTime: true,
		OnType: false,
		lastinc: 0,
		inctime: 5,
		incnumber: 5,
		inctype: 'unt9',
		incamount: 200000,
		inctype2: 'unt41',
		PortProvince : 0,
		PortToggle : true,
		PortAFK : true,
		UseRefuge : true,
		UseOrder : false,
		MistPort : false,
		SendMail : true,
		PortCities : {1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false},
		DoveCities : {1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false},
		AllAttacks : false,
	},

	init: function(div) {
		var t = Tabs.PortalTime;
		t.myDiv = div;

		if (!Options.PortOptions) {
			Options.PortOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.PortOptions.hasOwnProperty(y)) {
					Options.PortOptions[y] = t.Options[y];
				}
			}
		}
		
		Options.PortOptions.MistPort = false; // disable because it doesn't work!
		// conversion
		if (Options.PortOptions.AutoDove && Cities.byID[Options.PortOptions.PortCity]) {
			Options.PortOptions.DoveCities[Cities.byID[Options.PortOptions.PortCity].idx+1] = true;
			delete Options.PortOptions.AutoDove;
			saveOptions();
		}
		if (Options.PortOptions.PortCity && Cities.byID[Options.PortOptions.PortCity]) {
			Options.PortOptions.PortCities[Cities.byID[Options.PortOptions.PortCity].idx+1] = true;
			delete Options.PortOptions.PortCity;
			delete Options.PortOptions.PortCityIdx;
			saveOptions();
		}
		if (!Options.PortOptions.inctype2) {
			Options.PortOptions.inctype2 = 'unt41';
			saveOptions();
		}
		
		if (Options.PortOptions.PortToggle) AddSubTabLink('Port',t.togglePortState, 'PortToggleTab');
		SetToggleButtonState('Port',Options.PortOptions.Running,'Port');

		var selbut = null;
		var m = '<DIV class=divHeader align=center>'+translate("AUTOPORT OPTIONS")+'</div>';
		m += '<div align="center">';
		m += '<table width=100% class=xtab><tr><td width=30%><INPUT id=pbportbutton type=checkbox '+ (Options.PortOptions.PortToggle?'CHECKED ':'') +'/>&nbsp;'+translate("Add toggle button to main screen header")+'</td><td colspan=2 align=center><INPUT id=btAutoPortState type=submit value="'+translate("AutoPort")+' = '+ (Options.PortOptions.Running?'ON':'OFF')+'"></td><td width=30% align=right>&nbsp;</td></tr></table>';

		m += '<br><TABLE width=98% class=xtab cellpadding=1 cellspacing=0 align=center style="font-size:'+Options.OverviewOptions.OverviewFontSize+'px;"><TR valign=bottom><td width=20>&nbsp;</td><td width=40>&nbsp;</td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD style="font-size:11px;" align=center width=100><span id="btSpellCity_'+i+'"><B>'+Cities.cities[i-1].name.substring(0, 12)+'</b></span></td>';
		}
		m += "<td>&nbsp;</td>"; // spacer
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 align=right><b>'+tx('Auto-Port')+'&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><INPUT class='+i+' id="btPortAutoCity_'+i+'" type=checkbox '+(Options.PortOptions.PortCities[i]?'CHECKED':'')+'></div></td>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 align=right><b>'+tx('Auto-Dove')+'&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><INPUT class='+i+' id="btDoveAutoCity_'+i+'" type=checkbox '+(Options.PortOptions.DoveCities[i]?'CHECKED':'')+'></div></td>';
		}
		m += '</tr></table>';

		m += '<br><TABLE width=98% height=0% class=xtab>';
		m += '<tr><td colspan=4 align=center><b>'+translate("Requirements")+':</b></td></tr>';
		m += '<tr><td colspan=4 align=center>'+translate("The selected cities <b>MUST</b> contain a watchtower of level 8 or above, or it cannot properly detect Incoming Attacks/Scouts!")+'</td></tr>';
		m += '<tr><td colspan=4 align=center>'+translate("Porting will <b>NOT</b> work if there are troops outside the city, including barbarian raids!")+'</td></tr>';
		m += '<tr><td colspan=4><hr></td></tr>';
		m += '<tr><td width=10>&nbsp;</td><TD colspan=3>'+translate("Doves Owned")+' '+(Seed.items.i901?Seed.items.i901:"0")+'</td></tr>';
		m += '<tr><td width=10>&nbsp;</td><td colspan=3>Port to province:&nbsp;<select id=portprovince><option value="0">--- Random ---</option>';
		for (var i=1;i<=24;i++) m+='<option value="'+i+'">'+unsafeWindow.provincenames['p'+i]+'</option>';
		m += '</select></td></tr>';
		m += '<tr><TD><INPUT id=btportafk type=checkbox '+ (Options.PortOptions.PortAFK?'CHECKED ':'')+ '/></td><TD>'+translate("Only port when AFK")+'</td></tr>';
		m += '<tr><TD><INPUT id=btportorder type=checkbox '+ (Options.PortOptions.UseOrder?'CHECKED ':'')+ '/></td><TD width=180px>'+translate("Use Portal of Order (Owned")+' '+(Seed.items.i912?Seed.items.i912:"0")+')</td><TD style="display:none;"><INPUT id=btmistport type=checkbox '+ (Options.PortOptions.MistPort?'CHECKED ':'')+ '/>&nbsp;'+translate("Try to port to an existing mist")+'</td></tr>';
		m += '<tr><TD><INPUT id=btportrefuge type=checkbox '+ (Options.PortOptions.UseRefuge?'CHECKED ':'')+ '/></td><TD>'+translate("Use Portal of Refuge (Owned")+' '+(Seed.items.i911?Seed.items.i911:"0")+')</td></tr>';
		m += '<tr><TD>&nbsp;</td><td colspan=3>(Portals of Order will be used first if ticked. If map lookup fails a Portal of Refuge will be used whether ticked or not!)</td></tr>';
		m += '<tr><td colspan=4><hr></td></tr>';
		m += '<tr><td><INPUT id=portscout type=checkbox '+(Options.PortOptions.OnScout?'CHECKED':'')+'></td><td colspan=3>'+translate("Port on incoming scout")+'</td></tr>';
		m += '<tr><td><INPUT id=portall type=checkbox '+(Options.PortOptions.AllAttacks?'CHECKED':'')+'></td><td colspan=3>'+translate("Port on all incoming attacks")+'</td></tr>';
		m += '<tr><td><INPUT id=porttime type=checkbox '+(Options.PortOptions.OnTime?'CHECKED':'')+'></td><td colspan=3>'+translate("Port on more than")+'&nbsp;<INPUT style="width: 30px;text-align:right;" id=portincnumber type=text value=' + Options.PortOptions.incnumber + '>&nbsp;'+translate("attacks in")+'&nbsp;<INPUT id=portinctime style="width: 30px;text-align:right;" type=text value=' + Options.PortOptions.inctime + '>&nbsp;'+translate("minutes")+'</td></tr>';
		m += '<tr><td><INPUT id=porttype type=checkbox '+(Options.PortOptions.OnType?'CHECKED':'')+'></td><td colspan=3>'+translate("Port on more than")+'&nbsp;<INPUT style="width: 70px;text-align:right;" id=portincamount type=text value=' + Options.PortOptions.incamount + '>&nbsp;<select id=portinctype>';
		for (y in unsafeWindow.unitcost) m += '<option value="' + y + '">' + unsafeWindow.unitcost[y][0] + '</option>';
		m += '</select>&nbsp;'+tx('or')+'&nbsp;<select id=portinctype2>';
		for (y in unsafeWindow.unitcost) m += '<option value="' + y + '">' + unsafeWindow.unitcost[y][0] + '</option>';
		m += '</select>&nbsp;'+translate("incoming on a single attack")+'</td></tr>';
		m += '<tr><td><INPUT id=portsendmail type=checkbox '+(Options.PortOptions.SendMail?'CHECKED':'')+'></td><TD>'+translate("Send audit message to yourself when porting triggered")+'</td></tr>';
		m += '</table>';
		m += '<div align=center><br><hr>';
		m += '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">\
				<input type="hidden" name="cmd" value="_s-xclick">\
				<input type="hidden" name="hosted_button_id" value="8VEDPV3X9X82L">\
				<input type="image" src="https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online!">\
				<img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">\
				</form>';
		m += '<br>'+tx('This additional tab has been provided free of charge for the benefit of players. Please donate to help with future support and development of this and other features')+'.<br>'+tx('Thanks')+',&nbsp;Barbarossa.</div></div><br>';
		t.myDiv.innerHTML = m;

		for (var i = 1; i <= Cities.numCities; i++) {
			ById('btPortAutoCity_'+i).addEventListener('click', function(e){
				var citynum = e.target['className'];
				Options.PortOptions.PortCities[citynum] = e.target.checked;
				saveOptions();
			}, false);
			ById('btDoveAutoCity_'+i).addEventListener('click', function(e){
				var citynum = e.target['className'];
				Options.PortOptions.DoveCities[citynum] = e.target.checked;
				saveOptions();
			}, false);
		}

		document.getElementById('btAutoPortState').addEventListener('click', function() {
			t.togglePortState();
		}, false);

		ToggleOption ('PortOptions','pbportbutton','PortToggle');
		ToggleOption ('PortOptions','btportafk','PortAFK');
		ToggleOption ('PortOptions','portscout','OnScout');
		ToggleOption ('PortOptions','portall','AllAttacks');
		ToggleOption ('PortOptions','porttime','OnTime');
		ToggleOption ('PortOptions','porttype','OnType');
		ToggleOption ('PortOptions','btportrefuge','UseRefuge');
		ToggleOption ('PortOptions','btportorder','UseOrder');
//		ToggleOption ('PortOptions','btmistport','MistPort');
		ToggleOption ('PortOptions','portsendmail','SendMail');
		ChangeOption ('PortOptions','portprovince', 'PortProvince');
		ChangeOption ('PortOptions','portincnumber', 'incnumber', t.ResetTimer);
		ChangeOption ('PortOptions','portinctime', 'inctime', t.ResetTimer);
		ChangeOption ('PortOptions','portincamount', 'incamount');
		ChangeOption ('PortOptions','portinctype', 'inctype');
		ChangeOption ('PortOptions','portinctype2', 'inctype2');

		document.getElementById('portprovince').value = Options.PortOptions.PortProvince;
		document.getElementById('portinctype').value = Options.PortOptions.inctype;
		document.getElementById('portinctype2').value = Options.PortOptions.inctype2;

		setInterval(function() { t.checkincoming() }, 5000);
		t.ResetTimer();
		t.doveavailable = true;
	},

	checkincoming: function (){
		var t = Tabs.PortalTime;
		if(!Options.PortOptions.Running)return;
		if (t.triggered) return; // we're already on it!
		var now = unixTime();
		t.reason = '';
		if(afkdetector.isAFK || !(Options.PortOptions.PortAFK)) {
			for (var k in Seed.queue_atkinc){   // check each incoming march
				var m = Seed.queue_atkinc[k];
				if (m.toCityId) {
					var fromname = '???';
					if (Seed.players['u'+m.pid]) fromname = Seed.players['u'+m.pid].n;
					if((Options.PortOptions.PortCities[Cities.byID[m.toCityId].idx+1]==true || Options.PortOptions.DoveCities[Cities.byID[m.toCityId].idx+1]==true) && (m.toTileId == Cities.byID[m.toCityId].tileId)){

						var GoPort = false;
						if (m.marchType==3 && Options.PortOptions.OnScout && parseIntNan(m.arrivalTime)>now) { GoPort = true; t.reason = Cities.byID[m.toCityId].name+': Attempted scout on city by '+fromname; }

						if (( m.marchType==4) && Options.PortOptions.OnTime && parseIntNan(m.arrivalTime)>now){
							if (m.departureTime > Options.PortOptions.lastinc){
								t.inc++;
								setTimeout(function(){Options.PortOptions.lastinc = m.departureTime;saveOptions()},500);//potential fix for ghosted incoming attacks of the exact same second.
								if(t.inc > Options.PortOptions.incnumber) {
									GoPort = true;
									t.reason = Cities.byID[m.toCityId].name+': Too many attacks in a short space of time';
								};
							}
						}
						if (( m.marchType==4) && Options.PortOptions.OnType && parseIntNan(m.arrivalTime)>now){
							if (m["unts"]) {
								var i = parseIntNan(Options.PortOptions.inctype.split("unt")[1]);
								if (m["unts"]["u"+i] && m["unts"]["u"+i] >= Options.PortOptions.incamount) {
									GoPort = true;
									t.reason = Cities.byID[m.toCityId].name+': '+fromname+' Attempted to attack with '+m["unts"]["u"+i]+' '+uW.unitnamedesctranslated['unt'+i][0];
								}
								var i = parseIntNan(Options.PortOptions.inctype2.split("unt")[1]);
								if (m["unts"]["u"+i] && m["unts"]["u"+i] >= Options.PortOptions.incamount) {
									GoPort = true;
									t.reason = Cities.byID[m.toCityId].name+': '+fromname+' Attempted to attack with '+m["unts"]["u"+i]+' '+uW.unitnamedesctranslated['unt'+i][0];
								}
							}
						}
						if (( m.marchType==4) && Options.PortOptions.AllAttacks && parseIntNan(m.arrivalTime)>now){
							GoPort = true;
							t.reason = Cities.byID[m.toCityId].name+': Attempted attack on city by '+fromname;
						}

						if (GoPort) {
							t.triggered = true;
							t.porttype=0;
							if (Options.PortOptions.PortCities[Cities.byID[m.toCityId].idx+1]==true) {
								if (Options.PortOptions.UseOrder && parseIntNan(Seed.items.i912)!=0) { t.porttype = 912; }
								else {
									if (Options.PortOptions.UseRefuge && parseIntNan(Seed.items.i911)!=0) { t.porttype = 911; }
								}
							}
							if ((Seed.player.warStatus != 3) && (Options.PortOptions.DoveCities[Cities.byID[m.toCityId].idx+1]==true) && (t.doveavailable)) {
								actionLog(Cities.byID[m.toCityId].name+": Attempting to Auto Dove... ",'AUTOPORT');
								t.UseDove('901',m.toCityId);
							}
							else {
								t.ChoosePort(m.toCityId);
							}
							break;
						}
					}
				}
			}
		}
	},
	hide: function() {},

	show: function() {},

	ResetTimer: function () {
		var t = Tabs.PortalTime;
		clearInterval(t.resettimer)
		t.resettimer = setInterval(function() {
			t.inc=0;
		}, Options.PortOptions.inctime*60*1000);//reset to 0 every xxx mins
	},

	togglePortState: function(obj) {
		var t = Tabs.PortalTime;
		obj = document.getElementById('btAutoPortState');
		if (Options.PortOptions.Running == true) {
			Options.PortOptions.Running = false;
			obj.value = "AutoPort = OFF";
		} else {
			Options.PortOptions.Running = true;
			obj.value = "AutoPort = ON";
			t.doveavailable = true;
		}
		saveOptions();
		SetToggleButtonState('Port',Options.PortOptions.Running,'Port');
	},

	doRefuge: function(cid) {
		var t = Tabs.PortalTime;
		if(!Options.PortOptions.Running) return;
		actionLog(Cities.byID[cid].name+": Attempting to use Portal of Refuge... ",'AUTOPORT');
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
		params.pf = 0;
		params.iid = 911;
		params.cid = cid;
		if (parseIntNan(Options.PortOptions.PortProvince) == 0) { params.pid = Math.floor((Math.random()*24)+1); }//random province
		else { params.pid = parseIntNan(Options.PortOptions.PortProvince); }

		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/relocate.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function(rslt) {
				if (rslt.ok) {
					if (Options.PortOptions.SendMail) { t.SendPortMessage(t.reason); }
					ReloadKOC();
				}
				else {
					if (rslt.error_code == 311) {  // troops outside, wait for a minute!
						actionLog(Cities.byID[cid].name+": Troops outside when attempting to port! Waiting...",'AUTOPORT');
						setTimeout(t.ReleaseTrigger,1000*60);
						return;
					}
					t.triggered = false;
				};
			},
			onFailure: function(rslt) {	t.triggered = false; }
		});
	},

	doOrder: function(cid) {
		var t = Tabs.PortalTime;
		if(!Options.PortOptions.Running) return;
		actionLog(Cities.byID[cid].name+": Attempting to use Portal of Order... ",'AUTOPORT');
		if (parseIntNan(Options.PortOptions.PortProvince) == 0) { var province = Math.floor((Math.random()*24)+1); }//random province
		else { var province = parseIntNan(Options.PortOptions.PortProvince); }
		// provinces are 30x30 blocks, we're going to choose 4x4 to search, so need to choose random number between 0 and 26 inclusive for both x and y.
		var blockstartX = (Math.floor(Math.random() * 27)*5)+Provinces['p'+province].x;
		var blockstartY = (Math.floor(Math.random() * 27)*5)+Provinces['p'+province].y;
		t.Blocks = t.MapAjax.generateBlockList(blockstartX,blockstartY,9); // radius 9 gives 19 blocks distance
		var blockString = t.Blocks.join("%2C");
		t.MapAjax.LookupMap (blockString, function(rslt) {
			if (rslt.BotCode && rslt.BotCode==999) { // map captcha
				actionLog(Cities.byID[cid].name+": Map captcha detected!",'AUTOPORT');
				t.doRefuge(cid);
				return;
			}
			map = rslt.data;
			t.plain = {};
			t.checklist = [];
			for (var k in map){
				var u = map[k].tileUserId || 0;
				if (parseIntNan(map[k].tileType)==50 && u==0) { // unowned plain
					if (!Options.PortOptions.MistPort) {
						t.GoOrder(cid,map[k].xCoord,map[k].yCoord,false);
						break;
					}
					else { t.plain = {'x':map[k].xCoord,'y':map[k].yCoord};	}
				}
				if (Options.PortOptions.MistPort) {
					if (parseIntNan(map[k].tileType)==53) { // mist
						t.checklist.push({'x':map[k].xCoord,'y':map[k].yCoord});
					}
				}
			}
			if (Options.PortOptions.MistPort) {
				if (t.checklist.length>0) {
					var next = t.checklist.splice(0,1)[0];
					t.GoOrder(cid,next.x,next.y,true);
				}
				else {
					if (t.plain != {}) {
						t.GoOrder(cid,t.plain.x,t.plain.y,false);
					}
					else {
						t.triggered = false; // allow another go
					}
				}
			}
		});
	},

	GoOrder : function (cid,x,y,loop) {
		var t = Tabs.PortalTime;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
		params.pf = 0;
		params.iid = 912;
		params.cid = cid;
		params.xcoord = x
		params.ycoord = y
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/relocate.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function(rslt) {
				if (rslt.ok) {
					if (Options.PortOptions.SendMail) { t.SendPortMessage(t.reason); }
					ReloadKOC();
				}
				else {
					if (rslt.error_code == 311) {  // troops still outside, wait for a minute!
						actionLog(Cities.byID[cid].name+": Troops outside when attempting to port! Waiting...",'AUTOPORT');
						setTimeout(t.ReleaseTrigger,1000*60);
						return;
					}
					if (!loop) { t.triggered = false; }
					else {
						if (t.checklist.length>0) {
							var next = t.checklist.splice(0,1)[0];
							t.GoOrder(cid,next.x,next.y,true);
						}
						else {
							if (t.plain != {}) {
								t.GoOrder(cid,t.plain.x,t.plain.y,false);
							}
							else {
								t.triggered = false; // allow another go
							}
						}
					}
				};
			},
			onFailure: function(rslt) {	t.triggered = false; }
		});
	},

	ReleaseTrigger : function() {
		var t = Tabs.PortalTime;
		t.triggered = false;
	},

	ChoosePort : function(cid) {
		var t = Tabs.PortalTime;
		if (t.porttype==911) { t.doRefuge(cid); return; }
		if (t.porttype==912) { t.doOrder(cid); return; }
		setTimeout(t.ReleaseTrigger,1000*60); // not really sure what's supposed to happen here, but reset trigger anyway after a minute has elapsed
	},

	UseDove : function (iid,cid) {
		var t = Tabs.PortalTime;
		if(!Options.PortOptions.Running) return;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/doveOut.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					actionLog(Cities.byID[cid].name+": Auto Dove Successful!",'AUTOPORT');
					var boostTime = 43200;
					Seed.player.truceExpireUnixTime = unsafeWindow.unixtime() + boostTime;
					Seed.player.warStatus = 3;
					unsafeWindow.cm.InventoryView.removeItemFromInventory(iid);
					unsafeWindow.update_boosts()
				} else {
					actionLog(Cities.byID[cid].name+": Auto Dove Failed ("+unsafeWindow.printLocalError(rslt.error_code, rslt.msg, rslt.feedback)+")",'AUTOPORT');
				}
				t.doveavailable = false;
				t.ChoosePort(cid);
			},
			onFailure: function () {  // revert to port
				t.doveavailable = false;
				t.ChoosePort(cid);
			}
		},true); // noretry
	},

	SendPortMessage : function (message) {
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.emailTo = Seed.player['name'];
		params.subject = "Autoport triggered!";
		params.message = message;
		params.requestType = "COMPOSED_MAIL";
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) { DeleteLastMessage(); }
			},
			onFailure: function () {},
		},true);
	},
}