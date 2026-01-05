// ==UserScript==
// @name           Wall Manager Sidekick (Pot Farm)
// @namespace      Wall Manager Sidekick (Pot Farm)
// @description    Assists Wall Manager with Pot Farm posts
// @exclude        *apps.facebook.com/mypotfarm/*
// @include        http*://thepotfarmgame.com/*
// @include        http*://www.thepotfarmgame.com/*
// @include        http*://www.facebook.com/pages/FB-Wall-Manager/*
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @version        0.0.5
// @copyright      Itshadow
// @downloadURL https://update.greasyfork.org/scripts/5334/Wall%20Manager%20Sidekick%20%28Pot%20Farm%29.user.js
// @updateURL https://update.greasyfork.org/scripts/5334/Wall%20Manager%20Sidekick%20%28Pot%20Farm%29.meta.js
// ==/UserScript==   
(function() {
// @require        http://sizzlemctwizzle.com/updater.php?id=119887&days=1

	// Modified by Merricksdad 12/13/2013
	// *include secure browsing addresses (now required on most facebook servers)
	// *removed sizzle's updater reference
	// *replaced trackback address of appcenter to reqs page
	
	// Update date: 11-03-12 @ 01:55PM
	var version = "0.0.4";// Update date: 05-10-13 @ 04:20PM
	var thisAppID = "272810543124";
	var defaultTO=null;

	function $(ID,root) {return (root||document).getElementById(ID);}

	String.prototype.startsWith = function(s) {return (this.match("^"+s)==s)};

	String.prototype.endsWith = function(s) {return (this.match(s+"$")==s)};

	String.prototype.find = function(s) {return (this.indexOf(s) != -1);};

	String.prototype.contains = function(s) {return (this.indexOf(s) != -1);};

	String.prototype.noSpaces = function(s) {return (this.replace(/\s+/g,''));};

	String.prototype.upperWords = function(s) {return (this+'').replace(/^(.)|\s(.)/g, function($1){return $1.toUpperCase();});};

	Array.prototype.swap = function (x,y) {var b = this[x];this[x] = this[y];this[y] = b;return this;};

	Array.prototype.inArray = function(value) {for(var i=this.length-1; i>=0; i--) {if(this[i]==value) return true;} return false;};

	String.prototype.safeContent = function(src){
		return src.replace(new RegExp("(<!--.*?(?=-->)-->)|(<[ \n\r]*style[^>]*>.*?<[ \n\r]*/style[^>]*>)|(<[ \n\r]*script[^>]*>.*?<[ \n\r]*/script[^>]*>)|(<(?:.|\s)*?>)", 'gi'),'');
	}

	//sorts an array in such a way as to prevent
	//finding pea before peanut, or pea before english pea, and then effectively swapping their order
	//now also finds ash in cashew and places ash after cashew
	Array.prototype.fixOrder = function(){
		if (this.length>1) for (var i=this.length-1;i>0;i--) {
			for (var i2=i-1;i2>0;i2--){
				if (this[i].toLowerCase().contains(this[i2].toLowerCase())){
					var b=this[i];
					this[i]=this[i2];
					this[i2]=b;
					b=null;
				}
			}
		}
		return this;
	};

	//reconstruct an array, turning it into definitions using a prefix
	Array.prototype.toDefinitions = function(prefix){
		if (this) for (var i=0;(this[i]);i++) this[i]=prefix+this[i].noSpaces().toLowerCase();
		return this;
	};

	//returns the merge of any number of JSON objects
	//pass JSON objects as comma separated parameters
	//var newJSON = mergeJSON(a,b,c...n)
	//note: overwrites preexisting entries from earlier passed objects
	function mergeJSON () {
		var ret = {};
		for (var a=0,len=arguments.length;a<len;a++) for (var v in arguments[a]) ret[v] = arguments[a][v];
      		return ret;
	};

	//short form for evaluate
	//returns a snapshot object
	function selectNodes(xPath,params){
		params=(params||{});
		return (params['doc']||document).evaluate(xPath,(params['node']||document),null,(params['type']||6),null);
	};

	//short form for evaluate with single node return
	//returns the actual node, not the snapshot
	function selectSingleNode(xPath,params){
		params=params||{}; params['type']=9;
		return selectNodes(xPath,params).singleNodeValue;
	};

	//clicks an object using the mouse
	//does not run default actions like opening links
	function click(e) {
		if(!e && typeof e=='string') e=document.getElementById(e);
		if(!e) return;
		var evObj = e.ownerDocument.createEvent('MouseEvents');
		evObj.initMouseEvent("click",true,true,e.ownerDocument.defaultView,0,0,0,0,0,false,false,false,false,0,null);
		e.dispatchEvent(evObj);
	};

	// Created by avg, modified by JoeSimmons. shortcut to create an element
	function createElement(a,b,c) {
		if(a=="text") {return document.createTextNode(b);}
		var ret=document.createElement(a.toLowerCase());
		if(b) for(var prop in b) if(prop.indexOf("on")==0) ret.addEventListener(prop.substring(2),b[prop],false);
		else if(",style,accesskey,id,name,src,href,which,rel,action,method,value,data-ft".indexOf(","+prop.toLowerCase())!=-1) ret.setAttribute(prop.toLowerCase(), b[prop]);
		else ret[prop]=b[prop];
		if(c) c.forEach(function(e) { ret.appendChild(e); });
		return ret;
	};

	//sidekick ability to pass information via hash parameter
	function setHashParam(p,v){
		var h = unsafeWindow.top.location.hash;
		var params = h.split('&');
		var found=false;
		if (params.length) for (var x=0;x<params.length && !found;x++){
			var p1 = params[x].split('=')[0];
			var v1 = params[x].split('=')[1];
			if (p1 == p) {
				params[x]=p+'='+v;
				found=true;
			}
		}
		if (!found) params[params.length]=p+'='+v;
		h=params.join('&');
		unsafeWindow.top.location.hash = h;
	};

	function sendMessage(s){
		//top.location.href = 'http*://apps.facebook.com/?#status=' + s;
		top.location.href = 'http*://www.facebook.com/reqs.php?#status=' + s;
		return;
	};

	function dock(){
		//check that dock exists
		var door=$('wmDock');
		if (!door) {
			//cannot find dock
			window.setTimeout(dock, 1000);
			return;
		} 

		//check that the dock does not already have us listed
		var doorMark=$('wmDoor_app272810543124');
		if (doorMark) return; //already posted to door

		var attachment={
			appID:'272810543124',
			synAppID:['222727414408240'],
			addFilters:[{
					appID:'222727414408240',
					name:'Blaze Runner',
					icon:'http*://profile.ak.fbcdn.net/hprofile-ak-snc4/277133_222727414408240_8023392_q.jpg'
			}],

			alias:'PF',
			hrefKey:'ktf', //such as sendkey
			name:'Pot Farm', //how you want it to display
			thumbsSource:'www.thepotfarmgame.com',
			flags:{httpsTrouble:true,requiresTwo:false,skipResponse:false,alterLink:true},
			icon:"http*://photos-h.ak.fbcdn.net/photos-ak-snc1/v43/84/272810543124/app_2_272810543124_3370.gif",
			desc:"Pot Farm Sidekick ("+version+") w/ Blade Runner support",

			/*alterLink:{
				find:"(www\.thepotfarmgame\.com|apps\.facebook\.com/mypotfarm)",
				isRegex:true,
				replace:'thepotfarmgame.com/potfarm',
			},*/
			alterLink:{
				find:"(www\.thepotfarmgame\.com)",
				isRegex:true,
				replace:'apps.facebook.com/mypotfarm',
			},

			accText: {

//MOOCH ITEMS
_surpriseseed:"Surprise Seed",
_mysteryseed:"Mystery Seed",
_raremysteryseed:"Rare Mystery Seed",
_themeplant:"Theme Plant",
_4xthemeplant:"4x Theme Plant",
_9xthemeplant:"9x Theme Plant",
_1xnonthemeplant:"1x Non-Theme Plant",
_4xnonthemeplant:"4x Non-Theme Plant",
_9xnonthemeplant:"9x Non-Theme Plant",
_1xplant:"1x Plant",
_4xplant:"4x Plant",
_9xplant:"9x Plant",
_20xplant:"20x Plant",
_cultists:"Cultists",
_guano:"Guano",
_product:"Product",
_hashmix:"Hash Mix",
_bankersbud:"Bankers Bud",
_doctor:"The Doctor",
_variable:"Variable seed",
_puffpuff:"Puff Puff Pass",
_potheads:"Pot Heads",
//MOOCH ITEMS
			},
			tests: [
				{link:"Get a Surprise Seed!", ret:"_surpriseseed"},
				{link:"Get a Mystery Seed!", ret:"_mysteryseed"},
				{link:"Get a RARE Mystery Seed!", ret:"_raremysteryseed"},
				{link:"Get Theme Plant!", ret:"_themeplant"},
				{link:"Get cultists!", ret:"_cultists"},
				{link:"Get 4x Theme Plant!", ret:"_4xthemeplant"},
				{link:"Get 9x Theme Plant!", ret:"_9xthemeplant"},
				{link:"Get 1x Non-Theme Plant!", ret:"_1xnonthemeplant"},
				{link:"Get 4x Non-Theme Plant!", ret:"_4xnonthemeplant"},
				{link:"Get 9x Non-Theme Plant!", ret:"_9xnonthemeplant"},
				{link:"Get 1x Plant!", ret:"_1xplant"},
				{link:"Get 4x Plant!", ret:"_4xplant"},
				{link:"Get 9x Plant!", ret:"_9xplant"},
				{link:"Get 20x Plant!", ret:"_20xplant"},
				{link:"Get some Guano!", ret:"_guano"},
				{link:"Grab a Product!", ret:"_product"},
				{link:"Get Hash Mix!", ret:"_hashmix"},
				{link:"Get Banker's Bud!", ret:"_bankersbud"},
				{link:"Get The Doctor!", ret:"_doctor"},
				{link:"Get a Variable Seed!", ret:"_variable"},
				{link:"Get a Puff Puff Pass!", ret:"_puffpuff"},
				{link:"Get some Pot Heads!", ret:"_potheads"},

//MOOCH ITEMS
			],

			menu: {
				SSsection_main:{type:"section",label:"Pot Farm Feed Options ("+version+")",kids:{
//MOOCH ITEMS
					SSseeds:{type:"separator",label:"Seeds",kids:{
						seedstab0:{type:'tab',label:"Rewards",kids:{
							mseedsBlock:{type:'optionblock',label:"Gifts:",kids:{
								_surpriseseed:{type:"checkbox",label:"Surprise Seed"},
								_mysteryseed:{type:"checkbox",label:"Mystery Seed"},
								_raremysteryseed:{type:"checkbox",label:"Rare Mystery Seed"},
								_themeplant:{type:"checkbox",label:"Theme Plant"},
								_4xthemeplant:{type:"checkbox",label:"4x Theme Plant"},
								_9xthemeplant:{type:"checkbox",label:"9x Theme Plant"},
								_1xnonthemeplant:{type:"checkbox",label:"1x Non-Theme Plant"},
								_4xnonthemeplant:{type:"checkbox",label:"4x Non-Theme Plant"},
								_9xnonthemeplant:{type:"checkbox",label:"9x Non-Theme Plant"},
								_1xplant:{type:"checkbox",label:"1x Plant"},
								_4xplant:{type:"checkbox",label:"4x Plant"},
								_9xplant:{type:"checkbox",label:"9x Plant"},
								_20xplant:{type:"checkbox",label:"20x Plant"},
								_cultists:{type:"checkbox",label:"Cultists"},
								_guano:{type:"checkbox",label:"Guano"},
								_product:{type:"checkbox",label:"Product"},
								_hashmix:{type:"checkbox",label:"Hash Mix"},
								_bankersbud:{type:"checkbox",label:"Bankers Bud"},
								_doctor:{type:"checkbox",label:"The Doctor"},
								_variable:{type:"checkbox",label:"Variable Seed"},
								_puffpuff:{type:"checkbox",label:"Puff Puff Pass"},
								_potheads:{type:"checkbox",label:"Pot Heads"},
							}},
						}},
					}},
				}},
			}
		};

		attString=JSON.stringify(attachment);
		door.appendChild(createElement('div',{id:'wmDoor_app'+thisAppID,'data-ft':attString}));
		attachment=null;attString=null;
		window.setTimeout(function(){click(door);},1000);
	};

	//main script function
	function run(){
		var href = window.location.href;
		var text = document.documentElement.textContent;
		text = text.safeContent(text);
		var thisLoc; (thisLoc=(location.protocol+"//"+location.host+location.pathname).split("/")).pop(); thisLoc=thisLoc.join("/");

		//*************************************************************************************
		//***** this section must be tailored to fit your specific needs                  *****
		//***** below is a list of searches for text pertaining to various messages       *****
		//***** the list below is not generic and targets Empires and Allies specifically *****
		//***** you will need to find the specific texts for the game you selected        *****
		//*************************************************************************************
		//***** The WM script can recieve and act on the following statusCode values:     *****
		/*
			  1: Acceptance, no stipulations
			  0: Unknown return, use this only if your script encounters unplanned results and can still communicate a result
			 -1: Failure, generic
			 -2: Failure, none left
			 -3: Over Gift Limit failure
			 -4: Over Gift Limit, still allows sending gift, marked as accepted
			 -5: Identified server error
			 -6: Already got, failure marked as accepted
			 -7: Identified server down for repairs
			 -8: Problem finding a required action link
			 -9: reserved for WM functions
			-10: reserved for WM functions
			-11: Identified as expired
			-12: Post source is not a neighbor and neighbor status is required. Future WM version will auto-add neighbor if possible.

			//additional codes may now exist, please check the wiki support site for information
		*/
		//*************************************************************************************

		if (window.location.host=='www.facebook.com') {
			dock();
			return;
		}
		else if (href.startsWith(thisLoc+'/gifts.php')) {
			// Catch and stop the script on the gift page, it contains all the test strings
			// used in this script and can return a false positive, or a "Something is wrong with the link"
			// responce
			return false; 
		}
		else if (text.match(/invalid|wrong/gi)) {
			// Generic "This is an invalid link, Please Contact the Devs" link...
			// Something is wrong with the link
			sendMessage('-5');
			return;
		}
		else if (href.startsWith(thisLoc+'/claimViralReward.php')) {
			if (text.find('You totally scored')) {
				sendMessage('1');
				return;
			}
			else if (text.find('more than once')) {
				sendMessage('-6');
				return;
			}
			else if (text.find('reached today')) {
				sendMessage('-3');
				return;
			}
			else if (text.find('all been claimed')) {
				sendMessage('-2');
				return;
			}
			else if (text.find('same link')) {
				sendMessage('-1');
				return;
			}
		}
		//https://apps.facebook.com/mypotfarm/maintenance.php
		else if (href.startsWith(thisLoc+'/maintenance.php')) {
			sendMessage('-7');
			return;
		}
	}
	//start the script
	window.setTimeout(run,500);

})(); // anonymous function wrapper end
