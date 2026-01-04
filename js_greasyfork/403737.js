// ==UserScript==
// @author         Odrick
// @name           IITC plugin: Highlight portals by level
// @description    Highlight portals by level
// @category       Highlighter
// @version        0.0.1
// @id             highlight-portals-by-level
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @grant          none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/403737/IITC%20plugin%3A%20Highlight%20portals%20by%20level.user.js
// @updateURL https://update.greasyfork.org/scripts/403737/IITC%20plugin%3A%20Highlight%20portals%20by%20level.meta.js
// ==/UserScript==

function wrapper(plugin_info) {

if(typeof window.plugin !== 'function') window.plugin = function() {};

plugin_info.buildName = 'odrick@highlight-portals-by-level';
plugin_info.dateTimeVersion = '2020-05-19-160405';
plugin_info.pluginId = 'highlight-portals-by-level';

window.plugin.highlightPortalsByLevel = function() {};

function highlight(data, level) {
  if (data.portal.options.data.level === level) {
    data.portal.setStyle({fillColor: '#ff0000', fillOpacity: 0.75});
  }
}

window.plugin.highlightPortalsByLevel.colorLevel1 = function(data) {highlight(data, 1)};
window.plugin.highlightPortalsByLevel.colorLevel2 = function(data) {highlight(data, 2)};
window.plugin.highlightPortalsByLevel.colorLevel3 = function(data) {highlight(data, 3)};
window.plugin.highlightPortalsByLevel.colorLevel4 = function(data) {highlight(data, 4)};
window.plugin.highlightPortalsByLevel.colorLevel5 = function(data) {highlight(data, 5)};
window.plugin.highlightPortalsByLevel.colorLevel6 = function(data) {highlight(data, 6)};
window.plugin.highlightPortalsByLevel.colorLevel7 = function(data) {highlight(data, 7)};
window.plugin.highlightPortalsByLevel.colorLevel8 = function(data) {highlight(data, 8)};

var setup =  function() {
  window.addPortalHighlighter('Level 1', window.plugin.highlightPortalsByLevel.colorLevel1);
  window.addPortalHighlighter('Level 2', window.plugin.highlightPortalsByLevel.colorLevel2);
  window.addPortalHighlighter('Level 3', window.plugin.highlightPortalsByLevel.colorLevel3);
  window.addPortalHighlighter('Level 4', window.plugin.highlightPortalsByLevel.colorLevel4);
  window.addPortalHighlighter('Level 5', window.plugin.highlightPortalsByLevel.colorLevel5);
  window.addPortalHighlighter('Level 6', window.plugin.highlightPortalsByLevel.colorLevel6);
  window.addPortalHighlighter('Level 7', window.plugin.highlightPortalsByLevel.colorLevel7);
  window.addPortalHighlighter('Level 8', window.plugin.highlightPortalsByLevel.colorLevel8);
}

setup.info = plugin_info;
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);

if(window.iitcLoaded && typeof setup === 'function') setup();

}

var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);