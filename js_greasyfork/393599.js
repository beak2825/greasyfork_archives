// ==UserScript==
// @id             iitc-plugin-portal-google-map-link@odrick
// @name           IITC plugin: Open portal in google navigator
// @author Odrick
// @category       Portal info
// @license MIT
// @version        0.0.6
// @description    Add google map navigator link to portal details
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
// @downloadURL https://update.greasyfork.org/scripts/393599/IITC%20plugin%3A%20Open%20portal%20in%20google%20navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/393599/IITC%20plugin%3A%20Open%20portal%20in%20google%20navigator.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    plugin_info.buildName = 'Portal link to google map';
    plugin_info.dateTimeVersion = '20191212000500';
    plugin_info.pluginId = 'iitc-plugin-portal-google-map-link@odrick';

    window.plugin.portalGoogleMapLink = function() {};

    window.plugin.portalGoogleMapLink.handlePortalSelect = function(data) {
        var portal = window.portals[data.guid];
        var location = portal.getLatLng();

        var url = 'https://www.google.com/maps/dir//';
        url += location.lat + ',' + location.lng;
        url += '/@';
        url += location.lat + ',' + location.lng;
        url += ',18z/data=!4m2!4m1!3e0';

        setTimeout(function() {
            if(document.getElementById("portal-google-map-link")) {
                return;
            }

            $('<aside id="portal-google-map-link"><a href="' + encodeURI(url) + '" target="_blank">Google navigator</a></aside>').appendTo($(".linkdetails"))
        }, 0);
    };

    function setup() {
        window.addHook('portalDetailsUpdated', window.plugin.portalGoogleMapLink.handlePortalSelect);
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