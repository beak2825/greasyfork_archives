/*********************************** Resources TAB ***********************************/
// @tabversion 20180619

Tabs.Resources = {
	tabOrder : 1800,
	tabLabel : 'Resources',
	resource : {1:'Food', 2:'Wood', 3:'Stone', 4:'Ore'},
	users : [],
	myDiv : null,
	doList : [], // list of gifts to accept
	accepting : false,
	city : null,
	total : {gold:0, 1:0, 2:0, 3:0, 4:0},

	init : function (div){
		var t = Tabs.Resources;
			t.myDiv = div;
		div.innerHTML = '<style>div.indent25 {padding-left:25px}</style><div class=divHeader align=center>'+tx('COLLECT RESOURCES FROM COURTLY ACTIONS')+'</div><br><TABLE cellpadding=0 cellspacing=0 class=xtab width=100%><TR><TD align=center><INPUT id="pballlist" type=submit value="'+tx('Fetch Alliance List')+'" \>&nbsp;<INPUT id="pbfrndlist" type=submit value="'+tx('Fetch Friend List')+'" \></td></tr></table><HR>\
			<DIV id=resDiv style="width:100%; min-height:400px; height:100%">';
		document.getElementById('pballlist').addEventListener ('click', function() { t.e_clickfetchlist(1); }, false);
		document.getElementById('pbfrndlist').addEventListener ('click', function() { t.e_clickfetchlist(2); }, false);
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
	},

	show : function (){
	},
	hide : function (){
	},

	progress : function (msg, span, add){
		if(add)
			document.getElementById(span).innerHTML+=msg;
		else
			document.getElementById(span).innerHTML=msg;
	},

	e_clickfetchlist : function  (tt){     // (also cancel accepting)
		var t = Tabs.Resources;
		t.users = [];
		if (t.accepting){
			document.getElementById('pballlist').value = tx('Fetch Alliance List');
			document.getElementById('pbfrndlist').value = tx('Fetch Friend List');
			document.getElementById('resDiv').innerHTML+= '<BR><SPAN class=boldRed>'+tx('Cancelled')+'.</span>';
			t.accepting = false;
			return;
		}
		if (tt==1) {
			document.getElementById('resDiv').innerHTML = tx('Fetching alliance list')+' ... <span id=pbResUserListCount></span>';
		}
		else {
			document.getElementById('resDiv').innerHTML = tx('Fetching friend list')+' ... <span id=pbResUserListCount></span>';
		}

		t.fetchUserList (tt,gotUserList);

		function gotUserList(userList){
			if(userList.length < 1){
				listGifts();
				return;
			}
			document.getElementById('resDiv').innerHTML += '<BR>'+tx('Check if able to collect')+' ... <span id=pbResUserAvailCount></span>';
			t.checkDailyAction(userList, listGifts);
		}

		function listGifts (){
			t.city = Cities.cities[0];
			if (t.users.length<1){
				document.getElementById('resDiv').innerHTML = '<BR><BR><CENTER>'+tx('No players found')+'!</center>';
				return;
			}
			var m = '';
			m += '<TABLE class=xtab align=center width=100%><TR><TD width=50% align=right>'+tx('City to apply gifts to')+':</td><TD width=50% id=pbrescityselspan></td></tr>\
				<TR><TD align=right>'+tx('Select resource to collect')+':</td><TD>'+htmlSelector(t.resource, Options.getResType, 'id=pbResColType')+'</td></tr>';
			m += '<TR><TD align=right>'+tx('Select players you want to collect from and click')+':</td><TD width=250><INPUT type=submit id=pbResDo value="'+tx('Accept Resources')+'">&nbsp;\
				<SPAN id=pbResNone class=boldRed>&nbsp;</span></td></tr></table><HR><DIV class=divHeader><CENTER>'+tx('Player List')+'&nbsp;&nbsp;&nbsp;('+ t.users.length +' '+tx('found')+')</center></div><TABLE class=xtab align=center><TR valign=top>';
			m += '<TD width=10></td><TD><TABLE align=center cellpadding=2 cellspacing=0 class=xtab>\
				<TBODY id=pbResTbody style="height:250px; overflow:auto; display:block;">\
				<TR><TH class=xtabHD width=30>&nbsp;</th><TH align=left class=xtabHD width=200>'+tx('Name')+'</th><TH align=right class=xtabHD width=150>'+tx('Might')+'</th><TH align=center class=xtabHD width=50>'+tx('Select')+'</th></tr>';
			var r = 0;
			for (var i=0; i<t.users.length; i++){
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				m += '<TR class="'+rowClass+'"><td><img width=30 src="'+t.users[i].pic+'"></td><TD align=left>'+ t.users[i].name +'</td><TD align=right>'+ addCommas(t.users[i].might) +'</td><td align=center><INPUT type=checkbox id=pbrchk_'+ i +'></td></tr>';
			}
			m += '</tbody></table></td><TD width=10></td>';
			m += '<TD><INPUT id=pbResButAll type=submit value="'+tx('Select All')+'" style="width:100%; margin-bottom:5px"><BR><INPUT id=pbResButNone type=submit value="'+tx('Select None')+'"></td>';
			m += '</tr></table>';
			
			document.getElementById('resDiv').innerHTML = m;
			new CdispCityPicker ('pbrescitysel', document.getElementById('pbrescityselspan'), true, t.e_CityButton, t.city.idx);
			document.getElementById('pbResDo').addEventListener ('click', t.getErDone, false);
			document.getElementById('pbResButAll').addEventListener ('click', t.e_butAll, false);
			document.getElementById('pbResButNone').addEventListener ('click', t.e_butNone, false);
			ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
		}
	},

	e_CityButton : function (city, x, y){
		var t = Tabs.Resources;
		t.city = city;
	},

	e_butAll : function (){
		var t = Tabs.Resources;
		for (var i=0; i<t.users.length; i++)
			document.getElementById('pbrchk_'+i).checked = true;
	},

	e_butNone : function (){
		var t = Tabs.Resources;
		for (var i=0; i<t.users.length; i++)
			document.getElementById('pbrchk_'+i).checked = false;
	},

	getErDone : function (){
		var t = Tabs.Resources;
		t.doList = [];
		document.getElementById('pbResNone').innerHTML = '&nbsp;';
		Options.getResType = document.getElementById('pbResColType').value;
		t.total = {gold:0, 1:0, 2:0, 3:0, 4:0};
		for (var i=0; i<t.users.length; i++){
			if (document.getElementById('pbrchk_'+i).checked)
				t.doList.push (t.users[i]);
		}
		if (t.doList.length==0){
			document.getElementById('pbResNone').innerHTML = tx('None Selected')+'!';
			return;
			}
		t.accepting = true;
		document.getElementById('pballlist').value = tx('Stop Accepting');
		document.getElementById('pbfrndlist').value = tx('Stop Accepting');
		document.getElementById('resDiv').innerHTML = '<DIV id=rsltDiv style="height:400px; max-height:400px; overflow-y:auto"><B>'+tx('Accepting from')+' '+ t.doList.length +' '+tx('users')+':</b><BR></div>';
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
		t.acceptNext ();
	},

	allDone : function (msg){
		var t = Tabs.Resources;
		msg += '<BR><BR> '+tx('Total resources gained')+' : <BR>\
			'+tx('Gold')+': '+addCommas(t.total.gold)+'<BR>';
		for(var i=1; i<=4; i++){
			msg += tx(t.resource[i])+': '+addCommas(t.total[i])+'<BR>';
		}
		document.getElementById('rsltDiv').innerHTML += '<BR><BR>' + msg;
		document.getElementById('pballlist').value = tx('Fetch Alliance List');
		document.getElementById('pbfrndlist').value = tx('Fetch Friend List');
		t.accepting = false;
	},

	acceptNext : function (){
		var t = Tabs.Resources;
		var gift = t.doList.shift();
		if (gift == null){
			t.allDone (tx('Done accepting resources')+'.');
			return;
		}
		var acpDiv = document.getElementById('rsltDiv');
		var curDiv = document.createElement ('div');
		acpDiv.appendChild (curDiv);
		curDiv.innerHTML = '<B>'+tx('From')+' '+ gift.name +': ';
		var statSpan = document.createElement ('span');
		curDiv.appendChild (statSpan);
		statSpan.innerHTML = tx('Accepting')+' ... ';
		t.getCourtAction (gift, gotGiftData);

		function gotGiftData (rslt){
			if (!t.accepting)
				return;
			if (rslt.ok){
				var msg = rslt.gold +' '+tx('gold and')+' '+rslt.resource +' '+ tx(t.resource[rslt.resourcetype])+'&nbsp;&nbsp;'+tx('OK')+'.';
				actionLog ('Accepted from '+gift.name+': '+ rslt.gold +' gold and '+ rslt.resource +' '+ t.resource[rslt.resourcetype],'RESOURCES');
				statSpan.innerHTML += msg;
				t.total.gold += rslt.gold;
				t.total[rslt.resourcetype] += rslt.resource;
				t.acceptNext ();
				return;
			}

			if (rslt.msg)
				msg = '<B>'+ rslt.msg + '</b>';
			else
				msg = '<SPAN class=boldRed>ERROR: '+ rslt.ajaxErr +'</span>';

			curDiv.removeChild (statSpan);
			curDiv = document.createElement ('div');
			curDiv.className = 'indent25';
			acpDiv.appendChild (curDiv);
			curDiv.innerHTML = msg;
			t.acceptNext ();
		}
	},

	getMembersInfo : function (pageNo, notify) {
		var t = Tabs.Resources;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);

		params.pageNo = pageNo;
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/allianceGetMembersInfo.php" + unsafeWindow.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				notify (rslt);
			},
			onFailure: function (rslt) {
				notify ({errMsg:'Ajax Comm Error'});
			},
		});
	},

	getFriendsInfo : function (notify) {
		var t = Tabs.Resources;
		var params = uW.Object.clone(uW.g_ajaxparams);
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getAppFriends.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
			notify (rslt);
			},
			onFailure: function (rslt) {
			notify ({errMsg:'Ajax Comm Error'});
			},
		});
	},

	getDailyAction : function (uid, notify){
		var t = Tabs.Resources;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);

		params.pid = uid;
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/viewCourt.php" + unsafeWindow.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			notify (rslt);
		},
		onFailure: function (rslt) {
			notify ({errMsg:'Ajax Comm Error'});
		},
		});
	},

	getCourtAction : function (gift, notify){
		var t = Tabs.Resources;
		var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);

		params.atype = Options.getResType;
		params.toid = gift.userId;
		params.givercityid = t.city.id;
		new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/courtDoAction.php" + unsafeWindow.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			notify (rslt);
		},
		onFailure: function (rslt) {
			notify ({errMsg:'Ajax Comm Error'});
		},
		});
	},

	checkDailyAction : function (userList, notify){
		var t = Tabs.Resources;
		var count = 0;
		t.getDailyAction(userList[count].userId, parseViewCourt);

		function parseViewCourt (rslt){
			if (!rslt.ok || rslt.errMsg)
				notify ({errMsg:'Ajax Comm Error'});
			if(rslt.dailyActionFlag == 0)
				t.users.push(userList[count]);
			t.progress(count, 'pbResUserAvailCount');
			count++;
			if(count < userList.length){
				t.getDailyAction(userList[count].userId, parseViewCourt);
			} else {
				notify();
			}
		}
	},

	fetchUserList : function (tt,notify){
		var t = Tabs.Resources;
		var userList = [];
		if (tt==1) {
			t.getMembersInfo(1, parseAlliancePage);
		}
		else {
			t.getFriendsInfo(parseFriendPage);
		}

		function parseAlliancePage (rslt){
			if (!rslt.ok || rslt.errMsg)
				notify ({errMsg:'Ajax Comm Error'});
			var users = rslt.memberInfo;
			for(var k in users){
				userList.push({userId:users[k].userId, name:users[k].name, might:users[k].prestige, pic:users[k].avatarurl});
			}
			t.progress(userList.length, 'pbResUserListCount');
			if(rslt.currentPage < rslt.noOfPages){
				t.getMembersInfo((rslt.currentPage+1), parseAlliancePage);
			}
			else {
				notify(userList);
			}
		}

		function parseFriendPage (rslt){
			if (!rslt.ok || rslt.errMsg)
				notify ({errMsg:'Ajax Comm Error'});
			var users = rslt.data;
			for(var k in users){
				if (users[k].userId!=undefined)
				userList.push({userId:users[k].userId, name:users[k].displayName, might:users[k].might, pic:users[k].realPhoto});
			}
			t.progress(userList.length, 'pbResUserListCount');
			notify(userList);
		}
	},

}