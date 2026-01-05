// ==UserScript==
// @name 			WME Chat Jumper :)
// @description 	Remeber current position before jump to new position from chat-user, and add button in chat window to jump back
// @namespace 		http://pyrczak.pl
// @grant 			none
// @grant 			GM_info
// @version 		0.0.7
// @match               https://editor-beta.waze.com/*editor/*
// @match               https://www.waze.com/*editor/*
// @author			Pawel Pyrczak '2014
// @license			MIT/BSD/X11
// @downloadURL https://update.greasyfork.org/scripts/4624/WME%20Chat%20Jumper%20%3A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4624/WME%20Chat%20Jumper%20%3A%29.meta.js
// ==/UserScript==


/* Changelog
 * 0.0.7 - bugfix, more comatible with Chat addon writed by dummyd2
 * 0.0.6 - bugfix.
 * 0.0.5 - prevent from initializing again ChatJumper, when it is aleready initialized.
 * 0.0.4 - added presaving oryginal _onClick function, this may help with errors in future where oryginal function change 
 * 0.0.3 - now zoom level is also saved and used when jumping back
 * 0.0.2 - position is saved also in localStorage, so it is remebered even if page is reloaded
 * 0.0.1 - initial version
 */


function ChatJumper_bootstrap()
{
	var bGreasemonkeyServiceDefined = false;
	
	try {
		var ver = window.navigator.appVersion.match(/Chrome\/(.*?) /)[1];
	} catch(err) {
		var ver = null;
	}
	if (null !== ver) {
		var itschrome = true;
		///ver = "27.0.1438.7"; // last old working version
		// example: 32.0.1700.107
		// [0] - major versin
		// [2] - minor version
		ver = ver.split(".");
		ver[0] = parseInt(ver[0]);
		ver[2] = parseInt(ver[2]);
		if (ver[0] > 27) {
			var newmethod = true;
		} else if (ver[0] == 27) {
			if (ver[2] <= 1438) {
				var newmethod = false;
			} else {
				var newmethod = true;
			}
		} else {
			var newmethod = false;	
		}
	} else {
		var itschrome = false;
		var newmethod = false;
	}


	try
	{
		if ("object" === typeof Components.interfaces.gmIGreasemonkeyService)  // Firefox tells that "Components" is deprecated
		{
			bGreasemonkeyServiceDefined = true;
		}
    }	catch (err) { };

	try
	{
		if  ("object" === typeof GM_info) 
		{
			bGreasemonkeyServiceDefined = true;
		}
    }	catch (err) { };   
    
    
	if ( "undefined" === typeof unsafeWindow  ||  ! bGreasemonkeyServiceDefined)
	{
		try {
			unsafeWindow    = ( function ()
			{
				var dummyElem   = document.createElement('p');
				dummyElem.setAttribute ('onclick', 'return window;');
				return dummyElem.onclick ();
			} ) ();
		} 
		catch (err)
		{
			//Ignore.
		}
	}

	//And check again for new chrome, and no tamper(grease)monkey
	if ( itschrome && newmethod &&  !bGreasemonkeyServiceDefined)
	{
		//use "dirty" but effective method with injection to document
		var DLscript = document.createElement("script");
		DLscript.textContent ='unsafeWindow=window; \n'+ // need this for compatibility
		ChatJumper_init.toString()+' \n'+
		'ChatJumper_init();';
		DLscript.setAttribute("type", "application/javascript");
		document.body.appendChild(DLscript);    
		document.body.removeChild(DLscript); 
	} else {
		/* begin running the code! */
		ChatJumper_init();
        ///setTimeout(ChatJumper_init,200);
	}
	
	
}



function ChatJumper_init() {
	if ("undefined" == typeof unsafeWindow) { unsafeWindow = window; }
    if ( "undefined" !== typeof unsafeWindow.W.Presenter.ChatUser.prototype._onClickChatJumper) {
        try { // in "try", because some browser may not have console.log
            console.log("(ChatJumper) ChatJumper is already initialized, stopping...");
        } catch(e) {}
        return false; // if ChatJumper is already initialized, stop initializing again.
    }
    
    
	ChatJumper =  { 
		last: new Array(),
		isLast: false,
		isLSsupported: false,
		zoom: false
	};

   ChatJumper.init = function() {

    if ( "undefined" !== typeof unsafeWindow.W.Presenter.ChatUser.prototype._onClickChatJumper) {
        try { // in "try", because some browser may not have console.log
            console.log("(ChatJumper) ChatJumper is already initialized, stopping...");
        } catch(e) {}
        return false; // if ChatJumper is already initialized, stop initializing again.
    }
       
       // first presave oryginalcode
		unsafeWindow.W.Presenter.ChatUser.prototype._onClickChatJumper = unsafeWindow.W.Presenter.ChatUser.prototype._onClick;
		
		// then change it to new
		unsafeWindow.W.Presenter.ChatUser.prototype._onClick = function (e){
			var t;
			if (ChatJumper.isLast) { // Plese, dont erase Jump whet jumping again
			} else {
				var c = this.map.getCenter(); // Gets yours center of view and remeber it
				var zoom = this.map.getZoom(); // Gets zoom level
				ChatJumper.last = [c.lon,c.lat];
				ChatJumper.zoom = zoom;
				ChatJumper.isLast = true;
				ChatJumper.saveLS();
				ChatJumper.showButton(); //add in chat window new "back" button
			}
			this._onClickChatJumper(e)  };  /// call oryginal presaved function
			

			try { // check if localStorage is supported in this browser
				if ('localStorage' in window && window['localStorage'] !== null)
				this.isLSsupported = true;
			} catch (e) {
				this.isLSsupported = false;
			}
		this.loadLS();
		setTimeout(ChatJumper.loadTimer, 1000);
	}

	ChatJumper.loadTimer = function() {
		try {
			if ($("#chat .header")) {
				ChatJumper.showButton();

			} else {
				setTimeout(ChatJumper.loadTimer, 1000);
			}
		} catch(err) {
			setTimeout(ChatJumper.loadTimer, 1000);
		}
		
	}

	ChatJumper.loadLS = function() {
    	if (this.isLSsupported) {
			
			try {
			if ("string" == typeof localStorage.ChatJumper) {
				var s = JSON.parse(localStorage.ChatJumper);
				this.isLast = s.isLast;
				this.last = s.last;
				if ("undefined" != typeof s.zoom) {
					this.zoom = s.zoom;
				}
			}
			
			} catch (err) {
				
			}
		}
	}

	ChatJumper.saveLS = function() {
    	if (this.isLSsupported) {
			var s = {};
			s.isLast = this.isLast;
			s.last = this.last;
			s.zoom = this.zoom;
			localStorage.ChatJumper=JSON.stringify(s);
		}
	}

	ChatJumper.showButton = function() {
        if (!this.isLast) return; // dont know where to jump, so do nothing :( No jumps ;(
        
        try{
            if(document.getElementById('ChatJumper-JUMP') != null) return;
        }
        catch(e){ }
        
		var b = $('<button id="ChatJumper-JUMP" class="ChatJumper" style="float:none;color:#55ff55" title="JUMP" type="button">jump</button>');
		b.click (ChatJumper.JUMP);
		var c = $('<button id="ChatJumper-JUMP-clear" class="ChatJumper" style="padding-left:0px;float:none;color:red" title="Clear JUMP" type="button">X</button>');
		c.click (ChatJumper.Clear);
		$("#chat .header").append(b);
		$("#chat .header").append(c);
	}

	ChatJumper.JUMP = function(e) {
		if (!ChatJumper.isLast) return; // dont know where to jump, so do nothing :( No jumps ;(
		if (ChatJumper.zoom != false) {
			unsafeWindow.Waze.map.setCenter(ChatJumper.last,ChatJumper.zoom); // 3 ... 2 ... 1 ... JUMP !!!
		} else {
			unsafeWindow.Waze.map.setCenter(ChatJumper.last); // 3 ... 2 ... 1 ... JUMP !!!
		}
		ChatJumper.Clear();
	}

	ChatJumper.Clear = function(e) {
		ChatJumper.isLast = false;
		ChatJumper.saveLS();
		document.getElementById('ChatJumper-JUMP').parentNode.removeChild(document.getElementById('ChatJumper-JUMP'));
		document.getElementById('ChatJumper-JUMP-clear').parentNode.removeChild(document.getElementById('ChatJumper-JUMP-clear'));
	}

   ChatJumper.startcode = function () {
		// Check if WME is loaded, if not, waiting a moment and checks again. if yes init ChatJumper
		try {
			if ("undefined" != typeof unsafeWindow.W.Presenter.ChatUser ) {
				//this.console_log("ChatJumper ready to jump :)");
				this.init()
			} else {
				setTimeout(ChatJumper.startcode, 200);
			}
		} catch(err) {
				setTimeout(ChatJumper.startcode, 200);
		}
	}
   ChatJumper.startcode();
}


ChatJumper_bootstrap();




