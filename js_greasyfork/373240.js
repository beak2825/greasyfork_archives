// ==UserScript==
// @name        Sankaku Adds Remover (development version)
// @description This script removes all the adds on sankaku.
// @namespace   https://greasyfork.org/users/155308
// @include     *://*.sankakucomplex.com/*
// @version     1.0.0
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/373240/Sankaku%20Adds%20Remover%20%28development%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373240/Sankaku%20Adds%20Remover%20%28development%20version%29.meta.js
// ==/UserScript==

window.addEventListener('beforescriptexecute', function(e){
	var t = e.target;
	if( !t.src )
	{
		var h = t.innerHTML || '';
		if( (h.indexOf('eval') != -1 && h.indexOf('YIUjsaCNRpis') != -1) ||
			(h.indexOf('document.writeln') != -1 && (
				h.indexOf('/javascript/ps.js') != -1 ||
				h.indexOf('/javascript/ls.12.js') != -1 ||
				h.indexOf('BetterJsPop') != -1 ||
				h.indexOf('otaserve.net') != -1 ))
		)
		{
			console.log("adds-script has been stoped: ", t);
			e.preventDefault();
		}
	}
});
document.addEventListener('DOMContentLoaded', function(){
	if( !window.MutationObserver )
		window.MutationObserver = window.WebkitMutationObserver;
	var o = new MutationObserver(function(mutations, observer){
		var frames;
		for( var m of mutations)
		{
			for( var node of m.addedNodes )
			{
				if( node.nodeType != 1 )
					continue;
				else if( node.tagName == 'IFRAME' )
					checkFrame(node);
				else if( (frames = node.querySelectorAll('iframe')).length )
				{
					[].forEach.call(frames, function(frame){
						checkFrame(frame);
					});
				}
			}
		}
	});
	o.observe( document.querySelector('body'), {'childList': true, 'subtree': true});
	[].forEach.call(document.querySelectorAll('iframe'), function(frame){
		checkFrame(frame);
	});
});
function checkFrame(frame)
{
	var regex = /otaserve\.net/;
	if( regex.test(frame.src) || regex.test(frame.getAttribute('data-src')) )
	{
		frame.parentNode.removeChild(frame);
		console.log("adds-frame has been removed: ", frame);
	}else{
		var o = new MutationObserver(function(mutations, observer){
			for(var m of mutations)
			{
				if( regex.test(m.target.getAttribute(m.attributeName)) )
				{
					m.target.parentNode.removeChild(m.target);
					console.log("-adds-frame has been removed: ", m.target);
					observer.disconnect();
				}
			}
		});
		o.observe( frame, {'attributes': true, 'attributeFilter': ['src']});
	}
}