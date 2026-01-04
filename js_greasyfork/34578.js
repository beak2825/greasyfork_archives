// ==UserScript==
// @name            WME Simple Permalink (from WME KeepMyLayers)
// @namespace       https://greasyfork.org/users/11629-TheLastTaterTot
// @version         2024.02.27.01
// @description     Shortens WME permalinks by removing any layer and filter specifications
// @author          TheLastTaterTot
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @exclude         https://www.waze.com/*user/editor/*
// @grant           none
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/18089/WME%20Simple%20Permalink%20%28from%20WME%20KeepMyLayers%29.user.js
// @updateURL https://update.greasyfork.org/scripts/18089/WME%20Simple%20Permalink%20%28from%20WME%20KeepMyLayers%29.meta.js
// ==/UserScript==
/* jshint -W097 */

/* global W */
/* global OL */
/* ecmaVersion 2017 */
/* global $ */
/* global I18n */
/* global _ */
/* global WazeWrap */
/* global require */
/* eslint curly: ["warn", "multi-or-nest"] */

function loadSettings() {
    var loadedSettings = $.parseJSON(localStorage.getItem("WMESimplePermalink_Settings"));
    var defaultSettings = {
        CopyPermalinkShortcut: ''
    };
    settings = loadedSettings ? loadedSettings : defaultSettings;
    for (var prop in defaultSettings){
        if (!settings.hasOwnProperty(prop))
            settings[prop] = defaultSettings[prop];
    }
}

function saveSettings() {
    if (localStorage) {
        var localsettings = {
            OrthogonalizeShortcut: settings.CopyPermalinkShortcut
        };

        for (var name in W.accelerators.Actions) {
            var TempKeys = "";
            if (W.accelerators.Actions[name].group == 'wmesimplepermalink') {
                if (W.accelerators.Actions[name].shortcut) {
                    if (W.accelerators.Actions[name].shortcut.altKey === true)
                        TempKeys += 'A';
                    if (W.accelerators.Actions[name].shortcut.shiftKey === true)
                        TempKeys += 'S';
                    if (W.accelerators.Actions[name].shortcut.ctrlKey === true)
                        TempKeys += 'C';
                    if (TempKeys !== "")
                        TempKeys += '+';
                    if (W.accelerators.Actions[name].shortcut.keyCode)
                        TempKeys += W.accelerators.Actions[name].shortcut.keyCode;
                }
                else
                    TempKeys = "-1";
                localsettings[name] = TempKeys;
            }
        }

        localStorage.setItem("WMESimplePermalink_Settings", JSON.stringify(localsettings));
    }
}


var initSimplePermalink = function() {
    if (!document.getElementById('kmlPLPlaceholder')) {        var kmlKeyPresses = Array(2);

        var getKMLPermalink = function(currPl) {
            var kmlShortPL = currPl.substr(currPl.lastIndexOf('editor')+6).replace(/&[^&]*Filter=[^&]*|&s=(\d+)/ig,'').replace("/", "");
            return location.origin + location.pathname + kmlShortPL;
        };

        var copyPL = function(PLtoCopy){
            copyToClipboard(PLtoCopy);

                $('#kmlPLTooltip')[0].style.display = 'none';
                $('#kmlPLTooltipCopied')[0].style.display = 'block';
                setTimeout(function() {
                    $('#kmlPLTooltipCopied')[0].style.display = 'none';
                }, 2000);
        };

        var createStitchedPL = function(){
            var newPL = $('#aKMLPermalink')[0].href;
            var lon = newPL.match(/&lon=(-?\d{1,2}\.\d+)/)[1];
            var lat = newPL.match(/&lat=(-?\d{1,2}\.\d+)/)[1];
            var zoom = newPL.match(/zoom=\d+/)[1];

            var centroid = W.map.getCenter().transform(W.map.projection, W.map.displayProjection);
            newPL = newPL.replace(lon, Math.round(centroid.lon * 100000) / 100000);
            newPL = newPL.replace(lat, Math.round(centroid.lat * 100000) / 100000);
            newPL = newPL.replace(zoom, W.map.zoom);

            let selectedFeatures = WazeWrap.getSelectedFeatures();
            if(selectedFeatures.length > 0){
                if(selectedFeatures[0].model.type === "mapComment")
                    newPL += `&mapComments=${selectedFeatures[0].model.attributes.id}`;
                else if(selectedFeatures[0].model.type === "venue")
                    newPL += `&venues=${selectedFeatures[0].model.attributes.id}`;
                else if(selectedFeatures[0].model.type === "segment"){
                    newPL += "&segments=";
                    for(let i=0; i<selectedFeatures.length; i++){
                        if((i+1) < selectedFeatures.length)
                            newPL += `${selectedFeatures[i].model.attributes.id},`;
                        else
                            newPL += `${selectedFeatures[i].model.attributes.id}`;
                    }
                }
            }

            copyPL(newPL);

        };

        var copyToClipboard = function(str) {
            var $temp = $('<input>');
            $('body').append($temp);
            $temp.val(str).select();
            document.execCommand('copy');
            $temp.remove();
        };

        var copyPLHotkeyEvent = function(e) {
            if (e.metaKey || e.ctrlKey) kmlKeyPresses[0] = true;
            if (e.which === 67) kmlKeyPresses[1] = true;
            if (kmlKeyPresses[0] && kmlKeyPresses[1]) {
                copyPL($('#aKMLPermalink')[0].href);
            }
        };

        loadSettings();
        new WazeWrap.Interface.Shortcut('CopyPLShortcut', 'Copy Permalink', 'wmesimplepermalink', 'Simple Permalink', settings.CopyPermalinkShortcut, createStitchedPL, null).add();

        //saves the set keyboard shortcut
        window.onbeforeunload = function() {
            saveSettings();
        };

        var kmlStyle = document.createElement("style");

        // Create CSS container element
        kmlStyle.type = "text/css";
        kmlStyle.id = "kml-css-container";
        kmlStyle.innerHTML = `
        .kml-pl-container { height: 25px; width: 48px; position: absolute; bottom: 0; right: 0; line-height: 24px; margin-right: 15px; margin-left: -24px; padding-left: 2px; visibility: visible; pointer-events: auto; }
        .kml-pl-container a:link, .kml-pl-container a:active, .kml-pl-container a:focus { text-decoration: none; background-image: none; outline: 0; -webkit-box-shadow: none; box-shadow: none; }
        .kml-pl-container>.fa-stack { height: 25px; width: 24px; margin-left: -2px; line-height: inherit; }
        .kml-pl-container>.fa-stack .fa-circle { font-size: 26px; line-height: 25px; bottom: 0px; }
        .kml-pl-container>.fa-stack .fa-link { font-size: 16px; line-height: 25px; bottom: 0px; }
        .kml-pl-tooltipbox { max-width: 99%; right: 0; white-space: normal; word-wrap: break-word; word-break: break-all; bottom: 25px; visibility: visible; margin-right: 15px; color: white; font-size: 8pt; background-color: transparent; pointer-events: none; position: absolute; }
        .kml-pl-tooltipbox>div { padding: 5px; border-radius: 5px; background-color: black; }
        .street-view-mode .kml-pl-container, .street-view-mode .kml-pl-tooltipbox { right: 50% !important; }`;

        document.head.appendChild(kmlStyle);

        var wazePermalinkEl = document.querySelector('.WazeControlPermalink>a.permalink'),
            wazeCopyPlNote = wazePermalinkEl.getAttribute('title'),
            kmlCurrentPl = getKMLPermalink(wazePermalinkEl.getAttribute('href')),
            wazeControlPermalinkEl = wazePermalinkEl.parentNode,
            kmlMapPLContainer = document.createElement('div'),
            kmlPLPlaceholder = document.createElement('div'),
            kmlPermalink;

        wazePermalinkEl.id = 'wazePermalink';

        kmlMapPLContainer.id = 'kmlPL';
        kmlMapPLContainer.style.position = 'absolute';
        kmlMapPLContainer.style.width = '100%';
        kmlMapPLContainer.style.bottom = '0px';
        kmlMapPLContainer.style.right = '0px';
        kmlMapPLContainer.style.visibility = 'hidden';
        kmlMapPLContainer.style.pointerEvents = 'none';
        kmlMapPLContainer.style.zIndex = 4;
        kmlMapPLContainer.innerHTML = '<div class="kml-pl-tooltipbox"><div id="kmlPLTooltip" style="display: none;"></div><div id="kmlPLTooltipCopied" style="display: none;"></div></div>' +
                                      '<div class="kml-pl-container" style="overflow: hidden; width: 25px;"><div id="kmlPermalink" class="fa-stack"></div></div>';
        document.getElementById('map').appendChild(kmlMapPLContainer);

        kmlPLPlaceholder.id = 'kmlPLPlaceholder';
        kmlPLPlaceholder.style.float = 'right';
        kmlPLPlaceholder.style.position = 'relative';
        kmlPLPlaceholder.style.bottom = '0px';
        kmlPLPlaceholder.style.right = '0px';
        kmlPLPlaceholder.style.height = '25px';
        kmlPLPlaceholder.style.width = '25px';
        kmlPLPlaceholder.style.marginRight = '-4px';
        kmlPLPlaceholder.style.marginLeft = '-24px';
        kmlPLPlaceholder.style.backgroundColor = '#E9E9E9';
        wazeControlPermalinkEl.appendChild(kmlPLPlaceholder);

        //-------------------------
        kmlPermalink = document.getElementById('kmlPermalink');
        kmlPermalink.innerHTML = '<a id="aKMLPermalink" href="' + kmlCurrentPl + '"><span class="fa fa-circle fa-stack-1x" style="color: #59899E;"></span><span class="fa fa-link fa-stack-1x fa-inverse"></span></a>';
        //-------------------------
        // PL address popup
        document.getElementById('kmlPLTooltip').innerHTML = '<span id="tooltipKMLPermalink">' + kmlCurrentPl + '</span><p></p><b>' + wazeCopyPlNote + '</b>';
        // "Copied" popup
        document.getElementById('kmlPLTooltipCopied').innerHTML = '<b>' + I18n.translations[I18n.locale].footer.link_copied + '</b>';

        //------------------------------------------------------------------
        kmlPermalink.addEventListener('mouseenter', function(e) {
            var changedThisPl = getKMLPermalink(wazePermalinkEl.getAttribute('href'));

            document.getElementById('tooltipKMLPermalink').innerHTML = changedThisPl;
            document.getElementById('aKMLPermalink').setAttribute('href', changedThisPl);
            document.getElementById('kmlPLTooltip').style.display = 'block';
            window.addEventListener('keydown', copyPLHotkeyEvent, false);
        }, false);

        kmlPermalink.addEventListener('mouseleave', function() {
            kmlKeyPresses = Array(2);
            document.getElementById('kmlPLTooltip').style.display = 'none';
            document.getElementById('kmlPLTooltipCopied').style.display = 'none';
            window.removeEventListener('keydown', copyPLHotkeyEvent);
        }, false);

        try {
            // Hide WME permalink, but allow TB to overrule with display: none;
            wazePermalinkEl.style.visibility = 'hidden';
            document.getElementsByClassName('livemap-link')[0].style.paddingRight = '50px';
        } catch (err) {}
    }
};

function bootstrap(tries = 1) {
    if (W && W.map && W.model && $ && $('.WazeControlPermalink').length > 0 && WazeWrap.Ready)
        initSimplePermalink();
    else if (tries < 1000)
        setTimeout(function () {bootstrap(tries++);}, 200);
}

bootstrap();
