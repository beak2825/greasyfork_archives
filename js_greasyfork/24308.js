// ==UserScript==
// @name         WME GLR State Scripts
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2018.02.22.01
// @description  Consolidation of state scripts (validator/counties/cities) for GLR states
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @author       JustinS83
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/24308/WME%20GLR%20State%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/24308/WME%20GLR%20State%20Scripts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function bootstrap(tries) {
        tries = tries || 1;

        if (W &&
            W.map &&
            W.model &&
            WazeWrap.Interface &&
            $) {
            init();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
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
        var $section = $("<div>", {style:"padding:8px 16px", id:"GLRStateSections"});

        var $OHsection = $("<div>", {style:"padding:8px 16px", id:"GLROHScriptsSettings"});
        $OHsection.html([
            '<div style="font-weight:bold">Ohio</div>',
            '<div title="OH Validator Localization, Author: Xanderb" id="divGLROHValidatorLocalization" class="controls-container"><input type="checkbox" id="_cbGLROHValidatorLocalizationEnable" name="StateValidator" /><label for="_cbGLROHValidatorLocalizationEnable">OH Validator Localization <a href="https://greasyfork.org/en/scripts/8746-wme-validator-localization-for-ohio" target="_blank">...</a></label></div>',
            '<div title="OH Counties 2014, Author: rickzable" class="controls-container"><input type="checkbox" id="_cbGLROHCounties2014Enable" /><label for ="_cbGLROHCounties2014Enable"> OH Counties 2014 <a href="https://greasyfork.org/scripts/11240-wme-counties-ohio-census-2014" target="_blank">...</a></label></div>',
            '<div title="OH Cities 2014-1, Author: JustinS83" class="controls-container"><input type="checkbox" id="_cbGLROHCities20141Enable" /><label for ="_cbGLROHCities20141Enable"> OH Cities 2014-1 <a href="https://greasyfork.org/scripts/17391-wme-ohio-cities-census-2014-1" target="_blank">...</a></label></div>',
            '<div title="OH Cities 2014-2, Author: JustinS83" class="controls-container"><input type="checkbox" id="_cbGLROHCities20142Enable" /><label for ="_cbGLROHCities20142Enable"> OH Cities 2014-2 <a href="https://greasyfork.org/scripts/17392-wme-ohio-cities-census-2014-2" target="_blank">...</a></label></div>',
        ].join(' '));

        var $INsection = $("<div>", {style:"padding:8px 16px", id:"GLRINScriptsSettings"});
        $INsection.html([
            '<div style="font-weight:bold">Indiana</div>',
            '<div title="IN Validator Localization, Author: Xanderb" id="divINValidatorLocalization" class="controls-container"><input type="checkbox" id="_cbGLRINValidatorLocalizationEnable" name="StateValidator" /><label for="_cbGLRINValidatorLocalizationEnable">IN Validator Localization <a href="https://greasyfork.org/en/scripts/8433-wme-validator-localization-for-indiana" target="_blank">...</a></label></div>',
            '<div title="IN Counties 2014, Author: rickzable" class="controls-container"><input type="checkbox" id="_cbGLRINCounties2014Enable" /><label for ="_cbGLRINCounties2014Enable"> IN Counties 2014 <a href="https://greasyfork.org/en/scripts/11442-wme-counties-indiana-census-2014" target="_blank">...</a></label></div>',
        ].join(' '));

        var $ILsection = $("<div>", {style:"padding:8px 16px", id:"GLRILScriptsSettings"});
        $ILsection.html([
            '<div style="font-weight:bold">Illinois</div>',
            '<div title="IL Validator Localization, Author: Xanderb" id="divILValidatorLocalization" class="controls-container"><input type="checkbox" id="_cbGLRILValidatorLocalizationEnable" name="StateValidator" /><label for="_cbGLRILValidatorLocalizationEnable">IL Validator Localization <a href="https://greasyfork.org/en/scripts/8747-wme-validator-localization-for-illinois" target="_blank">...</a></label></div>',
            '<div title="IL Counties 2014, Author: rickzable" class="controls-container"><input type="checkbox" id="_cbGLRILCounties2014Enable" /><label for ="_cbGLRILCounties2014Enable"> IL Counties 2014 <a href="https://greasyfork.org/en/scripts/8297-wme-counties-illinois-census-2014" target="_blank">...</a></label></div>',
        ].join(' '));

        var $WIsection = $("<div>", {style:"padding:8px 16px", id:"GLRWIScriptsSettings"});
        $WIsection.html([
            '<div style="font-weight:bold">Wisconsin</div>',
            '<div title="WI Validator Localization, Author: Xanderb" id="divWIValidatorLocalization" class="controls-container"><input type="checkbox" id="_cbGLRWIValidatorLocalizationEnable" name="StateValidator" /><label for="_cbGLRWIValidatorLocalizationEnable">WI Validator Localization <a href="https://greasyfork.org/en/scripts/8748-wme-validator-localization-for-wisconsin" target="_blank">...</a></label></div>',
            '<div title="WI Counties 2014, Author: rickzable" class="controls-container"><input type="checkbox" id="_cbGLRWICounties2014Enable" /><label for ="_cbGLRWICounties2014Enable"> WI Counties 2014 <a href="https://greasyfork.org/en/scripts/11498-wme-counties-wisconsin-census-2014" target="_blank">...</a></label></div>',
        ].join(' '));

        var $MIsection = $("<div>", {style:"padding:8px 16px", id:"GLRMIScriptsSettings"});
        $MIsection.html([
            '<div style="font-weight:bold">Michigan</div>',
            '<div title="MI Validator Localization, Author: Xanderb" id="divMIValidatorLocalization" class="controls-container"><input type="checkbox" id="_cbGLRMIValidatorLocalizationEnable" name="StateValidator" /><label for="_cbGLRMIValidatorLocalizationEnable">MI Validator Localization <a href="https://greasyfork.org/en/scripts/8749-wme-validator-localization-for-michigan" target="_blank">...</a></label></div>',
            '<div title="MI Counties 2014, Author: rickzable" class="controls-container"><input type="checkbox" id="_cbGLRMICounties2014Enable" /><label for ="_cbGLRMICounties2014Enable"> MI Counties 2014 <a href="https://greasyfork.org/en/scripts/11453-wme-counties-michigan-census-2014" target="_blank">...</a></label></div>',
            '<div title="MI Drive Total Closures Only, Author: vaindil" class="controls-container"><input type="checkbox" id="_cbGLRMIDriveTotalClosures" /><label for="_cbGLRMIDriveTotalClosures">MI Drive Total Closures <a href="https://greasyfork.org/en/scripts/15672-mi-drive-total-closures-only" target="_blank">...</a></label></div>',
        ].join(' '));

        $section.append($OHsection);
        $section.append($INsection);
        $section.append($ILsection);
        $section.append($WIsection);
        $section.append($MIsection);

        new WazeWrap.Interface.Tab('GLR Scripts', $section.html(), initializeSettings);
    }

    function initializeSettings(){
        $('input[name^="StateValidator"]').change(function () {
            $('input[name^="StateValidator"]').not(this).prop('checked', false);
        });

        loadOhio();
        loadIndiana();
        loadIllinois();
        loadWisconsin();
        loadMichigan();
    }

    function loadOhio(){
        var storedOptionsStr = localStorage.GLR_OHScripts;

        if(!localStorage.GLR_OHScripts)
            storedOptionsStr = localStorage.OHScripts;

        var options =  storedOptionsStr ? JSON.parse(storedOptionsStr) : [0, true, true, false, false, true];
        setChecked('_cbGLROHValidatorLocalizationEnable', options[1]);
        setChecked('_cbGLROHCounties2014Enable', options[2]);
        setChecked('_cbGLROHCities20141Enable', options[3]);
        setChecked('_cbGLROHCities20142Enable', options[4]);

        if(!localStorage.GLR_OHScripts){
            SaveSettings();
            localStorage.removeItem("OHScripts");
        }

        $('input[id^="_cbGLROH"]').change(function() { SaveSettings(); });

        if(!$('#OHScriptsSettings')){
            if(options[1])
                $.getScript("https://greasyfork.org/scripts/8746-wme-validator-localization-for-ohio/code/WME%20Validator%20Localization%20for%20Ohio.user.js");

            if(options[2])
                $.getScript("https://greasyfork.org/scripts/26450-wme-counties-ohio-census-2014-justins83-fork/code/WME%20Counties%20Ohio%20Census%202014%20(JustinS83%20fork).user.js");

            if(options[3])
                $.getScript("https://greasyfork.org/scripts/17391-wme-ohio-cities-census-2014-1/code/WME%20Ohio%20Cities%20Census%202014%20-%201.user.js");

            if(options[4])
                $.getScript("https://greasyfork.org/scripts/17392-wme-ohio-cities-census-2014-2/code/WME%20Ohio%20Cities%20Census%202014%20-%202.user.js");
        }

        
    }

    function loadIndiana(){
        var storedOptionsStr = localStorage.GLR_INScripts;

        var options =  storedOptionsStr ? JSON.parse(storedOptionsStr) : [0, false, false];
        setChecked('_cbGLRINValidatorLocalizationEnable', options[1]);
        setChecked('_cbGLRINCounties2014Enable', options[2]);

        $('input[id^="_cbGLRIN"]').change(function() { SaveSettings(); });

        if(options[1])
            $.getScript("https://greasyfork.org/scripts/8433-wme-validator-localization-for-indiana/code/WME%20Validator%20Localization%20for%20Indiana.user.js");

        if(options[2])
            $.getScript("https://greasyfork.org/scripts/11442-wme-counties-indiana-census-2014/code/WME%20Counties%20Indiana%20Census%202014.user.js");
    }

    function loadIllinois(){
        var storedOptionsStr = localStorage.GLR_ILScripts;

        var options =  storedOptionsStr ? JSON.parse(storedOptionsStr) : [0, false, false];
        setChecked('_cbGLRILValidatorLocalizationEnable', options[1]);
        setChecked('_cbGLRILCounties2014Enable', options[2]);

        $('input[id^="_cbGLRIL"]').change(function() { SaveSettings(); });

        if(options[1])
            $.getScript("https://greasyfork.org/scripts/8747-wme-validator-localization-for-illinois/code/WME%20Validator%20Localization%20for%20Illinois.user.js");

        if(options[2])
            $.getScript("https://greasyfork.org/scripts/8297-wme-counties-illinois-census-2014/code/WME%20Counties%20Illinois%20Census%202014.user.js");
    }

    function loadWisconsin(){
        var storedOptionsStr = localStorage.GLR_WIScripts;

        var options =  storedOptionsStr ? JSON.parse(storedOptionsStr) : [0, false, false];
        setChecked('_cbGLRWIValidatorLocalizationEnable', options[1]);
        setChecked('_cbGLRWICounties2014Enable', options[2]);

        $('input[id^="_cbGLRWI"]').change(function() { SaveSettings(); });

        if(options[1])
            $.getScript("https://greasyfork.org/scripts/8748-wme-validator-localization-for-wisconsin/code/WME%20Validator%20Localization%20for%20Wisconsin.user.js");

        if(options[2])
            $.getScript("https://greasyfork.org/scripts/11498-wme-counties-wisconsin-census-2014/code/WME%20Counties%20Wisconsin%20Census%202014.user.js");
    }

    function loadMichigan(){
        var storedOptionsStr = localStorage.GLR_MIScripts;

        var options =  storedOptionsStr ? JSON.parse(storedOptionsStr) : [0, false, false, false];
        setChecked('_cbGLRMIValidatorLocalizationEnable', options[1]);
        setChecked('_cbGLRMICounties2014Enable', options[2]);
        setChecked('_cbGLRMIDriveTotalClosures', options[3]);

        $('input[id^="_cbGLRMI"]').change(function() { SaveSettings(); });

        if(options[1])
            $.getScript("https://greasyfork.org/scripts/8749-wme-validator-localization-for-michigan/code/WME%20Validator%20Localization%20for%20Michigan.user.js");

        if(options[2])
            $.getScript("https://greasyfork.org/scripts/11453-wme-counties-michigan-census-2014/code/WME%20Counties%20Michigan%20Census%202014.user.js");

        if(options[3])
            $.getScript("https://greasyfork.org/scripts/15672-mi-drive-total-closures-only/code/Mi%20Drive%20-%20Total%20Closures%20Only.user.js");
    }

    function SaveSettings(){
        if (localStorage) {
            var options = [];
            // preserve previous options which may get lost after logout
            if (localStorage.GLR_OHScripts) { options = JSON.parse(localStorage.GLR_OHScripts); }
            options[1] = isChecked('_cbGLROHValidatorLocalizationEnable');
            options[2] = isChecked('_cbGLROHCounties2014Enable');
            options[3] = isChecked('_cbGLROHCities20141Enable');
            options[4] = isChecked('_cbGLROHCities20142Enable');
            options[5] = isChecked('GLRFCDisplay');
            localStorage.GLR_OHScripts = JSON.stringify(options);

            var ILoptions = [];
            if (localStorage.GLR_ILScripts) { options = JSON.parse(localStorage.GLR_ILScripts); }
            ILoptions[1] = isChecked('_cbGLRILValidatorLocalizationEnable');
            ILoptions[2] = isChecked('_cbGLRILCounties2014Enable');
            localStorage.GLR_ILScripts = JSON.stringify(ILoptions);

            var INoptions = [];
            if (localStorage.GLR_INScripts) { options = JSON.parse(localStorage.GLR_INScripts); }
            INoptions[1] = isChecked('_cbGLRINValidatorLocalizationEnable');
            INoptions[2] = isChecked('_cbGLRINCounties2014Enable');
            localStorage.GLR_INScripts = JSON.stringify(INoptions);

            var WIoptions = [];
            if (localStorage.GLR_WIScripts) { options = JSON.parse(localStorage.GLR_WIScripts); }
            WIoptions[1] = isChecked('_cbGLRWIValidatorLocalizationEnable');
            WIoptions[2] = isChecked('_cbGLRWICounties2014Enable');
            localStorage.GLR_WIScripts = JSON.stringify(WIoptions);

            var MIoptions = [];
            if (localStorage.GLR_MIScripts) { options = JSON.parse(localStorage.GLR_MIScripts); }
            MIoptions[1] = isChecked('_cbGLRMIValidatorLocalizationEnable');
            MIoptions[2] = isChecked('_cbGLRMICounties2014Enable');
            MIoptions[3] = isChecked('_cbGLRMIDriveTotalClosures');
            localStorage.GLR_MIScripts = JSON.stringify(MIoptions);
		}
    }

})();