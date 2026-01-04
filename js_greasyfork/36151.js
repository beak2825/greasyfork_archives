// ==UserScript==
// @name				ConCon Collector Plus Online ver.
// @namespace			http://www.TakeAsh.net/
// @author				nsmr0604(org:take-ash)
// @description			modify 'ConCon Collector' site
// @ujs:category		general: enhancements
// @ujs:published		2016-07-14 23:00
// @version				1.0.201607142300.mod
// @include				http://concon-collector.com/*
// @include				http://c4.concon-collector.com/*
// @downloadURL https://update.greasyfork.org/scripts/36151/ConCon%20Collector%20Plus%20Online%20ver.user.js
// @updateURL https://update.greasyfork.org/scripts/36151/ConCon%20Collector%20Plus%20Online%20ver.meta.js
// ==/UserScript==

(function(){
if ( ! location.host.match( /concon-collector\.com/ ) ) {
	return;
}

/* 実スクリプト追加 */
var cccpScriptElm = document.createElement('script');
cccpScriptElm.id = 'cccpScript';
cccpScriptElm.type = 'text/javascript';
//cccpScriptElm.src = 'http://www.takeash.net/Etc/CCCollector/CCCP/CCCP.user.js';
cccpScriptElm.src = 'http://greasyfork.org/scripts/36150-concon-collector-plus/code/ConCon%20Collector%20Plus.user.js';
document.getElementsByTagName('body')[0].appendChild(cccpScriptElm);

})();

// EOF
