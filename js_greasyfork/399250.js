/**nomad tab**/
Tabs.Nomad = {
	tabOrder: 2120,
	tabLabel : 'Nomads',
	tabColor : 'brown',
	myDiv : null,
	timer : null,
	LoopCounter : 0,
	ValidNomad: false,
	tradeItem: 0,
	tradeItemQuantity: 0,
	prizes: [],
	eventId :0,
	isBusy: false,
	NomadMessage: tx('Fetching details from server')+'...',
	Options: {
		x: 0,
		y: 0,
		TradeAmount: 0,
		TradeInterval: 1,
		TradeInProgress: false,
		KeepAmount: 0,
		NomadRunning: false,
		ItemsWon: {},
		NumTrades : 0,
		LastNomadReport : 0,
	},

	init : function (div) {
		var t = Tabs.Nomad;
		t.myDiv = div;

		if (!Options.NomadOptions) {
			Options.NomadOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.NomadOptions.hasOwnProperty(y)) {
					Options.NomadOptions[y] = t.Options[y];
				}
			}
		}

		t.eventFetchNomadDetails(t.checkAutoTrade);
	},

	checkAutoTrade: function () {
		var t = Tabs.Nomad;
		if (Options.NomadOptions.TradeInProgress) {
			t.start();
		};
	},

	eventFetchNomadDetails: function (notify) {
		var t = Tabs.Nomad;
		NomadMessage = tx('Fetching Nomad details from server')+'...';
		t.ValidNomad = false;
		t.tradeItem = 0;
		t.tradeItemQuantity = 0;
		t.eventId = 0;
		t.prizes = [];
		t.show();

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.xCoord = Options.NomadOptions.x;
		params.yCoord = Options.NomadOptions.y;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getNomadCamp.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (!rslt.ok){
					if (GlobalOptions.btPowerBar) {
						var elem = ById("bttcNomad");
						elem.setAttribute("style","display:none");
					}
					if (rslt.msg) { t.NomadMessage = rslt.msg; }
					else { t.NomadMessage = tx('No Nomad Camp Details Available'); }
					Options.NomadOptions.TradeInProgress = false;
					Options.NomadOptions.NomadRunning = false;
					t.GenerateReport();
					saveOptions();
					t.show();
					return;
				}
				var elem = ById("bttcNomad");
				elem.setAttribute("style","color:#f00");
				t.ValidNomad = (rslt.tradeItem && rslt.tradeItem!=0);
				if (!t.ValidNomad) { t.NomadMessage = tx('Invalid Trade Item'); }

				t.tradeItem = rslt.tradeItem;
				t.tradeItemQuantity = rslt.tradeItemQuantity;
				t.eventId = rslt.eventId;
				t.prizes = rslt.prizes["2"];
				t.show();
				if (notify) { notify();}
			},
			onFailure: function () {
				t.NomadMessage = 'AJAX Error';
				Options.NomadOptions.TradeInProgress = false;
				Options.NomadOptions.NomadRunning = false;
				t.GenerateReport();
				saveOptions();
				t.show();
			},
		},true);
	},

	eventDoTrade: function () {
		var t = Tabs.Nomad;

		var div = $("pbnomad_info");

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.eventId = t.eventId;
		params.lootType = 2;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/nomadTrade.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt && rslt.ok){
					CM.NomadModel.removeItems(t.tradeItem, t.tradeItemQuantity);
					uW.update_inventory(uWCloneInto(rslt.bonusItems));
					for (var lootId in rslt.bonusItems) {
						if (lootId) {
							if (div) { div.innerHTML = '<span>'+tx('You received')+' '+rslt.bonusItems[lootId]+' '+uW.itemlist["i"+lootId].name+'</span><br>'+div.innerHTML; }
							else {
								actionLog('Auto-Trade: '+rslt.bonusItems[lootId]+' '+uW.itemlist["i"+lootId].name,'NOMAD');
								Options.NomadOptions.NumTrades++;
								if(Options.NomadOptions.ItemsWon[lootId]) { Options.NomadOptions.ItemsWon[lootId] += parseInt(rslt.bonusItems[lootId]); }
								else { Options.NomadOptions.ItemsWon[lootId] = parseInt(rslt.bonusItems[lootId]); }
								saveOptions();
							}
						}
					}
					Options.NomadOptions.TradeAmount = Options.NomadOptions.TradeAmount-t.tradeItemQuantity;
					setTimeout(t.nextqueue, 500);
				}
				else {
					if (div) {
						div.innerHTML = '<span style="color:#800;">'+rslt.msg+'</span><br>'+div.innerHTML;
						ById('pbNomadCancel').firstChild.innerHTML = uW.g_js_strings.commonstr.close;
					}
					else { actionLog('Auto-Trade Error: '+rslt.msg,'NOMAD'); }
					Options.NomadOptions.TradeInProgress = false;
					saveOptions();
					t.isBusy = false;
				}
			},
			onFailure: function () {
				if (div) {
					div.innerHTML = '<span style="color:#800;">'+tx('Server Error')+'!</span><br>'+div.innerHTML;
					ById('pbNomadCancel').firstChild.innerHTML = uW.g_js_strings.commonstr.close;
				}
				else { actionLog('AJAX Error!','NOMAD'); }
				Options.NomadOptions.TradeInProgress = false;
				saveOptions();
				t.isBusy = false;
			},
		},true);
	},

	show : function (){
		var t = Tabs.Nomad;

		if (!t.isBusy || Options.NomadOptions.NomadRunning) {
			var m = '<DIV class=divHeader align=center>'+tx('NOMAD CAMP AUTO TRADE')+'</div><br>';
			m += '<div style="min-height:350px;"><TABLE align=center width=98% cellpadding=0 cellspacing=0 class=xtab>';
			m += '<TR class=divHide><td colspan=4>X:&nbsp<INPUT id=btNomadX size=3 maxlength=3 type=text value="'+Options.NomadOptions.x+'">&nbsp&nbsp&nbspY:&nbsp<INPUT id=btNomadY size=3 maxlength=3 type=text value="'+Options.NomadOptions.y+'">&nbsp;&nbsp;&nbsp;<INPUT id=btNomadRefresh type=submit value="'+tx('Refresh Nomad Details')+'">&nbsp;('+tx('Co-ordinates currently not required, but added to the tab in case they are in the future')+')</td></tr>';
			m += '<TR><td colspan=4>&nbsp;</td></tr>';
			if (t.ValidNomad) {
				m += '<TR><td align=right>'+tx('Trade Item')+':&nbsp;</td><td colspan=3><b>'+uW.itemlist["i"+t.tradeItem].name+'</b></td></tr>';
				m += '<TR><td align=right>'+tx('Quantity per Trade')+':&nbsp;</td><td colspan=3><b>'+t.tradeItemQuantity+'</b></td></tr>';
				m += '<TR><td align=right>'+tx('You Own')+':&nbsp;</td><td><b>'+(Seed.items["i"+t.tradeItem]?Seed.items["i"+t.tradeItem]:0)+'</b></td><td align=right width=120px>'+tx('Amount to Keep')+':</td><td><INPUT size=4 id=btNomadItemKeep type=text value="'+Options.NomadOptions.KeepAmount+'">&nbsp;&nbsp;<a title="'+tx('automatically trade items')+'" id=pbautonomadstate class="inlineButton btButton '+(Options.NomadOptions.NomadRunning?'red14':'blue14')+'"><span id=pbautonomadlabel style="width:30px;display:inline-block;text-align:center;">'+(Options.NomadOptions.NomadRunning?tx('Off'):tx('Auto'))+'</span></a></td></tr>';
				m += '<TR><td colspan=2 align=right>&nbsp;</td><td align=right>'+tx('Amount to Trade')+':</td><td><INPUT size=4 id=btNomadItemAmount type=text value="'+Options.NomadOptions.TradeAmount+'">&nbsp;<INPUT id=btNomadTrade type=submit value="'+tx('Manual Trade')+'"></td></tr>';

				m += '<TR><td colspan=4>&nbsp;</td></tr>';
				m += '<TR><td>&nbsp;</td><td colspan=3><b>'+tx('Possible Prizes from Trade')+':-</b></td></tr>';

				for (var p in t.prizes) {
					if (t.prizes[p].itemId) {
						m += '<TR><td>&nbsp;</td><td colspan=3>'+t.prizes[p].quantity + ' ' +uW.itemlist["i"+t.prizes[p].itemId].name+'</td></tr>';
					}
				}
			}
			else {
				m += '<TR><td align=center colspan=4>'+t.NomadMessage+'</td></tr>';
			}
			m += '</table></div><br>';

			t.myDiv.innerHTML = m;
			ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);

			ById('btNomadRefresh').addEventListener('click', function() {t.eventFetchNomadDetails();},false);

			ById('btNomadX').addEventListener('keyup', function(){ if (isNaN(ById('btNomadX').value)) ById('btNomadX').value='';}, false);
			ById('btNomadY').addEventListener('keyup', function(){ if (isNaN(ById('btNomadY').value)) ById('btNomadY').value='';}, false);

			ById('btNomadX').addEventListener('change', function(){Options.NomadOptions.x = ById('btNomadX').value;} , false);
			ById('btNomadY').addEventListener('change', function(){Options.NomadOptions.y = ById('btNomadY').value;} , false);

			if (t.ValidNomad) {
				ById('btNomadTrade').addEventListener('click', function() {t.start();},false);

				ChangeIntegerOption('NomadOptions','btNomadItemAmount','TradeAmount');
				ChangeIntegerOption('NomadOptions','btNomadItemKeep','KeepAmount');

				ById('pbautonomadstate').addEventListener('click', function(){
					t.toggleAutoNomadState(this);
				}, false);

				if (Options.NomadOptions.NomadRunning) {
					ById('btNomadItemAmount').disabled = true;
					ById('btNomadTrade').disabled = true;
				}
			}
		}
		else { // reset curtain position..
			t.setCurtain(true);
		}
	},

	toggleAutoNomadState: function(obj){
		var t = Tabs.Nomad;
		obj = ById('pbautonomadlabel');
		if (Options.NomadOptions.NomadRunning == true) {
			Options.NomadOptions.NomadRunning = false;
			t.GenerateReport();
			obj.innerHTML = tx("Auto");
			jQuery('#pbautonomadstate').removeClass("red14");
			jQuery('#pbautonomadstate').addClass("blue14");
			ById('btNomadItemAmount').disabled = false;
			ById('btNomadTrade').disabled = false;
		}
		else {
			Options.NomadOptions.NomadRunning = true;
			Options.NomadOptions.ItemsWon = {};
			Options.NomadOptions.NumTrades = 0;
			obj.innerHTML = tx("Off");
			jQuery('#pbautonomadstate').addClass("red14");
			jQuery('#pbautonomadstate').removeClass("blue14");
			ById('btNomadItemAmount').disabled = true;
			ById('btNomadTrade').disabled = true;
			Options.NomadOptions.LastNomadChecked = 0;
		}
		saveOptions();
	},

	setPopup: function (onoff) {
		var t = Tabs.Nomad;
		if (onoff) {
			var div = document.createElement('div');
			div.id = 'ptNomadPop';
			div.style.backgroundColor = '#fff';
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
			t.myDiv.removeChild(ById('ptNomadPop'));
		}
	},

	setCurtain: function (onoff) {
		var t = Tabs.Nomad;
		if (onoff) {
			var off = getAbsoluteOffsets(t.myDiv);
			var curtain = ById('ptNomadCurtain');
			if (!curtain) {
				curtain = document.createElement('div');
				curtain.id = 'ptNomadCurtain';
				curtain.style.zindex = mainPop.div.zIndex + 1;
				curtain.style.backgroundColor = "#000000";
				curtain.style.opacity = '0.5';
				curtain.style.display = 'block';
				curtain.style.position = 'absolute';
				t.myDiv.appendChild(curtain);
			}
			curtain.style.width = (t.myDiv.clientWidth+4) + 'px';
			curtain.style.height = (t.myDiv.clientHeight+4) + 'px';
			curtain.style.top = off.top + 'px';
			curtain.style.left = off.left + 'px';
		} else {
			t.myDiv.removeChild(ById('ptNomadCurtain'));
		}
	},

	e_Cancel: function () {
		var t = Tabs.Nomad;
		if (t.isBusy) {
			t.isBusy = false;
			var div = $("pbnomad_info");
			div.innerHTML += "<br><span>"+tx('Cancelled')+"!</span>";
			ById('pbNomadCancel').firstChild.innerHTML = uW.g_js_strings.commonstr.close;
			return;
		}
		t.setCurtain(false);
		t.setPopup(false);
		t.show();
	},

	start : function (){
		var t = Tabs.Nomad;

		Options.NomadOptions.TradeAmount = parseIntNan(Options.NomadOptions.TradeAmount);
		if(Options.NomadOptions.TradeAmount >= t.tradeItemQuantity) {
			Options.NomadOptions.TradeInProgress = true;
			saveOptions();

			t.isBusy = true;
			t.setCurtain(true);
			var popDiv = t.setPopup(true);
			popDiv.innerHTML = '<TABLE class=xtab width=100% height=100%><TR><TD align=center>\
			<DIV class=divHeader align=center>'+tx('Trading with the Nomads')+'...</div>\
			<DIV id=pbnomad_info style="padding:10px; height:225px; max-height:225px; overflow-y:auto"></div>\
			</td></tr><TR><TD align=center>' + strButton20(uW.g_js_strings.commonstr.cancel, 'id=pbNomadCancel') + '</td></tr></table>';
			ById('pbNomadCancel').addEventListener('click', t.e_Cancel, false);
			t.nextqueue();
		}
		else {
			Options.NomadOptions.TradeInProgress = false;
			saveOptions();
		}
	},

	nextqueue : function (){
		var t = Tabs.Nomad;
		if(!t.isBusy)
			return;
		var div = $("pbnomad_info");
		if(Options.NomadOptions.TradeAmount < t.tradeItemQuantity){
			if (div) {
				div.innerHTML = "<span>"+tx('Completed')+"!</span><br>"+div.innerHTML;
				ById('pbNomadCancel').firstChild.innerHTML = 'Close';
			}

			Options.NomadOptions.TradeInProgress = false;
			saveOptions();

			t.isBusy = false;
			return;
		}
		t.eventDoTrade();
	},

	EverySecond : function () {
		var t = Tabs.Nomad;
		var now = unixTime();
		t.LoopCounter = t.LoopCounter + 1;

		if (t.LoopCounter%2==0) { // Check Nomad Item Limit and refresh display every 2 seconds
			if (Options.NomadOptions.NomadRunning) {
				if ((!Options.NomadOptions.TradeInProgress) && (Options.NomadOptions.LastNomadChecked+60) < now) { // check once a minute, but not if already trading!
					t.checkNomadItemLimit();
				}
				if (tabManager.currentTab.name == 'Nomad' && Options.btWinIsOpen){
					t.show();
				}
			}
		}
	},

	checkNomadItemLimit : function () {
		var t = Tabs.Nomad;
		if (!Options.NomadOptions.NomadRunning) return;
		if (!t.ValidNomad) return;
		var item = uW.ksoItems[t.tradeItem];
		if (item) {
			var useamount = parseIntNan(item.count - parseIntNan(Options.NomadOptions.KeepAmount));
			if (useamount>=parseIntNan(t.tradeItemQuantity)) { // automatically set trade amount to excess amount...
				Options.NomadOptions.TradeAmount = useamount;
				Options.NomadOptions.TradeInProgress = true;
				saveOptions();
				t.isBusy = true;
				t.nextqueue();
			}
		}
		var now = unixTime();
		Options.NomadOptions.LastNomadChecked = now;
		saveOptions();
	},

	GenerateReport : function () {
		var t = Tabs.Nomad;
		var now = unixTime();

		var total = Options.NomadOptions.NumTrades;
		if (total > 0) {
			var message = tx('Nomad Camp Trade Report')+' %0A';

			message +='%0A';
			message += tx('Items received from trading since previous report')+': %0A';
			for (var z in Options.NomadOptions.ItemsWon) {
				message += uW.ksoItems[z].name+' x '+Options.NomadOptions.ItemsWon[z]+'%0A';
			}

			message +='%0A';
			message += tx('Total Number of Trades')+': '+total+'%0A';

			var params = uW.Object.clone(uW.g_ajaxparams);
			params.emailTo = Seed.player['name'];
			params.subject = tx("Nomad Camp Trade Report");

			params.message = message;
			params.requestType = "COMPOSED_MAIL";

			new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
				method: "post",
				parameters: params,
				onSuccess: function (rslt) {
					if (rslt.ok) {
						DeleteLastMessage();
						Options.NomadOptions.ItemsWon = {};
						Options.NomadOptions.NumTrades = 0;
						saveOptions();
					}
				},
			});

			Options.NomadOptions.LastNomadReport = now;
			saveOptions();
		}
	},
}
