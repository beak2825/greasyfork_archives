// ==UserScript==
// @name        DotD tools
// @namespace   http://www.flipmctwist.tk
// @description Tools for DotD on Kongregate
// @include     http://www.kongregate.com/games/*
// @include     *50.18.191.15/kong/?DO_NOT_SHARE_THIS_LINK*
// @version     1.18
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/3827/DotD%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/3827/DotD%20tools.meta.js
// ==/UserScript==
if (window.location.host == "www.kongregate.com") {
    function toolsMain(s) {
    	var dotd_tools = s;
    	var tools_title;
    	window.toolsLoad = function(n) {
    		if (typeof holodeck == 'object' && holodeck.ready == true) {
    			toolsInit();
    		}
    		else if (n < 25) {
    			setTimeout(function(){toolsLoad(n+1);},1000);
    		}
    		else { console.log('DE: aborting'); }
    	}
    	toolsLoad(0);
    	
    	window.toolsInit = function() {
    		var r = /^Play\s(.+?)\x2C/.exec(document.title);
    		tools_title = r[1];
    		document.title = tools_title;
    		window.addEventListener("focus", function() { tabFocus(); }, false);
    		ChatDialogue.MESSAGE_TEMPLATE=new Template('<p class="#{classNames}"><span class="#{userClassNames} username time">#{time}</span> <span username="#{username}" class="username #{userClassNames}" oncontextmenu="rClick(\'#{username}\',event);return false;">#{prefix}#{username}</span><span class="separator">: </span><span class="message hyphenate">#{message}</span><span class="clear"></span></p>');
    		ChatDialogue.MESSAGE_TEMPLATE.reEval = ChatDialogue.MESSAGE_TEMPLATE.evaluate;
    		ChatDialogue.MESSAGE_TEMPLATE.evaluate = function(a) {
    			a.time = dotd_tools['tools_timestamp'] == true ? timestamp() + "&nbsp;": "";
    			return this.reEval(a);
    		};
    		
    		ChatDialogue.prototype.msgHandler = ChatDialogue.prototype.displayUnsanitizedMessage;
    		ChatDialogue.prototype.displayUnsanitizedMessage = function(a,b,c,d) {
    			//console.log("Chat:" + a,b,c,d);
    			if (!c) { c = {}; }
    			if (dotd_tools['tools_charter'] == true && /kv_action_type\=signcharter/.test(b)) { return; }
    			if (dotd_tools['tools_guildinv'] == true && /kv_action_type\=guildinvite/.test(b)) { return; }
    			if (dotd_tools['tools_friend'] == true && isFriend(a)) { c.class += " friend"; }
    			if (dotd_tools['tools_highlight'] == true) {
    				var r = new RegExp("(^|\\s|\\*|@)("+holodeck._username+")(\\s|\\.|\\,|\\!|\\:|\\?|\\'|\\*|$)","ig");
    				//var e = this._holodeck._chat_window._active_room._tab_for_room;
    				if (r.test(b)) {
    					c.class += " highlight"; 
    					if (dotd_tools['tools_highlight_alert'] == true && document.hidden == true) { tabAlert(); }
    				}
    				else if (dotd_tools['tools_highlight_ext'] == true) { 
    					var s = dotd_tools['tools_highlight_list'];
    					s = s.replace(/(\.|\*|\$|\^|\[|\]|\+|\?)/g,"\\$1");
    					r = new RegExp("(^|\\s|\\*|@)("+s.replace(/(,|\s)/g,'|')+")(\\s|\\.|\\,|\\!|\\:|\\?|\\'|\\*|$)", "ig");
    					if (r.test(b)) { 
    						c.class += " highlight"; 
    						if (dotd_tools['tools_highlight_alert'] == true && document.hidden == true) { tabAlert(); }
    					}
    				}
    			}
    			if (d && d.whisper == true && document.hidden == true) { tabAlert(); }
    			this.msgHandler(a,b,c,d);
    		};
    		newTab();
    		setCSS();
    		holodeck.addChatCommand("room",function(o,t) {
    			var n;
    			if (n = /^\/room\s(\d{1,2})/.exec(t)) {
    				changeRoom(n[1]);
    				return false;
    			}
    		});
    		holodeck.addChatCommand("echo",function(o,t) {
    			var n;
    			if (n = /^\/echo\s(.+?)$/.exec(t)) {
    				echo(n[1]);
    				return false;
    			}
    		});
    		holodeck.addChatCommand("share",function(o,t) {
    			var n;
    			if (n = /^\/share\s(.+?)$/.exec(t)) {
    				if (/kv_action_type\=raidhelp/.test(t)) {
    					shareMsg(n[1]);
    					return false;
    				}
    				else {
    					echo("Not a valid raid link");
    					return false;
    				}
    			}
    		});
    		holodeck.addChatCommand("tools",function(o,t) {
    			msgRoom("DotD tools by DanElectro: https://greasyfork.org/scripts/3827-dotd-tools");
    			return false;
    		});
    	}
    	window.msgRoom = function(msg,re) {
    		if (re) { msg = msg.replace(/(\$\$)/i,re); }
    		holodeck.activeDialogue()._holodeck.filterOutgoingMessage(msg,holodeck.activeDialogue()._onInputFunction);
    	}
    	window.echo = function(msg) {
    		holodeck.activeDialogue().msgHandler("DotD Tools:",msg,{class: "whisper whisper_received"},{non_user: true});
    	}
    	window.shareMsg = function(msg) {
    		var x = document.getElementById('tools_share_table');
    		var names = [];
    		for (var i=0;x.children[i];i++) {
    			names.push(x.children[i].id);
    		}
    		delaySend(0,names,msg);
    	}
    	window.delaySend = function(i,names,msg) {
    		holodeck.activeDialogue().sendPrivateMessage(names[i],msg);
    		setTimeout(function(){delaySend(i+1,names,msg);},1000);
    	}
    	window.newTab = function(name) {
    		var pane = document.createElement('div');
    		var link = document.createElement('a');
    		var tab = document.createElement('li');
    		var html = [
    			'<div id="tools_cont" style="height:'+document.getElementById('chat_tab_pane').style.height+';">',
    				'<div>DotD tools by DanElectro</div><br />',
    				'<form id="tools_settings" class="tools_form" onSubmit="saveData();return false;">',
    					'<input type="checkbox" name="tools_timestamp" /> Enable timestamp<br />',
    					'<input type="checkbox" name="tools_hidewc" /> Hide World Chat<br />',
    					'<input type="checkbox" name="tools_leftwc" /> World Chat on left<br />',
    					'<input type="checkbox" name="tools_friend" /> Friend color: <input type="text" name="tools_fcolor" class="iSmall" /><br />',
    					'<input type="checkbox" name="tools_highlight" /> Highlight color: <input type="text" name="tools_hcolor" class="iSmall" /><br />',
    					'<input type="checkbox" name="tools_highlight_ext" /> Also Highlight: <input type="text" name="tools_highlight_list" /><br />',
    					'<input type="checkbox" name="tools_highlight_alert" /> Enable Highlight alerts<br />',
    					'<input type="checkbox" name="tools_rctoolbar" /> Hide Raidcatcher toolbar<br />',
    					'<input type="checkbox" name="tools_charter" /> Hide guild charter messages<br />',
    					'<input type="checkbox" name="tools_guildinv" /> Hide guild invite messages<br />',
    					'<input type="checkbox" name="tools_achtab" /> Shorten Achievements tab name<br />',
    					'<input type="checkbox" name="tools_clean_page" /> Clean up page<br />',
    					'<input type="submit" value="Save"> <span id="tools_save_info"></span>',
    				'</form>',
    				'<br /><hr /><br /><div>Raid sharing</div><br />',
    				'<form id="tools_sharing" class="tools_form" onSubmit="addShare();return false;">',
    					'<div id="tools_share_table"></div><br />',
    					'<input type="text" name="tools_share_name" id="tools_share_name" class="iSmall" /> <input type="submit" value="Add" /><br /><br />',
    				'</form>',
    				'<form id="tools_sharing_submit" class="tools_form" onSubmit="sendShare();return false;">',
    					'<div class="container"><div class="left"><input type="submit" value="Share" /></div> <div class="right"><input type="text" name="tools_share_link" id="tools_share_link" class="iBig" /></div></div><br />',
    					'You can also share raids with the /share command.',
    				'</form>',
    				'<br /><hr /><br /><div>Chat Commands</div><br />',
    				'<form id="tools_commands" class="tools_form" onSubmit="addCmd();return false;">',
    					'<div id="tools_com_table"></div><br />',
    					'Command: <br/><input type="text" name="tools_cmdname" id="tools_cmdname" class="iSmall" /><br />',
    					'Message: <br /><input type="text" name="tools_cmddata" id="tools_cmddata" class="iBig" /><br /><br />',
    					'<input type="submit" value="New" />',
    				'</form>',
    			'</div>'
    		].join('');
    		pane.id = "tools_tab_pane";
    		pane.className = "tabpane";
    		pane.style = "display:none;";
    		pane.innerHTML = html;
    		link.href = "#tools_tab_pane";
    		link.innerHTML = 'Tools';
    		tab.id = "tools_tab";
    		tab.className = "tab";
    		tab.appendChild(link);
    		document.getElementById('kong_game_ui').appendChild(pane);
    		document.getElementById('main_tab_set').appendChild(tab);
    		holodeck._tabs.addTab(link);
    		loadData();
    	}
    	window.tabAlert = function() {
    		document.title = "[New message] "+tools_title;
    		changeIcon("data:image/x-icon;base64,AAABAAEAEhIAAAEAGABgBAAAFgAAACgAAAASAAAAJAAAAAEAGAAAAAAAAAAAAGAAAABgAAAAAAAAAAAAAAAYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgAABgYGAAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmRgYGAAAGRkZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZGRkZAAAZGRkAAJlAQLP///////////////////9AQLMAAJn///////////////////9/f8wAAJkZGRkAABoaGgAAmUBAs////////////////8/P7CAgpgAAmf///////////////9/f8lBQuQAAmRoaGgAAGhoaAACZAACZAACZv7/l////v7/lAACZAACZAACZcHDG////////n5/ZAACZAACZAACZGhoaAAAbGxsAAJkAAJkAAJm/v+X////Pz+wAAJkAAJkwMKz////////Pz+wQEJ8AAJkAAJkAAJkbGxsAABsbGwAAmQAAmQAAmb+/5f///////5+f2QAAmc/P7P///+/v+TAwrAAAmQAAmQAAmQAAmRsbGwAAHBwcAACZAACZAACZv7/l//////////////8A//8A//8A//8AAAAA//8A//8A//8A//8AHBwcAAAcHBwAAJkAAJkAAJm/v+X///+/v+VwcMb//wD//wD//wAAAAAAAAAAAAD//wD//wD//wAcHBwAAB0dHQAAmQAAmQAAmb+/5f///7+/5QAAmf//AP//AP//AP//AAAAAP//AP//AP//AP//AB0dHQAAHR0dAACZAACZAACZv7/l////v7/lAACZ//8A//8A//8A//8A//8A//8A//8A//8A//8AHR0dAAAeHh4AAJkAAJkAAJnPz+z///+/v+UAAJn//wD//wD//wAAAAAAAAAAAAD//wD//wD//wAeHh4AAB4eHgAAmTAwrO/v+f//////////////////AP//AP//AAAAAAAAAAAAAP//AP//AP//AB4eHgAAHh4eAACZQECz//////////////////////8A//8A//8AAAAAAAAAAAAA//8A//8A//8AHh4eAAAeHh4AAJkAAJkAAJkAAJkAAJkAAJkAAJn//wD//wD//wAAAAAAAAAAAAD//wD//wD//wAeHh4AAB4eHgAAmQAAmQAAmQAAmQAAmQAAmQAAmf//AP//AP//AP//AP//AP//AP//AP//AP//AB4eHgAAHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=");
    	}
    	window.tabFocus = function() {
    		document.title = tools_title;
    		changeIcon("http://cdn1.kongcdn.com/favicon.png");
    	}
    	window.changeIcon = function(t) {
    		x = document.getElementById("tools_icon");
    		if (x) { x.parentNode.removeChild(x); }
    		var favicon = document.createElement("link");
    		favicon.rel = "shortcut icon";
    		favicon.type = "image/png";
    		favicon.href = t;
    		favicon.id = "tools_icon";
    		document.head.appendChild(favicon);
    	}
    	window.setCSS =  function() {
    		var html = [
    			'.time {float:left!important;}',
    			'.iBig {width:98%;}',
    			'.iSmall {width:60px;}',
    			'.friend span.username {color:'+ dotd_tools["tools_fcolor"] +'!important;}',
    			'.highlight .message {color:'+ dotd_tools["tools_hcolor"] +'!important;}',
    			'.tools_share_name {border: 1px solid #666666; padding:1px;}',
    			'.cmdname {width:50px;display:inline-block;}',
    			'.container {width:100%;}',
    			'.container .left {display:table-cell;padding-right:4px;} ',
    			'.container .right {display:table-cell;width:100%;}',
    			'#tools_com_table {overflow-x:auto;white-space:nowrap;}'
    		];
    		if (/5thplanetgames\/dawn-of-the-dragons/i.test(document.location.href)) {
                if (dotd_tools["tools_clean_page"] == true) { html.push('.game_page_wrap {display:none;}','#subwrap {display:none;}','.game_details_outer {display:none;}'); }
                if (dotd_tools["tools_rctoolbar"] == true) { html.push('#DotD_chatToolbar {visibility:hidden;}'); }
                if (dotd_tools["tools_hidewc"] == true) {
                    html.push('#gameiframe {width:760px!important;}');
                    html.push('#game {width:760px!important;}');
                    html.push('#gameholder { width:760px!important; }');
                    html.push('#maingame { width:1064px!important; }');
                    html.push('#maingamecontent { width:1062px!important; }');
                    html.push('#flashframecontent { width:762px!important; }');
    
                }
    		}
    		document.getElementById("tools_css").innerHTML = html.join('');
    	}
    	window.addCmd = function() {
    		var cname = document.getElementById('tools_cmdname');
    		var cdata = document.getElementById('tools_cmddata');
    		if (cname.value && cdata.value) {
    			var cn = cname.value.replace(/\//g,"")
    			document.getElementById('tools_com_table').innerHTML += '<div class="tools_cmd" id="'+cn+'"><span><sup><a href="#" onClick="remCmd(this);return false;">[remove]</a></sup></span> <span class="cmdname">/'+cn+'</span> <span>:</span> <span class="cmditem">'+cdata.value+'</span></div>';
    			window.postMessage('DotD_tools addcom '+cn+'|'+cdata.value,'*');
    			regCmd(cn,cdata.value);
    			cname.value = "";
    			cdata.value = "";
    		}
    	}
    	window.remCmd = function(x) {
    		var e = x.parentElement.parentElement.parentElement;
    		e.parentElement.removeChild(e);
    		window.postMessage('DotD_tools remcom '+e.id,'*')
    	}
    	window.regCmd = function(name,msg) {
    		holodeck.addChatCommand(name, function(o,t) {
    			var r = new RegExp("^\/"+name+"\\s(.+?)$","i");
    			var n = r.exec(t);
    			if (n) { msgRoom(msg,n[1]); }
    			else { msgRoom(msg,""); }
    			return false;
    		});
    	}
    	window.addShare =  function() {
    		var n = document.getElementById('tools_share_name').value;
    		if (n) {
    			document.getElementById('tools_share_name').value = "";
    			document.getElementById('tools_share_table').innerHTML += '<span class="tools_share_name" id="'+n+'">'+n+'<sup><a href="#" onClick="remShare(this);return false;">x</a></sup></span> ';
    			window.postMessage('DotD_tools make share','*');
    		}
    	}
    	window.remShare = function(x) { 
    		var e = x.parentElement.parentElement;
    		e.parentElement.removeChild(e);
    		window.postMessage('DotD_tools make share','*');
    	}
    	window.sendShare = function() {
    		var x = document.getElementById('tools_share_link');
    		if (x.value && /kv_action_type\=raidhelp/.test(x.value)) { 
    			shareMsg(x.value);
    			x.value = "";
    		}
    	}
    	window.saveData = function() {
    		var x = document.getElementById('tools_settings');
    		var sdata = {};
    		var d = new Date();
    		for (var i=0;i < x.length;i++) {
    			if (x.elements[i].type == "checkbox") { sdata[x.elements[i].name] = x.elements[i].checked; }
    			else if (x.elements[i].type == "text") { 
    				var val = x.elements[i].value;
    				sdata[x.elements[i].name] = val;
    			}
    		}
    		dotd_tools = sdata;
    		setCSS();
    		document.getElementById('accomplishments_tab').children[0].innerHTML = dotd_tools['tools_achtab'] == true ? "A" : "Achievements"; 
    		window.postMessage('DotD_tools save '+JSON.stringify(sdata),'*');
    		document.getElementById("gameiframe").contentWindow.postMessage('DotD_tools update '+JSON.stringify(sdata),'*');
    		document.getElementById("tools_save_info").innerHTML = "Saved at "+ d.toLocaleTimeString();
    	}
    	window.loadData = function() {
    		window.postMessage('DotD_tools load','*');
    	}
    	window.rClick = function(name,e) {
    		if (e.ctrlKey == true) { 
    			document.getElementById('tools_share_table').innerHTML += '<span class="tools_share_name" id="'+name+'">'+name+'<sup><a href="#" onClick="remShare(this);return false;">x</a></sup></span> ';
    			window.postMessage('DotD_tools make share','*');
    			echo(name +' added to share list.');
    		}
    		else { holodeck.chatWindow().insertPrivateMessagePrefixFor(name); }
    	}
    	window.isFriend = function(name) {
    		return holodeck.activeDialogue()._user_manager.isFriend(name);
    	}
    	window.timestamp = function() {
    		var d = new Date();
    		var h = (d.getHours() < 10) ? "0"+d.getHours() : d.getHours();
    		var m = (d.getMinutes() < 10) ? "0"+d.getMinutes() : d.getMinutes();
    		return '['+h+':'+m+']';
    	}
    	window.changeRoom = function(n) { 
    		n=n-1;
    		if (n >= 0 && n < 13) {
    			var r = [
    				{"name":"Dawn of the Dragons - Room #01","id":"44247","xmpp_name":"138636-dawn-of-the-dragons-1","type":"game"},
    				{"name":"Dawn of the Dragons - Room #02","id":"138636","xmpp_name":"138636-dawn-of-the-dragons-2","type":"game"},
    				{"name":"Dawn of the Dragons - Room #03","id":"44303","xmpp_name":"138636-dawn-of-the-dragons-3","type":"game"},
    				{"name":"Dawn of the Dragons - Room #04","id":"44336","xmpp_name":"138636-dawn-of-the-dragons-4","type":"game"},
    				{"name":"Dawn of the Dragons - Room #05","id":"44341","xmpp_name":"138636-dawn-of-the-dragons-5","type":"game"},
    				{"name":"Dawn of the Dragons - Room #06","id":"44345","xmpp_name":"138636-dawn-of-the-dragons-6","type":"game"},
    				{"name":"Dawn of the Dragons - Room #07","id":"44348","xmpp_name":"138636-dawn-of-the-dragons-7","type":"game"},
    				{"name":"Dawn of the Dragons - Room #08","id":"44464","xmpp_name":"138636-dawn-of-the-dragons-8","type":"game"},
    				{"name":"Dawn of the Dragons - Room #09","id":"44465","xmpp_name":"138636-dawn-of-the-dragons-9","type":"game"},
    				{"name":"Dawn of the Dragons - Room #10","id":"44466","xmpp_name":"138636-dawn-of-the-dragons-10","type":"game"},
    				{"name":"Dawn of the Dragons - Room #11","id":"44467","xmpp_name":"138636-dawn-of-the-dragons-11","type":"game"},
    				{"name":"Dawn of the Dragons - Room #12","id":"44468","xmpp_name":"138636-dawn-of-the-dragons-12","type":"game"},
    				{"name":"Dawn of the Dragons - Room #13","id":"44473","xmpp_name":"138636-dawn-of-the-dragons-13","type":"game"}
    			]
    			holodeck.joinRoom(r[n]);
    		}
    	}
    }
    function rMessage(e) {
        if (/kongregate.com$/.exec(e.origin)) {
        	var r;
        	if (r = /^DotD_tools\ssave\s(.+?)$/.exec(e.data)) { 
        		GM_setValue("settings",r[1]);
        	}
        	else if (r = /^DotD_tools\sload$/.exec(e.data)) { 
        		var sdata = JSON.parse(GM_getValue("settings"));
        		var x = document.getElementById('tools_settings');
        		for (var i=0;x.elements[i] != null;i++) {
        			if (x.elements[i].type == "checkbox") { x.elements[i].checked = sdata[x.elements[i].name]; }
        			else if (x.elements[i].type == "text") { x.elements[i].value = sdata[x.elements[i].name]; }
        		}
        		if (sdata['tools_achtab'] == true) { document.getElementById('accomplishments_tab').children[0].innerHTML = "A"; }
        		sdata = GM_getValue("share") ? JSON.parse(GM_getValue("share")) : {};
        		var html = "";
        		for (var i=0;sdata[i] != null;i++) {
        			html += '<span class="tools_share_name" id="'+sdata[i]+'">'+sdata[i]+'<sup><a href="#" onClick="remShare(this);return false;">x</a></sup></span> ';
        		}
        		document.getElementById('tools_share_table').innerHTML = html;
        		html = "";
        		sdata = GM_getValue("commands") ? JSON.parse(GM_getValue("commands")) : {} ;
        		for (var i in sdata) {
        			html += '<div class="tools_cmd" id="'+i+'"><span><sup><a href="#" onClick="remCmd(this);return false;">[remove]</a></sup></span> <span class="cmdname">/'+i+'</span> <span>:</span> <span class="cmditem">'+sdata[i]+'</span></div>';
        			unsafeWindow.regCmd(i,sdata[i]);
        		}
        		document.getElementById('tools_com_table').innerHTML = html;
        	}
        	else if (r = /^DotD_tools\smake\sshare$/.exec(e.data)) {
        		var sdata = {};
        		var x = document.getElementById('tools_share_table');
        		for (var i=0;x.children[i];i++) {
        			sdata[i] = x.children[i].id;
        		}
        		GM_setValue("share",JSON.stringify(sdata));
        	}
        	else if (r = /^DotD_tools\saddcom\s(.+?)$/.exec(e.data)) {
        		var sdata = GM_getValue("commands") ? JSON.parse(GM_getValue("commands")) : {};
        		var x = r[1].split("|");
        		sdata[x[0]] = x[1];
        		GM_setValue("commands",JSON.stringify(sdata));
        	}
        	else if (r = /^DotD_tools\sremcom\s(.+?)$/.exec(e.data)) {
        		var sdata = JSON.parse(GM_getValue("commands"));
        		delete sdata[r[1]];
        		GM_setValue("commands",JSON.stringify(sdata))
        	}
    	}
    }
    if (window.top == window.self) {
    	if (GM_getValue("settings") == undefined) { 
    		var s = {"tools_timestamp":true,"tools_charter":false,"tools_friend":false,"tools_fcolor":"#0088CC","tools_highlight":false,"tools_hcolor":"#00CCCC","tools_highlight_ext":false,"tools_highlight_list":"","tools_highlight_alert":false,"tools_achtab":true,"tools_clean_page":false,"tools_rctoolbar":false,"tools_guildinv":false,"tools_hidewc":false,"tools_leftwc":true};
    		GM_setValue("settings",JSON.stringify(s));
    	}
    	if (GM_getValue("share") == undefined) { GM_setValue("share",""); }
    	if (GM_getValue("commands") == undefined) {	GM_setValue("commands",""); }	
    	var s = GM_getValue("settings");
    	var script = document.createElement('script'); 
    	script.type = "text/javascript"; 
    	script.appendChild(document.createTextNode('('+toolsMain+')('+s+')'));
    	document.head.appendChild(script);
    	window.addEventListener("message",rMessage,false);
    	var css = document.createElement('style');
    	css.id = "tools_css";
    	css.type = "text/css";
    	document.head.appendChild(css);
	}
}
else {
   function frameMain(s) {
    	var dotd_tools = s;
    	window.chatUpdate = function(s) {
            dotd_tools = s;
            if (dotd_tools["tools_leftwc"] == true && dotd_tools["tools_hidewc"] == false) { 
                document.getElementById("chatdiv").parentNode.style.left = "0px";
                document.getElementById("swfdiv").parentNode.style.left = "265px";
            }
            else { 
                document.getElementById("chatdiv").parentNode.style.left = "760px";
                document.getElementById("swfdiv").parentNode.style.left = "0px";
            }
        }
        chatUpdate(dotd_tools);
    }
    
    function fMessage(e) {
        if (/kongregate.com$/.exec(e.origin)) {
            var r;
        	if (r = /^DotD_tools\supdate\s(.+?)$/.exec(e.data)) { 
        	   unsafeWindow.chatUpdate(JSON.parse(r[1]));
        	}
    	}
    }
    
    var s = GM_getValue("settings");
    var script = document.createElement('script'); 
    script.type = "text/javascript"; 
    script.appendChild(document.createTextNode('('+frameMain+')('+s+')'));
    document.head.appendChild(script);
    window.addEventListener("message",fMessage,false);

}