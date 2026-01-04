// ==UserScript==
// @id             iitc-plugin-portal-yandex-map-link@odrick
// @name           IITC plugin: Open portal in yandex maps
// @author Odrick
// @category       Portal info
// @license MIT
// @version        0.0.1
// @description    Add yandex map link to portal details
// @include        https://*.ingress.com/*
// @include        http://*.ingress.com/*
// @match          https://*.ingress.com/*
// @match          http://*.ingress.com/*
// @grant          none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/435904/IITC%20plugin%3A%20Open%20portal%20in%20yandex%20maps.user.js
// @updateURL https://update.greasyfork.org/scripts/435904/IITC%20plugin%3A%20Open%20portal%20in%20yandex%20maps.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    plugin_info.buildName = 'Portal link to yandex map';
    plugin_info.dateTimeVersion = '20211121100500';
    plugin_info.pluginId = 'iitc-plugin-portal-yandex-map-link@odrick';

    window.plugin.portalYandexMapLink = function() {};

    window.plugin.portalYandexMapLink.handlePortalSelect = function(data) {
        var portal = window.portals[data.guid];
        var location = portal.getLatLng();

        var url = 'https://yandex.ru/maps/?';
        url += 'll=' + location.lng + ',' + location.lat;
        url += '&mode=routes&rtt=auto&ruri=~&z=14';
        url += '&rtext=~' + location.lat + ',' + location.lng;

        setTimeout(function() {
            if(document.getElementById("portal-yandex-map-link")) {
                return;
            }

            $('<aside id="portal-yandex-map-link"><a href="' + encodeURI(url) + '" target="_blank">Yandex</a></aside>').appendTo($(".linkdetails"))
        }, 0);
    };

    function setup() {
        window.addHook('portalDetailsUpdated', window.plugin.portalYandexMapLink.handlePortalSelect);
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