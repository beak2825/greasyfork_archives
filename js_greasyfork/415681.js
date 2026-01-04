// ==UserScript==
// @id             iitc-plugin-copy-portal-id@odrick
// @name           IITC plugin: Copy portal ID to the clipboard
// @author Odrick
// @category       Portal info
// @license MIT
// @version        0.0.1
// @description    Add copy portal id button to portal info panel
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
// @downloadURL https://update.greasyfork.org/scripts/415681/IITC%20plugin%3A%20Copy%20portal%20ID%20to%20the%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/415681/IITC%20plugin%3A%20Copy%20portal%20ID%20to%20the%20clipboard.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    plugin_info.buildName = 'Copy portal id button';
    plugin_info.dateTimeVersion = '201201101000500';
    plugin_info.pluginId = 'iitc-plugin-copy-portal-id@odrick';

    window.plugin.copyPortalId = function() {};

    window.plugin.copyPortalId.copyId = function(id) {
        var val = id + '';

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

    window.plugin.copyPortalId.handlePortalSelect = function(data) {
        setTimeout(function() {
            if(document.getElementById("copy-portal-id-button")) {
                return;
            }

            $('<aside id="copy-portal-id-button"><a onclick="window.plugin.copyPortalId.copyId(\'' + data.guid + '\');return false;">Copy ID</a></aside>').appendTo($(".linkdetails"))
        }, 0);
    };

    function setup() {
        window.addHook('portalDetailsUpdated', window.plugin.copyPortalId.handlePortalSelect);
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