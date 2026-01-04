// ==UserScript==
// @id             iitc-plugin-portal-links-on-map@odrick
// @name           IITC plugin: Portal links on map
// @author Odrick
// @category       Portal info
// @license MIT
// @version        0.0.2
// @description    Show portal links and linked portals on map
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
// @downloadURL https://update.greasyfork.org/scripts/393149/IITC%20plugin%3A%20Portal%20links%20on%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/393149/IITC%20plugin%3A%20Portal%20links%20on%20map.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    plugin_info.buildName = 'Portal links on map';
    plugin_info.dateTimeVersion = '20191130163000';
    plugin_info.pluginId = 'iitc-plugin-portal-links-on-map@odrick';

    window.plugin.portalLinksOnMap = function () {};

    var viewOutOptions = {
        color: "#ff6666",
        opacity: 1,
        weight: 2,
        fill: false,
        interactive: false,
        clickable: false,
        radius: 8
    };

    var viewInOptions = {
        color: "#ffff66",
        opacity: 1,
        weight: 2,
        fill: false,
        interactive: false,
        clickable: false,
        radius: 8
    };

    var viewCurrentOptions = {
        color: "#ffffff",
        opacity: 1,
        weight: 2,
        fill: false,
        interactive: false,
        clickable: false,
        radius: 8
    };

    var viewCurrentFullOptions = {
        color: "#ff0000",
        opacity: 1,
        weight: 2,
        fill: false,
        interactive: false,
        clickable: false,
        radius: 8
    };

    function highLightLink(sourcePortal, isIn, guid) {
        var link = window.links[guid];

        var portalGuid;

        if(isIn) portalGuid = link.options.data.oGuid;
        else portalGuid = link.options.data.dGuid;

        var portal = window.portals[portalGuid];

        if(!portal) return;

        var options = isIn ? viewInOptions : viewOutOptions;

        L.circleMarker(portal.getLatLng(), options).addTo(viewLayer);
        L.geodesicPolyline([sourcePortal.getLatLng(), portal.getLatLng()], options).addTo(viewLayer);
    }

    window.plugin.portalLinksOnMap.handlePortalSelect = function(data) {
        viewLayer.clearLayers();

        var portal = window.portals[data.selectedPortalGuid];
        var links = getPortalLinks(data.selectedPortalGuid);

        for(var i=0; i<links.in.length; i++) {
            highLightLink(portal, true, links.in[i]);
        }

        for(i=0; i<links.out.length; i++) {
            highLightLink(portal, false, links.out[i]);
        }

        L.circleMarker(portal.getLatLng(), links.out.length >= 8 ? viewCurrentFullOptions : viewCurrentOptions).addTo(viewLayer);

        var outCount = L.marker(portal.getLatLng(), {
            icon: L.divIcon({
                className: 'plugin-portal-links-on-map-out',
                iconAnchor: [15,30],
                iconSize: [12,10],
                html: links.out.length + '↑'
            }),
            guid: data.selectedPortalGuid + '_out'
        });

        outCount.addTo(viewLayer);

        var inCount = L.marker(portal.getLatLng(), {
            icon: L.divIcon({
                className: 'plugin-portal-links-on-map-in',
                iconAnchor: [-5,30],
                iconSize: [12,10],
                html: links.in.length + '↓'
            }),
            guid: data.selectedPortalGuid + '_in'
        });

        inCount.addTo(viewLayer);
    };

    function setupCSS() {
        $("<style>")
            .prop("type", "text/css")
            .html(".plugin-portal-links-on-map-out {\
                       font-size: 14px;\
                       font-weight: bold;\
                       color: #ff9999;\
                       font-family: monospace;\
                       text-align: center;\
                       text-shadow: 0 0 3px black, 0 0 3px black, 0 0 3px black;\
                       pointer-events: none;\
                       -webkit-text-size-adjust:none;\
                       }\
                   .plugin-portal-links-on-map-in {\
                       font-size: 14px;\
                       font-weight: bold;\
                       color: #ffff66;\
                       font-family: monospace;\
                       text-align: center;\
                       text-shadow: 0 0 3px black, 0 0 3px black, 0 0 3px black;\
                       pointer-events: none;\
                       -webkit-text-size-adjust:none;\
                       }")
            .appendTo("head");
    }

    var viewLayer;

    function setup() {
        setupCSS();
        window.addHook('portalSelected', window.plugin.portalLinksOnMap.handlePortalSelect);
        viewLayer = new L.LayerGroup();
        window.addLayerGroup('Portal Links', viewLayer, false);
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