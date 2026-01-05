// ==UserScript==
// @name           SVG favicon Mozilla fix
// @name:fr        SVG favicon Mozilla correction
// @description    SVG favicon doesn't appear in Firefox prior to 41 version Motty Katan(c) 15-09-2015 last updated 15-09-2015
// @description:fr    On ne voit pas des SVG favicons dans les versions de Firefox qui précèdaient 41 Motty Katan(c) 15-09-2015 dernière mise à jour 15-09-2015
// @version 1.0.1
// @include       *
// @namespace https://greasyfork.org/users/14985
// @downloadURL https://update.greasyfork.org/scripts/12471/SVG%20favicon%20Mozilla%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/12471/SVG%20favicon%20Mozilla%20fix.meta.js
// ==/UserScript==
(function(){
	var isFirefox = navigator.userAgent.match(/Firefox\/(\d\d\.\d)/);
	if (isFirefox && isFirefox[1]<41){
		var oChildren = document.head.children;
		var i = -1;
		while (++i < oChildren.length && (oChildren[i].tagName != 'LINK' || (!oChildren[i].getAttribute('rel') || oChildren[i].getAttribute('rel').indexOf("icon")===-1) || (!oChildren[i].getAttribute('href') || oChildren[i].getAttribute('href').substr(-3).toLowerCase()=="svg") )){}	
		if (typeof(oChildren[i])!="undefined"){
			//refresh it since a svg file can delete previous icon
			oChildren[i].href = oChildren[i].href;
		}	
	}
})();
