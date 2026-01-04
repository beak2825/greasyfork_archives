Tabs.Whisper = {
	tabOrder: 1090,
	tabLabel : 'Whisper',
	myDiv : null,
	LoggedWhispers : [],
	catchwhispers : null,
	catchwhispers2 : null,
	MaxLogEntries : 50000,
	NameFilter : '',
	NameFilter : '',

	Options : {
		LogWhenAFK : false,
		LogOutgoing : false,
		UnRead : false,
	},

	init : function (div) {
		var t = Tabs.Whisper;
		t.myDiv = div;

		uWExportFunction('whisperlog', t.whisperlog);
		uWExportFunction('btFormatWhisper', t.FormatWhisper);
		uWExportFunction ('whDeleteLog', Tabs.Whisper.DeleteLog);
		uWExportFunction ('whPostLog', Tabs.Whisper.PostLog);
		uWExportFunction ('whToggleKeep', Tabs.Whisper.ToggleKeep);
		uWExportFunction ('whFilterLog', Tabs.Whisper.FilterLog);
		uWExportFunction ('whClearNameFilter', Tabs.Whisper.ClearNameFilter);

		if (!Options.WhisperOptions) {
			Options.WhisperOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.WhisperOptions.hasOwnProperty(y)) {
					Options.WhisperOptions[y] = t.Options[y];
				}
			}
		}

		t.readWhisper();
		t.catchwhispers = new CalterUwFunc ('Chat.getChat', [[/linkComment\)\;if/,'linkComment\)\;if(i==3)whisperlog(chatwrap.innerHTML);if']]);
		t.catchwhispers.setEnable(true);

		t.catchwhispers2 = new CalterUwFunc ('Chat.sendChat', [[/if\s*\(rslt.data.recipientId\)\s*\{/,'if (rslt.data.recipientId) { btFormatWhisper(rslt,params); ']]);
		t.EnableOutgoing();

		t.SetButton();
	},

	saveWhisper : function (){
		var t = Tabs.Whisper;
		var serverID = getServerId();
		setTimeout(function () { GM_setValue ('Whisper_'+serverID+'_'+uW.tvuid, JSON2.stringify(t.LoggedWhispers)); },0); // get around GM_SetValue uW error
	},

	readWhisper : function (){
		var t = Tabs.Whisper;
		var serverID = getServerId();
		s = JSON2.parse(GM_getValue ('Whisper_'+serverID+'_'+uW.tvuid, '[]'));
		if (matTypeof(s) == 'array') { t.LoggedWhispers = s; }
	},

	ClearLog : function() {
		var t = Tabs.Whisper;
		t.LoggedWhispers = [];
		t.saveWhisper ();
		t.PaintLog();
	},

	EnableOutgoing : function () {
		var t = Tabs.Whisper;
		t.catchwhispers2.setEnable(Options.WhisperOptions.LogOutgoing);
	},

	FormatWhisper : function(rslt,params) {
		var t = Tabs.Whisper;

		if (rslt.data.recipientId!=uW.tvuid) {
			var date = new Date(uW.unixtime() * 1000);
			var mins = date.getMinutes();
			if (mins < 10) {
				mins = "0" + mins
			}
			var courtflag = 0;
			for (var i = 0; i < Seed.courtItems.length; i++) {
				if (CM.Court.isFlagItem(parseInt(Seed.courtItems[i]))) {
					courtflag = Seed.courtItems[i]
				}
			}
			var chatGlory = rslt.data.iconId;
			var chatwrap = document.createElement("div");
			var avatar = uW.stimgUrl + "img/avatars/v2/25/" + ((Seed.player.prefix == "Lord") ? "m" : "f") + Seed.player.avatarId + ".png";
			chatwrap.className = "chatwrap clearfix direct";
			var nm = "<a class='nm' onclick='Chat.viewProfile(this," + rslt.data.recipientId + "); return false;'>" + params.nm + "</a>";
			var tempcomment = '('+PlayerLink(rslt.data.recipientId,params.nm)+') '+params.comment;
			var chatloc = "<b style='color:#A56631;font-size:9px;'> " + uW.g_js_strings.sendChat.whispersto + " " + nm + ":</b> ";
			chatwrap.innerHTML = uW.Chat.chatDivContent(chatGlory, Seed.player.prefix + " " + Seed.player.name, date.getHours() + ":" + mins, avatar, tempcomment, "", courtflag, chatloc);
			t.whisperlog(chatwrap.innerHTML,true);
		}
	},

	whisperlog : function(innerHTML,Outgoing) {
		var t = Tabs.Whisper;
		var ts = unixTime();
		var okeep = false;

		if(afkdetector.isAFK || !Options.WhisperOptions.LogWhenAFK || Outgoing) {
			var n = t.LoggedWhispers.length;
			while (n--) {
				if (JSON2.stringify(innerHTML) == JSON2.stringify(t.LoggedWhispers[n].innerHTML)) {
					return; // no duplicate adding
				}
			}
				while (t.LoggedWhispers.length >= t.MaxLogEntries) {
				//make space in the log.. find the earliest entry where keep = false
				var spliced = false;
				for (var l in t.LoggedWhispers) {
					if (!t.LoggedWhispers[l].keep) {
						t.LoggedWhispers.splice(l,1);
						spliced = true;
						break;
					}
				}
				//no space, because keep is set on all entries. Log it!
				if (!spliced) {
					logit('No space in Whisper Log!');
					return;
				}
			}

			var a = innerHTML;
			var m = /div class=\"info\">.*<\/div>/im.exec(a);
			var suid = /viewProfile\(this,([0-9]+),/i.exec(m[0]);
			if (!suid) suid = uW.tvuid;
			else suid = suid[1];

			var sname = /ptChatIconClicked\(\'(.*)\'\)/im.exec(a);
			if (!sname) sname = /Chat\.whisper\(\&quot\;(.*)\&quot\;\)\;/im.exec(a);
			if (!sname)	sname = "";
			else sname = sname[1].replace(/\\/g, '');
			if (sname.indexOf(")")>1) sname = sname.substr(0,sname.indexOf(")"));

			var stext = /div.*class=\"tx\">(.*)\<\/div\>/im.exec(a);
			if (!stext)	stext = "";
			else stext = '<span>'+stext[1].split("</div>")[0]+'</span>';

			t.LoggedWhispers.push({ts:ts, uid:suid, name:sname, msg:stext, innerHTML:a, keep:okeep});
			t.saveWhisper ();

			if(afkdetector.isAFK) {
				Options.WhisperOptions.UnRead = true;
				saveOptions();
				t.SetButton();
			}
			if (tabManager.currentTab.name == 'Whisper' && Options.btWinIsOpen) {
				t.PaintLog();
			}
		};
	},

	SetButton : function () {
		var t = Tabs.Whisper;
		var elem = ById("bttcWhisper");

		if (Options.WhisperOptions.UnRead) {
			elem.setAttribute("style","color:#f00");
		}
		else {
			elem.setAttribute("style","color:#fff");
		}
	},

	PaintLog : function () {
		var t = Tabs.Whisper;

		Options.WhisperOptions.UnRead = false;
		saveOptions();
		t.SetButton();

		var z = '';
		var r = 0;
		var logshow = false;
		var logfiltered = false;

		var z = '<div align="center"><TABLE cellSpacing=0 width=98% height=0%><tr><td class="xtab">'+tx('Filter by Name/Uid')+': <INPUT class="btInput" id="whNameFilter" size=16 style="width: 115px" type=text value="'+t.NameFilter+'" onkeyup="btStartKeyTimer(this,whFilterLog)" onchange="whFilterLog()" />&nbsp;<a class="inlineButton btButton brown8" onclick="whClearNameFilter()"><span>Clear</span></a></td><td class="xtab">&nbsp;</td></td><td class="xtab" align=right>('+t.LoggedWhispers.length+'/'+t.MaxLogEntries+')</td></tr></table>';
		z += '<TABLE cellSpacing=0 width=98% height=0%><tr><td class="xtabHD" style="width:100px"><b>'+uW.g_js_strings.commonstr.date+'/'+uW.g_js_strings.commonstr.time+'</b></td><td style="width:115px" class="xtabHD"><b>'+uW.g_js_strings.commonstr.nametx+'</b></td><td class="xtabHD"><b>'+uW.g_js_strings.commonstr.message+'</b></td><td class="xtabHD" align="center" style="width:30px"><b>'+tx('Keep')+'</b></td><td class="xtabHD" align="right" style="width: 110px">'+strButton14(tx('Clear Log'),'id=whClearLog')+'</td></tr></table>';
		z += '<div style="max-height:535px; overflow-y:scroll" align="center"><TABLE id=whLogTable cellSpacing=0 width=98% height=0%>';

		var n = t.LoggedWhispers.length;
		while (n--) {
			var a = t.LoggedWhispers[n];

			logfiltered = true;
			if ((t.NameFilter != "") && (a.name.toUpperCase().search(t.NameFilter.toUpperCase()) < 0) && (a.uid.search(t.NameFilter) < 0)) continue;

			logshow = true;

			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }

			z += '<tr class="'+rowClass+'">';
			z += '<TD style="width:100px" class=xtab>'+formatDateTime(a.ts)+'</td>';
			z += '<TD style="width:115px" class=xtab>'+PlayerLink(a.uid,a.name)+'</td>';
			z += '<TD class=xtabBRTop><div ondblclick="btSelectText(this);">'+a.msg+'</div></td>';
			z += '<TD style="width:30px" class=xtab align=center><INPUT id="whKeep'+n+'" type=checkbox '+(a.keep?'CHECKED':'')+' onclick="whToggleKeep('+n+')" /></td>';
			z += '<TD class=xtab align=right style="width: 100px"><a id="whPostLog'+n+'" class="inlineButton btButton brown8" onclick="whPostLog('+ n +')"><span>'+tx('Post')+'</span></a>&nbsp;<a id="whDeleteLog'+n+'" class="inlineButton btButton brown8" onclick="whDeleteLog('+n+')"><span>'+tx('Del')+'</span></a></td>';
			z += '</tr>';
		}

		if (!logshow) {
			if (!logfiltered)
				z += '<tr><td colspan=2 class=xtab><div align="center"><br><br>'+tx('No logged whispers')+'</div></td></tr>';
			else
				z += '<tr><td colspan=2 class=xtab><div align="center"><br><br>'+tx('No logged whispers matching search parameters')+'</div></td></tr>';
		}

		z += '</table></div><br>';

		ById('ptWhisperLog').innerHTML = z;
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);

		ById('whClearLog').addEventListener ('click', function() {t.ClearLog();}, false);
	},

	ToggleKeep : function (entry) {
		var t = Tabs.Whisper;
		t.LoggedWhispers[entry].keep = !t.LoggedWhispers[entry].keep;
		t.saveWhisper ();
	},

	PostLog : function (entry) {
		var t = Tabs.Whisper;

		var mod_comm_list2 = ById('mod_comm_list2');
		var mod_comm_list1 = ById('mod_comm_list1')

		var chatwrap1 = document.createElement("div");
		chatwrap1.className = "chatwrap clearfix direct";
		chatwrap1.innerHTML = t.LoggedWhispers[entry].innerHTML;
		var chatwrap2 = document.createElement("div");
		chatwrap2.className = "chatwrap clearfix direct";
		chatwrap2.innerHTML = t.LoggedWhispers[entry].innerHTML;

		mod_comm_list2.insertBefore(chatwrap2,mod_comm_list2.firstChild);
		mod_comm_list1.insertBefore(chatwrap1,mod_comm_list1.firstChild);
	},

	DeleteLog : function (entry) {
		var t = Tabs.Whisper;
		t.LoggedWhispers.splice(entry,1);
		t.saveWhisper ();
		t.PaintLog();
	},

	FilterLog : function () {
		var t = Tabs.Whisper;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		t.NameFilter = ById('whNameFilter').value;
		t.PaintLog();
	},

	ClearNameFilter : function () {
		var t = Tabs.Whisper;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		ById('whNameFilter').value = "";
		t.FilterLog();
	},

	show : function (){
		var t = Tabs.Whisper;
		var m = '<DIV class=divHeader align=center>'+tx('RECEIVED WHISPER LOG')+'</div>';
		m += '<table class=xtab><TR><TD><INPUT id=whLogAFK type=checkbox ' + (Options.WhisperOptions.LogWhenAFK ? 'CHECKED ' : '') + '/></td><TD class=xtab>'+tx('Only log when AFK')+'</td><TD><INPUT id=whLogOutgoing type=checkbox ' + (Options.WhisperOptions.LogOutgoing ? 'CHECKED ' : '') + '/></td><TD class=xtab>'+tx('Log outgoing whispers')+'</td></tr></table>';
		m += '<div id=ptWhisperLog>&nbsp;</div><br>';
		t.myDiv.innerHTML = m;

		ToggleOption('WhisperOptions','whLogAFK','LogWhenAFK');
		ToggleOption('WhisperOptions','whLogOutgoing','LogOutgoing', t.EnableOutgoing);
		t.PaintLog();
	},
}