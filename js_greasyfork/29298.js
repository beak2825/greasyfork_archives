// ==UserScript==
// @name        BTC-E (WEX) Chat Extension
// @name:ru     BTC-E (WEX) Chat Extension (Расширение для чата BTC-E (WEX))
// @name:en     BTC-E Chat Extension
// @namespace   BTCeChatExtension
// @description:en BTC-E (WEX) Chat Extension. Selects nicknames of people with old registrations (id <300000). You can add people to "friend list", to sellect them with "green"
// @description:ru Расширение для чата btc-e. Выделяет ники старожилов с id < 300000. Возможно выделение людей из списка "друзей"
// @include     https://btc-e.nz/*
// @include     https://wex.nz/*
// @version     0.2.3
// @grant       none
// @description BTC-E (WEX) Chat Extension. Selects nicknames of people with old registrations (id <300000). You can add people to "friend list", to sellect them with "green"
// @downloadURL https://update.greasyfork.org/scripts/29298/BTC-E%20%28WEX%29%20Chat%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/29298/BTC-E%20%28WEX%29%20Chat%20Extension.meta.js
// ==/UserScript==

var actualCode = 'var STest=(' + function () {
	var friendList = null;
	var playSound = null;
	function nChatPutMsgNew2(a) {
		a = JSON.parse(a);
		var b = new RegExp("\\b" + auth_login + "\\b", "ig");
		var mO = '';
		var mN = a.msg;
		var uC = a.usr_clr;
		console.log(a.uid + ' ' + a.login + ':' + a.msg);
		if (nChatCheckForIgnore(a.uid))
			return !0; //не показываем сообщения людей из игнор-листа //don't show ignored people messages
		if (nChatCheckForIgnore2(mN))
			return !0; //не показывать ответы людям из списка игнора //don't show replies to ignored people
		if (uC == '#8da0b9') {
			uC = SetUserColor(a.uid, a.login) || '#8da0b9';
		}
		u_style = a.login == auth_login ? "color: #193477 !important;" : "color: " + uC;
		m_style = mN.match(b) ? "font-weight:bold;" + PlaySound() : "";
		b = "<p id='msg" + a.msg_id + "' class='chatmessage uid" + a.uid + "' style='" + m_style + "display:none'>" + ("<a title='" + a.date + "' style='" + u_style + " !important; font-weight: bold;' href='javascript:void(0)' onclick='nChatMenu(" + a.uid + ', "' + a.login + '", ' + a.msg_id + ", event)'>" + a.login + "</a>") + ": <span title='" + mO + "'>" + mN + "</span></p>";
		$("#nChat").append(b);
		old_msg_size = 0;
		512 < $("#nChat p").length && (old_msg_size = $("#nChat p").first().outerHeight(!0), $("#nChat p").first().remove());
		$("#msg" + a.msg_id).fadeIn(100);
		new_msg_size = $("#msg" + a.msg_id).outerHeight(!0);
		nChatScroll(new_msg_size, old_msg_size)

	}
	function SetUserColor(uid, login) {
		var uC = null;
		if (friendList[login]) {
			uC = '#47914E';
		}
		// выделяем ники людей с ID меньше 300000, если стоит обыкновенный цвет(не админ) //select people with id <= 300000 if not admin
		else
			if (uid <= 300000) { // синим //blue
				uC = '#2B68B9';
				if (uid <= 100000) { //фиолетовым //purple
					uC = '#815CC1';
				}
				if (uid <= 10000) { //терракотовым //terracotta
					uC = '#B96341';
				}

			}
		return uC;
	}
	function nChatCheckForIgnore2(a) {
		var n = a.indexOf(",");
		var rN = a.substring(0, n);
		if (Object.values(chat_ignored).indexOf(rN) > -1)
			return true;
		else
			return false;
	}
	function SetLocalData() {
		var oFriends = localStorage.getItem("FriendList");
		var oPlaySound = localStorage.getItem("PlaySound");

		if (!oFriends)
			oFriends = 'Selin,hazarun,kslavik,sysman,perfectfred,BitBarber,Panzer,Zer0man,MViktor1986,power12345,alpet,hextoex,tatty,Soffka';
		//ники перечисленных людей выделяются зелёным //nicknames of people in this group become "green"
		var oValues = oFriends.split(',');
		friendList = {};

		for (i in oValues) {
			if (oValues[i].length > 0)
				friendList[oValues[i]] = true;
		}
		if (!oPlaySound)
			oPlaySound = true;
		playSound = oPlaySound;
		localStorage.setItem("FriendList", oFriends);
		localStorage.setItem("PlaySound", oPlaySound);
	}
	function $O(id) {
		return document.getElementById(id);
	}
	function SetStyles(oE, alStyles) {
		for (var n in alStyles)
			oE.style[n] = alStyles[n];
	}
	function CreateElement(sT, sId, alStyles, sContent, parentEl) {
		var oE = $O(+sId);
		if (!oE) {
			oE = document.createElement(sT);
			if (!parentEl)
				parentEl = document.body;
			parentEl.appendChild(oE);
		}
		SetStyles(oE, alStyles);
		if (sContent)
			oE.innerHTML = sContent;
		oE.id = sId;
		return oE;
	}
	function SaveLocal(val) {
		console.log($O('tbFriends').value)
		console.log($O('tbMsgSound').checked)
		localStorage.setItem("FriendList", $O('tbFriends').value);
		localStorage.setItem("PlaySound", $O('tbMsgSound').checked);
		$O('divOptions').style.display = 'none';
		SetLocalData();
	}
	function nChatPrepare() {
		var nChat = $O('nChat').childNodes;
		for (i = 0; i < nChat.length; i++) {
			var uid = nChat[i].className.substr(15);
			var login = nChat[i].firstChild.innerHTML;
			var uC = nChat[i].firstChild.style.color;
			var msg = nChat[i].getElementsByTagName("span")[0].textContent;
			//console.log(nChat[i].getElementsByTagName("span").textContent + ' ' + uid + ' ' + login);
			if (nChatCheckForIgnore2(msg)) {
				nChat[i].style.display = "none";
			}
			if (uC != "rgb(194, 27, 27)" && uC != "rgb(25, 52, 119)") {
				uC = SetUserColor(uid, login);
				if (uC != null) {
					nChat[i].firstChild.style.color = uC;
					//console.log('Color setted to ' + login + ' with id: ' + uid + ' ' + uC);
				}
			}
		}
	}
	function CreateConfig() {
		var oFriends = localStorage.getItem("FriendList");
		var oPlaySound = localStorage.getItem("PlaySound");
		var oOptions = CreateElement('div', 'divOptions', {
				'border-radius': '6px',
				'display': 'none',
				'padding': '5px',
				'background': '#f5f5f5',
				'position': 'absolute',
				'width': '400px',
				'height': '105px',
				'top': '35px',
				'right': '20px',
				'border': '2px solid black'
			}, document.body);
		oOptions.innerHTML = '<table cellspacing=0 cellpadding=0>'
			 + '<tr><td style="width:90px;text-align:right"><b>Friends:</b></td><td><input type="text" value="' + oFriends + '" style="width:300px;margin:5px" id=tbFriends></td></tr>'
			 + '<tr><td style="width:90px;text-align:right"><b>Play sound on replies:</b></td><td><input type="checkbox" value="true" style="margin:5px 0px 0px 10px" id="tbMsgSound" ' + (oPlaySound == true ? 'checked' : '') + '>'
			 + '<input id=btnCancel type="button" value="Cancel" style="width:70px;float:right;margin-right:10px;margin-top:5px"><input id=btnSave type="button" value="Save" style="width:70px;float:right;margin-right:10px;margin-top:5px"></td></tr></table>'
			 + '<p style="font-size: 8px; color:darkgrey">BTC: 1FHa9WRi8BvgoNDPKUGJeM7aTRprrd1hve</p> <p style="font-size: 8px; color:darkgrey">LTC: LewvtcgpaimaHBDGMuUYoZjAfjL6yKnfEL</p> <p style="font-size: 8px; color:darkgrey">ETH: 0x0f71fdb829997DC6F27c9543100192d1ed8E1437</p>';
		AddEvent($O('btnSave'), "click", SaveLocal);
		AddEvent($O('btnCancel'), "click", function () {
			$O('divOptions').style.display = 'none';
		});
		var oButton = document.createElement('BUTTON');
		var t = document.createTextNode("Chat Options");
		oButton.appendChild(t);
		SetStyles(oButton, {
			'position': 'absolute',
			'top': '5px',
			'right': '20px',
			'width': '100px',
			'height': '20px',
			'padding': '0px'
		});
		document.body.appendChild(oButton);
		AddEvent(oButton, "click", function () {
			var oO = $O('divOptions');
			if (oO.style.display == 'none')
				oO.style.display = 'block';
			else
				oO.style.display = 'none';
		});
	}
	function AddEvent(el, type, fn) {
		if (el == null || el == undefined)
			return;
		if (el.attachEvent)
			el.attachEvent("on" + type, fn);
		else if (el.addEventListener)
			el.addEventListener(type, fn, false);
		else
			el["on" + type] = fn;
	}
	function PlaySound() {
		var audio = document.createElement("audio");
		audio.src = "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg";
		if ($O('tbMsgSound').checked) {
			audio.play();
		}
	}
	function LoadExt() {
		SetLocalData();
		nChatPrepare();
		chatChannel.unbind("msg", nChatPutMsg)
		chatChannel.bind("msg", nChatPutMsgNew2)
		CreateConfig();
		console.log("BTC-e (WEX) chat extension loaded")
	}
	setTimeout(LoadExt, 1000)
}
 + ')();';

var script = document.createElement('script');
script.textContent = actualCode;
(document.head || document.documentElement).appendChild(script);
script.remove();
