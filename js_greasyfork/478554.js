// ==UserScript==
// @name           WME one.network helper
// @description    Retains just the reference when pasting the share URL
// @namespace      https://github.com/CW-UK/WMEOneNetworkHelper
// @version        0.7.4
// @match           *://*.waze.com/*editor*
// @exclude         *://*.waze.com/user/editor*
// @author         Craig24x7, JamesKingdom
// @license        MIT
// @grant          GM_setValue
// @grant          GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/478554/WME%20onenetwork%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/478554/WME%20onenetwork%20helper.meta.js
// ==/UserScript==

/* global $ */
/* global W */

(function() {

    'use strict';

    // wait for WME to be ready
    document.addEventListener("wme-ready", initOneNetHelper, {
        once: true
    });

    // initialise the script
    function initOneNetHelper() {
        createOneNetHelperTab();
        createOneNetHelperDefaults();
        console.log('WME one.network helper: Loaded');
    }

    // create default config settings
    function createOneNetHelperDefaults() {
        if (!GM_getValue('startTime')) { GM_setValue('startTime', '08:00'); }
        if (!GM_getValue('endTime')) { GM_setValue('endTime', '18:00'); }
        if (GM_getValue('onhEnabled').length < 1) { GM_setValue('onhEnabled', true); }
    }

    // create the tab in side panel
    function createOneNetHelperTab() {
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wme-onenethelper");
        var onhEnabledCheckbox = GM_getValue('onhEnabled') ? " checked" : "";
        tabLabel.innerText = '🚧';
        tabLabel.title = 'WME one.network Helper';
        tabPane.id = 'sidepanel-wme-onenethelper';
        tabPane.innerHTML = "<h3>one.network Helper</h3>";
        tabPane.innerHTML += '<hr style="border-top: 3px solid #bbb;" />';
        tabPane.innerHTML += '<input type="checkbox" id="wme-onenethelper-enabled"'+onhEnabledCheckbox+'> <label for="onhenabled">Enable script?</label>';
        tabPane.innerHTML += '<hr style="border-top: 3px solid #bbb;" />';
        tabPane.innerHTML += '<h6>Default Start/End Times</h6>';
        tabPane.innerHTML += 'Start at <input type="text" id="wme-onenethelperStartTime" value="' + GM_getValue('startTime') + '" style="width: 60px; text-align: center;"> ';
        tabPane.innerHTML += 'End at <input type="text" id="wme-onenethelperEndTime" value="' + GM_getValue('endTime') + '" style="width: 60px; text-align: center;"><br />';
        tabPane.innerHTML += '<hr style="border-top: 3px solid #bbb;" />';
        tabPane.innerHTML += '<h6>Settings</h6>';
        tabPane.innerHTML += 'auto-fill reference<br />';
        tabPane.innerHTML += 'replace one.net URLs with ref<br />';
        tabPane.innerHTML += 'auto-replace ref from pasted URL<br />';
        tabPane.innerHTML += 'only replace 00:00-23:59 times';
    }

    // Remove one.network URL from references, optionally include a space before.
    function stripOneNetworkStuff(input, space) {
        var refStr = space ? ' #' : '#';
        input = input.replace("URL: ", "");
        var regex = /(?:https\:.*\/\?)(?:GB|GBTMI|GMTM|tmi=)(\d{5,}).*/;
        return input.replace(regex, refStr + "$1");
        //return refStr + getOneNetworkRefRegex(input);
        // TODO: Remove this and just use regex to extract?
        /*
        if (input.includes("Schedule:")) { return refStr + getOneNetworkRefRegex(input); }
        var input1 = input.replace('https://one.network/?GBTMI', refStr);
        var input2 = input1.replace('https://one.network/?GB', refStr);
        var input3 = input2.replace('https://one.network/?tmi=GB', refStr);
        return input3;
        */
    }

    // Get the reference number using regex
    // TODO: Remove this if stripOneNetworkStuff works fine going forward
    function getOneNetworkRefRegex(input) {
        var regex = /(?:GB|GBTMI)(\d{5,})/;
        return input.match(regex)[1];
    }

    // Get the time from an input string in format 00:00
    function getTimeFromString(input) {
        var regex = /(\d{2}\:\d{2})/;
        return input.match(regex)[1];
    }

    // Update the time in a way that WME accepts
    function changeTimeField($element, newtime) {
        $element.trigger({
            type: "changeTime.timepicker",
            time: {
                value: newtime,
                hours: newtime.substring(0, 2),
                minutes: newtime.substring(3, 5),
                seconds: 0,
                meridian: 0
            }
        });
    }

    // Trigger when user moves away from description and convert URLs to references
    $(document).on('blur', '#closure_reason', function() {
        $(this).val(stripOneNetworkStuff(this.value, false));
    });

    // Fill reference from MP when focus is given (by default in WME when opening the closure panel)
    $(document).on('focus', '#closure_reason', function() {
        var infoElem = $('#panel-container > div > div > div.top-section > div > div > div > div.collapsible.content > p.extraInfo');
        var startElem = $('#panel-container > div > div > div.top-section > div > div > div > div.collapsible.content > div.startTime');
        var endElem = $('#panel-container > div > div > div.top-section > div > div > div > div.collapsible.content > div.endTime');
        if (infoElem.length > 0) {
            if ($(this).val().length > 0) {
                return;
            }
            $(this).val(stripOneNetworkStuff(infoElem.text(), true));
            var startTime = getTimeFromString(startElem.text());
            var endTime = getTimeFromString(endElem.text());
            //changeTimeField($("#edit-panel div.closures div.form-group.start-date-form-group > div.date-time-picker > div > input"), GM_getValue('startTime'));
            //changeTimeField($("#edit-panel div.closures div.form-group.end-date-form-group > div.date-time-picker > div > input"), GM_getValue('endTime'));
            changeTimeField($("#edit-panel div.closures div.form-group.start-date-form-group > div.date-time-picker > div > input"), startTime);
            changeTimeField($("#edit-panel div.closures div.form-group.end-date-form-group > div.date-time-picker > div > input"), endTime);
        }
    });

    // Update settings from script tab
    $(document).on('change', '#wme-onenethelper-enabled', function() { // enable/disable checkbox
        if (this.checked) { GM_setValue("onhEnabled", true); console.log("enabled"); }
        else { GM_setValue('onhEnabled', false); console.log("disabled"); }
    });
    $(document).on('keyup', '#wme-onenethelperStartTime', function() { // default start time
        GM_setValue('startTime', $(this).val());
    });
    $(document).on('keyup', '#wme-onenethelperEndTime', function() { // default end time
        GM_setValue('endTime', $(this).val());
    });

})();
