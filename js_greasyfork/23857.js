// ==UserScript==
// @name         WME Virginia DOT Reports
// @namespace    https://greasyfork.org/users/45389
// @version      2020.01.19.001
// @description  Display VA transportation department reports in WME.
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        GM_xmlhttpRequest
// @connect      iteriscdn.com
// @connect      511virginia.org

// @downloadURL https://update.greasyfork.org/scripts/23857/WME%20Virginia%20DOT%20Reports.user.js
// @updateURL https://update.greasyfork.org/scripts/23857/WME%20Virginia%20DOT%20Reports.meta.js
// ==/UserScript==

/* global $ */
/* global OpenLayers */
/* global GM_info */
/* global W */
/* global GM_xmlhttpRequest */
/* global unsafeWindow */
/* global Waze */
/* global Components */
/* global I18n */

(function() {
    'use strict';

    var _window = unsafeWindow ? unsafeWindow : window;

    var _settingsStoreName = 'va_dot_report_settings';
    var _alertUpdate = false;
    var _debugLevel = 0;
    var _scriptVersion = GM_info.script.version;
    var _scriptVersionChanges = [
        GM_info.script.name + '\nv' + _scriptVersion + '\n\nWhat\'s New\n------------------------------',
        '\n- All reports are displayed.'
    ].join('');

    var _imagesPath = 'https://github.com/mapomatic/wme-virginia-dot-reports/raw/master/images/';
    var _mapLayer = null;
    var _settings = {};
    var _tabDiv = {};  // stores the user tab div so it can be restored after switching back from Events mode to Default mode
    var _reports = [];
    var _lastShownTooltipDiv;
    var _tableSortKeys = [];
    var _columnSortOrder = ['properties.icon','properties.location_description','archived'];
    var _reportTitles = {weather_closure: 'WEATHER CLOSURE', incident: 'INCIDENT', construction: 'CONSTRUCTION', high_impact_incident: 'HIGH PRIORTITY INCIDENT' };

    function log(message, level) {
        if (message && level <= _debugLevel) {
            console.log('VA DOT Reports: ' + message);
        }
    }

    function saveSettingsToStorage() {
        if (localStorage) {
            var settings = {
                lastVersion: _scriptVersion,
                layerVisible: _mapLayer.visibility,
                state: _settings.state,
                hideArchivedReports: $('#hideVADotArchivedReports').is(':checked'),
                archivedReports:_settings.archivedReports
            };
            localStorage.setItem(_settingsStoreName, JSON.stringify(settings));
            log('Settings saved', 1);
        }
    }

    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var props = property.split('.');
            props.forEach(function(prop) {
                a = a[prop];
                b = b[prop];
            });
            var result = (a < b) ? -1 : (a > b) ? 1 : 0;
            return result * sortOrder;
        };
    }

    function dynamicSortMultiple() {
        /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
        var props = arguments;
        if (arguments[0] && Array.isArray(arguments[0])) {
            props = arguments[0];
        }
        return function (obj1, obj2) {
            var i = 0, result = 0, numberOfProperties = props.length;
            /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
            while(result === 0 && i < numberOfProperties) {
                result = dynamicSort(props[i])(obj1, obj2);
                i++;
            }
            return result;
        };
    }

    function getReport(reportId) {
        for (var i=0; i<_reports.length; i++) {
            if (_reports[i].id === reportId) { return _reports[i]; }
        }
    }

    function isHideOptionChecked(reportType) {
        return $('#hideVADot' + reportType + 'Reports').is(':checked');
    }

    function updateReportsVisibility() {
        hideAllReportPopovers();
        var hideArchived = isHideOptionChecked('Archived');
        var visibleCount = 0;
        _reports.forEach(function(report) {
            var hide =
                hideArchived && report.archived;
            if (hide) {
                report.dataRow.hide();
                if (report.imageDiv) { report.imageDiv.hide(); }
            } else {
                visibleCount += 1;
                report.dataRow.show();
                if (report.imageDiv) { report.imageDiv.show(); }
            }
        });
        $('.va-dot-report-count').text(visibleCount + ' of ' + _reports.length + ' reports');
    }

    function hideAllPopovers($excludeDiv) {
        _reports.forEach(function(rpt) {
            var $div = rpt.imageDiv;
            if ((!$excludeDiv || $div[0] !== $excludeDiv[0]) && $div.data('state') === 'pinned') {
                $div.data('state', '');
                $div.popover('hide');
            }
        });
    }

    function deselectAllDataRows() {
        _reports.forEach(function(rpt) {
            rpt.dataRow.css('background-color','white');
        });
    }

    function toggleMarkerPopover($div) {
        hideAllPopovers($div);
        if ($div.data('state') !== 'pinned') {
            var id = $div.data('reportId');
            var report = getReport(id);
            $div.data('state', 'pinned');
            W.map.setCenter(report.marker.lonlat);
            $div.popover('show');
            if (report.archived) {
                $('.btn-archive-dot-report').text("Un-Archive");
            }
            $('.btn-archive-dot-report').click(function() {setArchiveReport(report,!report.archived, true); buildTable();});
            $('.btn-open-dot-report').click(function(evt) {evt.stopPropagation(); window.open($(this).data('dotReportUrl'),'_blank');});
            $('.reportPopover,.close-popover').click(function(evt) {evt.stopPropagation(); hideAllReportPopovers();});
            //$(".close-popover").click(function() {hideAllReportPopovers();});
            $div.data('report').dataRow.css('background-color','beige');
        } else {
            $div.data('state', '');
            $div.popover('hide');
        }
    }

    function toggleReportPopover($div) {
        deselectAllDataRows();
        toggleMarkerPopover($div);
    }

    function hideAllReportPopovers() {
        deselectAllDataRows();
        hideAllPopovers();
    }

    function setArchiveReport(report, archive, updateUi) {
        report.archived = archive;
        if (archive) {
            _settings.archivedReports[report.id] = {updateNumber: report.id};
            report.imageDiv.addClass('va-dot-archived-marker');
        }else {
            delete _settings.archivedReports[report.id];
            report.imageDiv.removeClass('va-dot-archived-marker');
        }
        if (updateUi) {
            saveSettingsToStorage();
            updateReportsVisibility();
            hideAllReportPopovers();
        }
    }

    function archiveAllReports(unarchive) {
        _reports.forEach(function(report) {
            setArchiveReport(report, !unarchive, false);
        });
        saveSettingsToStorage();
        buildTable();
        hideAllReportPopovers();
    }

    function addRow($table, report) {
        var $img = $('<img>', {src:report.imgUrl, class:'table-img'});
        var $row = $('<tr> class="clickable"', {id:'va-dot-row-'+report.id}).append(
            $('<td>',{class:'centered'}).append(
                $('<input>',{type:'checkbox',title:'Archive',id:'va-archive-' + report.id, 'data-report-id':report.id}).prop('checked', report.archived).click(
                    function(evt){
                        evt.stopPropagation();
                        var id = $(this).data('reportId');
                        var report = getReport(id);
                        setArchiveReport(report, $(this).is(':checked'), true);
                    }
                )
            ),
            $('<td>',{class:'clickable centered'}).append($img),
            $('<td>').text(report.properties.location_description)
        )
        .click(function () {
            var $row = $(this);
            var id = $row.data('reportId');
            var marker = getReport(id).marker;
            var $imageDiv = report.imageDiv;
            //if (!marker.onScreen()) {
            W.map.setCenter(marker.lonlat);
            //}
            toggleReportPopover($imageDiv);

        }).data('reportId', report.id);
        report.dataRow = $row;
        $table.append($row);
        $row.report = report;
    }


    function onClickColumnHeader(obj) {
        var prop;
        switch (/va-dot-table-(.*)-header/.exec(obj.id)[1]) {
            case 'category':
                prop = 'properties.icon';
                break;
            case 'begins':
                prop = 'beginTime.time';
                break;
            case 'desc':
                prop = 'properties.location_description';
                break;
            case 'priority':
                prop = 'priority';
                break;
            case 'archive':
                prop = 'archived';
                break;
            default:
                return;
        }
        var idx = _columnSortOrder.indexOf(prop);
        if (idx > -1) {
            _columnSortOrder.splice(idx, 1);
            _columnSortOrder.reverse();
            _columnSortOrder.push(prop);
            _columnSortOrder.reverse();
            buildTable();
        }
    }

    function buildTable() {
        log('Building table', 1);
        var $table = $('<table>',{class:'va-dot-table'});
        var $th = $('<thead>').appendTo($table);
        $th.append(
            $('<tr>').append(
                $('<th>', {id:'va-dot-table-archive-header',class:'centered'}).append(
                    $('<span>', {class:'fa fa-archive',style:'font-size:120%',title:'Sort by archived'}))).append(
                $('<th>', {id:'va-dot-table-category-header',title:'Sort by report type'})).append(
                $('<th>',{id:'va-dot-table-desc-header',title:'Sort by description'}).text('Description')
            ));
        _reports.sort(dynamicSortMultiple(_columnSortOrder));
        _reports.forEach(function(report) {
            addRow($table, report);
        });
        $('.va-dot-table').remove();
        $('#va-dot-report-table').append($table);
        $('.va-dot-table th').click(function() {onClickColumnHeader(this);});

        updateReportsVisibility();
    }

    function addReportToMap(report){
        var coord = report.geometry.coordinates;
        var imgName;
        switch (report.type) {
            case 'high_impact_incident':
                imgName = 'incident_major';
                break;
            default:
                imgName = report.type;
        }
        imgName += '.png';
        var size = new OpenLayers.Size(29,29);
        var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        var now = new Date(Date.now());

        report.imgUrl = _imagesPath + imgName;
        var icon = new OpenLayers.Icon(report.imgUrl,size,null);
        var marker = new OpenLayers.Marker(new OpenLayers.LonLat(coord[0],coord[1]).transform("EPSG:4326", "EPSG:900913"),icon);

        var popoverTemplate = ['<div class="reportPopover popover" style="max-width:500px;width:500px;">',
                               '<div class="arrow"></div>',
                               '<div class="popover-title"></div>',
                               '<div class="popover-content">',
                               '</div>',
                               '</div>'].join('');
        marker.report = report;
        //marker.events.register('click', marker, onMarkerClick);
        _mapLayer.addMarker(marker);

        //var dt = new Date(report.details.unixtime * 1000);
        var content = [
            report.properties.location_description,
            '<br><br>',
            report.details,
            //'<br><br>',
            //'<span style="font-weight:bold">Display Time:</span>&nbsp;&nbsp;' + dt.toLocaleDateString() + '&nbsp;&nbsp;' + dt.toLocaleTimeString(),
            '<div"><hr style="margin-bottom:5px;margin-top:5px;border-color:gainsboro"><div style="display:table;width:100%"><button type="button" style="float:right;" class="btn btn-primary btn-archive-dot-report" data-dot-report-id="' + report.id + '">Archive</button></div></div></div>'
        ].join('');
        var $imageDiv = $(marker.icon.imageDiv)
        .css('cursor', 'pointer')
        .addClass('vaDotReport')
        .attr({
            'data-toggle':'popover',
            title:'',
            'data-content':content,
            'data-original-title':'<div style"width:100%;"><div style="float:left;max-width:330px;color:#5989af;font-size:120%;">' + _reportTitles[report.type] + '</div><div style="float:right;"><a class="close-popover" href="javascript:void(0);">X</a></div><div style="clear:both;"</div></div>'
        })

        .popover({trigger: 'manual', html:true,placement: 'auto top', template:popoverTemplate})
        .on('click', function() {toggleReportPopover($(this));})
        .data('reportId', report.id)
        .data('state', '');

        $imageDiv.data('report', report);
        if (report.archived) { $imageDiv.addClass('va-dot-archived-marker'); }
        report.imageDiv = $imageDiv;
        report.marker = marker;
    }

    function processReportDetails(reportDetails, reports) {
        _reports = [];
        _mapLayer.clearMarkers();
        log('Adding reports to map...', 1);
        reports.forEach(function(report, index) {
            if (report.geometry) {
                report.details = reportDetails[report.id];
                report.archived = false;
                if (_settings.archivedReports.hasOwnProperty(report.id)) {
                    // if ( _settings.archivedReports[report.id].updateNumber < report.situationUpdateKey.updateNumber) {
                    //     delete _settings.archivedReports[report.id];
                    // } else {
                    report.archived = true;
                    // }
                }
                addReportToMap(report);
                _reports.push(report);
            }
        });
        buildTable();
    }

    function requestReportDetails(reports) {
        // Limit the # of details reports to 50 at a time, so we don't overflow the URL length limit.
        var limit = 50;
        var numberOfCalls = Math.floor((reports.length - 1) / limit) + 1;
        var parentContext = {reports: reports, details: {}, numberOfCalls: numberOfCalls, callsReceived: 0};

        for (var i=0; i<numberOfCalls; i++) {
            var ids = reports.slice(i*limit,(i+1)*limit).map(report => report.id);
            var url = 'http://www.511virginia.org/report.pl?idents=' + ids.join('%2C');
            GM_xmlhttpRequest({
                method: 'GET',
                context: {parentContext: parentContext, ids: ids},
                url: url,
                onload: function(res) {
                    var parentContext = res.context.parentContext;
                    var text = res.responseText;
                    var re = /<div>(.*?)<[/]div>/gi;
                    var result;
                    var idx = 0;
                    while (result = re.exec(text)) {
                        parentContext.details[res.context.ids[idx]] = result[1];
                        idx++;
                    }
                    parentContext.callsReceived++;
                    if (parentContext.callsReceived >= parentContext.numberOfCalls) {
                        processReportDetails(parentContext.details, parentContext.reports);
                    }
                },
                onerror: function(res) {
                    console.log(res);
                }
            });
        }
    }

    function processReports(reports, context) {
        reports.forEach(function(report) {
            report.type = context.type;
        });
        Array.prototype.push.apply(context.results.reports, reports);

        if (context.results.callCount === context.results.expectedCallCount) {
            requestReportDetails(context.results.reports);
        }
    }

    function requestReports(context) {
        GM_xmlhttpRequest({
            method: 'GET',
            context: context,
            url: 'http://files6.iteriscdn.com/WebApps/VA/SafeTravel/data/local/icons/metadata/icons.' + context.type + '.geojsonp',
            onload: function(res) { res.context.results.callCount += 1; processReports($.parseJSON(/\((.*)\)/.exec(res.responseText)[1]).features, res.context); },
            onError: function(err) { log(err,0); }
        });
    }

    function fetchReports() {
        var results = {callCount: 0, reports: [], expectedCallCount: 4};
        var weatherClosureContext = { type:'weather_closure', results:results };
        var incidentContext= { type:'incident', results:results };
        var constructionContext = { type:'construction', results:results };
        var highImpactContext = { type: 'high_impact_incident', results: results};

        requestReports(weatherClosureContext);
        requestReports(incidentContext);
        requestReports(constructionContext);
        requestReports(highImpactContext);
    }

    function onLayerVisibilityChanged(evt) {
        saveSettingsToStorage();
    }

    function installIcon() {
        OpenLayers.Icon = OpenLayers.Class({
            url: null,
            size: null,
            offset: null,
            calculateOffset: null,
            imageDiv: null,
            px: null,
            initialize: function(a,b,c,d){
                this.url=a;
                this.size=b||{w: 20,h: 20};
                this.offset=c||{x: -(this.size.w/2),y: -(this.size.h/2)};
                this.calculateOffset=d;
                a=OpenLayers.Util.createUniqueID("OL_Icon_");
                var div = this.imageDiv=OpenLayers.Util.createAlphaImageDiv(a);
                $(div.firstChild).removeClass('olAlphaImg');   // LEAVE THIS LINE TO PREVENT WME-HARDHATS SCRIPT FROM TURNING ALL ICONS INTO HARDHAT WAZERS --MAPOMATIC
            },
            destroy: function(){ this.erase();OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);this.imageDiv.innerHTML="";this.imageDiv=null; },
            clone: function(){ return new OpenLayers.Icon(this.url,this.size,this.offset,this.calculateOffset); },
            setSize: function(a){ null!==a&&(this.size=a); this.draw(); },
            setUrl: function(a){ null!==a&&(this.url=a); this.draw(); },
            draw: function(a){
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,this.size,this.url,"absolute");
                this.moveTo(a);
                return this.imageDiv;
            },
            erase: function(){ null!==this.imageDiv&&null!==this.imageDiv.parentNode&&OpenLayers.Element.remove(this.imageDiv); },
            setOpacity: function(a){ OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,null,null,null,null,null,a); },
            moveTo: function(a){
                null!==a&&(this.px=a);
                null!==this.imageDiv&&(null===this.px?this.display(!1): (
                    this.calculateOffset&&(this.offset=this.calculateOffset(this.size)),
                    OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,{x: this.px.x+this.offset.x,y: this.px.y+this.offset.y})
                ));
            },
            display: function(a){ this.imageDiv.style.display=a?"": "none"; },
            isDrawn: function(){ return this.imageDiv&&this.imageDiv.parentNode&&11!=this.imageDiv.parentNode.nodeType; },
            CLASS_NAME: "OpenLayers.Icon"
        });
    }

    function init511ReportsOverlay(){
        installIcon();
        _mapLayer = new OpenLayers.Layer.Markers("VA DOT Reports", {
            displayInLayerSwitcher: true,
            uniqueName: "__vaDotReports",
        });

        //I18n.translations[I18n.locale].layers.name.__stateDotReports = "VA DOT Reports";
        W.map.addLayer(_mapLayer);
        _mapLayer.setVisibility(_settings.layerVisible);
        _mapLayer.events.register('visibilitychanged',null,onLayerVisibilityChanged);
    }

    function restoreUserTab() {
        $('#user-tabs > .nav-tabs').append(_tabDiv.tab);
        $('#user-info > .flex-parent > .tab-content').append(_tabDiv.panel);
        $('[id^=hideVADot]').change(function(){
            saveSettingsToStorage();
            updateReportsVisibility();
        });
        $('.va-dot-refresh-reports').click(function(e) {
            hideAllReportPopovers();
            fetchReports(processReports);
            var refreshPopup = $('#va-dot-refresh-popup');
            refreshPopup.show();
            setTimeout(function() { refreshPopup.hide(); }, 1500);
            e.stopPropagation();
        });
    }

    function onModeChanged(model, modeId, context) {
        hideAllReportPopovers();
        if(!modeId || modeId === 1) {
            restoreUserTab();
        }
    }

    function initUserPanel() {
        _tabDiv.tab = $('<li>').append(
            $('<a>', {'data-toggle':'tab', href:'#sidepanel-va-statedot'}).text('VA DOT').append(
                $('<span>', {title:'Click to refresh DOT reports', class:'fa fa-refresh refreshIcon nav-tab-icon va-dot-refresh-reports', style:'cursor:pointer;'})
            )
        );

        _tabDiv.panel = $('<div>', {class:'tab-pane', id:'sidepanel-va-statedot'}).append(
            $('<div>',  {class:'side-panel-section>'}).append(
                $('<label style="width:100%; cursor:pointer; border-bottom: 1px solid #e0e0e0; margin-top:9px;" data-toggle="collapse" data-target="#vaDotSettingsCollapse"><span class="fa fa-caret-down" style="margin-right:5px;font-size:120%;"></span>Hide reports...</label>')).append(
                $('<div>',{id:'vaDotSettingsCollapse',class:'collapse'}).append(
                    $('<div>',{class:'controls-container'})
                    .append($('<input>', {type:'checkbox',name:'hideVADotArchivedReports',id:'hideVADotArchivedReports'}))
                    .append($('<label>', {for:'hideVADotArchivedReports'}).text('Archived'))
                )
            )
        ).append(
            $('<div>', {class:'side-panel-section>', id:'va-dot-report-table'}).append(
                $('<div>').append(
                    $('<span>', {title:'Click to refresh DOT reports', class:'fa fa-refresh refreshIcon va-dot-refresh-reports va-dot-table-label', style:'cursor:pointer;'})
                ).append(
                    $('<span>',{class:'va-dot-table-label va-dot-report-count count'})
                ).append(
                    $('<span>',{class:'va-dot-table-label va-dot-table-action right'}).text('Archive all').click(function() {
                        var r = confirm('Are you sure you want to archive all reports for ' + _settings.state + '?');
                        if (r===true) {
                            archiveAllReports(false);
                        }
                    })
                ).append(
                    $('<span>', {class:'va-dot-table-label right'}).text('|')
                ).append(
                    $('<span>',{class:'va-dot-table-label va-dot-table-action right'}).text('Un-Archive all').click(function() {
                        var r = confirm('Are you sure you want to un-archive all reports for ' + _settings.state + '?');
                        if (r===true) {
                            archiveAllReports(true);
                        }
                    })
                )
            )
        );

        restoreUserTab();
        $('<div>', {id: 'va-dot-refresh-popup',}).text('DOT Reports Refreshed').hide().appendTo($('div#editor-container'));

        (function setChecks(settingProps, checkboxIds) {
            for (var i=0; i<settingProps.length; i++) {
                if (_settings[settingProps[i]]) { $('#' + checkboxIds[i]).attr('checked', 'checked'); }
            }
        })(['hideArchivedReports'],
           ['hideVADotArchivedReports']);
    }

    function showScriptInfoAlert() {
        /* Check version and alert on update */
        if (_alertUpdate && _scriptVersion !== _settings.lastVersion) {
            alert(_scriptVersionChanges);
        }
    }

    function initGui() {
        init511ReportsOverlay();
        initUserPanel();
        showScriptInfoAlert();
        fetchReports(processReports);

        var classHtml =  [
            '.va-dot-table th,td,tr {cursor:pointer;} ',
            '.va-dot-table .centered {text-align:center;} ',
            '.va-dot-table th:hover,tr:hover {background-color:aliceblue; outline: -webkit-focus-ring-color auto 5px;} ',
            '.va-dot-table th:hover {color:blue; border-color:whitesmoke; } ',
            '.va-dot-table {border:1px solid gray; border-collapse:collapse; width:100%; font-size:83%;margin:0px 0px 0px 0px} ',
            '.va-dot-table th,td {border:1px solid gainsboro;} ',
            '.va-dot-table td,th {color:black; padding:1px 4px;} ',
            '.va-dot-table th {background-color:gainsboro;} ',
            '.va-dot-table .table-img {max-width:24px; max-height:24px;} ',
            '.tooltip.top > .tooltip-arrow {border-top-color:white;} ',
            '.tooltip.bottom > .tooltip-arrow {border-bottom-color:white;} ',
            'a.close-popover {text-decoration:none;padding:0px 3px;border-width:1px;background-color:white;border-color:ghostwhite} a.close-popover:hover {padding:0px 4px;border-style:outset;border-width:1px;background-color:white;border-color:ghostwhite;} ',
            '#va-dot-refresh-popup {position:absolute;z-index:9999;top:80px;left:650px;background-color:rgb(120,176,191);e;font-size:120%;padding:3px 11px;box-shadow:6px 8px rgba(20,20,20,0.6);border-radius:5px;color:white;} ',
            '.refreshIcon:hover {color:blue; text-shadow: 2px 2px #aaa;} .refreshIcon:active{ text-shadow: 0px 0px; }',
            '.va-dot-archived-marker {opacity:0.5;} ',
            '.va-dot-table-label {font-size:85%;} .va-dot-table-action:hover {color:blue;cursor:pointer} .va-dot-table-label.right {float:right} .va-dot-table-label.count {margin-left:4px;}'
        ].join('');
        $('<style type="text/css">' + classHtml + '</style>').appendTo('head');

        _previousZoom = W.map.zoom;
        W.map.events.register('moveend',null,function() {if (_previousZoom !== W.map.zoom) {hideAllReportPopovers();} _previousZoom=W.map.zoom;});
    }

    var _previousZoom;

    function loadSettingsFromStorage() {
        var settings = $.parseJSON(localStorage.getItem(_settingsStoreName));
        if(!settings) {
            settings = {
                lastVersion:null,
                layerVisible:true,
                hideArchivedReports:true,
                archivedReports:{}
            };
        } else {
            settings.layerVisible = (settings.layerVisible === true);
            if(typeof settings.hideArchivedReports === 'undefined') { settings.hideArchivedReports = true; }
            settings.archivedReports = settings.archivedReports ? settings.archivedReports : {};
        }
        _settings = settings;
    }

    function init() {
        loadSettingsFromStorage();
        initGui();
        _window.addEventListener('beforeunload', function saveOnClose() { saveSettingsToStorage(); }, false);
        W.app.modeController.model.bind('change:mode', onModeChanged);
        log('Initialized.', 0);
    }

    function bootstrap() {
        var wz = _window.W;
        if (wz && wz.loginManager &&
            wz.loginManager.events.register &&
            wz.map && wz.loginManager.user) {
            log('Initializing...', 1);
            init();
        } else {
            log('Bootstrap failed. Trying again...', 1);
            _window.setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }

    log('Bootstrap...', 0);
    bootstrap();
})();
