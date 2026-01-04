// ==UserScript==
// @name           WME Beta - Refresh Issue Tracker
// @description    Adds a refresh button to the new issue tracker
// @namespace      https://www.waze.com/user/editor/Craig24x7
// @version        0.4
// @match          https://beta.waze.com/editor*
// @match          https://beta.waze.com/*/editor*
// @author         Craig24x7
// @grant		   none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/458925/WME%20Beta%20-%20Refresh%20Issue%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/458925/WME%20Beta%20-%20Refresh%20Issue%20Tracker.meta.js
// ==/UserScript==

// Globals
/* global $ */
/* global W */

(function() {

    'use strict';
    const debug = false;

    var autoRefreshDelay = 60000; // ms - 1 minute
    var autoRefreshTrackerTimer;
    var refreshTrackerIconCode = '<i slot="trailing-icon" title="Refresh Issue Tracker" class="w-icon w-icon-refresh refresh-button" style="right: 45px; font-size: 18px; cursor: pointer; position: absolute; top:50%; transform: translateY(-50%);"></i>';
    var autoRefreshTrackerCode = '<wz-checkbox id="auto-refresh-tracker" checked="false" value="on">'
                               + '  <span tabindex="1">'
                               + '    <label class="wz-checkbox" tabindex="-1">'
                               + '      <input type="checkbox" value="on" style="display: none">'
                               + '    </label>'
                               + '  </span>'
                               + '  Auto Refresh Issue Tracker'
                               + '</wz-checkbox>';
    var autoRefreshState;

    // initialise script
    document.addEventListener("wme-initialized", initRefreshIcon, { once: true });

    // confirm script initialised properly
    function initRefreshIcon() {
        console.log('Refresh Issue Tracker: Loaded - Icon will be inserted the first time the sidebar is opened');
    }

    // add icon and checkbox to issue tracker
    function insertRefreshFeatures() {
        if (W.map.getZoom() < 12) {
            // don't bother doing anything if map is zoomed out beyond editable level
            if (debug) { console.log('Refresh Issue Tracker: Zoom warning is visible - not inserting icons'); }
            return;
        }

        // check if refresh icon is missing
        if ($('.refresh-button').length == 0) {
            $('.filter-selection-region:first-child').append(refreshTrackerIconCode);
            if (debug) { console.log('Refresh Issue Tracker: Icon inserted.'); }
        }

        // check if auto refresh checkbox is missing
        if ($('#auto-refresh-tracker').length == 0) {
            $('.issues-tracker-footer').append(autoRefreshTrackerCode);
            if (debug) { console.log('Refresh Issue Tracker: Auto refresh checkbox inserted.'); }

            // if zooming out removed the issue tracker panel and auto refresh was enabled, restore it
            if (autoRefreshState == 1 && !$('#auto-refresh-tracker')[0].checked) {
                if (debug) { console.log('Refresh Issue Tracker: Restoring after zooming out'); }
                autoRefreshTrackerTimer = setInterval(refreshTracker, autoRefreshDelay);
                $('#auto-refresh-tracker').prop('checked', true);
                autoRefreshState = 1;
            }

        }
    }

    function refreshTracker() {
        if (W.map.getZoom() < 12) {
            // don't bother doing anything if map is zoomed out beyond editable level
            if (debug) { console.log('Refresh Issue Tracker: Zoom warning is visible - not refreshing'); }
            return;
        }
        $("#feed-sync-with-map" ).prop( "checked", false );
        $('#feed-sync-with-map').trigger('click');
        $('#feed-sync-with-map').trigger('click');
        if (debug) { console.log('Refresh Issue Tracker: Refresh requested - updating'); }
    }

    // detect issue tracker panel being opened
    $(document).on('click', 'wz-navigation-drawer:first-child', insertRefreshFeatures);

    // listen for tracker refresh button being clicked
    $(document).on('click', '.refresh-button', function() {
        refreshTracker();
    });

    // process actions for auto refresh checkbox
    $(document).on('click', '#auto-refresh-tracker', function() {
        // enable auto refresh
        if ($('#auto-refresh-tracker')[0].checked) {
            autoRefreshTrackerTimer = setInterval(refreshTracker, autoRefreshDelay);
            autoRefreshState = 1;
            refreshTracker();
            if (debug) { console.log('Refresh Issue Tracker: Auto refresh enabled.'); }
        }
        // disable auto refresh
        else {
            clearInterval(autoRefreshTrackerTimer);
            autoRefreshState = 0;
            if (debug) { console.log('Refresh Issue Tracker: Auto refresh disabled.'); }
        }
    });

    // listen for mouse scroll, wait for side panel to load in and check if we need to re-insert icon and checkbox
    $(window).on('mousewheel', function() {
        if (debug) { console.log('Refresh Issue Tracker: Mouse scroll detected 2'); }
        setTimeout(insertRefreshFeatures, 2000); // wait for side panel to load in
    })

})();