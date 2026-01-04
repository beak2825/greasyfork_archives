// ==UserScript==
// @id             iitc-plugin-portals-Lanched@Lanched
// @name           IITC plugin: view portal locations
// @category       Layer
// @version        0.0.3
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @description    See all portals locations on map with any zoom
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/398402/IITC%20plugin%3A%20view%20portal%20locations.user.js
// @updateURL https://update.greasyfork.org/scripts/398402/IITC%20plugin%3A%20view%20portal%20locations.meta.js
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = function() {};
    window.plugin.lanched = function() {};

    window.plugin.lanched.getPortals = function()
    {
        window.plugin.lanched.cache = [];

        window.plugin.lanched.stopRefresh = false;

        window.plugin.lanched.addPortal = function(portal)
        {
            var render = window.mapDataRequest.render;

            if(!render.bounds.contains(L.latLng(portal.lat, portal.lng)))
                return console.log('out of bounds');

            render.createPortalEntity([
                portal.guid,
                0,
                [
                    'p',
                    0,
                    portal.lat * 1E6,
                    portal.lng * 1E6,
                    1,
                    0,
                    0,
                    null,
                    portal.name,
                    [],
                    false,
                    false,
                    null,
                    0
                ]
            ]);
        };

        window.plugin.lanched.refresh = function()
        {
            window.plugin.lanched.cache.forEach(window.plugin.lanched.addPortal);
        };

        window.addHook('mapDataRefreshStart', function(){
            setTimeout(window.plugin.lanched.refresh);
        });

        window.plugin.lanched.request(0);
    };

    window.plugin.lanched.request = function(offset)
    {
        if (offset === -1 || window.plugin.lanched.stopRefresh)
            return;

        console.log("Getting info with offset " + offset);

        var datatoSend = map.getBounds();

        $.ajax({
            type: "GET",
            url: "https://lanched.ru/PortalGet/getPortals.php",
            dataType: 'jsonp',
            crossDomain: true,
            data: {
                nelat: datatoSend._northEast.lat,
                nelng: datatoSend._northEast.lng,
                swlat: datatoSend._southWest.lat,
                swlng: datatoSend._southWest.lng,
                offset
            },
            success: function(data) {
                window.plugin.lanched.cache = window.plugin.lanched.cache.concat(data.portalData);
                data.portalData.forEach(window.plugin.lanched.addPortal);
                if (data.nextOffset !== -1) {
                    window.plugin.lanched.request(data.nextOffset);
                }
                if(window.plugin.portalNames)
                    window.plugin.portalNames.updatePortalLabels();
            },
            error: function(xhr) {
                alert('error');
            }
        });
    };

    window.plugin.lanched.stopGet = function() {
        window.plugin.lanched.stopRefresh = true;
    };
    //send info about current portal

    var setup = function() {
        $('#toolbox').append('<a onclick="window.plugin.lanched.getPortals();return false;" title="Get portals from Lanched" id="getPortals">GetPortals</a>');
        $('#toolbox').append('<a onclick="window.plugin.lanched.stopGet();return false;" title="Stop getting portals from Lanched" id="stopRefesh" visible="false">StopRefresh</a>');
    };

    // PLUGIN END //////////////////////////////////////////////////////////


    setup.info = plugin_info; //add the script info data to the function as a property
    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
};
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);

