// ==UserScript==
// @name        Gamdom Rains
// @namespace   https://greasyfork.org/users/173937
// @description Rain notifier for gamdom.com. Immediate notifications without any delay.
// @include     /^https:\/\/greasyfork\.org\/([a-z]{2}(\-[A-Z]{2})?\/)?scripts/39779(\-[^\/]+)$/
// @include     /^https?:\/\/gamdom\.com\/.*$/
// @require     https://greasyfork.org/scripts/39795-gamdom-rain-notifier-library-resource/code/Gamdom%20Rain%20Notifier%20Library%20Resource.js?version=260234
// @require     https://greasyfork.org/scripts/39794-library-misc/code/Library%20Misc.js?version=260233
// @require     https://greasyfork.org/scripts/39689-library-updater/code/Library%20Updater.js?version=260226
// @version     0.4.2
// @grant       GM_info
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/39779/Gamdom%20Rains.user.js
// @updateURL https://update.greasyfork.org/scripts/39779/Gamdom%20Rains.meta.js
// ==/UserScript==

(function(){
	var RAINING = {
		add: 0,
		del: 0,
		get val(){return this.del + this.add * 2;},
		set val(v){v = v%4; this.del = v%2; this.add = parseInt(v/2, 10);},
		init: function(){this.del = 0; this.add = 0;},
	};
	switch(location.hostname)
	{
		case "greasyfork.org": return self === parent && main();
		case "gamdom.com"    : return self !== parent && start();
	}
	function start()
	{
		sendMessage({n: "gr", s: !0});
		document.addEventListener("DOMContentLoaded", function(e){_start(e);}, false);
	}
	function _start()
	{
		if( !!qs(".rain-message") || !!qs(".rainbot") || !!qs(".rain-logo") )
			sendRain("add");
		var MutationObserver = window.MutationObserver || window.WebkitMutationObserver,
			observer = new MutationObserver(function(mutations){
			var n;
			for(var m of mutations)
			{
				for(n of m.addedNodes)
				{
					//if( n.nodeType == 1 && !RAINING && isItRain(n) ) sendRain("add", n);
					if( n.nodeType == 1 && !RAINING.add )
						setTimeout(function(){return isItRain(n) ? sendRain("add", n) : null;}, 100);
				}
				for(n of m.removedNodes)
				{
					if( n.nodeType == 1 && !RAINING.del && isItRain(n) ) sendRain("del", n);
				}
			}
		});
		observer.observe(qs("body"), {
			childList: true,
			subtree: true,
		});
		return observer;
	}
	function isItRain(n)
	{
		if( hasClass(n, "msg-user-message") ) return !1;
		var b = hasClass(n, "rain-message");
		if( b ) return !0;
		b = !!qs(".rain-message", n) || !!qs(".rainbot", n) || !!qs(".rain-logo", n);
		if( b ) return !0;
		return (n.tagName == "LI" && /Rainbot/.test(n.innerText));
	}
	function hasClass(el, cl){return !!el.classList ? el.classList.contains(cl) : (el.className||"").indexOf(cl) != -1;}
	function sendRain(t, n)
	{
		if( RAINING.val >= 2 ) return;
		RAINING[t] = 1;
		switch(RAINING.val)
		{
			case 1:
			if( !qs(".claimRain", n) ) return RAINING.init();
			case 2:
			case 3:
			RAINING.add = 1;
			setTimeout(function(){RAINING.init();}, 1e5);
			sendMessage({r: !0, n: "gr", t: t});
			return;
		}
	}
	function sendMessage(data){window.parent.postMessage(data, "https://greasyfork.org");}
	function open()
	{
		checkUPD().then(function(r){
			var frame;
			if(r) return close();
			if( !!(frame = qs("#gamdom-frame")) )
				return frame;
			frame = document.createElement("iframe");
			frame.id = "gamdom-frame";
			frame.src = "https://gamdom.com";
			return qs("body").appendChild(frame);
		});
	}
	function close()
	{
		var frame;
		if( (frame = qs("#gamdom-frame")) && frame.parentNode )
		{
			notify_close();
			return frame.parentNode.removeChild(frame);
		}
	}
	function main()
	{
		scriptSET(GM_info.script.name, GM_info.script.version);// NAME, VERSION, SCRIPT
		imageUPD("IMAGE");
		window.addEventListener("message", function(e){message(e);});
		window.addEventListener("keydown", function(e){hotkey(e);});
		styles();
	}
	function styles()
	{
		addStyle(`
		#gamdom-frame {
			top: 0;
			left: 0;
			width: 1000px;
			height: 500px;
			z-index: -100;
			position: fixed;
			visibility: hidden;
		}
		`);
	}
	function addStyle(css)
	{
		var s = document.createElement("style");
		s.type = "text/css";
		s.appendChild(document.createTextNode(css));
		return qs("head").appendChild(s);
	}
	function hotkey(e)
	{
		var charCode = e.keyCode || e.which,
			c = String.fromCharCode(charCode).toUpperCase();
		switch(c)
		{
			case "O": return open();
			case "C": return close();
		}
	}
	function message(e)
	{
		if( e.origin == "https://gamdom.com" )
		{
			if( !e.data || e.data.n !== "gr" )
				return console.log("ignored message: ", e.data );
			if( e.data.r === true )
				notify_rain(e.data.t);
			if( e.data.s === true )
				notify_start();
		}
	}
	function notify(title, text, timeout)
	{
		notification({
			title: title,
			text: text,
			timeout: timeout,
			get image(){ return window.IMAGE ? window.IMAGE.source : null;},
		});
	}
	function notify_rain(t){console.log("rain: ", t, new Date()); notify("IT'S RAINING!", "THE RAIN WAS DETECTED!", 7e3); SOUND.play();}
	function notify_start(){notify("STARTS", "Just leave this page open, and you'll recieve all rain notifications. Press 'C' to close/stop script", 7e3);}
	function notify_close(){notify("CLOSED", "Press 'O' to start recieving notifications", 5e3);}
	function qs(s, e){return (e||document).querySelector(s);}
})();