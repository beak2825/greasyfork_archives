// ==UserScript==
// @id             iitc-plugin-hide-playerstat@kik0220
// @name           IITC plugin: Hide player stat
// @version        0.0.1.20150627.4522
// @namespace      https://github.com/kik0220
// @description    [kik0220-2015-06-27-004522] Hide player stat
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/11118/IITC%20plugin%3A%20Hide%20player%20stat.user.js
// @updateURL https://update.greasyfork.org/scripts/11118/IITC%20plugin%3A%20Hide%20player%20stat.meta.js
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'kik0220';
plugin_info.dateTimeVersion = '20150627.4522';
plugin_info.pluginId = 'hide-playerstat';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.hidePlayerStat = function() {};

window.plugin.hidePlayerStat.setup = function() {
  $('head').append('<style>' +
    '#playerstat { display: none; }' +
    '</style>');
};

var setup = window.plugin.hidePlayerStat.setup;

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);


