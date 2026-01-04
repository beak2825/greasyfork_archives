// ==UserScript==
// @name        DSporter
// @namespace   DSporter
// @icon			https://images2.imgbox.com/90/a1/t71GLzrS_o.jpg
// @description      KOC Auto Port for those who need to get out of a tight jam on !
// @include			*.rycamelot.com/*main_src.php*
// @include			*.beta.rycamelot.com/*main_src.php*
// @include			*apps.facebook.com/kingdomsofcamelot/*
// @include			*.rockyou.com/rya/*
// @include			*.koc-cdn.popreach.com*
// @connect			*
// @connect			greasyfork.org
// @grant	      unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_log
// @grant       GM_registerMenuCommand
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @version		4.0.4
// @copyright       Copyright 2013-2021 KSA CodeSphere - Non-commercial use only. No modifications permitted.
// @license			 	http://creativecommons.org/licenses/by/4.0/
// @downloadURL https://update.greasyfork.org/scripts/408275/DSporter.user.js
// @updateURL https://update.greasyfork.org/scripts/408275/DSporter.meta.js
// ==/UserScript==
//	*********************************************************************************************************
//	*	                         In Hounour Of Mark Branscombe(TCO) & Neo AutoPort                      *
//	*	                   That Paved The Way For Scripts Like These Thanks Mark You Rock!!             *                                                              
//	*	            "Parts of this script use code created by Mark Branscombe & used with his           *
//	*                 explicit permission. We thank you for your generosity Mark Branscombe"                *
//	*	                                            							*
//	*                                                														 
//      *
//	*********************************************************************************************************



var JSON2 = JSON; 
var DSportermainPop;
var Tabs = {};
var Cities = {};
var DEBUG_TRACE = false;
var UID = 0;
var dlgHeight = 630;
var dlgWidth = 400;
var Version = "4.0.4";
GM_addStyle("._10.uiLayer._4-hy._3qw {display: none;}"); 
var AutoPort = {
    DSporterPassword: "",
    DSporterSarcasm: false,
    DSporterSarcasmContent: "See Ya!",
    DSporterWarning: false,
    DSporterWarningContent: "I'm Being Attacked/Scouted, Attempting To Autoport!",
    DSporterMessage: false,
    DSporterRefuge: true,
    DSporterOrder: false,
    DSporterThresholdAttack: 10000,
    DSporterThresholdScout: 10,
    DSporterRecheck: 10,
    DSporterCitiesAttack: {0:false,1:false,2:false,3:false,4:false,5:false,6:false,7:false},
    DSporterCitiesScout: {0:false,1:false,2:false,3:false,4:false,5:false,6:false,7:false}
};

function setCities(){
  Cities.numCities = unsafeWindow.seed.cities.length;
  Cities.cities = [];
  Cities.byID = {};
  for (i=0; i < Cities.numCities; i++){
    city = {};
    city.idx = i;
    city.id = parseInt(unsafeWindow.seed.cities[i][0]);
    city.name = unsafeWindow.seed.cities[i][1];
    city.x = parseInt(unsafeWindow.seed.cities[i][2]);
    city.y = parseInt(unsafeWindow.seed.cities[i][3]);
    city.tileId = parseInt(unsafeWindow.seed.cities[i][5]);
    city.provId = parseInt(unsafeWindow.seed.cities[i][4]);
    Cities.cities[i] = city;
    Cities.byID[unsafeWindow.seed.cities[i][0]] = city;
  }
}

setCities();

var DSporterWinManager = {
	wins : {},    // prefix : DSporterCPopup obj

	get : function (prefix){
		var t = DSporterWinManager;
		return t.wins[prefix];
	},
  
	add : function (prefix, pop){
		var t = DSporterWinManager;
		t.wins[prefix] = pop;
		if (unsafeWindow.cpopupWins == null)
			unsafeWindow.cpopupWins = {};
		unsafeWindow.cpopupWins[prefix] = pop;
	},
  
	delete : function (prefix){
		var t = DSporterWinManager;
		delete t.wins[prefix];
		delete unsafeWindow.cpopupWins[prefix];
	}    
}

function DSporterCPopup(prefix, x, y, width, height, enableDrag, onClose) {
	var pop = DSporterWinManager.get(prefix);
	if (pop) {
		pop.show(false);
		return pop;
	}
	this.BASE_ZINDEX = 111111;
	this.show = show;
	this.toggleHide = toggleHide;
	this.getTopDiv = getTopDiv;
	this.getMainDiv = getMainDiv;
	this.getLayer = getLayer;
	this.setLayer = setLayer;
	this.setEnableDrag = setEnableDrag;
	this.getLocation = getLocation;
	this.setLocation = setLocation;
	this.focusMe = focusMe;
	this.unfocusMe = unfocusMe;
	this.centerMe = centerMe;
	this.destroy = destroy;
	this.div = document.createElement('div');
	this.prefix = prefix;
	this.onClose = onClose;
	var t = this;
	this.div.className = 'DSporterCPopup ' + prefix + '_CPopup';
	this.div.id = prefix + '_outer';
	this.div.style.background = "#fff";
	this.div.style.zIndex = this.BASE_ZINDEX // KOC modal is 100210 ?
	this.div.style.display = 'none';
	this.div.style.width = width + 'px';
	this.div.style.height = height + 'px';
	this.div.style.position = "absolute";
	this.div.style.top = y + 'px';
	this.div.style.left = x + 'px';
	topClass = 'DSCPopupTop ' + prefix + '_DSCPopupTop';
	var m = '<TABLE cellspacing=0 width=100% height=100%><TR id="' + prefix + '_bar" class="' + topClass + '"><TD style="-moz-border-radius-topleft: 20px; border-top-left-radius: 20px;" width=99%><SPAN id="'+ prefix +'_top"></span></td>\
      <TD id=' + prefix + '_X align=right valign=middle onmouseover="this.style.cursor=\'pointer\'" style="color:#fff; background:#000; font-weight:bold; font-size:14px; padding:0px 5px;  -moz-border-radius-topright: 20px; border-top-right-radius: 20px;">X</td></tr>\
      <TR><TD height=100% valign=top class="DSCPopMain' + prefix + '_CPopMain" colspan=2 id="' + prefix + '_main"></td></tr></table>';
	document.body.appendChild(this.div);
	this.div.innerHTML = m;
	document.getElementById(prefix + '_X').addEventListener('click', e_XClose, false);
	this.dragger = new DSporterCWinDrag(document.getElementById(prefix + '_bar'), this.div, enableDrag);
	this.div.addEventListener('mousedown', e_divClicked, false);
	DSporterWinManager.add(prefix, this);

	function e_divClicked() {
		t.focusMe();
	}

	function e_XClose() {
		t.show(false);
		if (t.onClose != null)
			t.onClose();
	}

	function focusMe() {
		t.setLayer(5);
		for (k in unsafeWindow.cpopupWins) {
			if (k != t.prefix)
				unsafeWindow.cpopupWins[k].unfocusMe();
		}
	}

	function unfocusMe() {
		t.setLayer(-5);
	}

	function getLocation() {
		return {
			x: parseInt(this.div.style.left),
			y: parseInt(this.div.style.top)
		};
	}

	function setLocation(loc) {
		t.div.style.left = loc.x + 'px';
		t.div.style.top = loc.y + 'px';
	}

	function destroy() {
		document.body.removeChild(t.div);
		DSporterWinManager.delete(t.prefix);
	}

	function centerMe(parent) {
		if (parent == null) {
			var coords = getClientCoords(document.body);
		} else
			var coords = getClientCoords(parent);
		var x = ((coords.width - parseInt(t.div.style.width)) / 2) + coords.x;
		var y = ((coords.height - parseInt(t.div.style.height)) / 2) + coords.y;
		if (x < 0)
			x = 0;
		if (y < 0)
			y = 0;
		t.div.style.left = x + 'px';
		t.div.style.top = y + 'px';
	}

	function setEnableDrag(tf) {
		t.dragger.setEnable(tf);
	}

	function setLayer(zi) {
		t.div.style.zIndex = '' + (this.BASE_ZINDEX + zi);
	}

	function getLayer() {
		return parseInt(t.div.style.zIndex) - this.BASE_ZINDEX;
	}

	function getTopDiv() {
		return document.getElementById(this.prefix + '_top');
	}

	function getMainDiv() {
		return document.getElementById(this.prefix + '_main');
	}

	function show(tf) {
		if (tf) {
			t.div.style.display = 'block';
			t.focusMe();
		} else {
			t.div.style.display = 'none';
		}
		return tf;
	}

	function toggleHide(t) {
		if (t.div.style.display == 'block') {
			return t.show(false);
		} else {
			return t.show(true);
		}
	}
}

function DSporterCWinDrag (clickableElement, movingDiv, enabled) {
	var t=this;
	this.setEnable = setEnable;
	this.setBoundRect = setBoundRect;
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
}

function getClientCoords(e) {
	if (e == null)
		return {
			x: null,
			y: null,
			width: null,
			height: null
		};
	var x = 0,
		y = 0;
	ret = {
		x: 0,
		y: 0,
		width: e.clientWidth,
		height: e.clientHeight
	};
	while (e.offsetParent != null) {
		ret.x += e.offsetLeft;
		ret.y += e.offsetTop;
		e = e.offsetParent;
	}
	return ret;
}

var DSportertabManager = {
	tabList : {},           // {name, obj, div}
	currentTab : null, 
	init : function (mainDiv){
		var t = DSportertabManager;
		var sorter = [];
		for (k in Tabs){
			if (!Tabs[k].tabDisabled){  
				t.tabList[k] = {};
				t.tabList[k].name = k;
				t.tabList[k].tabColor = Tabs[k].tabColor?Tabs[k].tabColor:'blue';
				t.tabList[k].obj = Tabs[k];
				if (Tabs[k].tabLabel != null)
					t.tabList[k].label = Tabs[k].tabLabel;
				else
					t.tabList[k].label = k;
				if (Tabs[k].tabOrder != null)
					sorter.push([Tabs[k].tabOrder, t.tabList[k]]);
				else
					sorter.push([1000, t.tabList[k]]);
				t.tabList[k].div = document.createElement('div');
			}
		}

		sorter.sort (function (a,b){return a[0]-b[0]});
		var m = '';		
		m += '<center><TABLE><TR>';
		for (var i=0; i<sorter.length; i++) {
			var color = sorter[i][1].tabColor;
			m += '<TD align=center ><A id=nttc'+ sorter[i][1].name +' class="buttonv2 h20 '+color+'"><SPAN>'+ sorter[i][1].label +'</span></a></td>';
			if ((i+1)%9 == 0) m+='</tr><TR>';
		}
		m+='</tr></table></center>';  			
		DSportermainPop.getTopDiv().innerHTML = m;   
		var contentDiv = document.createElement('div');
		contentDiv.id = 'DSporterMain_content';
		mainDiv.appendChild(contentDiv);		
		for (k in t.tabList) {
			document.getElementById('nttc'+ k).addEventListener('click', this.e_clickedTab, false);
			var div = t.tabList[k].div;
			div.style.display = 'none';
			div.style.height = '100%';
			contentDiv.appendChild(div);
			try {
				t.tabList[k].obj.init(div);
			} catch (e){
				div.innerHTML = "INIT ERROR: "+ e;
			}
		}
    
		if (t.currentTab == null)
			t.currentTab = sorter[0][1];    
		t.currentTab.div.style.display = 'block';
	},
  
	hideTab : function (){
		var t = DSportertabManager;
		t.currentTab.obj.hide();
	},
  
	showTab : function (){
		var t = DSportertabManager;
		t.currentTab.obj.show();
	},
    
	setTabStyle : function (Tab, selected){
		var e = document.getElementById ('nttc'+ Tab.name)
		var c = Tab.tabColor?Tab.tabColor:"blue";
		if (selected){
			e.className = 'buttonv2 h20 green';
		} else {
			e.className = 'buttonv2 h20 '+c;
		}
	},
	
	e_clickedTab : function (e){
		var t = DSportertabManager;
		DSportermainPop.show (true);
		if (e.target.id)
			var newTab = t.tabList[e.target.id.substring(4)];
		else
			var newTab = t.tabList[e.target.parentNode.id.substring(4)];
		if (t.currentTab.name != newTab.name){
			t.setTabStyle (t.currentTab, false);
			t.setTabStyle (newTab, true);
			t.currentTab.obj.hide ();
			t.currentTab.div.style.display = 'none';
			t.currentTab = newTab;
			newTab.div.style.display = 'block';
		}
		newTab.obj.show();
	},

}

function eventHideShow() {
	if (DSportermainPop.toggleHide(DSportermainPop)) {
		DSportertabManager.showTab();
	} else {
		DSportertabManager.hideTab();
	}
}

function AddMainTabLink(text, eventListener, mouseListener) {
	var a = document.createElement('a');
	a.className = 'button20';
	a.innerHTML = '<span style="color: #ff6">' + text + '</span>';
	a.className = 'tab';
	var tabs = document.getElementById('main_engagement_tabs');
	if (!tabs) {
		tabs = document.getElementById('topnav_msg');
		if (tabs)
			tabs = tabs.parentNode;
	}
	if (tabs) {
		var e = tabs.parentNode;
		var gmTabs = null;
		for (var i = 0; i < e.childNodes.length; i++) {
			var ee = e.childNodes[i];      
			if (ee.tagName && ee.tagName == 'DIV' && ee.className == 'tabs_engagement' && ee.id != 'main_engagement_tabs') {
				gmTabs = ee;
				break;
			}
		}
		if (gmTabs == null) {
			gmTabs = document.createElement('div');
			gmTabs.className = 'tabs_engagement';
			tabs.parentNode.insertBefore(gmTabs, tabs);
			gmTabs.style.whiteSpace = 'normal';
			gmTabs.style.width = '735px';
		}
		gmTabs.style.height = '0%';
		gmTabs.style.overflow = 'auto';
		if (gmTabs.firstChild)
			gmTabs.insertBefore(a, gmTabs.firstChild);
		else
			gmTabs.appendChild(a);
		a.addEventListener('click', eventListener, false);
		if (mouseListener != null)
			a.addEventListener('mousedown', mouseListener, true);
		return a;
	}
	return null;
}

var attacking = unsafeWindow.g_js_strings.commonstr.attacking;
var scouting = unsafeWindow.g_js_strings.commonstr.scouting;

function sendChat (msg){
  document.getElementById("mod_comm_input").value = msg;
  unsafeWindow.Chat.sendChat ();
}

function sendComposedMail (sendTo, subject, msg) {
    var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
    params.emailTo = sendTo;
    params.subject = subject;
    params.message = msg;
    params.requestType = "COMPOSED_MAIL";
    new AjaxRequest(unsafeWindow.g_ajaxpath + "ajax/getEmail.php" + unsafeWindow.g_ajaxsuffix, {
        method:"post",
        parameters:params,
        onSuccess:function(message){
        },
        onFailure:function(){
        }
    })
}

function inspect(obj, maxLevels, level, doFunctions){
    var str = '', type, msg;
    if(level == null)  level = 0;
    if(maxLevels == null) maxLevels = 1;
    if(maxLevels < 1)
        return 'Inspect Error: Levels number must be > 0';
    if(obj == null)
        return 'ERROR: Object is NULL\n';
    var indent = '';
    for (var i=0; i<level; i++)
        indent += '  ';
    for(property in obj) {
        try {
            type =  matTypeof(obj[property]);
            if (doFunctions==true && (type == 'function')){
                str += indent + '(' + type + ') ' + property + "[FUNCTION]\n";
            } else if (type != 'function') {
                str += indent + '(' + type + ') ' + property + ( (obj[property]==null)?(': null'):('')) +' = '+ obj[property] +"\n";
            }
            if((type=='object' || type=='array') && (obj[property] != null) && (level+1 < maxLevels))
                str += inspect(obj[property], maxLevels, level+1, doFunctions);  // recurse
        }
        catch(err) {
            // Is there some properties in obj we can't access? Print it red.
            if(typeof(err) == 'string') msg = err;
            else if(err.message)        msg = err.message;
            else if(err.description)    msg = err.description;
            else                        msg = 'Unknown';
            str += '(Error) ' + property + ': ' + msg +"\n";
        }
    }
    str += "\n";
    return str;
}

function logit (msg) {
    var now = new Date();
    GM_log (getServerId() +' @ '+ now.toTimeString().substring (0,8) +'.' + now.getMilliseconds() +': '+  msg);
}

function RefreshCamelot() {  //This piece of code was taken from KoC Power BOT.  All credit goes to them for this piece.  Thanks guys/gals!
    var serverId = getServerId();
    var goto = window.location.protocol + '//apps.facebook.com/kingdomsofcamelot/?s=' + serverId;
    if (document.URL.match(/standalone=1/i)) {
        goto = window.location.protocol + '//apps.facebook.com/kingdomsofcamelot/?s=' + serverId;
    };
    setTimeout (function (){window.top.location = goto;}, 0);
}

    setInterval(function () { checkAutoPort() }, (AutoPort.DSporterRecheck * 1000));

    function checkAutoPort() {
        if (AutoPort.DSporterRefuge || AutoPort.DSporterOrder) {
            for (var attacks in unsafeWindow.seed.queue_atkinc) {
                var thisAttack = unsafeWindow.seed.queue_atkinc[attacks];
                for (i = 0; i < Cities.numCities; i++) {
                    var city = unsafeWindow.seed.cities[i];
                    if (city[0] == thisAttack.toCityId && city[5] == thisAttack.toTileId) {
                        if (thisAttack["unts"]) {
                            var troops_in_march = '';
                            var units = 0;
                            for (var ui in unsafeWindow.cm.UNIT_TYPES) {
                                if (thisAttack["unts"]["u" + unsafeWindow.cm.UNIT_TYPES[ui]]) {
                                    units += parseInt(thisAttack["unts"]["u" + unsafeWindow.cm.UNIT_TYPES[ui]]);
                                    troops_in_march += parseInt(thisAttack["unts"]["u" + unsafeWindow.cm.UNIT_TYPES[ui]]) + ' ' + unsafeWindow.unitcost['unt' + unsafeWindow.cm.UNIT_TYPES[ui]][0] + ' : ';
                                }
                            }
                            var attackerName = unsafeWindow.seed.players['u' + thisAttack.pid].n;
                            var attack_msg = ' by ' + attackerName + ' from (' + thisAttack.fromXCoord + ',' + thisAttack.fromYCoord + ') using [ : ' + troops_in_march + ']';
                            if (thisAttack.marchType == 4 && units >= parseInt(AutoPort.DSporterThresholdAttack) && AutoPort.DSporterCitiesAttack[i]) {  //attack
                                attack_msg = city[1] + ' at (' + city[2] + ',' + city[3] + ') attacked' + attack_msg;
                                if (AutoPort.DSporterRefuge) {
                                    PortOfRefugeCity(i, thisAttack.pid, attack_msg);
                                    return;
                                } else {
                                    PortOfOrderCity(i, thisAttack.pid, attack_msg);
                                    return;
                                }
                            } else if (thisAttack.marchType == 3 && units >= parseInt(AutoPort.DSporterThresholdScout) && AutoPort.DSporterCitiesScout[i]) {  //scout
                                attack_msg = city[1] + ' at (' + city[2] + ',' + city[3] + ') scouted' + attack_msg;
                                if (AutoPort.DSporterRefuge) {
                                    PortOfRefugeCity(i, thisAttack.pid, attack_msg);
                                    return;
                                } else {
                                    PortOfOrderCity(i, thisAttack.pid, attack_msg);
                                    return;
                                }
                            } else { //other
                            }
                        }
                    }
                }
            }
        }
    }

    function PortOfRefugeCity(citynum, pid, portmsg) {
        var portParameters = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
        portParameters.pf = 0;
        portParameters.iid = 911;
        portParameters.cid = unsafeWindow.seed.cities[citynum][0];
        portParameters.pid = Math.floor((Math.random() * (24)) + 1);
        var path = unsafeWindow.g_ajaxpath + "ajax/relocate.php" + unsafeWindow.g_ajaxsuffix;
        new MyAjaxRequest(path, { method: "post", parameters: portParameters, onSuccess: function (rslt) {
            if (rslt.ok) {
                if (AutoPort.DSporterWarning) sendChat('/a AUTOPORT AUTOREPLY: ' + AutoPort.DSporterWarningContent);
                if (AutoPort.DSporterSarcasm) sendChat('/' + unsafeWindow.seed.players['u' + pid].n + ' ' + AutoPort.DSporterSarcasmContent);
                if (AutoPort.DSporterMessage) sendComposedMail(unsafeWindow.seed.player.name, "AUTOPORT USED", portmsg);
                setTimeout(function () { RefreshCamelot(); }, 1000); 
            } else {
                sendComposedMail(unsafeWindow.seed.player.name, "PORT FAILED", 'Code ' + rslt.error_code + ': ' + rslt.msg);
            };
        }, onFailure: function (rslt) {
        } 
        });
    }

    function GetPortBlock() {
        var province = 13;
        while (province == 13) province = Math.floor((Math.random() * 25) + 1);
        var x_off = 150 - ((Math.floor((Math.random() * 10))) * 15);
        var y_off = 150 - ((Math.floor((Math.random() * 10))) * 15);

        var x_multiplier = (province % 5) == 0 ? 5 : province % 5;
        var y_multiplier = (province % 5) == 0 ? 1 : (((province - (province % 5)) / 5) + 1);

        var xx = 150 * x_multiplier;
        var yy = 150 * y_multiplier;

        var xxx = xx - x_off < 0 ? 750 - xx - x_off : xx - x_off;
        var yyy = yy - y_off < 0 ? 750 - yy - y_off : yy - y_off;

        yyy = yyy > 750 ? 750 : yyy;
        xxx = xxx > 750 ? 750 : xxx;

        if (xxx >= 300 && xxx < 450 && yyy >= 300 && yyy < 450) {
            xxx = 150;
            yyy = 150;
        }

        return "bl_" + xxx + "_bt_" + yyy;
    };

    function PortOfOrderCity(citynum, pid, portmsg) {
        var blockString = GetPortBlock();
        var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
        params.blocks = blockString;
        new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/fetchMapTiles.php" + unsafeWindow.g_ajaxsuffix, {
            method: "post",
            parameters: params,
            onSuccess: function (rslt) {
                if (rslt.ok) {
                    var tcoMapData = rslt.data;
                    for (tile in tcoMapData) {
                        if (parseInt(tcoMapData[tile].tileType) == 50  && (!tcoMapData[tile].tileUserId || tcoMapData[tile].tileUserId==0 || tcoMapData[tile].tileUserId=="0")) {
                            var portParameters = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
                            portParameters.pf = 0;
                            portParameters.iid = 912;
                            portParameters.cid = unsafeWindow.seed.cities[citynum][0];
                            portParameters.xcoord = tcoMapData[tile].xCoord;
                            portParameters.ycoord = tcoMapData[tile].yCoord;
                            var path = unsafeWindow.g_ajaxpath + "ajax/relocate.php" + unsafeWindow.g_ajaxsuffix;
                            new MyAjaxRequest(path, {
                                method: "post",
                                parameters: portParameters,
                                onSuccess: function (rslt) {
                                    if (rslt.ok) {
                                        if (AutoPort.DSporterWarning) sendChat('/a AUTOPORT AUTOREPLY: ' + AutoPort.DSporterWarningContent);
                                        if (AutoPort.DSporterSarcasm) sendChat('/' + unsafeWindow.seed.players['u' + pid].n + ' ' + AutoPort.DSporterSarcasmContent);
                                        if (AutoPort.DSporterMessage) sendComposedMail(unsafeWindow.seed.player.name, "AUTOPORT USED", portmsg);
                                        setTimeout(function () { RefreshCamelot(); }, 1000); 
                                    } else {
                                        if (rslt.error_code == 104) {
                                            setTimeout(function () { PortOfOrderCity(citynum, pid, portmsg); }, 0);
                                            return;
                                        } else {
                                            sendComposedMail(unsafeWindow.seed.player.name, "PORT FAILED", 'Code ' + rslt.error_code + ': ' + rslt.msg);
                                        }
                                    };
                                },
                                onFailure: function (rslt) {
                                    setTimeout(function () { PortOfOrderCity(citynum, pid, portmsg); }, 1000);
                                }
                            });
                            return;
                        }
                    }
                }
            },
            onFailure: function (rslt) {
                setTimeout(function () { PortOfOrderCity(citynum, pid, portmsg); }, 1000);
            }
        }, false);
    }

function AjaxRequest (url, opts) {  //emulate protoype's Ajax.Request ...
    var headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Prototype-Version': '1.6.1',
            'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
    };
    var ajax = null;

    if (window.XMLHttpRequest)
        ajax=new XMLHttpRequest();
    else
        ajax=new ActiveXObject("Microsoft.XMLHTTP");

    if (opts.method==null || opts.method=='')
        method = 'GET';
    else
        method = opts.method.toUpperCase();

    if (method == 'POST'){
        headers['Content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    } else if (method == 'GET'){
        addUrlArgs (url, opts.parameters);
    }

    ajax.onreadystatechange = function(){
        if (ajax.readyState==4) {
            if (ajax.status >= 200 && ajax.status < 305)
                if (opts.onSuccess) opts.onSuccess(ajax);
                else
                    if (opts.onFailure) opts.onFailure(ajax);
        } else {
            if (opts.onChange) opts.onChange (ajax);
        }
    }

    ajax.open(method, url, true);   // always async!

    for (var k in headers)
        ajax.setRequestHeader (k, headers[k]);
    if (matTypeof(opts.requestHeaders)=='object')
        for (var k in opts.requestHeaders)
            ajax.setRequestHeader (k, opts.requestHeaders[k]);

    if (method == 'POST'){
        var a = [];
        for (k in opts.parameters){
            if(matTypeof(opts.parameters[k]) == 'object')
                for(var h in opts.parameters[k])
                    a.push (k+'['+h+'] ='+ opts.parameters[k][h] );
            else
                a.push (k +'='+ opts.parameters[k] );
        }
        ajax.send (a.join ('&'));
    } else               {
        ajax.send();
    }
}

function MyAjaxRequest (url, o, noRetryX) {
    if (DEBUG_TRACE) logit (" 0 myAjaxRequest: "+ url +"\n" + inspect (o, 2, 1));
    var opts = unsafeWindow.Object.clone(o);
    var wasSuccess = o.onSuccess;
    var wasFailure = o.onFailure;
    var retry = 0;
    var delay = 10;
    var noRetry = noRetry===true?true:false;
    opts.onSuccess = mySuccess;
    opts.onFailure = myFailure;

    new AjaxRequest(url, opts);
    return;

    function myRetry(){
        ++retry;
        new AjaxRequest(url, opts);
        delay = delay * 2.25;
    }
    function myFailure(){
        var o = {};
        o.ok = false;
        o.errorMsg = "AJAX Communication Failure";
        wasFailure (o);
    }
    function mySuccess (msg){
        var rslt = eval("(" + msg.responseText + ")");
        if (!rslt)
        {
            logit("Message error: " + inspect(msg,3,1));
            return;
        }
        var x;
        if (window.EmulateAjaxError){
            rslt.ok = false;
            rslt.error_code=8;
        }
        if (rslt.ok){
            if (rslt.updateSeed)
                unsafeWindow.update_seed(rslt.updateSeed);
            wasSuccess (rslt);
            return;
        }
        rslt.errorMsg = unsafeWindow.printLocalError((rslt.error_code || null), (rslt.msg || null), (rslt.feedback || null));

        wasSuccess (rslt);
    }
}

function DSporterScriptStartup () {
	var metc = getClientCoords(document.getElementById('main_engagement_tabs'));
	if (metc.width==null || metc.width==0) {
		setTimeout (DSporterScriptStartup, 1000);
		return;
	}	
	// initialise 
	var styles = '\
	tr.DSCPopupTop td {background-color:#000000; border:1px solid #000; height: 21px;  padding:0px; color:#eeeeee;}\
	.DSCPopMain      {background-color:#F7F3E6; border:1px solid #000000; -moz-box-shadow:inset 0px 0px 10px #A9A9A9; -moz-border-radius-bottomright: 20px; -moz-border-radius-bottomleft: 20px; border-bottom-right-radius: 20px; border-bottom-left-radius: 20px; font-size:11px; color:#000000}\
	.DSporterCPopup         {border:5px ridge #666; opacity:1; -moz-border-radius:25px; border-radius:25px; -moz-box-shadow: 1px 1px 5px #000000;}\
	.DSdivHeader			 {border:0px solid; border-color:#000000; background: -moz-linear-gradient(top, #A9A9A9, #333); -moz-border-radius:5px; height: 16px;border-bottom:0px solid #000000;font-weight:bold;font-size:11px;opacity:0.75;margin-left:0px;margin-right:0px;margin-top:1px;margin-bottom:0px;padding-top:4px;padding-right:10px;vertical-align:text-top;align:left; color:#000000;}';	
    LoadAutoPortData();
	AddMainTabLink('DSporter', eventHideShow);
	DSportermainPop = new DSporterCPopup ('DSporterMain', 0, 0, dlgWidth, dlgHeight, true, function (){ DSportertabManager.hideTab(); });
	DSportermainPop.getMainDiv().innerHTML = '<STYLE>'+ styles +'</style>';

	DSportertabManager.init (DSportermainPop.getMainDiv());
}
/*********************************** TABS ***********************************/
Tabs.MainTab = {
	tabOrder: 100,
	tabLabel: 'DSporter - version ' + Version,
	tabColor: 'gray',
	
	init: function (div) {
		var t = Tabs.MainTab;
		t.mydiv = div;
	},
	
	hide: function () {},
	
	show: function () {
		var t = Tabs.MainTab;
		m = '<div>';
		m += '<div class="DSdivHeader	" align="left">&nbsp;AUTOPORT OPTIONS</div>';
        m += '<div>Port on Attack of <input id=DSporterThresholdAttack type=text value="' + AutoPort.DSporterThresholdAttack + '"/> or More Troops</div>';
        m += '<div>Port on Scout of <input id=DSporterThresholdScout type=text value="' + AutoPort.DSporterThresholdScout + '"/> or More Troops</div>';
        if (unsafeWindow.ksoItems[911].count == 0 && AutoPort.DSporterRefuge) {
            AutoPort.DSporterRefuge = false;
            SaveAutoPortData();
        }
        if (unsafeWindow.ksoItems[912].count == 0 && AutoPort.DSporterOrder) {
            AutoPort.DSporterOrder = false;
            SaveAutoPortData();
        }
        m += '<div><input id=DSporterRefuge type=checkbox ' + (AutoPort.DSporterRefuge? ' CHECKED' : '') + '/>Use Port of Refuge (' + unsafeWindow.ksoItems[911].count + ')</div>';
        m += '<div><input id=DSporterOrder type=checkbox ' + (AutoPort.DSporterOrder? ' CHECKED' : '') + ' />Use Port of Order (' + unsafeWindow.ksoItems[912].count + ')</div>';
		m += '<div class="DSdivHeader	" align="left">&nbsp;CITIES TO AUTOPORT</div>';

        m += '<div><table width=75%><tr><td width=33%><b>CITY</b></td><td width=33%><b>ON ATTACK</b></td><td width=33%><b><i>ON SCOUT</i></b></td></tr>';
        for(i = 0; i < Cities.numCities; i++) {
            m += '<tr>';
            m += '<td>' + Cities.cities[i].name + '</td>';
            m += '<td align=center><input id=DSporterCityAttack' + i + ' class=DSporterCityAttack type=checkbox ' + (AutoPort.DSporterCitiesAttack[i]? ' CHECKED' : '') + '/></td>';
            m += '<td align=center><input id=DSporterCityScout' + i + ' class=DSporterCityScout type=checkbox ' + (AutoPort.DSporterCitiesScout[i]? ' CHECKED' : '') + '/></td>';
            m += '</tr>';
		}
        m += '<tr><td><input id=DSporterClearAll class="buttonv2 h20 purple" style="width:75px" type=button value="Clear All"/></td>';
        m += '<td align=center><input id=DSporterClearAttacks class="buttonv2 h20 purple" style="width:50px" type=button value="Clear"/></td>';
        m += '<td align=center><input id=DSporterClearScouts class="buttonv2 h20 purple" style="width:50px" type=button value="Clear"/></td></tr>';
        m += '</table></div>';
		m += '<div class="DSdivHeader	" align="left">&nbsp;ADVANCED OPTIONS</div>';
        m += '<div><input id=DSporterWarning type=checkbox ' + (AutoPort.DSporterWarning? ' CHECKED' : '') + '/>Warn Alliance Chat <input id=DSporterWarningContent type=text value="' + AutoPort.DSporterWarningContent + '"/></div>';
        m += '<div><input id=DSporterSarcasm type=checkbox ' + (AutoPort.DSporterSarcasm? ' CHECKED' : '') + '/>Sarcastic Whisper <input id=DSporterSarcasmContent type=text value="' + AutoPort.DSporterSarcasmContent + '"/></div>';
        m += '<div><input id=DSporterMessage type=checkbox ' + (AutoPort.DSporterMessage? ' CHECKED' : '') + '/>Message My Inbox Details of Port</div>';
        m += '<div>&nbsp;Password: <input id=DSporterPassword type=text value="' + AutoPort.DSporterPassword + '"/></div>';
        m += '<div>&nbsp;Recheck Every <input id=DSporterRecheck type=text value="' + AutoPort.DSporterRecheck + '"/> Seconds</div>';
        m += '<br>';
        m += '</div>';
		t.mydiv.innerHTML = m;

        document.getElementById('DSporterPassword').addEventListener('change', function () {
            AutoPort.DSporterPassword = document.getElementById('DSporterPassword').value;
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterWarning').addEventListener('change', function () {
            AutoPort.DSporterWarning = document.getElementById('DSporterWarning').checked;
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterWarningContent').addEventListener('change', function () {
            AutoPort.DSporterWarningContent = document.getElementById('DSporterWarningContent').value;
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterSarcasm').addEventListener('change', function () {
            AutoPort.DSporterSarcasm = document.getElementById('DSporterSarcasm').checked;
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterSarcasmContent').addEventListener('change', function () {
            AutoPort.DSporterSarcasmContent = document.getElementById('DSporterSarcasmContent').value;
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterMessage').addEventListener('change', function () {
            AutoPort.DSporterMessage = document.getElementById('DSporterMessage').checked;
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterRefuge').addEventListener('change', function () {
            AutoPort.DSporterRefuge = document.getElementById('DSporterRefuge').checked;
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterOrder').addEventListener('change', function () {
            AutoPort.DSporterOrder = document.getElementById('DSporterOrder').checked;
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterThresholdAttack').addEventListener('change', function () {
            //validate the entry is a number only
            AutoPort.DSporterThresholdAttack = document.getElementById('DSporterThresholdAttack').value;
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterThresholdScout').addEventListener('change', function () {
            //validate the entry is a number only
            AutoPort.DSporterThresholdScout = document.getElementById('DSporterThresholdScout').value;
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterRecheck').addEventListener('change', function () {
            AutoPort.DSporterRecheck = document.getElementById('DSporterRecheck').value;
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterClearAll').addEventListener('click', function () {
            DSporterClearAttacks();
            DSporterClearScouts();
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterClearAttacks').addEventListener('click', function () {
            DSporterClearAttacks();
            SaveAutoPortData();
        }, false);

        document.getElementById('DSporterClearScouts').addEventListener('click', function () {
            DSporterClearScouts();
            SaveAutoPortData();
        }, false);


        var DSporterClearAttacks = function() {
            for(var i = 0; i < Cities.numCities; i++) {
                AutoPort.DSporterCitiesAttack[i] = false;
                document.getElementById('DSporterCityAttack' + i).checked = false;
            }
        };

        var DSporterClearScouts = function() {
            for(var i = 0; i < Cities.numCities; i++) {
                AutoPort.DSporterCitiesScout[i] = false;
                document.getElementById('DSporterCityScout' + i).checked = false;
            }
        };

        var DSporterCitiesAttack = document.getElementsByClassName("DSporterCityAttack");
        var DSporterCitiesScout = document.getElementsByClassName("DSporterCityScout");

        var DSporterCityAttack = function() {
            var id = this.getAttribute("id");
            var citynum = id.split("DSporterCityAttack")[1];
            AutoPort.DSporterCitiesAttack[citynum] = this.checked;
            SaveAutoPortData();
        };

        var DSporterCityScout = function() {
            var id = this.getAttribute("id");
            var citynum = id.split("DSporterCityScout")[1];
            AutoPort.DSporterCitiesScout[citynum] = this.checked;
            SaveAutoPortData();
        };

        for(var i = 0; i < DSporterCitiesScout.length; i++){
            DSporterCitiesScout[i].addEventListener('change', DSporterCityScout, false);
        };

        for(var i = 0; i < DSporterCitiesAttack.length; i++){
            DSporterCitiesAttack[i].addEventListener('change', DSporterCityAttack, false);
        };
	}

}

/***********************************************************************/
function matTypeof (v){
    if (typeof (v) == 'object'){
        if (!v)
            return 'null';
        else if (v.constructor.toString().indexOf("Array")>=0 && typeof(v.splice)=='function')
            return 'array';
        else return 'object';
    }
    return typeof (v);
}

function unixTime () {
    return parseInt (new Date().getTime() / 1000) + unsafeWindow.g_timeoff;
}

var myServerId = null;  //example: https://www150.kingdomsofcamelot.com

function getServerId() {
    if (myServerId == null){
        var m=/^[a-zA-Z]+([0-9]+)\./.exec(document.location.hostname);
        if (m)
            myServerId = m[1];
        else
            myServerId = '??';
    }
    return myServerId;
}

function LoadAutoPortData() {
    var serverID = getServerId();
    s = GM_getValue ('DSporter_' + serverID);
    if (s != null){
        opts = JSON2.parse (s);
        for (k in opts){
            if (matTypeof(opts[k]) == 'object')
                for (kk in opts[k])
                    AutoPort[k][kk] = opts[k][kk];
            else
                AutoPort[k] = opts[k];
        }
    }
}

function SaveAutoPortData() {
    var serverID = getServerId();
    setTimeout(function () { GM_setValue('DSporter_' + serverID, JSON2.stringify(AutoPort)); }, 0);
}

DSporterScriptStartup();

