// ==UserScript==
// @author         Odrick
// @name           IITC plugin: Highlight unique portals
// @description    Highlight unique portals by capture, visit or scout controller
// @category       Highlighter
// @version        0.0.8
// @id             highlight-unique-portals
// @match          https://*.ingress.com/*
// @match          http://*.ingress.com/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @include        https://*.ingress.com/*
// @include        http://*.ingress.com/*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @grant          none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/421453/IITC%20plugin%3A%20Highlight%20unique%20portals.user.js
// @updateURL https://update.greasyfork.org/scripts/421453/IITC%20plugin%3A%20Highlight%20unique%20portals.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    plugin_info.buildName = 'odrick@highlight-unique-portals';
    plugin_info.dateTimeVersion = '2021-02-08-220302';
    plugin_info.pluginId = 'highlight-unique-portals';

    var CAPTURED = 0b10;
    var VISITED = 0b01;
    var SCOUT_CONTROLLED = 0b100;

    function isHistoryExists(data) {
        return true;
        //return data && data.portal && data.portal.options && data.portal.options.ent[2] && data.portal.options.ent[2][18] !== undefined;
    }

    function checkHistory(data, flag) {
        var history = data.portal.options.ent[2][18] || 0;
        return (history & flag) !== 0;
    }

    function highlightInverse(data, flag) {
        if(!isHistoryExists(data)) {
            data.portal.setStyle({fillColor: '#666666', fillOpacity: 0.5});
            return;
        }

        if(!checkHistory(data, flag)) {
            data.portal.setStyle({fillColor: '#ff0000', fillOpacity: 0.75});
        }
    }

    function highlight(data, flag) {
        if(checkHistory(data, flag)) {
            data.portal.setStyle({fillColor: '#ff0000', fillOpacity: 0.75});
        }
    }

    var e = {};

    e.highlightCaptured = function(data) {
        highlight(data, CAPTURED);
    }

    e.highlightVisited = function(data) {
        highlight(data, VISITED);
    }

    e.highlightScoutControlled = function(data) {
        highlight(data, SCOUT_CONTROLLED);
    }

    e.highlightNotCaptured = function(data) {
        highlightInverse(data, CAPTURED);
    }

    e.highlightNotVisited = function(data) {
        highlightInverse(data, VISITED);
    }

    e.highlightNotScoutControlled = function(data) {
        highlightInverse(data, SCOUT_CONTROLLED);
    }

    e.handlePortalSelect = function(data) {
        setTimeout(function() {
            highlightPortal(data.portal);

            //IITC CE
            if(document.getElementById("historydetails")) return;

            var info = document.getElementById("portal-history-info-container");

            if(info) {
                $(info).remove();
            }

            var content = '<div id="portal-history-info-container" style="text-align: center; padding-top: 6px">';

            if(isHistoryExists(data)) {
                content += '<b style="color: #fff">History:</b> ';
                content += '<span style="color: ' + (checkHistory(data, VISITED) ? '#66ff66' : '#ff6666' ) + '">visited</span>, ';
                content += '<span style="color: ' + (checkHistory(data, CAPTURED) ? '#66ff66' : '#ff6666' ) + '">captured</span>, ';
                content += '<span style="color: ' + (checkHistory(data, SCOUT_CONTROLLED) ? '#66ff66' : '#ff6666' ) + '">scout controlled</span> ';
            }
            else {
                content += '<b style="color: #fff">History missing</b>';
            }

            content += '</div>';

            $(content).appendTo($("#portaldetails"))
        }, 0);
    }

    window.plugin.highlightUniquePortals = e;

    function setup() {
        window.addPortalHighlighter('Unique - captured', window.plugin.highlightUniquePortals.highlightCaptured);
        window.addPortalHighlighter('Unique - visited', window.plugin.highlightUniquePortals.highlightVisited);
        window.addPortalHighlighter('Unique - scout controlled', window.plugin.highlightUniquePortals.highlightScoutControlled);

        window.addPortalHighlighter('Unique - not captured', window.plugin.highlightUniquePortals.highlightNotCaptured);
        window.addPortalHighlighter('Unique - not visited', window.plugin.highlightUniquePortals.highlightNotVisited);
        window.addPortalHighlighter('Unique - not scout controlled', window.plugin.highlightUniquePortals.highlightNotScoutControlled);

        window.addHook('portalDetailsUpdated', window.plugin.highlightUniquePortals.handlePortalSelect);
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