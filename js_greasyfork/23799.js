// ==UserScript==
// @name         WME OH Scripts
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2021.06.19.01
// @description  Recommended scripts for editing in Ohio
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @author       JustinS83
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/23799/WME%20OH%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/23799/WME%20OH%20Scripts.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */
/* global $ */

(function() {
    'use strict';

    // Your code here...
    function bootstrap(tries = 1) {
        if (W &&
            W.map &&
            W.model &&
            WazeWrap.Ready &&
            $) {
            init();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(++tries);}, 200);
        }
    }

    bootstrap();

    function isChecked(id) {
        return $('#' + id).is(':checked');
    }

    function setChecked(id, checked) {
        $('#' + id).prop('checked', checked);
    }

    function init(){
        var $section = $("<div>", {style:"padding:8px 16px", id:"OHScriptsSettings"});
        $section.html([
            '<p>',
            '<div><a href="https://www.waze.com/forum/viewforum.php?f=943" target="_blank">Great Lakes Region forum</a></br>',
            '<a href="https://www.waze.com/forum/viewforum.php?f=261" target="_blank">Ohio forum</a></br>',
            '<a href="https://wazeopedia.waze.com/wiki/USA/Ohio" target="_blank">Ohio wiki</a>',
            '</div>',
            '<hr>',
            '<div title="OH Validator Localization, Author: Xanderb" id="divOHValidatorLocalization" class="controls-container"><input type="checkbox" id="_cbOHValidatorLocalizationEnable" /><label for="_cbOHValidatorLocalizationEnable">OH Validator Localization <a href="https://greasyfork.org/en/scripts/8746-wme-validator-localization-for-ohio" target="_blank">...</a></label></div>',
            '<div title="OH Counties 2014, Author: rickzable" class="controls-container"><input type="checkbox" id="_cbOHCounties2014Enable" /><label for ="_cbOHCounties2014Enable"> OH Counties 2014 <a href="https://greasyfork.org/en/scripts/26450-wme-counties-ohio-census-2014-justins83-fork" target="_blank">...</a></label></div>',
            '<div title="OH Cities 2014-1, Author: JustinS83" class="controls-container"><input type="checkbox" id="_cbOHCities20141Enable" /><label for ="_cbOHCities20141Enable"> OH Cities 2014-1 <a href="https://greasyfork.org/scripts/17391-wme-ohio-cities-census-2014-1" target="_blank">...</a></label></div>',
            '<div title="OH Cities 2014-2, Author: JustinS83" class="controls-container"><input type="checkbox" id="_cbOHCities20142Enable" /><label for ="_cbOHCities20142Enable"> OH Cities 2014-2 <a href="https://greasyfork.org/scripts/17392-wme-ohio-cities-census-2014-2" target="_blank">...</a></label></div>',
            '<hr>',
            '<div class="controls-container"><button type="button" id="_btnLoadTIMS">Open in TIMS</button><input type="radio" style="display:block" name="TIMSOptions" id="FCDisplay" /><label for="FCDisplay" title="Function Classification Display">FC Display</label><input type="radio" style="display:block" name="TIMSOptions" id="CRDisplay"/><label for="CRDisplay" title="County Road Display">CR Display</label></div>',
            '<div class="controls-container"><button type="button" id="_btnOpenGMM">Open in Google Maps</button></div>',
            '<div class="controls-container"><button type="button" id="_btnOpenCAGIS">Open in CAGIS</button></div>',
            '</p>'
        ].join(' '));
        new WazeWrap.Interface.Tab('OH Scripts', $section.html(), initializeSettings);
    }

    function CAGISButtonClick(){
        //http://www.arcgis.com/apps/webappviewer/index.html?center=-84.38982,39.16987,4326&extent=1432531.5982,431576.3841,1432984.2024,431800.3424,102723
        var center_lonlat = WazeWrap.Geometry.ConvertTo4326(W.map.getCenter().lon, W.map.getCenter().lat);
        var TopLeft, BottomRight;
        var extent = W.map.getExtent();
        TopLeft = WazeWrap.Geometry.ConvertTo4326(extent.left, extent.bottom);
        BottomRight = WazeWrap.Geometry.ConvertTo4326(extent.right, extent.top);
        var lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
        var lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
        window.open('http://www.arcgis.com/apps/webappviewer/index.html?center=' + lon + ',' + lat + ',4326&extent=' + TopLeft.lon + ',' + TopLeft.lat + ',' + BottomRight.lon + ',' + BottomRight.lat + ',4326', 'CAGIS');
    }

    function GMMButtonClick(){
        var center_lonlat = WazeWrap.Geometry.ConvertTo4326(W.map.getCenter().lon, W.map.getCenter().lat);
        var lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
        var lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
        console.log(center_lonlat);
        window.open('https://www.google.com/maps/@' + lat + ',' + lon + ',' +( W.map.zoom + 12) + 'z', 'Google Maps');
    }

    function TIMSButtonClick(){
        var center_lonlat = WazeWrap.Geometry.ConvertTo4326(W.map.getCenter().lon, W.map.getCenter().lat);
        var topleft = WazeWrap.Geometry.ConvertTo4326(W.map.getExtent().left, W.map.getExtent().top);
        var bottomright = WazeWrap.Geometry.ConvertTo4326(W.map.getExtent().right, W.map.getExtent().bottom);
        var lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
        var lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
        var spn = Math.abs(topleft.lat - bottomright.lat) + ',' + Math.abs(topleft.lon - bottomright.lon);
        var newZoom = (W.map.zoom + 12);
        if($('#FCDisplay').is(':checked')) //FC display
            window.open('https://gis.dot.state.oh.us/tims/map?center=' + lon + ',' + lat + '&level=' + newZoom + '&visiblelayers=odot-osip-1:0,1%7Codot-osip-2:0,3%7CAssets:-1%7CBoundaries:2%7CEnvironmental:-1%7CProjects:-1%7CRoadway%20Information:9%7CStrategic%20Transportation%20System:-1%7CSafety:-1', 'ODOT TIMS');
        else //CR display
            window.open('https://gis.dot.state.oh.us/tims/map?center=' + lon + ',' + lat + '&level=' + newZoom + '&visiblelayers=Assets:-1|Environmental:-1|Projects:-1|Roadway%20Information:8|Strategic%20Transportation%20System:-1','ODOT TIMS');
    }

    function initializeSettings(){
        var storedOptionsStr = localStorage.GLR_OHScripts;

        if(!localStorage.GLR_OHScripts)
            storedOptionsStr = localStorage.OHScripts;

        var options =  storedOptionsStr ? JSON.parse(storedOptionsStr) : [0, true, true, false, false, true];
        setChecked('_cbOHValidatorLocalizationEnable', options[1]);
        setChecked('_cbOHCounties2014Enable', options[2]);
        setChecked('_cbOHCities20141Enable', options[3]);
        setChecked('_cbOHCities20142Enable', options[4]);

        if(!localStorage.GLR_OHScripts){
            SaveSettings();
            localStorage.removeItem("OHScripts");
        }

        if(options[5])
            setChecked('FCDisplay', true);
        else
            setChecked('CRDisplay', true);

        $('input[id^="_cbOH"]').change(function() { SaveSettings(); });
        $('input[id^="_cbOH"]').change(function() {
            var layerName = "";
            if(this.id === "_cbOHCities20141Enable"){
                if(this.checked){
                    if(!W.map.getLayerByUniqueName('__OhioCities1'))
                        $.getScript("https://greasyfork.org/scripts/17391-wme-ohio-cities-census-2014-1/code/WME%20Ohio%20Cities%20Census%202014%20-%201.user.js");
                    else
                        toggleLayerVisible('__OhioCities1', true);
                }
                else{
                    toggleLayerVisible('__OhioCities1', false);
                }
            }
            else if(this.id === "_cbOHCities20142Enable"){
                if(this.checked){
                    if(!W.map.getLayerByUniqueName('__OhioCities2'))
                        $.getScript("https://greasyfork.org/scripts/17392-wme-ohio-cities-census-2014-2/code/WME%20Ohio%20Cities%20Census%202014%20-%202.user.js");
                    else
                        toggleLayerVisible('__OhioCities2', true);
                }
                else{
                    toggleLayerVisible('__OhioCities2', false);
                }
            }
            else if(this.id === "_cbOHCounties2014Enable"){
                if(this.checked){
                    if(!W.map.getLayerByUniqueName('__Ohio'))
                        $.getScript("https://greasyfork.org/scripts/26450-wme-counties-ohio-census-2014-justins83-fork/code/WME%20Counties%20Ohio%20Census%202014%20(JustinS83%20fork).user.js");
                    else
                        toggleLayerVisible('__Ohio', true);
                }
                else{
                    toggleLayerVisible('__Ohio', false);
                }
            }
        });

        $('#FCDisplay').change(function() { SaveSettings(); });
        $('#CRDisplay').change(function() { SaveSettings(); });
        $('#_btnLoadTIMS').click(TIMSButtonClick);
        $('#_btnOpenGMM').click(GMMButtonClick);
        $('#_btnOpenCAGIS').click(CAGISButtonClick);

        if(options[1])
            $.getScript("https://greasyfork.org/scripts/8746-wme-validator-localization-for-ohio/code/WME%20Validator%20Localization%20for%20Ohio.user.js");

        if(options[2])
            $.getScript("https://greasyfork.org/scripts/26450-wme-counties-ohio-census-2014-justins83-fork/code/WME%20Counties%20Ohio%20Census%202014%20(JustinS83%20fork).user.js");

        if(options[3]){
            if(!W.map.getLayerByUniqueName('__OhioCities1')){
                $.getScript("https://greasyfork.org/scripts/17391-wme-ohio-cities-census-2014-1/code/WME%20Ohio%20Cities%20Census%202014%20-%201.user.js");
                //W.map.getLayerByUniqueName('__OhioCities1').displayInLayerSwitcher = false;
            }
        }

        if(options[4]){
             if(!W.map.getLayerByUniqueName('__OhioCities1')){
                 $.getScript("https://greasyfork.org/scripts/17392-wme-ohio-cities-census-2014-2/code/WME%20Ohio%20Cities%20Census%202014%20-%202.user.js");
                 //W.map.getLayerByUniqueName('__OhioCities2').displayInLayerSwitcher = false;
             }
        }
    }

    function toggleLayerVisible(layerName, visible){
        if(visible)
            W.map.getLayerByUniqueName(layerName).div.style.display = 'block';
        else
            W.map.getLayerByUniqueName(layerName).div.style.display = 'none';
        W.map.getLayerByUniqueName(layerName).visibility = visible;
    }

    function SaveSettings(){
        if (localStorage) {
            var options = [];
            // preserve previous options which may get lost after logout
            if (localStorage.GLR_OHScripts) { options = JSON.parse(localStorage.GLR_OHScripts); }
            options[1] = isChecked('_cbOHValidatorLocalizationEnable');
            options[2] = isChecked('_cbOHCounties2014Enable');
            options[3] = isChecked('_cbOHCities20141Enable');
            options[4] = isChecked('_cbOHCities20142Enable');
            options[5] = isChecked('FCDisplay');
            localStorage.GLR_OHScripts = JSON.stringify(options);
		}
    }
})();