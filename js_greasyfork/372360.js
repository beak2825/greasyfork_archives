// ==UserScript==
// @name         Waze Route Point
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Learning to script!
// @author       You
// @include      https://beta.waze.com/*
// @include      https://www.waze.com/forum/*
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js?version=229392
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372360/Waze%20Route%20Point.user.js
// @updateURL https://update.greasyfork.org/scripts/372360/Waze%20Route%20Point.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var settings = {};
    var wazedevSelectedLayer;

    function bootstrap(tries = 1) {
        if (W && W.map &&
            W.model && W.loginManager.user &&
            $ ) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function init()
    {
        wazedevSelectedLayer = new OL.Layer.Vector("wazedevSelectedLayer",{uniqueName: "__wazedevSelectedLayer"});
        W.map.addLayer(wazedevSelectedLayer);
        wazedevSelectedLayer.setVisibility(true);

        var $section = $("<div>");
        $section.html([
            '<div>',
            '<h2>Our First Script!</h2>',
            '<input type="checkbox" id="wazedevEnabled" class="wazedevSettingsCheckbox"><label for="wazedevEnabled">Enabled</label>',
            '<hr>',
            '<div>',
            '<h3>User Info</h3>',
            'Username: <span id="wazedevUsername"></span></br>',
            'Rank: <span id="wazedevRank"></span></br>',
            'Total edits: <span id="wazedevTotalEdits"></span></br>',
            'Total points: <span id="wazedevTotalPoints"></span></br>',
            'Area manager: <span id="wazedevAM"></span></br>',
            'Editable areas: <span id="wazedevEditableAreas"></span>',
            '</div>',
            '</div>'
        ].join(' '));

        new WazeWrap.Interface.Tab('WazeGo', $section.html(), initializeSettings);
    }

    function initializeSettings()
    {
        loadSettings();
        setChecked('wazedevEnabled', settings.Enabled);

        $('#wazedevUsername').text(W.loginManager.user.userName);
        $('#wazedevRank').text(W.loginManager.user.normalizedLevel);
        $('#wazedevTotalEdits').text(W.loginManager.user.totalEdits);
        $('#wazedevTotalPoints').text(W.loginManager.user.totalPoints);
        $('#wazedevAM').text(W.loginManager.user.isAreaManager);
        $('#wazedevEditableAreas').text(W.loginManager.user.areas.length);

        if(settings.Enabled)
            W.selectionManager.events.register("selectionchanged", null, drawSelection);

        $('.wazedevSettingsCheckbox').change(function() {
             var settingName = $(this)[0].id.substr(7);
            settings[settingName] = this.checked;
            saveSettings();
            if(this.checked)
                W.selectionManager.events.register("selectionchanged", null, drawSelection);
            else
            {
                W.selectionManager.events.unregister("selectionchanged", null, drawSelection);
                wazedevSelectedLayer.removeAllFeatures();
            }
        });
    }

    function drawSelection()
    {
        if(W.selectionManager.hasSelectedItems())
        {
            let style = {strokeColor: "red", strokeLinecap: "round", strokeWidth: 12, fill: false};

            let geo = W.selectionManager.selectedItems[W.selectionManager.selectedItems.length-1].model.geometry.clone();
            var feature = new OL.Feature.Vector(geo, {}, style);
            wazedevSelectedLayer.addFeatures([feature]);
        }
        else
            wazedevSelectedLayer.removeAllFeatures();
    }

    function setChecked(checkboxId, checked) {
        $('#' + checkboxId).prop('checked', checked);
    }

    function saveSettings() {
        if (localStorage) {
            var localsettings = {
                Enabled: settings.Enabled
            };

            localStorage.setItem("wavedev_Settings", JSON.stringify(localsettings));
        }
    }

    function loadSettings() {
        var loadedSettings = $.parseJSON(localStorage.getItem("wavedev_Settings"));
        var defaultSettings = {
            Enabled: false,
        };
        settings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!settings.hasOwnProperty(prop))
                settings[prop] = defaultSettings[prop];
        }

    }

    bootstrap();
})();