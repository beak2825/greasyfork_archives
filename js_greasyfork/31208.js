// ==UserScript==

// @name        Die2Nite tools 2
// @version     1.0.13
// @author      Rulesy - rjdown@gmail.com
// @namespace   rulesy-die2nite
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_info
// @include     http://www.die2nite.com/*
// @description:en updater thingie
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js
// @require     http://greasyfork.org/scripts/31200-farbtastic/code/Farbtastic.js?version=204642
// @require     http://greasyfork.org/scripts/31199-app-js/code/appjs.js?version=204803
// @require     http://greasyfork.org/scripts/31206-updateapps/code/updateApps.js?version=204804
// @require     http://greasyfork.org/scripts/31205-scavengercountdown/code/scavengerCountdown.js?version=204647
// @require     http://greasyfork.org/scripts/31202-flashingescortbutton/code/flashingEscortButton.js?version=204644
// @require     http://greasyfork.org/scripts/31204-ghoulhungerpercentages/code/ghoulHungerPercentages.js?version=204646
// @require 		http://greasyfork.org/scripts/31201-mod-devtools/code/mod_devtools.js?version=204643
// @resource    style.css http://raw.githubusercontent.com/Miudod2n/die2nitestuff/master/style.css
// @description updater thingie

// @downloadURL https://update.greasyfork.org/scripts/31208/Die2Nite%20tools%202.user.js
// @updateURL https://update.greasyfork.org/scripts/31208/Die2Nite%20tools%202.meta.js
// ==/UserScript==

// @todo		names alone are not enough to identify some items. need to use images as well
// @todo		add a reset button to the flashing escort button config page	
// @todo		stop dtd updating when camped, because topology is unavailable but required
delete modules.updateApps.externalApps.cartographer;
var debugMode = true;

if (!debugMode) {
	delete modules.devtools;
}

window.log = function(data) {
	if (debugMode && this.console) {
		console.log(data);
	}
};

var remoteCssUrl = 'http://raw.githubusercontent.com/Miudod2n/die2nitestuff/master/';

// basic jquery mutation observer extension, fuck IE for now
$.fn.domChange = function(callback) {
		
	var mutations;
	var mutationObserver
	var selector;
	
	app.mutationObservers = app.mutationObservers || {};
	
	selector = this.selector;

	// kill any existing observers for this selector
	if (app.mutationObservers[selector]) {
		app.mutationObservers[selector].disconnect();
	}
	
	mutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	
	app.mutationObservers[selector] = new mutationObserver(function() {
		// run once, might need to make this a variable later...
		this.disconnect();

		callback();
	});
	
	mutations = {
		attributes: true,
		characterData: true,
		childList: true
	}

	this.each(function() {
		app.mutationObservers[selector].observe(this, mutations);
	});
	
}

// bootstrap
window.setInterval(function() {
	if ($('#appsettings').length == 0 && window.location.hash != '') {
		app.settings.init();
		app.init();
	}
}, 1000);