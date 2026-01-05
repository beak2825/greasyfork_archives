// ==UserScript==
// @name                WME Closure Monitor Helper
// @namespace           http://userscripts.org/users/419370
// @description         Helps editor to create closures in WME for Closure Monitor
// @author              Timbones
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @version             2.65
// @grant               GM_xmlhttpRequest
// @connect             waze.cryosphere.co.uk
// @run-at              document-idle
// @downloadURL https://update.greasyfork.org/scripts/19275/WME%20Closure%20Monitor%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/19275/WME%20Closure%20Monitor%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var WMERC_lineLayer_path = null;

    var cifs_incident; // global copy of most recent incident

    function loadIncident(guid, callback) {
        cifs_incident = undefined;
        WMERC_lineLayer_path.destroyFeatures();

        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://waze.cryosphere.co.uk/datex/json/' + guid + '.json',
            responseType: "document",
            onload: function (response) {
                cifs_incident=JSON.parse(response.responseText);
                callback(cifs_incident);
            }
        });
    }

    function drawPolyline(incident) {
        // fetch polyline and draw in on the map
        var points = [];
        var polyline = incident.polyline.split(' ');
        for (var i = 0; i < polyline.length; i += 2) {
            var lonlat = new OpenLayers.LonLat(polyline[i+1], polyline[i]);
            var coords = lonlat.transform(W.Config.map.projection.remote, W.Config.map.projection.local);
            points.push(new OpenLayers.Geometry.Point(coords.lon,coords.lat));
        }
        var newline = new OpenLayers.Geometry.LineString(points);

        var lineStyle = { strokeColor: 'orange', strokeOpacity: 0.8, strokeWidth: 10 };
        var lineFeature = new OpenLayers.Feature.Vector(newline, {}, lineStyle);

        // add (S) and [E] labels
        var startLabel = new OpenLayers.Feature.Vector(points[0], {display: 'block', labelText: 'S', shape: 'circle'});
        var endLabel = new OpenLayers.Feature.Vector(points[points.length-1], {display: 'block', labelText: 'E', shape: 'square'});
        if (incident.detail.match(new RegExp("\((All|Both) Directions\)"))) {
            startLabel = new OpenLayers.Feature.Vector(points[0], {display: 'block', labelText: '=', shape: 'circle'});
            endLabel = new OpenLayers.Feature.Vector(points[points.length-1], {display: 'block', labelText: '=', shape: 'circle'});
        }
        // check if all points are the same
        var samePoints = true;
        var j = 1; while (j < points.length && samePoints) {
            samePoints &= points[0].toString() == points[j++].toString();
        }
        if (samePoints) { // ...and if they are, show (!) instead
            startLabel = new OpenLayers.Feature.Vector(points[0], {display: 'block', labelText: '!', shape: 'circle'});
            WMERC_lineLayer_path.addFeatures([lineFeature, startLabel]);
        }
        else {
            WMERC_lineLayer_path.addFeatures([lineFeature, startLabel, endLabel]);
        }

        if (W.selectionManager.hasSelectedFeatures()) {
            displayClosureInfo(incident);
        }
        else {
            W.controller.waitForAllMapDataToLoad().then(selectClosureSegments);
        }

        // hide junction nodes so that they can't be selected by mistake
        var nodes = document.getElementById(W.map.getLayerByUniqueName("nodes").id + "_root");
        nodes.style.visibility = "hidden";
    }

    function selectClosureSegments() {
        //console.log("selectClosureSegments");
        var segments = cifs_incident.segments;
        if (!Array.isArray(segments)) {
            segments = segments.split(',');
        }
        if (segments.length == 0) {
            return;
        }

        var objects = W.model.segments.getByIds(segments);
        if (objects.length > 0) {
            W.selectionManager.setSelectedModels(objects);
        }
    }

    function displayClosureInfo(incident) {
        // only active if closure is in view
        if (!isClosureVisible(incident)) {
            return;
        }

        // display diagnostic information about the closure
        var closures = $('.closures-list');
        if (typeof incident != 'undefined' && closures.length > 0) {
            // fix scrolling of closure list
            //$('.closures-list-items')[0].style.overflowY = 'visible';

            var infoBox = document.createElement('div');
            infoBox.id = "cm_info";
            infoBox.className = "message";
            infoBox.style.marginTop = "12px";
            infoBox.style.border = 'solid 1px silver';
            infoBox.style.padding = '4px';

            var details = document.createElement('p');
            details.innerHTML = '<b>' + getClosureStatus(incident) + " " + incident.description.replace(/ Ref #/, "</b><br>$&");
            infoBox.appendChild(details);

            if (incident.detail != '') {
                details = document.createElement('p');
                details.innerHTML = '<i> ' + incident.detail.replace(/\n/g, "<br>") + '</i>';
                infoBox.appendChild(details);
            }

            var location = document.createElement('p');
            location.innerHTML += '<b>Street:</b> <i>' + incident.location_description + '</i><br>';
            if (incident.starttime != null) {
                 location.innerHTML += '<b>Start:</b> ' + incident.starttime.replace('T', ' ').substr(0, 16) + '<br>';
            }
            if (incident.closedtime != null) {
                 location.innerHTML += '<b>Closed:</b> ' + incident.closedtime.replace('T', ' ').substr(0, 16) + '<br>';
            }
            if (incident.endtime != null) {
                 location.innerHTML += '<b>Until:</b> ' + incident.endtime.replace('T', ' ').substr(0, 16) + '<br>';
            }
            infoBox.appendChild(location);

            var logLine = document.createElement('p');
            logLine.innerHTML = ' &raquo; ';

            var logLink = document.createElement('a');
            logLink.href = 'https://waze.cryosphere.co.uk/ClosureMonitor/'+incident.id+'.log';
            logLink.innerText = 'Log';
            logLink.target = '_blank';
            logLine.appendChild(logLink);

            if (!incident.hasEnded) {
                logLine.appendChild(document.createTextNode(' | '));

                let recheck = document.createElement('u');
                recheck.innerText = 'Recheck';
                recheck.onclick = function() { remoteAction(incident.id, 'RECHECK', this); };
                recheck.style.color = 'blue';
                recheck.style.cursor = 'pointer';
                logLine.appendChild(recheck);
            }
            if (incident.status != 'IGNORED') {
                logLine.appendChild(document.createTextNode(' | '));

                let ignore = document.createElement('u');
                ignore.onclick = function() { remoteAction(incident.id, 'IGNORE', this); };
                ignore.innerText = 'Ignore';
                ignore.style.color = 'grey';
                ignore.style.cursor = 'pointer';
                logLine.appendChild(ignore);
            }
            if (incident.status == 'ACTIVE' && !incident.hasEnded) {
                logLine.appendChild(document.createTextNode(' | '));

                let badLink = document.createElement('u');
                badLink.onclick = function() { remoteAction(incident.id, 'ENDNOW', this); };
                badLink.innerText = 'End Now';
                badLink.style.color = 'red';
                badLink.style.cursor = 'pointer';
                logLine.appendChild(badLink);
            }
            if (incident.recorded == '' && incident.byuser != '') {
                logLine.appendChild(document.createTextNode(' | '));

                let saveLinks = document.createElement('u');
                saveLinks.onclick = function() { remoteAction(incident.id, 'SAVE_LINKS', this); };
                saveLinks.innerText = 'Save';
                saveLinks.style.color = 'green';
                saveLinks.style.cursor = 'pointer';
                logLine.appendChild(saveLinks);
            }
            infoBox.appendChild(logLine);

            if (incident.comments) {
                let comments = document.createElement('p');
                comments.innerHTML += '	&#128172; <i>' + incident.comments.replace(/\n/, "<br>") + '</i>';
                comments.style.paddingLeft = '20px';
                comments.style.textIndent = '-20px';
                infoBox.appendChild(comments);
            }

            if (incident.note) {
                let noteText = document.createElement('p');
                noteText.innerHTML += '&#128221; <i>' + incident.note + '</i>';
                noteText.style.paddingLeft = '20px';
                noteText.style.textIndent = '-20px';
                infoBox.appendChild(noteText);
            }

            closures[0].appendChild(infoBox);
        }

        // open the Closures tab
        window.setTimeout(focusClosures, 200);
    }

    function remoteAction(guid, action, source) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://waze.cryosphere.co.uk/datex/remote.php?guid=${guid}&action=${action}`,
            responseType: "document",
            onload: function (response) {
                //console.log(response);
                source.innerHTML += " &#x2705;";
            }
        });
    }

    function isClosureVisible(incident) {
        var polyline = incident.polyline.split(' ');
        for (var i = 0; i < polyline.length; i += 2) {
            var lonlat = new OpenLayers.LonLat(polyline[i+1], polyline[i]);
            if (W.map.isOnScreen(lonlat)) {
                return true;
            }
        }
        return false;
    }

    function focusClosures() {
        var tabs=document.querySelectorAll('#edit-panel wz-tabs')[0];
        if (tabs && tabs.shadowRoot) {
            tabs = tabs.shadowRoot.querySelectorAll('.wz-tab-label');
            for (var t = 0; t < tabs.length; t++) {
                var tab = tabs[t];
                if (tab.innerText == 'Closures' && !tab.classList.contains('active')) {
                    tab.click();
                    break;
                }
            }
        }

        // attach to add-closure-button
        var button = $('.add-closure-button')[0];
        button.addEventListener("click", function() {
            initClosureForm(cifs_incident);
        });

        // hide alert messages
        $('wz-alert wz-button').click()
    }

    function getClosureStatus(incident) {
        if (incident.status == 'IGNORED') {
            return '&#128683; <i>IGNORED</i><br>';
        }

        var closures = W.model.roadClosures.getObjectArray();
        for (var i in closures) {
            if (closures[i].reason == incident.description) {
                return incident.hasEnded ? '&#10060; ENDED<br>' : '&#9989;';
            }
        }

        // no closure found
        return incident.hasEnded ? '&#10004;' : '&#10145;&#65039; <i>NEW</i><br>';
    }

    function initClosureForm(incident) {
        // only active if closure is in view
        if (!isClosureVisible(incident)) {
            return;
        }

        var nodes = document.getElementById(W.map.getLayerByUniqueName("nodes").id + "_root");
        nodes.style.visibility = "visible";

        console.log("Closure Monitor Helper: attempting to set the form values");
        var form = $('#edit-panel div.closure form');

        var reason = form.find('wz-text-input[id="closure_reason"]');
        if (reason.val() != '') {
            // form has already been filled in, so this is probably a repeat
            return;
        }

        // set the Description to the GUID
        if (incident && reason) {
            reason.val(incident.description);
            reason.change();
        }

        // set begin time, sliding recurring closures to today
        var begin = new Date(incident.starttime);
        if (incident.recurring) {
            var today = new Date();
            while (begin.getDate() < today.getDate()) {
                begin.setDate(begin.getDate() + 1);
            }
        }

        // set the End Date (unless null)
        var endDate = form.find('wz-text-input#closure_endDate');
        var endTime = form.find('div.form-group.end-date-form-group wz-text-input.time-picker-input');
        if (incident.endtime != null) {
            // set end time, sliding recurring closures to before tomorrow
            var until = new Date(incident.endtime);
            if (incident.recurring) {
                var tomorrow = new Date();
                tomorrow.setDate(begin.getDate() + 1);
                while (until > tomorrow) {
                    until.setDate(until.getDate() - 1);
                }
            }

            if (endDate) {
                window.setTimeout(function() {
                    endDate.val(until.toLocaleDateString(I18n.locale));
                    endDate.blur();
                });
            }

            // set the End Time
            if (endTime) {
                endTime.val(until.toLocaleTimeString(I18n.locale, {timeStyle: 'short'}));
                endTime.blur();
            }
        }

        var startDate = form.find('wz-text-input#closure_startDate');
        var startTime = form.find('div.form-group.start-date-form-group wz-text-input.time-picker-input');

        // set the Start Date
        if (startDate) {
            window.setTimeout(function() {
                startDate.val(begin.toLocaleDateString(I18n.locale));
                startDate.blur();
            });
        }

        // set the Start Time
        if (startTime) {
            startTime.val(begin.toLocaleTimeString(I18n.locale, {timeStyle: 'short'}));
            startTime.blur();
        }

        // set the Event to "None"
        var eventId = form.find('wz-select[id="closure_eventId"]');
        if (eventId) {
            window.setTimeout(function() {
                eventId.find('wz-option')[0].click();
            }, 50);
        }

        // count properties of selected segments
        var ramps = 0;
        var roundabouts = 0;
        var hasClosures = 0;
        /*var segments = W.selectionManager.getSelectedFeatures();
        for (var i = 0; i < segments.length; i++) {
            var segment = segments[i].model;
            if (segment.attributes.roadType == 4) {
                ramps++;
            }
            if (segment.attributes.junctionID !== null) {
                roundabouts++;
            }
            if (segment.attributes.hasClosures === true) {
                hasClosures++;
            }
        }*/

        // helper function to remove segments from selection using filter function
        function removeSegments(filter) {
            var newselection = [];
            for (var i = 0; i < segments.length; i++) {
                if (filter(segments[i].model)) {
                    newselection.push(segments[i].model);
                }
            }
            W.selectionManager.setSelectedModels(newselection);

            // re-open closure form
            $('#edit-panel .contents .segment .nav-tabs a[href="#segment-edit-closures"').click();
            $('#edit-panel .closures .add-closure-button').click();
            return false;
        }

        // check if there are any ramp segments included in the selection
        if (ramps > 0 && ramps < segments.length) {
            var warning1 = $('#edit-panel .closures .form').prepend('<div id="selected-ramps" style="color: red">\u26a0\ufe0f some ramps selected - </div>');
            var fix1 = $('#selected-ramps').append('<a id="unselect-ramps" href="#">remove</a>');
            $('#unselect-ramps').click(function() {
                removeSegments(function(segment) {return segment.attributes.roadType != 4; });
            });
        }

        // check if there are any roundabout segments included in the selection
        if (roundabouts > 0 && roundabouts < segments.length) {
            var warning2 = $('#edit-panel .closures .form').prepend('<div id="selected-roundabouts" style="color: red">\u26a0\ufe0f roundabouts selected - </div>');
            var fix2 = $('#selected-roundabouts').append('<a id="unselect-roundabouts" href="#">remove</a>');
            $('#unselect-roundabouts').click(function() {
                removeSegments(function(segment) {return segment.attributes.junctionID === null; });
            });
        }

        // check if there are any already closed segments included in the selection
        if (hasClosures > 0) {
            var warning3 = $('#edit-panel .closures .form').prepend('<div id="selected-closures" style="color: red">\u26a0\ufe0f existing closures selected</div>');
            if (hasClosures < segments.length) {
                var fix3 = $('#selected-closures').append(' - <a id="unselect-closures" href="#">remove</a>');
                $('#unselect-closures').click(function() {
                    removeSegments(function(segment) {return segment.attributes.hasClosures === false; });
                });
            }
        }

        // additional tweaks to the UI that have to be done a little later
        window.setTimeout(function() {
            // warn about future closures
            var begin = new Date(incident.starttime);
            if (begin.getTime() > Date.now()) {
                var startError = $('div.form-group.start-date-form-group div.error-area');
                startError.html(`<div id="future-date" style="color: gray; text-align: center">&#128712; future start date</div>`);
            }

            // warn about recurring closures
            if (incident.recurring) {
                var endError = $('div.form-group.end-date-form-group div.error-area');
                endError.html(`<div style="color: red; text-align: center">&#128257; Closure is recurring until <b>${incident.recurring}</b></div>`);
            }

            // warn about two-way closures
            var direction = form.find('wz-select[id="closure_direction"]');
            if (direction.val() == 3 && incident.reference == 'HighwaysEng') {
                $('#edit-panel .closures .form .closure-direction-container').append('<div id="selected-2-way" style="color: red; text-align: center">\u26a0\ufe0f segment direction is <b>two-way</b></div>');
            }

            // hide closure nodes
            var nodes = document.getElementsByClassName('closure-nodes')[0];
            var group = nodes.getElementsByClassName('closure-nodes-region')[0];
            var label = nodes.getElementsByTagName('wz-label')[0];
            label.onclick = function() { group.style.display = group.style.display == 'none' ? 'block' : 'none'; };
            label.style.textDecoration = 'underline dotted blue';
            group.style.display = 'none';
        }, 50);
    }

    function initEvents() {
        if (W.loginManager.user == null) {
            W.loginManager.events.register("login", null, initEvents);
            console.log("Closure Monitor Helper: waiting for login");
            return;
        }

        console.log("Closure Monitor Helper: initialising");

        var style = new OpenLayers.Style({
            label : "${labelText}",
            fontFamily: "Tahoma, Arial, Verdana",
            labelAlign: 'cm',
            labelOutlineColor: 'black',
            labelOutlineWidth: 2,
            fontColor: 'white',
            fontOpacity: 1.0,
            fontSize: "12px",
            fontWeight: 'bold',
            pointRadius: 10,
            strokeColor: 'white',
            strokeWidth: 2,
            fillColor: '#222',
            graphicName: '${shape}'
        });

        WMERC_lineLayer_path = new OpenLayers.Layer.Vector("Closure Monitor Helper",
                                                   { displayInLayerSwitcher: false,
                                                     uniqueName: 'closure_polyline',
                                                     styleMap: new OpenLayers.StyleMap(style) }
                                                  );
        W.map.addLayer(WMERC_lineLayer_path);

        var params = new URLSearchParams(window.location.search);
        if (params.has('guid')) {
            // load incident data
            loadIncident(params.get('guid'), function(incident) {
                drawPolyline(incident, !params.get('lat'));
            });
        }

        var observer = new MutationObserver(function(mutations) {
            if (typeof cifs_incident == 'undefined') {
                return; // ssh!
            }
            function rescurse(node) {
                if (node.id == 'segment-edit-general') {
                    // ignore general tab
                }
                else if (node.className == 'closures-list') {
                    displayClosureInfo(cifs_incident);
                }
                else if (node.className == 'lanes-tab') {
                    // ignore lanes
                }
                else {
                    for (var j=0; j<node.childNodes.length; j++) {
                        rescurse(node.childNodes[j]);
                    }
                }
            }
            mutations.forEach(function(mutation) {
                for (var i=0; i<mutation.addedNodes.length; i++) {
                    rescurse(mutation.addedNodes[i]);
                }
            });
        });
        observer.observe(document.getElementById('edit-panel'), {childList: true, subtree: true});
    }

    // initialise script when WME is ready
    if (W?.userscripts?.state.isReady) {
        initEvents();
    } else {
        document.addEventListener("wme-ready", initEvents, {
            once: true,
        });
    }

    // listen for future GUID messages
    window.addEventListener("closuremonitor", (e) => {
        // detect whenever Permalink Loader has received a message
        console.log(`Closure Monitor Helper: loading guid ${e.detail} from Permalink Loader`);
        loadIncident(e.detail, function(incident) {
            drawPolyline(incident, true);
        });
    });
})();