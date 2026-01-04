/**************************** Joust Tab ****************************************/
// @tabversion 20190705

Tabs.Joust = {
	tabOrder: 2120,
	tabLabel : 'Joust',
	tabColor : 'brown',
	ValidJoust: false,
	isBusy: false,
	myDiv : null,
	timer : null,
	NumJousts : 0,
	NumWins : 0,
	Options: {
		JoustRunning: false,
		JoustDelay: 7,
	},

	init : function (div){
		var t = Tabs.Joust;
		t.myDiv = div;
		
		if (!Options.JoustOptions) {
			Options.JoustOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.JoustOptions.hasOwnProperty(y)) {
					Options.JoustOptions[y] = t.Options[y];
				}
			}
		}
		t.CheckEvent(t.show);
	},
	
	CheckEvent : function (notify) {
		var t = Tabs.Joust;
		t.ValidJoust = uW.cm.JoustingModel.getTimeLeft() > 0;
		t.ValidJoust = true;
		var elem = ById("bttcJoust");
		if (t.ValidJoust) {
			elem.setAttribute("style","color:#f00");
		}
		if (Options.JoustOptions.JoustRunning) {
			t.start();
		}
		if (notify) { notify(); }
	},
	
	eventDoJoust: function () {
		var t = Tabs.Joust;
		if (!t.isBusy) return;

		var div = $("pbjoust_info");

		// get opponents
		
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.ctrl = 'jousting\\JoustingController';
		params.action = 'opponents';
		new MyAjaxRequest(uW.g_ajaxpath+"ajax/_dispatch53.php"+uW.g_ajaxsuffix,{
			method:"post",
			parameters:params,
			onSuccess:function(rslt) {
				if (rslt.ok){
					for (var o=0;o<rslt.opponents.length;o++) {
						setTimeout(t.eventDoFight,(o*1000*Math.ceil(Options.JoustOptions.JoustDelay,1000)),rslt.opponents[o].id, rslt.opponents[o].serverid);
					}
					var DelayAdjustment = Math.floor(Math.random() * 4);
					setTimeout(t.nextfight, 1000*Math.ceil(((Options.JoustOptions.JoustDelay*3)+DelayAdjustment),3));
				}
				else {
					div.innerHTML = '<span style="color:#800;">'+tx('Server Error')+' '+rslt.msg+'</span><br>'+div.innerHTML;
					ById('pbJoustCancel').firstChild.innerHTML = uW.g_js_strings.commonstr.close;
					t.isBusy = false;
				}
			},
			onFailure: function () {
				div.innerHTML = '<span style="color:#800;">'+tx('Server Error')+'!</span><br>'+div.innerHTML;
				ById('pbJoustCancel').firstChild.innerHTML = uW.g_js_strings.commonstr.close;
				t.isBusy = false;
			},
		},true);
	},
	
	eventDoFight : function (opponent,opponentServerId) {
		var t = Tabs.Joust;
		if (!t.isBusy) return;

		var div = $("pbjoust_info");
		
		var params = uW.Object.clone(uW.g_ajaxparams);

		params.ctrl = 'jousting\\JoustingController';
		params.action = 'fight';
		params.opponent = opponent;
		params.opponentServerId = opponentServerId;
		new MyAjaxRequest(uW.g_ajaxpath+"ajax/_dispatch53.php"+uW.g_ajaxsuffix,{
			method:"post",
			parameters:params,
			onSuccess:function(rslt2) {
				if (rslt2.ok){
					t.NumJousts++;
					reward = '';
					if (rslt2.reward) {
						uW.ksoItems[rslt2.reward.itemId].add(rslt2.reward.quantity);
						Seed.items["i"+rslt2.reward.itemId] = parseInt(Seed.items["i"+rslt2.reward.itemId])+rslt2.reward.quantity;
						reward = ' - '+tx('Awarded')+' '+rslt2.reward.quantity+' '+uW.itemlist['i'+rslt2.reward.itemId].name;
					}
					if (rslt2.report.s1.won) {
						t.NumWins++;
						div.innerHTML = '<span style="color:#080;">'+tx('Won against')+' '+rslt2.report.s0.nam+reward+'</span><br>'+div.innerHTML;
					}
					else {
						div.innerHTML = '<span style="color:#800;">'+tx('Lost against')+' '+rslt2.report.s0.nam+reward+'</span><br>'+div.innerHTML;
					}
				}
				else {
					div.innerHTML = '<span style="color:#800;">'+tx('Server Error')+' '+rslt2.msg+'</span><br>'+div.innerHTML;
				}
				ById('joustHeader').innerHTML = tx('Jousting Results')+'... ('+t.NumWins+'/'+t.NumJousts+')';
			},
			onFailure: function () {
				div.innerHTML = '<span style="color:#800;">'+tx('Server Error')+'!</span><br>'+div.innerHTML;
				ById('pbJoustCancel').firstChild.innerHTML = uW.g_js_strings.commonstr.close;
				t.isBusy = false;
			},
		},true);
	},
	
	show : function (){
		var t = Tabs.Joust;
		
		if (!t.isBusy) {
			var m = '<DIV class=divHeader align=center>JOUST</div>';
			m += '<div style="min-height:400px;">';
			
			if (t.ValidJoust) {
				m += '<br><DIV align=center>'+tx("Joust interval")+': <INPUT id=btjoustinterval type=text size=3 value=' + Options.JoustOptions.JoustDelay + ' /> '+tx("seconds");
				m += '</div>';
				m +='<br><br><center><input type=button value="'+uW.g_js_strings.modal_mmb.playnow+'" id=btJoustStart></center>';
			}
			else {
				m += '<br><div align=center>'+tx('No active event')+'</div>';
			}
			m += '</div>';
			m += '<div align=center><div style="position:absolute;bottom:0px;width:'+GlobalOptions.btWinSize.x+'px;"><br><hr>';
			m += '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">\
					<input type="hidden" name="cmd" value="_s-xclick">\
					<input type="hidden" name="hosted_button_id" value="8VEDPV3X9X82L">\
					<input type="image" src="https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online!">\
					<img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">\
					</form>';
			m += '<br>'+tx('This additional tab has been provided free of charge for the benefit of players. Please donate to help with future support and development of this and other features')+'.<br>'+tx('Thanks')+',&nbsp;Barbarossa.<br>&nbsp;</div></div>';
			
			t.myDiv.innerHTML = m;
			ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);

			if (t.ValidJoust) {
				ById('btJoustStart').addEventListener('click', function(){t.start();} , false);

				ChangeOption('JoustOptions','btjoustinterval', 'JoustDelay');
			}
		}
		else { // reset curtain position..
			t.setCurtain(true);
		}
	},
	
	setPopup: function (onoff) {
		var t = Tabs.Joust;
		if (onoff) {
			var div = document.createElement('div');
			div.id = 'ptJoustPop';
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
			t.myDiv.removeChild(ById('ptJoustPop'));
		}
	},

	setCurtain: function (onoff) {
		var t = Tabs.Joust;
		if (onoff) {
			var off = getAbsoluteOffsets(t.myDiv);
			var curtain = ById('ptJoustCurtain');
			if (!curtain) {
				curtain = document.createElement('div');
				curtain.id = 'ptJoustCurtain';
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
			t.myDiv.removeChild(ById('ptJoustCurtain'));
		}
	},

	e_Cancel: function () {
		var t = Tabs.Joust;
		if (t.isBusy) {
			t.isBusy = false;
			Options.JoustOptions.JoustRunning = false;
			var div = $("pbjoust_info");
			div.innerHTML += "<br><span>"+tx('Cancelled')+"!</span>";
			ById('pbJoustCancel').firstChild.innerHTML = uW.g_js_strings.commonstr.close;
			return;
		}
		t.setCurtain(false);
		t.setPopup(false);
		t.show();
	},

	start : function (){
		var t = Tabs.Joust;
	
		t.isBusy = true;
		t.NumJousts = 0;
		t.NumWins = 0;
		Options.JoustOptions.JoustRunning = true;
		t.setCurtain(true);
		var popDiv = t.setPopup(true);
		popDiv.innerHTML = '<TABLE class=xtab width=100% height=100%><TR><TD align=center>\
		<DIV class=divHeader align=center id=joustHeader>'+tx('Jousting Results')+'...</div>\
		<DIV id=pbjoust_info style="padding:10px; height:225px; max-height:225px; overflow-y:auto"></div>\
		</td></tr><TR><TD align=center>' + strButton20(uW.g_js_strings.commonstr.cancel, 'id=pbJoustCancel') + '</td></tr></table>';
		ById('pbJoustCancel').addEventListener('click', t.e_Cancel, false);

		t.nextfight();
	},

	nextfight : function (){
		var t = Tabs.Joust;
		if(!t.isBusy)
			return;
		var div = $("pbjoust_info");
		t.eventDoJoust();
	},
}