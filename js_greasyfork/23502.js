// ==UserScript==
// @id             iitc-plugin-waze-navigte
// @name           IITC plugin: Navigate to portal from waze
// @category       Controls
// @version        0.0.2.20161001.104955
// @namespace      waze
// @description    [local-2016-09-25-104955] Navigate to portal
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/23502/IITC%20plugin%3A%20Navigate%20to%20portal%20from%20waze.user.js
// @updateURL https://update.greasyfork.org/scripts/23502/IITC%20plugin%3A%20Navigate%20to%20portal%20from%20waze.meta.js
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'local';
plugin_info.dateTimeVersion = '20160925.104955';
plugin_info.pluginId = 'waze-navigate';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.waze = function() {};

window.plugin.waze.addLink = function(d) {
  var portal = window.selectedPortal;
  if (window.portals[portal]) {
    var lat = window.portals[portal].options.data.latE6/1000000;
    var lng = window.portals[portal].options.data.lngE6/1000000;
    var $link = $('#waze-link');
    if ($link.length == 0) {
      $link = $('body').append('<a id="waze-link" title="Navigate"></a></aside>');
      if (window.useAndroidPanes()) {
        $link.click(function(){
          window.prompt('Вставьте в браузер', $(this).attr('href'));
        })
      }
    }
    var url = 'waze://?ll=' + lat + ',' + lng + '&navigate=yes'
    $link.attr('href', url);
  }
}

var setup = function () {
  addHook('portalSelected', window.plugin.waze.addLink);

  $('head').append('<style>' +
      '#waze-link {' +
        'position: fixed;' +
        'display: block;' +
        'right: 0;' +
        'background-image: url(data:image/jpeg;base64,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);' +
        'background-size: contain;' +
        'bottom: 24px;' +
        'width: 30px;' +
        'z-index: 999999;' +
        'height: 30px;' +
    '}' +
    '</style>');
}


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

