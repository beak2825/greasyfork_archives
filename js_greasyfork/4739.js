// ==UserScript==
// @name        SpyShare
// @namespace   SpyShareNamespace
// @author		[TSN]Kanly
// @include     *.ogame.gameforge.com/game/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description SpyShare for Ogame: Allows you to share spy reports with your buddies even if you are not in the same alliance
// @version     2.0
// @downloadURL https://update.greasyfork.org/scripts/4739/SpyShare.user.js
// @updateURL https://update.greasyfork.org/scripts/4739/SpyShare.meta.js
// ==/UserScript==

var SSR = {};
var noSpyShareTxt = "\n\n\ If you see this message then you don't have the SpyShare Tool, it is not active/working or Commander is not activated. For more info check the[url=https://greasyfork.org/scripts/4739-spyshare] SpyShare Page[/url]";

function main() {
	SSR.Data.init();
	SSR.Updater.check();
	SSR.Init.init();
}

SSR.Updater = {
	scriptId: 4739,
	updStr: "",
	scriptName: "",
	checkD: 1,
	checkH: 0,
	checkM: 0,
	checkS: 0,
	checkInterval: 0,
	currVersion: 0,

	parseVersion: function(data) {
		return parseInt(data.match(/@version\s+\d+/)[0].match(/\d+/));
	},
	
	call: function(alertResp) {
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://greasyfork.org/scripts/4739-spyshare/code/' + this.scriptId + '.meta.js',
			onload: function (response) {
				SSR.Updater.compare(response.responseText, alertResp);
			}
		});
	},
	
	compare: function(metaData, alertResp) {
		try{
			var newVersion = parseInt(metaData.match(/@version\s+[\d\.]+/)[0].match(/[\d\.]+/)[0].replace(".",""));
			if (newVersion > this.currVersion) {
				if (confirm('A new version of the ' + this.scriptName + ' user script is available. Do you want to update?')) {
					SSR.Storage.store(this.updStr, new Date().getTime() + "");
					top.location.href = 'https://greasyfork.org/scripts/4739-spyshare/code/' + this.scriptId + '.user.js';
				}
				else {
					if (confirm('Do you want to turn off auto updating for this script?')) {
						SSR.Storage.store(this.updStr, "off");
						GM_registerMenuCommand("Auto Update " + this.scriptName,
							function () {
								SSR.Storage.store(SSR.Updater.updStr, new Date().getTime() + "");
								SSR.Updater.call(true);
						});
						alert('Automatic updates can be re-enabled for this script from the User Script Commands submenu.');
					}
					else {
						SSR.Storage.store(this.updStr, new Date().getTime() + "");
					}
				}
			}
			else {
				if (alertResp)
					alert('No updates available for ' + this.scriptName);
				SSR.Storage.store(this.updStr, new Date().getTime()+ "");
			}
		}catch(e){}
	},
	
	check: function() {
		try {
			var meta = GM_getResourceText('meta');
			var updStat;
			var timeNow = new Date().getTime();

			//this.scriptName = meta.match(/@name\s+(.*)\s*\n/i)[1];
			this.scriptName = GM_info.script.name;
			//this.currVersion = meta.match(/@version\s+\d+/)[0].match(/\d+/);
			this.currVersion = parseInt(GM_info.script.version.replace(".",""));
			this.updStr = "updated_" + this.scriptId;
			this.checkInterval = ((((this.checkD*24 + this.checkH)*60 + this.checkH)*60 + this.checkM)*60 + this.checkS)*1000;

			updStat = SSR.Storage.get(this.updStr, 0);
			if (updStat === "off") {
				GM_registerMenuCommand("Enable " + this.scriptName + " updates",
					function () {
						SSR.Storage.store(SSR.Updater.updStr, new Date().getTime() + "");
						SSR.Updater.call(true);
					});
			}
			else {
				if (timeNow > parseInt(updStat) + this.checkInterval) {
					SSR.Storage.store(this.updStr, timeNow + "");
					this.call();
				}

			}
			GM_registerMenuCommand("Check " + this.scriptName + " for updates",
				function () {
					SSR.Storage.store(SSR.Updater.updStr, new Date().getTime() + '');
					SSR.Updater.call(true);
				});
		}catch(e){}
	}
};

SSR.Data = {
	universe: '',
	playerId: 0,
	buddies: [],
	page: '',
	allianceName: '',

	init: function() {
		SSR.Data.playerId = document.getElementsByName("ogame-player-id")[0].content;
		SSR.Data.universe = document.getElementsByName("ogame-universe")[0].content;
		SSR.Data.allianceName = document.getElementsByName("ogame-alliance-tag")[0].content;
		SSR.Data.page = (unsafeWindow.location+"").match(/page=[^&]+((?=&)|(?=#)|)/g)[0].replace("page=", "");
	}
};

SSR.Storage = {
	getPrefix: function() {
		var s = SSR.Data.universe+"::"+SSR.Data.playerId+":::";
		return s;
	},

	store: function(name, value) {
		GM_setValue(SSR.Storage.getPrefix()+name, value);
	},

	get: function(name, defValue) {
		return GM_getValue(SSR.Storage.getPrefix()+name, defValue);
	},

	remove: function(name) {
		GM_deleteValue(SSR.Storage.getPrefix()+name);
	}
};

SSR.Init = {
	init: function() {
		if (SSR.Init.hasCommander() === false)
			return;

		SSR.Buddies.getBuddies();

		if (SSR.Data.page === "messages") {
			GM_addStyle(SSR.shareSection.getCss());

			SSR.Utils.waitForKeyElements('#mailz', SSR.Reports.fullSpyReports, false);
			SSR.Utils.waitForKeyElements('.read.messagebox', SSR.Reports.widgetMessagePopUp, false);
		}
	},
	
	hasCommander: function() {
		var found = false;

		$('#officers').find('a.tooltipHTML.on').each(function() {
			var cls = $(this).attr('class');
			
			if (cls.indexOf('commander') != -1)
				found = true;
		});
		
		return found;
	}
};

SSR.Reports = {
	widgetMessagePopUp: function(jNode) {
		var widget = jNode;
		var isSharedRep = false;
		var isSpyReport = false;
		var isAllianceSharedRep = false;
		
		if (jNode.find('.infohead th[scope="row"]').next().text().match(/\[spyShare\]/g)) {
			isSharedRep = true;
		}
		else if ((kk = jNode.find('.textWrapper .note').text().match(/_SPY_SHARE_/g)) && kk && kk.length === 2) {
			isSharedRep = true;
			isAllianceSharedRep = true;
		}
		else if ($('.infohead span.playerName a[target="_parent"]').exists() === false && $('.defenseattack.spy').exists()) {
			isSpyReport = true;
		}
		if (isSharedRep === false && isSpyReport === false)
			return;
		
		if (isSharedRep) {
			var info = jNode.find('.note .other.newMessage');
			
			if (info.exists() === false && isAllianceSharedRep === true)
				info = jNode.find('.textWrapper .note');
			
			info = info.text();
			info = info.match(/_SPY_SHARE_.+_SPY_SHARE_/g)[0].replace(/_SPY_SHARE_/g, '');
			info = JSON.decode(info);

			jNode.find('.showMsgNavi').remove();
			jNode.find('.answerHeadline.open').remove();
			jNode.find('.answerForm').remove();

			jNode.find('.note').html(SSR.Reports.formSharedReportHtml(info));
		}
		else if (isSpyReport) {
			jNode.find('.defenseattack.spy').parent().append(SSR.shareSection.getHtml(true));
			jNode.find('.textWrapper').css('max-height', 'none');

			SSR.shareSection.initEvents(jNode);
		}
	},

	fullSpyReports: function(jNode) {
		$('[id^="spioDetails_"]').each(function () {
			$(this).find('.defenseattack.spy').parent().append(SSR.shareSection.getHtml(true));
		});

		SSR.shareSection.initEvents(jNode);
	},

	formSharedReportHtml: function(info) {
		var html = '';
		var resTable = '';
		var tables = '';
		var header = '';

		html = formHeader(info.header);
		html += formResTable(info.resources);

		for (var section in info.data) {
			if (info.data.hasOwnProperty(section) && section !== "resources") {
				html += formTable(section+"", info.data[section]);
			}
		}

		function formHeader(hdr) {
			var s = 
			'<table cellpadding="0" cellspacing="0" class="material spy">'+
				'<tbody>'+
					'<tr>'+
						'<th class="area" style="color: #6f9fc8" colspan="6" plunder_status='+hdr.pl_st+'>'+
							'<span style="float: left; color: '+hdr.act_clr+';" title='+hdr.act_title+'>&nbsp;&nbsp;'+hdr.act+'</span>'+hdr.part1+
							'<a target="_parent" href="javascript:showGalaxy('+SSR.Utils.formatCoords(hdr.coords, true)+')">'+SSR.Utils.formatCoords(hdr.coords, false)+'</a>'+hdr.part2+
							'<span class='+hdr.tar_class+'>'+hdr.player+'</span>)'+hdr.part3+
						'</th>'+
					'</tr>';

			return s;
		}

		function formResTable(res) {
			var s = 
					'<tr class="areadetail">'+
						'<td colspan="6">'+
							'<table class="fragment spy2">'+
								'<tbody>'+
									'<tr>'+
										'<td class="item">'+res[0].name+'</td>'+
										'<td>'+res[0].value+'</td>'+
										'<td class="item">'+res[1].name+'</td>'+
										'<td>'+res[1].value+'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="item">'+res[2].name+'</td>'+
										'<td>'+res[2].value+'</td>'+
										'<td class="item">'+res[3].name+'</td>'+
										'<td>'+res[3].value+'</td>'+
									'</tr>'+
								'</tbody>'+
							'</table>';

			return s;
		};

		function formTable(title, data) {
			var html =	'<table cellpadding="0" cellspacing="0" class="fleetdefbuildings spy">'+
							'<tbody>'+
								'<tr>'+
									'<th class="area" colspan="4">'+title+'</th>'+
								'</tr>';
								
			var n = 0;
			for (var entry in data) {
				if (data.hasOwnProperty(entry)) {
					if (n%2 === 0)
						html += '<tr>';
					
					html += '<td class="key">'+entry+'</td>'+
							'<td class="value">'+data[entry]+'</td>';

					if (n%2 === 1)
						html += '</tr>';

					n++;
				}
			}
			
			html += 		'</tbody>'+
						'</table>';
			return html;
		}
		
		return html;
	},

	extractSpyReportData: function(buttTable) {
		var item = buttTable;
		var info = {};
		var res = [];
		var curRes = {};
		var header = {};
		var fltdefbuilt = {};

		/*
			header:{
				pl_st:1,
				act_title: Activitate,
				tar_class: status_abbr_honorableTarget,
				act:33,
				act_clr: #848484
				player: nume,
				coords:["1", "167", "12"],
				part1: Resurse la Planeta',
				part2: Jucator:,
				part3: in 02-02 18:28:02
			}	

				<th class="area" colspan="6" plunder_status="1">
					<span style="float: left; color: #848484;" title="Activitate">&nbsp;&nbsp;-- </span>
					Resurse la<figure class="planetIcon planet tooltip js_hideTipOnMobile" title="Planeta"></figure>Caledonia <a target="_parent" href="javascript:showGalaxy(1,172,8)">[1:172:8]</a> 
					(Jucator: <span class="status_abbr_honorableTarget">focul</span>) in 02-02 14:33:23
				</th>

			'53 '      'Resurse la HomeDepo' '[1:167:12]'  '(Jucator: '   'Billy')     ' in 02-02 18:28:02'
			activity    part1                coords         part2          player       date
		*/

		// get activity
		item.siblings('.aktiv.spy').each(function () {
			var item = $(this);

			header.act_title = item.find('th.area').text();
			if (item.find('font').exists()) {
				header.act_clr = item.find('font').attr('color');
				header.act = item.find('font').text();
			}
			else {
				header.act_clr = "#848484";
				header.act = "-- ";
			}
		});
		// get header info
		item.siblings('.material.spy').find('th.area').each(function () {
			var item = $(this);
			var coords = {};
			var txt;

			// plunder status
			header.pl_st = (item.is('[plunder_status]') === true) ? item.attr("plunder_status") : "0";

			// get target name
			item.find('span:last').each(function() {
				header.player = $(this).text();
				header.tar_class = $(this).attr("class");
			});

			txt = item.text();
			txt = txt.replace(header.act, '');
			txt = txt.replace(header.player, '');

			// get coords
			var coordsStr = txt.match(/\[[^\]]+\]/g);
			if (coordsStr && coordsStr[0]) {
				header.coords = coordsStr[0].match(/\d+/g);
				txt = txt.replace(coordsStr, '');
			}
			else
				header.coords = ["0", "0", "0"];

			// get "(Player: "
			var playerSec = txt.match(/\([^\)]+/g);
			if (playerSec && playerSec[0]) {
				header.part2 = playerSec[0];
				txt = txt.replace(playerSec, '');
			} else
				header.part2 = "(Player: ";
			
			// get time
			var dateSec = txt.match(/[^\)]+(.+)/);
			if (dateSec && dateSec[1]) {
				header.part3 = dateSec[1].replace(')', '');
				txt = txt.replace(dateSec[1], '');
			}
			else
				header.part3 = " no time available";
				
			header.part1 = txt;
		});
		info.header = header;

		// get resources
		item.siblings('.material.spy').find('.fragment.spy2').each(function() {
			var resCont = $(this);
		
			resCont.find('td').each(function() {
				var item = $(this);
				
				if (item.attr('class') === 'item')
					curRes.name = item.text();
				else {
					curRes.value = item.text();
					res.push(curRes);
					curRes = {};
				}
			});
		});
		info.resources = res;

		// get fleet
		item.siblings('.fleetdefbuildings.spy').each(function() {
			var section = $(this).find('th.area').text();
			var values = {};
			
			$(this).find('td.key').each(function() {
				values[$(this).text()] = $(this).next().text();
			});
			
			fltdefbuilt[section] = values;
		});
		info.data = fltdefbuilt;

		return info;
	}
};

SSR.Buddies = {
	getBuddies: function() {
		SSR.Data.buddies = JSON.decode(SSR.Storage.get("myBuddies", '[]'));

		SSR.Utils.waitForKeyElements('#buddylist', SSR.Buddies.extractBuddies, false);

		if (SSR.Data.buddies.length === 0)
			SSR.Buddies.requestBuddies();
	},

	requestBuddies: function() {
		var url = 'http://'+SSR.Data.universe+'/game/index.php?page=buddies&action=9&ajax=1';
		var host = SSR.Data.universe;
		var ref = 'http://'+SSR.Data.universe+'/game/index.php?page=overview';
		var contType = 'application/x-www-form-urlencoded';
		var payload = '';

		SSR.Utils.sendRequest({
			method: 'GET',
			url: url,
			host: host,
			acc: '*/*',
			ref: ref,
			contType: contType,
			payload: '',
			onloadFun: SSR.Buddies.parseBuddiesStr});
	},

	parseBuddiesStr: function(resp) {
		var html = $.parseHTML(resp);

		SSR.Buddies.extractBuddies($(html, 'table#buddylist'));
	},

	extractBuddies: function(jNode) {
		SSR.Data.buddies.length = 0;
		jNode.find('tbody tr').each(function() {
			var item = $(this);
			var name = item.find('span:first').text();
			var id = item.find('.deleteBuddy').attr('id');

			SSR.Data.buddies.push({id:id, name:name});
		});

		SSR.Storage.remove("myBuddies");
		SSR.Storage.store("myBuddies", JSON.encode(SSR.Data.buddies));
	}
};

SSR.shareSection = {
	getCss: function() {
		var css = 
			'a.sendShareInfo.ok {'+
				'color: green;'+
			'}'+
			'a.sendShareInfo.err {'+
				'color: red;'+
			'}'+
			'td.blockTD {'+
				'display: inline-block;'+
			'}'+
			'.dropdown-check-list {'+
				'display: inline-block;'+
				'font-family: Verdana,Arial,SunSans-Regular,Sans-Serif;'+
				'font-size: 12px;'+
			'}'+
			'.dropdown-check-list .anchor {'+
				'position: relative;'+
				'cursor: pointer;'+
				'display: inline-block;'+
				'padding: 5px 50px 5px 10px;'+
				'background-color: #23282d;'+
				'border: 1px solid #000;'+
				'color:#6f9fc8;'+
				'-webkit-touch-callout: none;'+
				'-webkit-user-select: none;'+
				'-khtml-user-select: none;'+
				'-moz-user-select: none;'+
				'-ms-user-select: none;'+
				'user-select: none;'+
			'}'+
			'.dropdown-check-list .anchor:after {'+
				'position: absolute;'+
				'content: "";'+
				'border-left: 2px solid lawnGreen;'+
				'border-top: 2px solid lawnGreen;'+
				'padding: 5px;'+
				'right: 10px;'+
				'top: 20%;'+
				'-moz-transform: rotate(-135deg);'+
				'-ms-transform: rotate(-135deg);'+
				'-o-transform: rotate(-135deg);'+
				'-webkit-transform: rotate(-135deg);'+
				'transform: rotate(-135deg);'+
			'}'+
			'.dropdown-check-list.visible .anchor:after {'+
				'top: 40%;'+
				'-moz-transform: rotate(45deg);'+
				'-ms-transform: rotate(45deg);'+
				'-o-transform: rotate(45deg);'+
				'-webkit-transform: rotate(45deg);'+
				'transform: rotate(45deg);'+
			'}'+
			'.dropdown-check-list ul.items {'+
				'padding: 2px;'+
				'display: none;'+
				'margin: 0;'+
				'border: 1px solid #000;'+
				'border-top: none;'+
				'background-color: #161A1F;'+
				'color: #848484;'+
			'}'+
			'.dropdown-check-list ul.items li, .dropdown-check-list ul.items input {'+
				'cursor: pointer;'+
				'list-style: none;'+
				'-webkit-touch-callout: none;'+
				'-webkit-user-select: none;'+
				'-khtml-user-select: none;'+
				'-moz-user-select: none;'+
				'-ms-user-select: none;'+
				'user-select: none;'+
			'}'+
			'.dropdown-check-list.visible li.groupHeader {'+
				'color: #6f9fc8;'+
			'}'+
			'.dropdown-check-list.visible .items {'+
				'display: block;'+
			'}';
			
			return css;
	},
	
	getHtml: function(addTable) {
		var html = '';
		
		if (addTable)
			html += '<table cellpadding="0" cellspacing="0" class="spy"><tbody>'+
			'<tr><th class="area" colspan="4">Share it</th></tr>';
			
		html += 
			'<tr>'+
				'<td>' + SSR.shareSection.getListHtml() + '</td>'+
				'<td class="blockTD"><a class="btn_blue share_button">Share</a></td>'+
				'<td class="blockTD"><a class="sendShareInfo"></a></td>'+
			'</tr>';
			
		if (addTable)
			html += '</tbody></table>';
			
		return html;
	},
	
	getListHtml: function() {
//		buddies: [{id:id, name:name}, ... ]
		var html = 
			'<div class="shareList dropdown-check-list">'+
				'<span class="anchor">Share With</span>'+
				'<ul class="items">';
			if (SSR.Data.buddies.length !== 0)
				html += '<li class="groupHeader"><input type="checkbox" data="Friend" class="shareGroup"/>All Friends </li>';
			
			for (var bud in SSR.Data.buddies) {
				html += '<li><input type="checkbox" data="'+SSR.Data.buddies[bud].id+'" class="share Friend" />'+SSR.Data.buddies[bud].name+'</li>';
			}

			html += '<li class="groupHeader"><input type="checkbox" id="allianceShare" data="Ally" class="shareGroup" />'+SSR.Data.allianceName+' Alliance </li>';
/*				
			for (var allId in allies) {
				if (allies.hasOwnProperty(allId))
					html += '<li><input type="checkbox" data="'+allId+'" class="share Ally" />'+allies[allId]+'</li>';
			}
*/			
			html +=	'</ul>'+
				'</div>';

		return html;
	},

	updateShareNote: function(jNode, status, txt) {
		if (status === 'err')
			jNode.parent().siblings().find('a.sendShareInfo').removeClass('ok').addClass('err');
		else
			jNode.parent().siblings().find('a.sendShareInfo').removeClass('err').addClass('ok');

		jNode.parent().siblings().find('a.sendShareInfo').text(txt);
	},

	initEvents: function(wrapper) {
		// show/hide list
		wrapper.find('.shareList .anchor').click(function(ev) {
			var item = $(this).parent();
			
			if (item.hasClass('visible'))
				item.removeClass('visible');
			else
				item.addClass('visible');
		});

		// check/uncheck groups
		wrapper.find('.shareList input:checkbox.shareGroup').click(function(ev) {
			var item = $(this);
			var newState = item.is(':checked');
			var cls = item.attr('data');

			if (!newState)
				item.parent().siblings().find('input:checkbox:checked.'+cls).click();
			else
				item.parent().siblings().find('input:checkbox.'+cls).not(':checked').click();
		});

		// share button
		wrapper.find('a.share_button').click(function(ev) {
			var item = $(this);
			var dest = [];
			var inf = '';
			var allianceShare = false;

			ev.preventDefault();

			item.parent().siblings().find('input:checked.share').each(function() {
				dest.push($(this).attr('data'));
			});

			allianceShare = item.parent().siblings().find('#allianceShare:checked').exists();
			
			if (dest.length === 0 && allianceShare === false) {
				SSR.shareSection.updateShareNote(item, 'err', 'No destination selected!');
				return;
			}
			else {
				info = SSR.Reports.extractSpyReportData(item.closest('table'));
				SSR.Utils.sendSharedMessages(item, dest,
					'[spyShare] '+info.header.player+" ["+SSR.Utils.formatCoords(info.header.coords, false)+"]",
					"_SPY_SHARE_"+JSON.encode(info)+"_SPY_SHARE_"+noSpyShareTxt, allianceShare);
			}
		});
	}
};

SSR.Utils = {
	sendRequest: function(opts) {
		var hdr = {
				'Accept-Language': 'en-us,en;q=0.5',
				'Accept-Encoding': 'gzip, deflate',
				'Connection': 'keep-alive'
			};
		var onLoadFun = opts.onLoadFun;

		hdr.Accept = (opts.acc && opts.acc !== '') ? opts.acc : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
		if (opts.host) hdr.Host = opts.host;
		if (opts.ref) hdr.Referer = opts.ref;
		if (opts.contType) hdr['Content-Type'] = opts.contType;

		GM_xmlhttpRequest({
			method: opts.method,
			url: opts.url,
			headers: hdr,
			data: opts.payload,

			onload: function(response) {
				if (opts.onloadFun)
					opts.onloadFun(response.responseText);
			},
			onabort: function(resp) {
				if (opts.onabortFun)
					opts.onabortFun(resp.responseText);
			},
			onerror: function(resp) {
				if (opts.onerrorFun)
					opts.onerrorFun(resp.responseText);
			},
			ontimeout: function(resp) {
				if (opts.ontimeoutFun)
					opts.ontimeoutFun(resp.responseText);
			}
		});
	},

	sendSharedMessages: function(jNode, dest, subj, content, allianceShare) {
		var sent = 0;
		var curBuddy = 0;
		var totalMsg = dest.length;

		if (allianceShare) {
			totalMsg++;
			curBuddy = -1;
			sendAlliance();
		}
		else {
			sendSingle(dest[curBuddy]);
		}

		function sendAlliance() {
			var url = 'http://'+SSR.Data.universe+'/game/index.php?page=allianceBroadcast';
			var host = SSR.Data.universe;
			var ref = 'http://'+SSR.Data.universe+'/game/index.php?page=alliance';
			var contType = 'application/x-www-form-urlencoded';
			var payload = 'empfaenger=200&'+'&text='+content+'&ajax=1';

			SSR.Utils.sendRequest({
				method: 'POST',
				url: url,
				host: host,
				acc: '',
				ref: ref,
				contType: contType,
				payload: payload,
				onloadFun: messageSentOk});
		}

		function sendSingle() {
			var url = 'http://'+SSR.Data.universe+'/game/index.php?page=messages&to='+dest[curBuddy];
			var host = SSR.Data.universe;
			var ref = 'http://'+SSR.Data.universe+'/game/index.php?page=messages';
			var contType = 'application/x-www-form-urlencoded';
			var payload = 'betreff='+subj+'&text='+content;

			SSR.Utils.sendRequest({
				method: 'POST',
				url: url,
				host: host,
				acc: '',
				ref: ref,
				contType: contType,
				payload: payload,
				onloadFun: messageSentOk});
		}

		function messageSentOk(resp) {
			sent++;
			curBuddy++;
			SSR.shareSection.updateShareNote(jNode, 'ok', sent+'/'+totalMsg+' messages sent!');

			if (curBuddy < dest.length)
				unsafeWindow.setTimeout(sendSingle, 300);
		}
	},

	formatCoords: function(coords, isHref) {
		var del = (isHref ? ',' : ':');
		var s = parseInt(coords[0]) + del + parseInt(coords[1]) + del + parseInt(coords[2]);

		return s;
	},
	
	waitForKeyElements: function (selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
	    var targetNodes, btargetsFound;

	    if (typeof iframeSelector == "undefined")
	        targetNodes = $(selectorTxt);
	    else
	        targetNodes = $(iframeSelector).contents()
	            .find(selectorTxt);

	    if (targetNodes && targetNodes.length > 0) {
	        /*--- Found target node(s).  Go through each and act if they
			   are new.
		   */
	        targetNodes.each(function () {
	            var jThis = $(this);
	            var alreadyFound = jThis.data('alreadyFound') || false;

	            if (!alreadyFound) {
	                //--- Call the payload function.
	                unsafeWindow.setTimeout(function () {
	                    actionFunction(jThis);
	                }, 100);
	                jThis.data('alreadyFound', true);
	            }
	        });
	        btargetsFound = true;
	    } else {
	        btargetsFound = false;
	    }

	    //--- Get the timer-control variable for this selector.
	    var controlObj = SSR.Utils.waitForKeyElements.controlObj || {};
	    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
	    var timeControl = controlObj[controlKey];

	    //--- Now set or clear the timer as appropriate.
	    if (btargetsFound && bWaitOnce && timeControl) {
	        //--- The only condition where we need to clear the timer.
	        clearInterval(timeControl);
	        delete controlObj[controlKey]
	    } else {
	        //--- Set a timer, if needed.
	        if (!timeControl) {
	            timeControl = setInterval(function () {
	                    SSR.Utils.waitForKeyElements(selectorTxt,
	                        actionFunction,
	                        bWaitOnce,
	                        iframeSelector
	                    );
	                },
	                2000
	            );
	            controlObj[controlKey] = timeControl;
	        }
	    }
	    SSR.Utils.waitForKeyElements.controlObj = controlObj;
	}
};

JSON=new function(){this.encode=function(){var self=arguments.length?arguments[0]:this,result,tmp;if(self===null)
    result="null";else if(self!==undefined&&(tmp=$[typeof self](self))){switch(tmp){case Array:result=[];for(var i=0,j=0,k=self.length;j<k;j++){if(self[j]!==undefined&&(tmp=JSON.encode(self[j])))
        result[i++]=tmp;};result="[".concat(result.join(","),"]");break;case Boolean:result=String(self);break;case Date:result='"'.concat(self.getFullYear(),'-',d(self.getMonth()+1),'-',d(self.getDate()),'T',d(self.getHours()),':',d(self.getMinutes()),':',d(self.getSeconds()),'"');break;case Function:break;case Number:result=isFinite(self)?String(self):"null";break;case String:result='"'.concat(self.replace(rs,s).replace(ru,u),'"');break;default:var i=0,key;result=[];for(key in self){if(self[key]!==undefined&&(tmp=JSON.encode(self[key])))
            result[i++]='"'.concat(key.replace(rs,s).replace(ru,u),'":',tmp);};result="{".concat(result.join(","),"}");break;}};return result;};var c={"\b":"b","\t":"t","\n":"n","\f":"f","\r":"r",'"':'"',"\\":"\\","/":"/"},d=function(n){return n<10?"0".concat(n):n},e=function(c,f,e){e=eval;delete eval;if(typeof eval==="undefined")eval=e;f=eval(""+c);eval=e;return f},i=function(e,p,l){return 1*e.substr(p,l)},p=["","000","00","0",""],rc=null,rd=/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/,rs=/(\x5c|\x2F|\x22|[\x0c-\x0d]|[\x08-\x0a])/g,rt=/^([0-9]+|[0-9]+[,\.][0-9]{1,3})$/,ru=/([\x00-\x07]|\x0b|[\x0e-\x1f])/g,s=function(i,d){return"\\".concat(c[d])},u=function(i,d){var n=d.charCodeAt(0).toString(16);return"\\u".concat(p[n.length],n)},v=function(k,v){return $[typeof result](result)!==Function&&(v.hasOwnProperty?v.hasOwnProperty(k):v.constructor.prototype[k]!==v[k])},$={"boolean":function(){return Boolean},"function":function(){return Function},"number":function(){return Number},"object":function(o){return o instanceof o.constructor?o.constructor:null},"string":function(){return String},"undefined":function(){return null}},$$=function(m){function $(c,t){t=c[m];delete c[m];try{e(c)}catch(z){c[m]=t;return 1}};return $(Array)&&$(Object)};try{rc=new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$')}
                    catch(z){rc=/^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/};this.decode=function(string, secure) {
                        if (typeof(string) != 'string' || !string.length) return new Object();
                        
                        if (secure && !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '')))
                            return new Object();
                        
                        return eval('(' + string + ')');
                    }}

$.fn.exists = function () {
    return this.length !== 0;
}

if (document.body) {
	main();
}