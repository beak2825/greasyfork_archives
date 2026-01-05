// ==UserScript==
// @name			KoCByte
// @version			1
// @description		A Kingdoms of Camelot Tracker (Kocmon replacement)
// @icon			http://www.gravatar.com/avatar/f93cdced9c9b863a7d9e4b9988886015
// @include			https://kocbyte.axiomaticenigma.com/*
// @include			*.kingdomsofcamelot.com/fb/e2/src/main_src.php*
// @grant			unsafeWindow
// @grant			GM_deleteValue
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_listValues
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @grant			GM_log
// @grant			GM_addStyle
// @grant			GM_registerMenuCommand
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace kocbyte.com
// @downloadURL https://update.greasyfork.org/scripts/19269/KoCByte.user.js
// @updateURL https://update.greasyfork.org/scripts/19269/KoCByte.meta.js
// ==/UserScript==

//============================================================================

var uW = unsafeWindow;
this.jQuery = jQuery.noConflict(true);
var Tabs = {};
var mainPop;
var kbPopUpTopClass = 'kbPopTop';
var version = 1;

var Options = {
	kbWinIsOpen: false,
	kbTrackOpen: true,
	currentTab: 'Mod',
	debug: true,
	autoUpdate: false,
	autoScout: false,
	kbWinDrag: true,
	kbWinPos: {},
};

var kb = {
	uid: 0,
	name: '',
	domain: 0,
	allianceId: 0,
	allianceName: '',
	misted: 0,
	cities: [],
	seed: null,
	target: {
		x: 0,
		y: 0
	},
	authedSites: null,
	currentUrl: document.location.toString(),
	currentWebFolder: document.location.host+document.location.pathname.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '')+'/',
	removedMixPanel: false,
	urlInfoListener: 'https://kocbyte.axiomaticenigma.com/ajax/infoListener.php',
	urlMapListener: 'https://kocbyte.axiomaticenigma.com/ajax/mapListener.php',
	urlUpdateListener: 'https://kocbyte.axiomaticenigma.com/ajax/updateListener.php',
	storagePrefix: 'KoCByte_',
	sendInfoDelay: 1000*60*60*6,
	sendMapDelay: 1000*60*10,
	sendTimer: null,
	updateTimer: null,
	taskTimer: null,
	generateRandomNumber: function(min, max){
		if(min >= max){
			return null;
		}else{
			return Math.round(min+((max-min)*Math.random()));
		}
	},
	createUrl: function(page){
		return 'https://www'+(uW.g_server)+'.kingdomsofcamelot.com/fb/e2/src/'+page;
	},
	createAjaxUrl: function(page){
		return 'https://www'+(uW.g_server)+'.kingdomsofcamelot.com/fb/e2/src/ajax/'+page+'.php';
	},
	getAjaxParams: function(){
		if(uW && uW.g_ajaxparams){
			return JSON.parse(JSON.stringify(uW.g_ajaxparams));
		}
	},
	setValueObject: function(k, v){
		v = JSON.stringify(v);
		GM_setValue(k, v);
	},
	getValueObject: function(k, dv){
		var v = GM_getValue(k, dv);
		if(!v || v === undefined){
			return null;
		}
		v = JSON.parse(v);
		if(!v){
			if(!dv){
				v = null;
			}
			else{
				v = dv;
			}	
		}
		return v;
	},
	setValue: function(k, v){
		GM_setValue(k, v);
	},
	getValue: function(k, dv){
		return(GM_getValue(k, dv));
	},
	deleteValue: function(k){
		GM_deleteValue(k);
	},
	getSavedInfo: function(){
		return(kb.getValue('ajaxparams', null));
	},
	getSavedServerId: function(){
		return(kb.getValue('sid'));
	},
	getCurrentCityId: function(){
		if(uW && uW.currentcityid){
			return JSON.parse(JSON.stringify(uW.currentcityid));
		}
	},
	getCities: function(){
		var seed = kb.getSeed();
		if(seed && seed.cities){
			return JSON.parse(JSON.stringify(seed.cities));
		}
	},
	gameInfoSave: function(){
		if(uW && uW.seed){
			kb.setValue('domain', kb.domain);
			kb.setValue('uid', kb.uid);
			kb.setValue('name', kb.name);
			kb.setValue('allianceId', kb.allianceId);
			kb.setValue('allianceName',	kb.allianceName);
			kb.setValue('misted', kb.misted);
			kb.setValueObject('cities',	kb.cities);

			var current = null;
			var saved = null;
			var tmp = null;
			var thekey = '';
			
			//seed
			tmp = [];
			for(var i in kb.seed){
				thekey = kb.storagePrefix+'SEED_'+i;
				kb.setValueObject(thekey,kb.seed[i]);
				tmp.push(i);
				//console.log(kb.getValueObject(thekey));
			}
			kb.setValueObject(kb.storagePrefix+'SEEDKEYS',tmp);
			
			//cities
			current = kb.getValueObject('cities');
			thekey = kb.storagePrefix+'CITIES';
			saved = kb.getValueObject(thekey);
			if(current != saved){
				kb.setValueObject(kb.storagePrefix+'CITIES',current);
			}
			kb.setValueObject('acctIds', kb.acctIds);
		}
	},
	gameInfoLoad: function(){
		if(uW && uW.seed){
			kb.uid = kb.getUserId();
			kb.name = kb.getUserName();
			kb.domain = kb.getServerId();
			kb.allianceId = kb.getPlayerAllianceId();
			kb.allianceName	= kb.getPlayerAllianceName();
			kb.misted = kb.getPlayerMist();
			kb.cities = kb.getCities();
			kb.authedSites = kb.authorizedWebsiteGet();
			kb.storagePrefix = kb.uid+'_'+kb.domain+'_';
			kb.seed	 = kb.getSeed();
			kb.acctIds = kb.getSavedUserIds(kb.uid);
		}else{
			kb.uid = kb.getValue('uid');
			kb.name = kb.getValue('name');
			kb.domain = kb.getValue('domain');
			kb.allianceId = kb.getValue('allianceId');
			kb.allianceName	= kb.getValue('allianceName');
			kb.misted = kb.getValue('misted');
			kb.cities = kb.getValueObject('cities');
			kb.authedSites = kb.authorizedWebsiteGet();
			kb.storagePrefix = kb.uid+'_'+kb.domain+'_';

			//the seed is too large to store as one string so we have to reassemble
			kb.seed = {};
			kb.seedKEYS = kb.getValueObject(kb.storagePrefix+'SEEDKEYS');
			if(kb.seedKEYS){
				var prefix = kb.storagePrefix+'SEED_';
				var k='';
				for(var i in kb.seedKEYS){
					k = kb.seedKEYS[i];
					kb.seed[k] = JSON.parse(kb.getValue(prefix+k));
				}
			}
			kb.acctIds = kb.getSavedUserIds();
		}
		
	},
	getServerId: function(){
		if(uW && uW.g_server){
			return (1*uW.g_server);
		}
	},
	getSavedUserIds: function(uid){
		var uids = kb.getValueObject('acctIds',[uid]);
		if(uid){
			if(!jQuery.inArray(uid,uids)){
				uids.push(uid);
			}
		}
		return uids;
	},
	getUserId: function(){
		if(uW && uW.g_ajaxparams && uW.g_ajaxparams.tvuid){
			return JSON.parse(JSON.stringify(uW.g_ajaxparams.tvuid));
		}
	},
	getUserName: function(){
		if(uW && uW.seed && uW.seed.player && uW.seed.player.name){
			return JSON.parse(JSON.stringify(uW.seed.player.name));
		}
	},
	getSeed: function(){
		if(uW && uW.seed){
			return JSON.parse(JSON.stringify(uW.seed));
		}
	},
	getPlayerAllianceId: function(){
		if(uW && uW.seed && uW.seed.allianceDiplomacies && uW.seed.allianceDiplomacies.allianceId){
			return JSON.parse(JSON.stringify(uW.seed.allianceDiplomacies.allianceId));
		}
		return 0;
	},
	getPlayerAllianceName: function(){
		if(uW && uW.seed && uW.seed.allianceDiplomacies && uW.seed.allianceDiplomacies.allianceName){
			return JSON.parse(JSON.stringify(uW.seed.allianceDiplomacies.allianceName));
		}
		return '';
	},
	getPlayerMist: function(){
		var result=0;
		if(uW && uW.seed && uW.seed.playerEffects && uW.seed.playerEffects.fogExpire){
			result = uW.seed.playerEffects.fogExpire;
			var timestamp = Math.floor(new Date().getTime()/1000);
			if(timestamp > result){
				result=0;			
			}
		}
		return JSON.parse(JSON.stringify(result));
	},
	sendToKB: function(type, payload, callback){
		var t = kb;
		var url,obj;
		switch(type){
			case 'map':
				url = t.urlMapListener;
			break;
			
			case 'update':
				url = t.urlUpdateListener;
			break;
			
			case 'info':
			default:
				url = t.urlInfoListener;
			break;
		}
		
		obj = {
			domain: t.domain,
			uid: t.uid,
			cities: t.cities,
			allianceName: t.allianceName,
			allianceId: t.allianceId,
			userName: t.name,
			data: payload,
		};
		
		t.log('Sending: '+type);
		
		var args='domain='+t.domain+'&data='+encodeURIComponent(JSON.stringify(obj));
		
		if(Options.debug){
			t.log(obj);
			t.log(args);
		}
		
		GM_xmlhttpRequest({
			"method": 'POST',
			"url": url,
			"data": args,
			"headers": {
				"Content-type" : "application/x-www-form-urlencoded"
			},
			"onreadystatechange": function(r) {
				
			},
			"onload": function(result) {
				if(result && result.status!=200 && Options.debug){
					var s='';
					s=s+"\n"+'url='+url;
					s=s+"\n"+'data='+JSON.stringify(obj);
					if(result.status){s=s+"\n"+'status:'+result.status;}
					if(result.statusText){s=s+"\n"+'statusText'+result.statusText;}
					if(result.responseHeaders){s=s+"\n"+'responseHeaders'+result.responseHeaders;}
					if(result.responseText){s=s+"\n"+'responseText'+result.responseText;}
					if(result.readyState){s=s+"\n"+'readyState'+result.readyState;}
					
					if(Options.debug){
						t.log(s);
					}
				}
				if(result && result.status == 200){
					var logMsg = 'Send done: ';
					if(Options.debug){
						logMsg += url+': ';
					}
					t.log(logMsg+result.responseText);
				}
				if(callback) {
					callback(result);
				}
			}
		});	
	},
	saveInfo: function(){
		var info = JSON.stringify(kb.getCurrentInfo());
		if(info){
			var sid = kb.getServerId();
			kb.setValue('ajaxparams',info);
			kb.setValue('sid',sid);	
		}
	},
	sendInfo: function(force){
		if(uW.g_ajaxparams && uW.g_server){
			//kb.log('checking if time to send');
			var now = new Date().getTime();
			var k = kb.storagePrefix+'lastsent_ajaxparams';
			var lastsent = kb.getValue(k,0);
			if(force || 1*lastsent+kb.sendInfoDelay<now){
				var savedkey = kb.storagePrefix+'saved_ajaxparams';
				var saved = JSON.parse(kb.getValue(savedkey,null));
				var json = kb.getAjaxParams();
				if(force || saved != json){
					kb.setValue(k,''+now+'');
					kb.setValue(savedkey,''+JSON.stringify(json));
					kb.sendToKB('info', json);
				}
			}
		}
	},
	showTime: function(timestamp,version){
		var now = null;
		if(timestamp){
			now = new Date(timestamp);
		}else{
			now = new Date();
		}
		var hours = now.getHours();
		var minutes = now.getMinutes();
		var seconds = now.getSeconds();
		var timeValue = "" + ((hours >12) ? hours -12 :hours);
		if (timeValue == "0") timeValue = 12;
		timeValue += ((minutes < 10) ? ":0" : ":") + minutes;
		timeValue += ((seconds < 10) ? ":0" : ":") + seconds;
		timeValue += (hours >= 12) ? " PM" : " AM";
		return timeValue;	
	},
	log: function(msg){
		var type = jQuery.type(msg);
		if(type == 'string'){
			msg.replace(/</gi,"&lt;");
			msg.replace(/>/gi,"&gt;");
		}else{
			msg = JSON.stringify(msg);
			msg = msg.replace(/</gi,'&lt;');
			msg = msg.replace(/>/gi,'&gt;');
		}
	
		var consoleStr = 'KoCByte: '+kb.domain+' @ '+kb.showTime()+': '+msg;
		uW.console.log(consoleStr);
		var elem = jQuery('#'+kb.elemPrefix+'-log-result');
		
		var html = '';
		if(type == 'string'){
			html = '<div>'+kb.showTime()+' '+msg+'</div>';
		}else{
			html = '<pre>'+kb.showTime()+"\n"+msg+'</pre>';
		}
		
		var n = elem.children().length;
		if(n > 10){
			elem.children(':last').remove();
		}
		elem.prepend(html);
	},
	debug: function(msg){
		var type = jQuery.type(msg);
		if(type == 'string'){
			msg.replace(/</gi,"&lt;");
			msg.replace(/>/gi,"&gt;");
		}else{
			msg = JSON.stringify(msg);
			msg = msg.replace(/</gi,'&lt;');
			msg = msg.replace(/>/gi,'&gt;');
		}
	
		var consoleStr = 'KoCByte: '+kb.domain+' @ '+kb.showTime()+': '+msg;
		uW.console.log(consoleStr);
		
		var elem = jQuery('#'+kb.elemPrefix+'-debug-result');
	
		if(type == 'string'){
			html = '<div>'+kb.showTime()+' '+msg+'</div>';
		}else{
			html = '<pre>'+kb.showTime()+"\n"+msg+'</pre>';
		}
		
		var n = elem.children().length;
		if(n > 10){
			elem.children(':last').remove();
		}
		elem.prepend(html);
	},
	authorizedWebsiteGet: function(){
		var websites = JSON.parse(''+kb.getValue('authedSites',null));
		if(!websites){
			websites = ['kocbyte.axiomaticenigma.com'];
		}
		if(jQuery.inArray(jQuery(websites),'kocbyte.axiomaticenigma.com') != -1){
			websites.push('kocbyte.axiomaticenigma.com');
		}
		return websites;
	},
	authorizedWebsiteAdd: function(url){
		var websites = JSON.parse(''+kb.getValue('authedSites',null));
		if(!websites){
			websites = ['kocbyte.axiomaticenigma.com'];
		}
		if(jQuery.inArray(jQuery(websites),url) > -1){
			websites.push(url);
			var sites = websites.filter(function(elem, pos) {
				return websites.indexOf(elem) == pos;
			});
			kb.setValue('authedSites',''+JSON.stringify(sites));
			return true;
		}else{
			return false;
		}
	},
	getStyles: function(){
		var styles = 'a.kocbytebutton20 {color:#ffff80}';
		styles = styles + '.large-pull-1,.large-pull-10,.large-pull-11,.large-pull-2,.large-pull-3,.large-pull-4,.large-pull-5,.large-pull-6,.large-pull-7,.large-pull-8,.large-pull-9,.large-push-1,.large-push-10,.large-push-11,.large-push-2,.large-push-3,.large-push-4,.large-push-5,.large-push-7,.large-push-8,.large-push-9{position:relative}';
		styles = styles + '.row{max-width:75rem;margin-left:auto;margin-right:auto}';
		styles = styles + '.row .row,.row.expanded{max-width:none}';
		styles = styles + '.row::after,.row::before{content:" ";display:table}';
		styles = styles + '.row::after{clear:both}';
		styles = styles + '.row.collapse>.column,.row.collapse>.columns{padding-left:0;padding-right:0}';
		styles = styles + '.row .row{margin-left:-.625rem;margin-right:-.625rem}';
		styles = styles + '.row .row.collapse{margin-left:0;margin-right:0}';
		styles = styles + '.row.expanded .row{margin-left:auto;margin-right:auto}';
		styles = styles + '.column,.columns{width:100%;float:left;padding-left:.625rem;padding-right:.625rem}';
		styles = styles + '.column:last-child:not(:first-child),.columns:last-child:not(:first-child){float:right}';
		styles = styles + '.column.end:last-child:last-child,.end.columns:last-child:last-child{float:left}';
		styles = styles + '.column.row.row,.row.row.columns{float:none}';
		styles = styles + '.row .column.row.row,.row .row.row.columns{padding-left:0;padding-right:0;margin-left:0;margin-right:0}';
		styles = styles + '.large-1{width:8.33333%}';
		styles = styles + '.large-push-1{left:8.33333%}';
		styles = styles + '.large-pull-1{left:-8.33333%}';
		styles = styles + '.large-offset-0{margin-left:0}';
		styles = styles + '.large-2{width:16.66667%}';
		styles = styles + '.large-push-2{left:16.66667%}';
		styles = styles + '.large-pull-2{left:-16.66667%}';
		styles = styles + '.large-offset-1{margin-left:8.33333%}';
		styles = styles + '.large-3{width:25%}';
		styles = styles + '.large-push-3{left:25%}';
		styles = styles + '.large-pull-3{left:-25%}';
		styles = styles + '.large-offset-2{margin-left:16.66667%}';
		styles = styles + '.large-4{width:33.33333%}';
		styles = styles + '.large-push-4{left:33.33333%}';
		styles = styles + '.large-pull-4{left:-33.33333%}';
		styles = styles + '.large-offset-3{margin-left:25%}';
		styles = styles + '.large-5{width:41.66667%}';
		styles = styles + '.large-push-5{left:41.66667%}';
		styles = styles + '.large-pull-5{left:-41.66667%}';
		styles = styles + '.large-offset-4{margin-left:33.33333%}';
		styles = styles + '.large-6{width:50%}';
		styles = styles + '.large-push-6{position:relative;left:50%}';
		styles = styles + '.large-pull-6{left:-50%}';
		styles = styles + '.large-offset-5{margin-left:41.66667%}';
		styles = styles + '.large-7{width:58.33333%}';
		styles = styles + '.large-push-7{left:58.33333%}';
		styles = styles + '.large-pull-7{left:-58.33333%}';
		styles = styles + '.large-offset-6{margin-left:50%}';
		styles = styles + '.large-8{width:66.66667%}';
		styles = styles + '.large-push-8{left:66.66667%}';
		styles = styles + '.large-pull-8{left:-66.66667%}';
		styles = styles + '.large-offset-7{margin-left:58.33333%}';
		styles = styles + '.large-9{width:75%}';
		styles = styles + '.large-push-9{left:75%}';
		styles = styles + '.large-pull-9{left:-75%}';
		styles = styles + '.large-offset-8{margin-left:66.66667%}';
		styles = styles + '.large-10{width:83.33333%}';
		styles = styles + '.large-push-10{left:83.33333%}';
		styles = styles + '.large-pull-10{left:-83.33333%}';
		styles = styles + '.large-offset-9{margin-left:75%}';
		styles = styles + '.large-11{width:91.66667%}';
		styles = styles + '.large-push-11{left:91.66667%}';
		styles = styles + '.large-pull-11{left:-91.66667%}';
		styles = styles + '.large-offset-10{margin-left:83.33333%}';
		styles = styles + '.large-12{width:100%}';
		styles = styles + '.large-offset-11{margin-left:91.66667%}';
		styles = styles + '.large-up-1>.column,.large-up-1>.columns{width:100%;float:left}';
		styles = styles + '.large-up-1>.column:nth-of-type(1n),.large-up-1>.columns:nth-of-type(1n){clear:none}';
		styles = styles + '.large-up-1>.column:nth-of-type(1n+1),.large-up-1>.columns:nth-of-type(1n+1){clear:both}';
		styles = styles + '.large-up-1>.column:last-child,.large-up-1>.columns:last-child{float:left}';
		styles = styles + '.large-up-2>.column,.large-up-2>.columns{width:50%;float:left}';
		styles = styles + '.large-up-2>.column:nth-of-type(1n),.large-up-2>.columns:nth-of-type(1n){clear:none}';
		styles = styles + '.large-up-2>.column:nth-of-type(2n+1),.large-up-2>.columns:nth-of-type(2n+1){clear:both}';
		styles = styles + '.large-up-2>.column:last-child,.large-up-2>.columns:last-child{float:left}';
		styles = styles + '.large-up-3>.column,.large-up-3>.columns{width:33.33333%;float:left}';
		styles = styles + '.large-up-3>.column:nth-of-type(1n),.large-up-3>.columns:nth-of-type(1n){clear:none}';
		styles = styles + '.large-up-3>.column:nth-of-type(3n+1),.large-up-3>.columns:nth-of-type(3n+1){clear:both}';
		styles = styles + '.large-up-3>.column:last-child,.large-up-3>.columns:last-child{float:left}';
		styles = styles + '.large-up-4>.column,.large-up-4>.columns{width:25%;float:left}';
		styles = styles + '.large-up-4>.column:nth-of-type(1n),.large-up-4>.columns:nth-of-type(1n){clear:none}';
		styles = styles + '.large-up-4>.column:nth-of-type(4n+1),.large-up-4>.columns:nth-of-type(4n+1){clear:both}';
		styles = styles + '.large-up-4>.column:last-child,.large-up-4>.columns:last-child{float:left}';
		styles = styles + '.large-up-5>.column,.large-up-5>.columns{width:20%;float:left}';
		styles = styles + '.large-up-5>.column:nth-of-type(1n),.large-up-5>.columns:nth-of-type(1n){clear:none}';
		styles = styles + '.large-up-5>.column:nth-of-type(5n+1),.large-up-5>.columns:nth-of-type(5n+1){clear:both}';
		styles = styles + '.large-up-5>.column:last-child,.large-up-5>.columns:last-child{float:left}';
		styles = styles + '.large-up-6>.column,.large-up-6>.columns{width:16.66667%;float:left}';
		styles = styles + '.large-up-6>.column:nth-of-type(1n),.large-up-6>.columns:nth-of-type(1n){clear:none}';
		styles = styles + '.large-up-6>.column:nth-of-type(6n+1),.large-up-6>.columns:nth-of-type(6n+1){clear:both}';
		styles = styles + '.large-up-6>.column:last-child,.large-up-6>.columns:last-child{float:left}';
		styles = styles + '.large-up-7>.column,.large-up-7>.columns{width:14.28571%;float:left}';
		styles = styles + '.large-up-7>.column:nth-of-type(1n),.large-up-7>.columns:nth-of-type(1n){clear:none}';
		styles = styles + '.large-up-7>.column:nth-of-type(7n+1),.large-up-7>.columns:nth-of-type(7n+1){clear:both}';
		styles = styles + '.large-up-7>.column:last-child,.large-up-7>.columns:last-child{float:left}';
		styles = styles + '.large-up-8>.column,.large-up-8>.columns{width:12.5%;float:left}';
		styles = styles + '.large-up-8>.column:nth-of-type(1n),.large-up-8>.columns:nth-of-type(1n){clear:none}';
		styles = styles + '.clearfix::after,.large-up-8>.column:nth-of-type(8n+1),.large-up-8>.columns:nth-of-type(8n+1){clear:both}';
		styles = styles + '.large-up-8>.column:last-child,.large-up-8>.columns:last-child{float:left}';
		styles = styles + '.large-collapse>.column,.large-collapse>.columns{padding-left:0;padding-right:0}';
		styles = styles + '.large-collapse .row{margin-left:0;margin-right:0}';
		styles = styles + '.large-uncollapse>.column,.large-uncollapse>.columns{padding-left:.9375rem;padding-right:.9375rem}';
		styles = styles + '.large-centered{float:none;margin-left:auto;margin-right:auto}';
		styles = styles + '.large-pull-0,.large-push-0,.large-uncentered{position:static;margin-left:0;margin-right:0;float:left}';
		styles = styles + '.text-left{text-align:left}';
		styles = styles + '.text-right{text-align:right}';
		styles = styles + '.text-center{text-align:center}';
		styles = styles + '.text-justify{text-align:justify}';
		styles = styles + '.hide{display:none!important}';
		styles = styles + '.invisible{visibility:hidden}';
		styles = styles + '.float-left{float:left!important}';
		styles = styles + '.float-right{float:right!important}';
		styles = styles + '.float-center{display:block;margin-left:auto;margin-right:auto}';
		styles = styles + '.clearfix::after,.clearfix::before{content:"";display:table}';
		styles = styles + '	table.kbMainTab { empty-cells: show; margin-left: 5px; margin-top: 4px; padding: 1px;  padding-left:5px;}';
		styles = styles + '	table.kbMainTab tr td a {color:inherit }';
		styles = styles + '	table.kbMainTab tr td   {height:60%; empty-cells:show; padding: 0px 4px 0px 4px;  margin-top:5px; white-space:nowrap; border: 1px solid; border-style: none none solid none; -moz-border-radius:5px; }';
		styles = styles + '	table.kbMainTab tr td.spacer {padding: 0px 0px;}';
		styles = styles + '	table.kbMainTab tr td.notSel { color: #ffffff; font-size: 12px; font-weight:bold; -moz-border-radius: 10px; -moz-box-shadow: 0px 1px 3px #357544; text-shadow: -1px 1px 3px #666666; border: solid #615461 1px; background: -moz-linear-gradient(top, #6ff28e, #196b2c);}';
		styles = styles + '	table.kbMainTab tr td.sel { color: #000000; font-size: 12px; font-weight:bold; -moz-border-radius: 10px; -moz-box-shadow: 0px 1px 3px #357544; text-shadow: -1px 1px 3px #CECECE; border: solid #615461 1px; background: -moz-linear-gradient(top, #6ff28e, #196b2c);}';
		styles = styles + '	table.kbMainTab tr td:hover { color: #191919; font-size: 12px; font-weight:bold; text-shadow: -1px 1px 3px #CECECE; background: -moz-linear-gradient(top, #43cc7e, #20a129)}';
		styles = styles + '	tr.kbPopTop td { background-color:transparent; border:none; height: 21px; padding:0px;}';
		styles = styles + '	tr.kbretry_kbPopTop td { background-color:#a00; color:#fff; border:none; height: 21px;  padding:0px; }';
		styles = styles + '	tr.kbMainPopTop td { background-color:#ded; border:none; height: 42px; width:80%; padding:0px; }';
		styles = styles + '	tr.kbretry_kbMainPopTop td { background-color:#a00; color:#fff; border:none; height: 42px;  padding:0px; }';
		styles = styles + '	.kbPopMain  { border:1px solid #000000; -moz-box-shadow:inset 0px 0px 10px #6a6a6a; -moz-border-radius-bottomright: 20px; -moz-border-radius-bottomleft: 20px;}';
		styles = styles + '	.kbPopup  {border:5px ridge #666; opacity:'+(parseFloat(Options.Opacity)<'0.5'?'0.5':Options.Opacity)+'; -moz-border-radius:25px; -moz-box-shadow: 1px 1px 5px #000000; z-index:999999;}';
		styles = styles + '	span.kbTextFriendly {color: #080}';
		styles = styles + '	span.kbTextHostile {color: #800}';
		styles = styles + '	.kbButCancel {background-color:#a00; font-weight:bold; color:#fff}';
		styles = styles + '	div.indent25 {padding-left:25px}';
		styles = styles + '	.kbdivHeader       {transparent;height: 16px;border-bottom:0px solid #000000;font-weight:bold;font-size:11px;opacity:0.75;margin-left:0px;margin-right:0px;margin-top:1px;margin-bottom:0px;padding-top:4px;padding-right:10px;vertical-align:text-top;align:left;background-color:#335577;}';
		styles = styles + '	.kbdivLink         {color:#000;text-decoration:none;}';
		styles = styles + '	.kbdivLink:Hover   {color:#000;text-decoration:none;}';
		styles = styles + '	.kbdivLink:Active  {color:#000;text-decoration:none;}';
		styles = styles + '	.kbdivHide         {display:none}';
		
		return styles;
	},
	initSite: function(){
		var stickyOffset = jQuery('.sticky').offset().top;
		jQuery(uW).scroll(function(){
			var sticky = jQuery('.sticky'),
				scroll = jQuery(uW).scrollTop();
			
			if (scroll >= stickyOffset) sticky.addClass('fixed');
			else sticky.removeClass('fixed');
		});
		jQuery('.cityCoords').on('click', function(e){
			e.preventDefault();
			
			var x = jQuery(this).attr('data-x');
			var y = jQuery(this).attr('data-y');
			var d = jQuery(this).attr('data-domain');
			kb.setValue('command', 'location|'+d+'|'+x+'|'+y);
		});
	},
	initWindow: function(){
		var styles = kb.getStyles();
		if(Options.kbWinPos === null || Options.kbWinPos.x === null || Options.kbWinPos.x === '' || isNaN(Options.kbWinPos.x)){
			Options.kbWinPos.x = 40;
			Options.kbWinPos.y = 49;
			kb.saveOptions();
		}
		
		mainPop = new kbPopup(kb.elemPrefix, Options.kbWinPos.x, Options.kbWinPos.y, 725, 400, true, function(){
			tabManager.hideTab();
			Options.kbWinIsOpen=false;
			kb.saveOptions();
		});
		mainPop.autoHeight(true);  

		mainPop.getMainDiv().innerHTML = '<style>'+ styles +'</style>';
		AddMainTabLink('KoCByte', eventHideShow, null);
		tabManager.init(mainPop.getMainDiv());
		
		if(Options.kbWinIsOpen && Options.kbTrackOpen){
			mainPop.show(true);
			tabManager.showTab();
		}
	},
	init: function(){
		
		
		jQuery('.sticky').on('click', kb.initWindow, false);
		
		kb.readOptions();
		kb.initWindow();
		
		window.addEventListener('unload', kb.onUnload, false);
		
		kb.log('Gathering game info');
		kb.gameInfoLoad();
		if(!kb.uid || !kb.domain){
			return;
		}
		kb.log('Saving game info');
		kb.gameInfoSave();
		
		if(Options.autoUpdate){
			setTimeout(function(){
				AutoUpdater.check();
			}, 5000);
		}
		
		setTimeout(function(){
			kb.sendInfo(1);
		}, 30000);
		
		kb.sendTimer = window.setInterval(function(){
			kb.sendInfo(1);
		}, kb.sendInfoDelay);
		
		kb.taskTimer = window.setInterval(function(){
			kb.doTask();
		},1000*1);
		
		kb.addXMLRequestCallback(function(xhr){
			kb.XHRHandler(xhr);
		});
		
		if(Options.autoUpdate){
			kb.updateTimer = window.setInterval(function(){
				AutoUpdater.check();
			}, kb.updateCheckDelay);
		}
		
		kb.taskTimer = window.setInterval(function(){
			kb.doTask();
		},1000*1);
	},
	getClientCoords: function(e){
		if (e==null)
			return {x:null, y:null, width:null, height:null};
		var x=0, y=0;
		ret = {x:0, y:0, width:e.clientWidth, height:e.clientHeight};
		while (e.offsetParent != null){
			ret.x += e.offsetLeft;
			ret.y += e.offsetTop;
			e = e.offsetParent;
		}
		return ret;
	},
	unload: function(){
		kb.saveOptions();
	},
	doTask: function(){
		var now = new Date().getTime();
		kb.setValue('lasttaskrun',''+now+'');
		kb.setValue('currentdomain',''+kb.getServerId()+'');
		var command = kb.getValue('command', '');
		if (command !== '') {
			kb.setValue('command','');
			kb.log('command=' + command);
			var x = 0;
			var y = 0;
			var cmd = command.split('|');
			var type = cmd[0];
			var domain = 1*cmd[1];
			
			switch(type){
				case 'location':
					if(domain == kb.domain){
						x = 1*cmd[2];
						y = 1*cmd[3];
						
						uW.console.log(x+','+y);
						uW.cm.formatModel.jumpTo(x, y);
					}else{
						kb.log('You\'re in the wrong domain to perform this action!');
					}
				break;
			}
		}
	},
	sendMap: function(data){
		kb.sendToKB('map', data);
	},
	sendUpdate: function(data){
		kb.sendToKB('update', data);
	},
	readOptions: function(){
		jQuery.each(Options, function(k, v){
			Options[k] = kb.getValue(kb.storagePrefix+'_Options_'+k, null);
		});
	},
	saveOptions: function(){
		jQuery.each(Options, function(k, v){
			kb.setValue(kb.storagePrefix+'_Options_'+k, v);
		});
	},
	addXMLRequestCallback: function(callback){
		var oldSend, i;
		if(XMLHttpRequest.callbacks){
			// we've already overridden send() so just add the callback
			XMLHttpRequest.callbacks.push(callback);
		}else{
			// create a callback queue
			XMLHttpRequest.callbacks = [callback];
			// store the native send()
			oldSend = XMLHttpRequest.prototype.send;
			// override the native send()
			XMLHttpRequest.prototype.send = function(){
				var state = this.onreadystatechange;
				this.onreadystatechange = function(){
					if(this.readyState == 4){
						if(this.responseURL.match(/fetchMapTiles/)){
							kb.sendMap(this.responseText);
						}
						if(this.responseURL.match(/fetchMarch/)){
							var marchData = JSON.parse(this.responseText);
							if(marchData.march.marchType == 3){
								var obj = {
									uid: marchData.march.toPlayerId,
									cid: marchData.march.toCityId,
									tid: marchData.march.toTileId,
									prov: marchData.march.toProvinceId,
									aid: marchData.march.toAllianceId,
									x: marchData.march.toXCoord,
									y: marchData.march.toYCoord
								};
								kb.sendUpdate(obj);
							}
						}
						if(this.responseURL.match(/getUserGeneralInfo/)){
							var playerData = JSON.parse(this.responseText);
							var obj = {
								uid: playerData.userInfo.userId,
								name: playerData.userInfo.name,
								aid: playerData.userInfo.allianceId,
								might: playerData.userInfo.might
							};
						}
					}
					state.apply(this, arguments);
				}
				for(i = 0; i < XMLHttpRequest.callbacks.length; i++){
					XMLHttpRequest.callbacks[i](this);
				}
				oldSend.apply(this, arguments);
			}
		}
	},
	XHRHandler: function(req){
		var t = Tabs.KoCByte;
	},
};

var AutoUpdater = {
    id: 19269,
	URL: 'https://greasyfork.org/en/scripts/19269-kocbyte/code/KoCByte.user.js',
	name: 'KoCByte',
	homepage: 'https://greasyfork.org/en/scripts/19269-kocbyte',
    version: kb.scriptVer,
    call: function(response) { kb.log("Checking for "+this.name+" Update!");
		var _s = this;
		GM_xmlhttpRequest({
            method: 'GET',
			url: _s.URL,
			onload: function(xpr) {_s.compare(xpr,response);},
            onerror: function(xpr) {_s.compare({responseText:""},response);}
        });
    },
    compareVersion: function(remoteVer, localVer){
		var remote = parseInt(remoteVer);
		var local = parseInt(localVer);
		return ((remote > local) ? true : false);
    },
    compare: function(xpr,response) {
		this.xversion=(/@version\s*(.*?)\s*$/m.exec(xpr.responseText));
        if(this.xversion){
			this.xversion = this.xversion[1];
		}else{
			if(response){
				uW.Modal.showAlert('<div align="center">Unable to check for updates to '+this.name+'.<br>Please change the update options or visit the<br><a href="'+this.homepage+'" target="_blank">script homepage</a></div>');
			}
			kb.log("Unable to check for updates");
			return;
		}
        
        var updated = this.compareVersion(this.xversion, this.version);   
        if (updated) {
			kb.log('New Version Available!');                  
 			var body = '<BR><DIV align=center><FONT size=3><B>New version '+this.xversion+' is available!</b></font></div><BR>';
			if (this.xrelnotes){
				body+='<BR><div align="center" style="border:0;width:470px;height:120px;max-height:120px;overflow:auto"><b>New Features!</b><p>'+this.xrelnotes+'</p></div><BR>';
			}
 			body+='<BR><DIV align=center><a class="gemButtonv2 green" id="doBotUpdate">Update</a></div>';
 			this.ShowUpdate(body);
        }else{
			kb.log("No updates available");
        } 		
    },
    check: function() {
    	var now = uW.unixtime();
    	var lastCheck = 0;
    	if (GM_getValue('updated_'+this.id, 0)) lastCheck = parseInt(GM_getValue('updated_'+this.id, 0));
		if (now > (lastCheck + 60*1)) this.call(false);
    },
	ShowUpdate: function (body) {
		var now = uW.unixtime();
		setUpdate = function(){
			GM_setValue('updated_'+AutoUpdater.id, now);
		};
		uW.cm.ModalManager.addMedium({
            title: this.name,
            body: body,
            closeNow: false,
            close: function (){
                setTimeout (function (){GM_setValue('updated_'+AutoUpdater.id, now);}, 0);
                uW.cm.ModalManager.closeAll();
            },
            "class": "Warning",
            curtain: false,
            width: 500,
            height: 700,
            left: 140,
            top: 140
        });

		document.getElementById('doBotUpdate').addEventListener('click', this.doUpdate, false);   
	},
	doUpdate: function () {
		uW.cm.ModalManager.closeAll();
		uW.cm.ModalManager.close();
		var now = uW.unixtime();
		GM_setValue('updated_'+AutoUpdater.id, now);
		GM_openInTab(AutoUpdater.URL);
	},
};

var tabManager = {
	tabList : {},           // {name, obj, div}
	currentTab : null,
	init: function (mainDiv){
		var t = tabManager;
		var sorter = [];
		for(k in Tabs){
			if(!Tabs[k].tabDisabled){  
				t.tabList[k] = {};
				t.tabList[k].name = k;
				t.tabList[k].obj = Tabs[k];
				if(Tabs[k].tabLabel != null)
					t.tabList[k].label = Tabs[k].tabLabel;
				else
					t.tabList[k].label = k;
				if(Tabs[k].tabOrder != null)
					sorter.push([Tabs[k].tabOrder, t.tabList[k]]);
				else
					sorter.push([1000, t.tabList[k]]);
				t.tabList[k].div = document.createElement('div');
			}
		}

		sorter.sort (function (a,b){return a[0]-b[0]});
		var m = '<TABLE cellspacing=3 class=kbMainTab><TR>';
		for(var i=0; i<sorter.length; i++) {
			m += '<TD class=spacer></td><TD align=center class=notSel id=kb'+ sorter[i][1].name +' ><A><SPAN>'+ sorter[i][1].label +'</span></a></td>';
			//m += '<TD align=center class=notSel id=kb'+ sorter[i][1].name +' ><A><SPAN>'+ sorter[i][1].label +'</span></a></td>';
			if((i+1)%9 == 0) m+='</tr><TR>';
		}
		m+='</tr></table>';  
		//m += '<TD class=spacer width=90% align=right>'+ Version +'&nbsp;</td></tr></table>';
		mainPop.getMainTopDiv().innerHTML = m;
    
		for(k in t.tabList){
			if(t.tabList[k].name == Options.currentTab)
				t.currentTab =t.tabList[k] ;
			document.getElementById('kb'+ k).addEventListener('click', this.e_clickedTab, false);
			var div = t.tabList[k].div;
			div.style.display = 'none';
			div.style.height = '100%';
			mainDiv.appendChild(div);
			try{
				t.tabList[k].obj.init(div);
			}catch(e){
				div.innerHTML = "INIT ERROR: "+ e;
			}
		}
    
		if(t.currentTab == null)
			t.currentTab = sorter[0][1];    
		t.setTabStyle (document.getElementById ('kb'+ t.currentTab.name), true);
		t.currentTab.div.style.display = 'block';
	},
	hideTab : function (){
		var t = tabManager;
		t.currentTab.obj.hide();
	},
	showTab : function (){
		var t = tabManager;
		t.currentTab.obj.show();
	},
	setTabStyle : function (e, selected){
		if(selected){
			e.className = 'sel';
		}else{
			e.className = 'notSel';
		}
	},
	e_clickedTab : function (e){
		var t = tabManager;
		var newTab = t.tabList[e.target.parentNode.parentNode.id.substring(2)];
		if(t.currentTab.name != newTab.name){
			t.setTabStyle (document.getElementById ('kb'+ t.currentTab.name), false);
			t.setTabStyle (document.getElementById ('kb'+ newTab.name), true);
			t.currentTab.obj.hide ();
			t.currentTab.div.style.display = 'none';
			t.currentTab = newTab;
			newTab.div.style.display = 'block';
			Options.currentTab = newTab.name;      
		}
		newTab.obj.show();
	},
};

var WinManager = {
	wins: {},    // prefix : kbPopup obj
	didHide: [],
	get: function(prefix){
		var t = WinManager;
		return t.wins[prefix];
	},
	add: function(prefix, pop){
		var t = WinManager;
		t.wins[prefix] = pop;
		if(uW.cpopupWins == null)
			uW.cpopupWins = {};
		uW.cpopupWins[prefix] = pop;
	},
	hideAll: function(){
		var t = WinManager;
		t.didHide = [];
		for(var k in t.wins){
			if(t.wins[k].isShown()){
				t.didHide.push (t.wins[k]);
				t.wins[k].show (false);
			}
		}
	},
	restoreAll: function(){
		var t = WinManager;
		for(var i=0; i<t.didHide.length; i++)
			t.didHide[i].show(true);
	},
	delete: function(prefix){
		var t = WinManager;
		delete t.wins[prefix];
		delete uW.cpopupWins[prefix];
	}    
};

// creates a 'popup' div
// prefix must be a unique (short) name for the popup window
function kbPopup(prefix, x, y, width, height, enableDrag, onClose) {
	var pop = WinManager.get(prefix);
	if(pop){
		pop.show (false);
		return pop;
	}
	this.BASE_ZINDEX = 111111;
    
	// protos ...
	this.show = show;
	this.toggleHide = toggleHide;
	this.getTopDiv = getTopDiv;
	this.getMainTopDiv = getMainTopDiv;
	this.getMainDiv = getMainDiv;
	this.getJQMainDiv = getJQMainDiv;
	this.getLayer = getLayer;
	this.setLayer = setLayer;
	this.setEnableDrag = setEnableDrag;
	this.getLocation = getLocation;
	this.setLocation = setLocation;
	this.focusMe = focusMe;
	this.isShown = isShown;
	this.unfocusMe = unfocusMe;
	this.centerMe = centerMe;
	this.destroy = destroy;
	this.autoHeight = autoHeight;
	
	// object vars ...
	this.div = document.createElement('div');
	this.prefix = prefix;
	this.onClose = onClose;
	
	var t = this;
	this.div.className = 'kbPopup '+ prefix +'_kbPopup';
	this.div.id = prefix +'_outer';
	this.div.style.background = "#fff";
	this.div.style.zIndex = this.BASE_ZINDEX;
	this.div.style.display = 'none';
	this.div.style.width = width + 'px';
	this.div.style.height = height + 'px';
	this.div.style.maxHeight = height + 'px';
	this.div.style.overflowY = 'show';
	this.div.style.position = "absolute";
	this.div.style.top = y +'px';
	this.div.style.left = x + 'px';
  
  var topClass = '';
	if(kbPopUpTopClass==null)
		topClass = 'kbPopupTop '+ prefix +'_kbPopupTop';
	else
		topClass = kbPopUpTopClass +' '+ prefix +'_'+ kbPopUpTopClass;
    
	var m = '<table cellspacing=0 width=100% ><tr id="'+ prefix +'_bar" class="'+ topClass +'"><td width=99% valign=bottom><SPAN id="'+ prefix +'_top"></span></td>';
	m = m + '<td id='+ prefix +'_X align=right valign=middle onmouseover="this.style.cursor=\'pointer\'" style="color:#fff; background:#333; font-weight:bold; font-size:14px; padding:0px 5px; -moz-border-radius-topright: 20px;">x</td></tr>';
	m = m + '</table><table cellspacing=0 width=100% ><tr><td height=100% valign=top class="kbPopMain '+ prefix +'_kbPopMain" colspan=2 id="'+ prefix +'_main"></td></tr></table>';
	document.body.appendChild(this.div);
	this.div.innerHTML = m;
	document.getElementById(prefix+'_X').addEventListener ('click', e_XClose, false);
	this.dragger = new CWinDrag (document.getElementById(prefix+'_bar'), this.div, enableDrag);
  
	this.div.addEventListener('mousedown', e_divClicked, false);
	WinManager.add(prefix, this);
  
	function e_divClicked(){
		t.focusMe();
	}  
	function e_XClose(){
		t.show(false);
		if (t.onClose != null)
			t.onClose();
	}
	function autoHeight(onoff){
		if(onoff)
			t.div.style.height = '';  
		else
			t.div.style.height = t.div.style.maxHeight;
	}
	function focusMe(){
		t.setLayer(5);
		for(var k in uW.cpopupWins){
			if(k != t.prefix)
				uW.cpopupWins[k].unfocusMe();
		}
	}
	function unfocusMe(){
		t.setLayer(-5);
	}
	function getLocation(){
		return {x: parseInt(this.div.style.left), y: parseInt(this.div.style.top)};
	}
	function setLocation(loc){
		t.div.style.left = loc.x +'px';
		t.div.style.top = loc.y +'px';
	}
	function destroy(){
		document.body.removeChild(t.div);
		WinManager.delete (t.prefix);
	}
	function centerMe(parent){
    var coords;
		if(parent == null){
			coords = getClientCoords(document.body);
		}else
			coords = getClientCoords(parent);
		var x = ((coords.width - parseInt(t.div.style.width)) / 2) + coords.x;
		var y = ((coords.height - parseInt(t.div.style.height)) / 2) + coords.y;
		if(x<0)
			x = 0;
		if(y<0)
			y = 0;
		t.div.style.left = x +'px';
		t.div.style.top = y +'px';
	}
	function setEnableDrag (tf){
		t.dragger.setEnable(tf);
	}
	function setLayer(zi){
		t.div.style.zIndex = ''+ (this.BASE_ZINDEX + zi);
	}
	function getLayer(){
		return parseInt(t.div.style.zIndex) - this.BASE_ZINDEX;
	}
	function getTopDiv(){
		return document.getElementById(this.prefix+'_top');
	}
	function getMainDiv(){
		return document.getElementById(this.prefix+'_main');
	}
	function getJQMainDiv(){
		return jQuery('#'+this.prefix+'_main');
	}
	function getMainTopDiv(){
		return document.getElementById(this.prefix+'_top');
	}
	function isShown (){
		return t.div.style.display == 'block';
	}
	function show(tf){
		if (tf){
			t.div.style.display = 'block';
			t.focusMe ();
		} else {
			t.div.style.display = 'none';
		}
		return tf;
	}
	function toggleHide(t){
		if (t.div.style.display == 'block') {
			return t.show (false);
		} else {
			return t.show (true);
		}
	}
}

function CWinDrag(clickableElement, movingDiv, enabled){
	var t=this;
	this.setEnable = setEnable;
	this.setBoundRect = setBoundRect;
	this.debug = debug;
	this.dispEvent = dispEvent;
	this.lastX = null;
	this.lastY = null;
	this.enabled = true;
	this.moving = false;
	this.theDiv = movingDiv;
	this.body = document.body;
	this.ce = clickableElement;
	this.moveHandler = new CeventMove(this).handler;
	this.outHandler = new CeventOut(this).handler;
	this.upHandler = new CeventUp(this).handler;
	this.downHandler = new CeventDown(this).handler;
	this.clickableRect = null;
	this.boundRect = null;
	this.bounds = null;
	this.enabled = false;
	if (enabled == null)
		enabled = true;
	this.setEnable (enabled);

	function setBoundRect (b){    // this rect (client coords) will not go outside of current body
		this.boundRect = boundRect;
		this.bounds = null;
	}

	function setEnable (enable){
		if (enable == t.enabled)
		return;
		if (enable){
			clickableElement.addEventListener('mousedown',  t.downHandler, false);
			t.body.addEventListener('mouseup', t.upHandler, false);
		} else {
			clickableElement.removeEventListener('mousedown', t.downHandler, false);
			t.body.removeEventListener('mouseup', t.upHandler, false);
		}
		t.enabled = enable;
	}

	function CeventDown (that){
		this.handler = handler;
		var t = that;
		function handler (me){
			if (t.bounds == null){
				t.clickableRect = getClientCoords(clickableElement);
				t.bodyRect = getClientCoords(document.body);
				if (t.boundRect == null)
					t.boundRect = t.clickableRect;
				t.bounds = {top:10-t.clickableRect.height, bot:t.bodyRect.height-25, left:40-t.clickableRect.width, right:t.bodyRect.width-25};
			}
			if (me.button==0 && t.enabled){
				t.body.addEventListener('mousemove', t.moveHandler, true);
				t.body.addEventListener('mouseout', t.outHandler, true);
				t.lastX = me.clientX;
				t.lastY = me.clientY;
				t.moving = true;
			}
		}
	}

	function CeventUp  (that){
		this.handler = handler;
		var t = that;
		function handler (me){
			if (me.button==0 && t.moving)
				_doneMoving(t);
		}
	}

	function _doneMoving (t){
		t.body.removeEventListener('mousemove', t.moveHandler, true);
		t.body.removeEventListener('mouseout', t.outHandler, true);
		t.moving = false;
	}

	function CeventOut  (that){
		this.handler = handler;
		var t = that;
		function handler (me){
			if (me.button==0){
				t.moveHandler (me);
			}
		}
	}

	function CeventMove (that){
		this.handler = handler;
		var t = that;
		function handler (me){
			if (t.enabled && !t.wentOut){
				var newTop = parseInt(t.theDiv.style.top) + me.clientY - t.lastY;
				var newLeft = parseInt(t.theDiv.style.left) + me.clientX - t.lastX;
				if (newTop < t.bounds.top){     // if out-of-bounds...
					newTop = t.bounds.top;
					_doneMoving(t);
				} else if (newLeft < t.bounds.left){
					newLeft = t.bounds.left;
					_doneMoving(t);
				} else if (newLeft > t.bounds.right){
					newLeft = t.bounds.right;
					_doneMoving(t);
				} else if (newTop > t.bounds.bot){
					newTop = t.bounds.bot;
					_doneMoving(t);
				}
				t.theDiv.style.top = newTop + 'px';
				t.theDiv.style.left = newLeft + 'px';
				t.lastX = me.clientX;
				t.lastY = me.clientY;
			}
		}
	}

	function debug(msg, e){
		if(Options.debug){
			kb.debug("*************** "+ msg +" ****************");
			kb.debug('clientWidth, Height: '+ e.clientWidth +','+ e.clientHeight);
			kb.debug('offsetLeft, Top, Width, Height (parent): '+ e.offsetLeft +','+ e.offsetTop +','+ e.offsetWidth +','+ e.offsetHeight +' ('+ e.offsetParent +')');
			kb.debug('scrollLeft, Top, Width, Height: '+ e.scrollLeft +','+ e.scrollTop +','+ e.scrollWidth +','+ e.scrollHeight);
		}
	}

	function dispEvent(msg, me){
		if(Options.debug){
			kb.debug(msg + ' Button:'+ me.button +' Screen:'+ me.screenX +','+ me.screenY +' client:'+  me.clientX +','+ me.clientY +' rTarget: '+ me.relatedTarget);
		}
	}
}

function getClientCoords(e){
	if (e==null)
		return {x:null, y:null, width:null, height:null};
	var ret = {x:0, y:0, width:e.clientWidth, height:e.clientHeight};
	while (e.offsetParent != null){
		ret.x += e.offsetLeft;
		ret.y += e.offsetTop;
		e = e.offsetParent;
	}
	return ret;
}

function eventHideShow(){
	if(mainPop.toggleHide(mainPop)){
		tabManager.showTab();
		Options.kbWinIsOpen = true;
	} else {
		tabManager.hideTab();
		Options.kbWinIsOpen = false;
	}
}

function createButton(label,id){
	var a=document.createElement('a');
	a.className='kocbytebutton20';
	a.id = id;
	a.innerHTML='<span style="color: #ff6">'+ label +'</span>';
	return a;
}

function AddMainTabLink(text, eventListener, mouseListener){
	var a = createButton(text,'kocbytebutton');
	a.className='tab';
	var tabs=document.getElementById('main_engagement_tabs');
	if(!tabs){
		tabs=document.getElementById('topnav_msg');
		if(tabs)
			tabs=tabs.parentNode;
	}
	if(tabs){
		var e = tabs.parentNode;
		var gmTabs = null;
		for(var i=0; i<e.childNodes.length; i++){
			var ee = e.childNodes[i];
			if (ee.tagName && ee.tagName=='div' && ee.className=='tabs_engagement' && ee.id!='main_engagement_tabs'){
				gmTabs = ee;
				break;
			}
		}
		if(gmTabs == null){
			gmTabs = document.createElement('div');
			gmTabs.className='tabs_engagement';
			tabs.parentNode.insertBefore(gmTabs, tabs);
			gmTabs.style.whiteSpace='nowrap';
			gmTabs.style.width='735px';
			gmTabs.lang = 'en_KB';
		}
		gmTabs.style.height='0%';
		gmTabs.style.overflow='auto';
		gmTabs.appendChild(a);
		a.addEventListener('click',eventListener, false);
		if(mouseListener != null)
			a.addEventListener('mousedown',mouseListener, true);
		return a;
	}
	return null;
}

Tabs.Mod = {
	tabOrder: 1,
	tabDisabled: false,
	tabLabel: 'Mod',
	myDiv: null,
	timer: null,  
	init: function(div){    // called once, upon script startup
		var t = Tabs.Mod;
		t.myDiv = div;
		
		var str = '<div class="row">';
		str = str + '	<div class="large-12 columns end text-center">';
		
		str = str + '		<button id="'+kb.elemPrefix+'-website-updateinfo"><span>Send Info</span></button><br /><br />';
		str = str + '		<br />';
		
		
		str = str + '	</div>';
		str = str + '</div>';
		
		str = str + '<div class="row">';
		str = str + '	<div class="large-12 columns text-center">';
		str = str + '		<button id="'+kb.elemPrefix+'-main-update">Update</button>&nbsp;v<span id="'+kb.elemPrefix+'-main-version">'+version+'</span><br />';
		str = str + '	</div>';
		str = str + '</div>';
		
		t.myDiv.innerHTML = str;
		
		jQuery('#'+kb.elemPrefix+'-main-update').click(function(){
			AutoUpdater.check(false);
		});
		
		jQuery('#'+kb.elemPrefix+'-website-updateinfo').click(function(){
			kb.sendInfo(1);
		});
		
	},
	hide: function(){         // called whenever the main window is hidden, or another tab is selected
		var t = Tabs.Mod;
	},
	show: function(){         // called whenever this tab is shown
		var t = Tabs.Mod;
	},
};



Tabs.Options = {
	tabOrder: 2,
	tabDisabled: false,
	tabLabel: 'Options',
	myDiv: null,
	timer: null,  
	init: function(div){    // called once, upon script startup
		var t = Tabs.Options;
		t.myDiv = div;
		
		var str = '';
		str = str + '<div class="row">';
		str = str + '	<div class="large-12 columns text-center">';
		str = str + '		Enable AutoUpdate? <input type="checkbox" name="'+kb.elemPrefix+'-options-autoupdate" value="autoupdate" '+((Options.autoUpdate) ? 'checked' : '')+' /><br />';
		str = str + '		Enable Debug? <input type="checkbox" name="'+kb.elemPrefix+'-options-debug" value="debug" '+((Options.debug) ? 'checked' : '')+' /><br />';
		str = str + '	</div>';
		str = str + '</div>';
		
		t.myDiv.innerHTML = str;
		
		jQuery('#'+kb.elemPrefix+'-options-debug').change(function(){
			var value = jQuery(this).is(":checked");
			Options.debug = value;
			kb.saveOptions();
		});
		
		jQuery('#'+kb.elemPrefix+'-options-autoupdate').change(function(){
			var value = jQuery(this).is(":checked");
			Options.autoUpdate = value;
			kb.saveOptions();
		});
		
	},
	hide: function(){         // called whenever the main window is hidden, or another tab is selected
		var t = Tabs.Options;
		kb.saveOptions();
	},
	show: function(){         // called whenever this tab is shown
		var t = Tabs.Options;
	},
};

Tabs.Log = {
	tabOrder: 3,
	tabDisabled: false,
	tabLabel: 'Log',
	myDiv: null,
	timer: null,
	init: function(div){
		var t = Tabs.Log;
		t.myDiv = div;
		
		var str = '';
		str = str + '<div class="row">';
		str = str + '	<div class="large-12 columns">';
		str = str + '		<pre id="'+kb.elemPrefix+'-log-result" style="height:500px;width:1000px;overflow-y:scroll;overflow-x:scroll"><div>Log text goes here</div></pre>';
		str = str + '	</div>';
		str = str + '</div>';
		
		t.myDiv.innerHTML = str;
	},
	hide: function(){         // called whenever the main window is hidden, or another tab is selected
		var t = Tabs.Log;
	},
	show: function(){         // called whenever this tab is shown
		var t = Tabs.Log;
	},
};

Tabs.Debug = {
	tabOrder: 4,
	tabDisabled: false,
	tabLabel: 'Debug',
	myDiv: null,
	timer: null,
	init: function(div){
		var t = Tabs.Debug;
		t.myDiv = div;
		
		var str = '';
		str = str + '<div class="row">';
		str = str + '	<div class="large-12 columns">';
		str = str + '		<pre id="'+kb.elemPrefix+'-debug-result" style="height:500px;width:1000px;overflow-y:scroll;overflow-x:scroll"><div>Debug text goes here</div></pre>';
		str = str + '	</div>';
		str = str + '</div>';
		
		t.myDiv.innerHTML = str;
	},
	hide: function(){
		var t = Tabs.Debug;
	},
	show: function(){
		var t = Tabs.Debug;
	},
};

kb.elemPrefix = 'kb-'+kb.generateRandomNumber(0,65535);
kb.currentUrl = document.location.toString();

if(kb.currentUrl.match('src/main_src.php')){
	kb.init();
}else if(kb.currentUrl.match('apps.facebook.com/kingdomsofcamelot/')){
	kb.init();
}else if(kb.currentUrl.match('kocbyte.axiomaticenigma.com')){
	kb.initSite();
}
console.log(kb.currentUrl);