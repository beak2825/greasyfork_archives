// ==UserScript==
// @name            prueba rt
// @namespace     https://greasyfork.org/es/scripts/23723-waze-edit-ur-count-monitor
// @version         1.0.0
// @description     Displays your daily edit count in the WME toolbar.  Warns if you might be throttled. Owner MapOMatic.
// @author          Crotalo
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require         https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @license         GNU GPLv3
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @grant           GM_xmlhttpRequest
// @connect         www.waze.com

// @downloadURL https://update.greasyfork.org/scripts/421339/prueba%20rt.user.js
// @updateURL https://update.greasyfork.org/scripts/421339/prueba%20rt.meta.js
// ==/UserScript==

/* global W */
/* global GM_info */
/* global toastr */

// This function is injected into the page to allow it to run in the page's context.
function WECM_Injected() {
    'use strict';

    let _toastrSettings = {
        remindAtEditCount: 100,
        warnAtEditCount: 150,
        wasReminded: false,
        wasWarned: false
    };

    var debugLevel = 0;
    var $outputElem = null;
    var $outputElemContainer = null;
    var lastEditCount = null;
    var userName = null;
    var savesWithoutIncrease = 0;
    var lastURCount = null;
    var lastMPCount = null;
    var tooltipText = 'Go to Reporting Tool';

    function log(message, level) {
        if (message && level <= debugLevel) {
            console.log('Edit Count Monitor: ' + message);
        }
    }

    function checkEditCount() {
        window.postMessage(JSON.stringify(['wecmGetCounts',userName]),'*');
        _toastrSettings.wasReminded = false;
        _toastrSettings.wasWarned = false;
        toastr.remove();
    }

    function getChangedObjectCount() {
        let count = 0;
        let changed = W.model._getModifiedObjects();
        Object.keys(changed).forEach(key => {
            let obj = changed[key];
            count += obj.Insert.length + obj.Update.length + obj.Delete.length;
        });
        return count;
    }

    function updateEditCount(editCount, urCount, mpCount, noIncrement) {
        var textColor;
        var bgColor;
        var tooltipTextColor;



        // Add the counter div if it doesn't exist.
        if ($('#wecm-count').length === 0) {
             var projI=new OpenLayers.Projection("EPSG:900913");
    var projE=new OpenLayers.Projection("EPSG:4326");
    var center_lonlat=(new OpenLayers.LonLat(Waze.map.olMap.center.lon,Waze.map.olMap.center.lat)).transform(projI, projE);
    var lat=Math.round(center_lonlat.lat * 1000000)/1000000;
    var lon=Math.round(center_lonlat.lon * 1000000)/1000000;
            $outputElemContainer = $('<div>', {style:'position:relative; border-radius:23px; text-color:#354148; height:24px; padding-top:1px; padding-left:10px; padding-right:10px; display:block; float:right; margin-top:11px; font-weight:bold; font-size:medium;'});  //margin:9px 5px 8px 5px;  display:inline;
            $outputElem = $('<a>', {id: 'wecm-count',
                                    href: 'https://www.waze.com/reporting?env=row&lon='+lon +'&lat='+lat +'&lon='+ '&zoom='+ 17,
                                    target: '_blank',
                                    style:'text-decoration:none',
                                    'data-original-title': tooltipText});
            $outputElemContainer.append($outputElem);
            $('#edit-buttons').children().first().append($outputElemContainer);
            $outputElem.tooltip({
                placement: 'auto top',
                delay: {show: 100, hide: 100},
                html: true,
                template: '<div class="tooltip" role="tooltip" style="opacity:0.95"><div class="tooltip-arrow"></div><div class="my-tooltip-header" style="display:block;"><b></b></div><div class="my-tooltip-body tooltip-inner" style="display:block; font-weight:600; !important"></div></div>'
            });
        }

        log('edit count = ' + editCount + ', UR count = ' + urCount.count, 1);
        if (lastEditCount !== editCount || lastURCount.count !== urCount.count || lastMPCount !== mpCount.count) {
            savesWithoutIncrease = 0;
        } else {
            if (!noIncrement) savesWithoutIncrease += 1;
        }

        switch (savesWithoutIncrease) {
            case 0:
            case 1:
                textColor = '#354148';
                bgColor = '';
                tooltipTextColor = 'white';
                break;
            case 2:
                textColor = '#354148';
                bgColor = 'yellow';
                tooltipTextColor = 'black';
                break;
            default:
                textColor = 'white';
                bgColor = 'red';
                tooltipTextColor = 'white';
        }
        $outputElemContainer.css('background-color', bgColor);
        $outputElem.css('color', textColor).html('RT');
        $outputElem.attr('data-original-title', tooltipText + mpCountText + warningText);
        
    }

    function receiveMessage(event) {
        var msg;
        try {
            msg = JSON.parse(event.data);
        } catch (err) {
            // Do nothing
        }

        if (msg && msg[0] === 'wecmUpdateUi') {
            var editCount = msg[1][0];
            var urCount = msg[1][1];
            var mpCount = msg[1][2];
            updateEditCount(editCount, urCount, mpCount);
        }
    }

    function checkChangedObjectCount() {
        let objectEditCount = getChangedObjectCount();
        if (objectEditCount >= _toastrSettings.warnAtEditCount && !_toastrSettings.wasWarned) {
            toastr.remove();
            toastr.warning('You have edited at least ' + _toastrSettings.warnAtEditCount + ' objects. You should consider saving soon. ' +
                           'If you get an error while saving, you may need to undo some actions and try again.', 'Reminder from Edit Count Monitor:');
            _toastrSettings.wasWarned = true;
            //_toastrSettings.wasReminded = true;
        } else if (objectEditCount >= _toastrSettings.remindAtEditCount && !_toastrSettings.wasReminded) {
            toastr.remove();
            toastr.info('You have edited at least ' + _toastrSettings.remindAtEditCount + ' objects. You should consider saving soon.', 'Reminder from Edit Count Monitor:');
            _toastrSettings.wasReminded = true;
        } else if (objectEditCount < _toastrSettings.remindAtEditCount) {
            _toastrSettings.wasWarned = false;
            _toastrSettings.wasReminded = false;
            toastr.remove();
        }
    }

    function errorHandler(callback) {
        try {
            callback();
        } catch (ex) {
            console.error('Waze Edit Count Monitor:', ex);
        }
    }

    function init() {
        userName = W.loginManager.user.userName;
        // Listen for events from sandboxed code.
        window.addEventListener('message', receiveMessage);
        // Listen for Save events.

        $('head').append(
            $('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css'
            }),
            $('<style type="text/css">#toast-container {position: absolute;} #toast-container > div {opacity: 0.95;} .toast-top-center {top: 30px;}</style>')
        );
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js', function() {
            toastr.options = {
                target:'#map',
                timeOut: 9999999999,
                positionClass: 'toast-top-right',
                closeOnHover: false,
                closeDuration: 0,
                showDuration: 0,
                closeButton: true
                //preventDuplicates: true
            };
            W.model.actionManager.events.register('afterclearactions', null, () => errorHandler(checkEditCount));
            W.model.actionManager.events.register('afteraction', null, () => errorHandler(checkChangedObjectCount));
            W.model.actionManager.events.register('afterundoaction', null, () => errorHandler(checkChangedObjectCount));

            // Update the edit count first time.
            checkEditCount();
            log('Initialized.',0);
        });
    }

    function bootstrap() {
        if (W &&
            W.loginManager &&
            W.loginManager.events &&
            W.loginManager.events.register &&
            W.map &&
            W.loginManager.user) {
            log('Initializing...', 0);
            init();
        } else {
            log('Bootstrap failed. Trying again...', 0);
            window.setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }

    bootstrap();
}


// Code that is NOT injected into the page.
// Note that jQuery may or may not be available, so don't rely on it in this part of the script.
(function(){
    'use strict';

    function getEditorProfileFromSource(source) {
        var match = source.match(/gon.data=({.*?});gon.env=/i);
        return JSON.parse(match[1]);
    }

    function getEditCountFromProfile(profile) {
        var editingActivity = profile.editingActivity;
        return editingActivity[editingActivity.length-1];
    }

    function getEditCountByTypeFromProfile(profile, type) {
        let edits = profile.editsByType.find(edits => edits.key === type);
        return edits ? edits.value : -1;
    }

    // Handle messages from the page.
    function receiveMessage(event) {
        var msg;
        try {
            msg = JSON.parse(event.data);
        }
        catch (err) {
            // Ignore errors
        }

        if (msg && msg[0] === 'wecmGetCounts') {
            var userName = msg[1];
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://www.waze.com/user/editor/' + userName,
                onload: function(res) {
                    var profile = getEditorProfileFromSource(res.responseText);
                    window.postMessage(JSON.stringify(['wecmUpdateUi',[getEditCountFromProfile(profile), getEditCountByTypeFromProfile(profile,'mapUpdateRequest'), getEditCountByTypeFromProfile(profile,'machineMapProblem')]]),'*');
                }
            });
        }
    }


    var WECM_Injected_script = document.createElement('script');
    WECM_Injected_script.textContent = '' + WECM_Injected.toString() + ' \nWECM_Injected();';
    WECM_Injected_script.setAttribute('type', 'application/javascript');
    document.body.appendChild(WECM_Injected_script);

    // Listen for events coming from the page script.
    window.addEventListener('message', receiveMessage);
})();
