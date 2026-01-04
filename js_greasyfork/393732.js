// ==UserScript==
// @id             iitc-plugin-copy-portal-location@odrick
// @name           IITC plugin: Copy portal location to the clipboard
// @author Odrick
// @category       Portal info
// @license MIT
// @version        0.0.2
// @description    Add copy portal location button to portal info panel
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/393732/IITC%20plugin%3A%20Copy%20portal%20location%20to%20the%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/393732/IITC%20plugin%3A%20Copy%20portal%20location%20to%20the%20clipboard.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    plugin_info.buildName = 'Copy portal location button';
    plugin_info.dateTimeVersion = '20191413000500';
    plugin_info.pluginId = 'iitc-plugin-copy-portal-location@odrick';

    window.plugin.copyPortalLocation = function() {};

    window.plugin.copyPortalLocation.copyLocation = function(lat, lng) {
    	var val = lat + ', ' + lng;

        var textArea = document.createElement("textarea");
        textArea.value = val;
        textArea.style.position="fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');

            if(successful) {
                var hint = document.createElement("div");
                hint.innerHTML = "Copied " + val;
                document.body.appendChild(hint);
                hint.style.position = "fixed";
                hint.style.display = "block";
                hint.style.left = "50%";
                hint.style.top = "50%";
                hint.style.transform = "translate(-50%, -50%)";
                hint.style.zIndex = 100500;
                hint.style.padding = "4px";
                hint.style.background = "#fff";
                hint.style.color = "#000";

                setTimeout(function() {
                    document.body.removeChild(hint);
                }, 1000)
            }
        }
        catch (err) {
        }

        document.body.removeChild(textArea);
    }

    window.plugin.copyPortalLocation.handlePortalSelect = function(data) {
        var portal = window.portals[data.guid];
        var location = portal.getLatLng();

        setTimeout(function() {
            if(document.getElementById("copy-portal-location-button")) {
                return;
            }

            $('<aside id="copy-portal-location-button"><a onclick="window.plugin.copyPortalLocation.copyLocation(' + location.lat + ', ' + location.lng + ');return false;">Copy location</a></aside>').appendTo($(".linkdetails"))
        }, 0);
    };

    function setup() {
        window.addHook('portalDetailsUpdated', window.plugin.copyPortalLocation.handlePortalSelect);
    }

    setup.info = plugin_info;

    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    if (window.iitcLoaded && typeof setup === 'function') setup();
}

var script = document.createElement('script');
var info = {};

if(typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    info.script = {
        version: GM_info.script.version,
        name: GM_info.script.name,
        description: GM_info.script.description
    };
}

var textContent = document.createTextNode('('+ wrapper +')('+ JSON.stringify(info) +')');
script.appendChild(textContent);
(document.body || document.head || document.documentElement).appendChild(script);