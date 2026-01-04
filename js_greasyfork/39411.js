// ==UserScript==
// @name        ajax log gm
// @namespace   https://greasyfork.org/users/174399
// @description ajax log library for GM usage
// @version     0.5.1
// ==/UserScript==

window.GM_xmlhttpRequest = window.GM_xmlhttpRequest || function(){
	alert("Error: your script doesn't include GM_xmlhttpRequest API!\r\n" +
	"In order to script works you should include GM_xmlhttpRequest");
};
(function(){
	var _ajaxLog = {},
		inited = null,
		scriptName = 'ajax log',
		scriptVersion = '0.5.1',
		url = "https://greasyfork.org/scripts/39403-ajax-log/code/ajax%20log.js?version=258004",
		link;
	Object.defineProperties( _ajaxLog, {
		'name': {
			get(){return scriptName;},
			enumerable: true,
		},
		'version': {
			get(){return scriptVersion;},
			enumerable: true,
		},
		'nameVer': {
			get(){return scriptName + ' v' + scriptVersion;},
			enumerable: true,
		},
		'start': {
			value: function(){
				if( !inited )
					startLog();
				inited = true;
			},
			enumerable: true,
		},
	});
	function startLog()
	{
		console.log('document.readyState: ', document.readyState );
		var handleDOMLoad = function handleDOMLoad(){
			startLog();
			this.removeEventListener('DOMContentLoaded', handleDOMLoad);
		};
		switch(document.readyState)
		{
			case 'loading': return document.addEventListener('DOMContentLoaded', handleDOMLoad);
			case 'interactive':
			case 'complete':
			break;
			default: return;
		}
		console.log(_ajaxLog.nameVer + ' start');
		var s = new Promise(function(f){
			GM_xmlhttpRequest({
				url: getLocation(url),
				method: 'GET',
				headers: {'Referer': getLocation(url, 'origin')},
				onload: function(r){f(r.response);},
			});
		}).then(function(r){
			var script = document.createElement('script'),
				body = document.body || document.querySelector('body');
			script.type = 'text/javascript';
			script.innerHTML = r;
			body.appendChild(script);
			setTimeout(function(){body.removeChild(script);}, 1e4);
		});
	}
	Object.defineProperty(window, 'ajaxLog', {
		get(){return _ajaxLog;},
		enumerable: true,
	});
	function getLocation(u, p)
	{
		link = link || document.createElement('a');
		link.href = u;
		return link[p||'href'];
	}
})();