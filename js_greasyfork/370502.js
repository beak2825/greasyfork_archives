// ==UserScript==
// @name         WME State DOT Reports
// @namespace    https://greasyfork.org/users/45389
// @version      2020.11.02.002
// @description  Display state transportation department reports in WME.
// @author       MapOMatic
// @license      GNU GPLv3
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        GM_xmlhttpRequest
// @connect      indot.carsprogram.org
// @connect      hb.511ia.org
// @connect      ohgo.com
// @connect      hb.511.nebraska.gov
// @connect      hb.511.idaho.gov
// @connect      hb.511mn.org
// @downloadURL https://update.greasyfork.org/scripts/370502/WME%20State%20DOT%20Reports.user.js
// @updateURL https://update.greasyfork.org/scripts/370502/WME%20State%20DOT%20Reports.meta.js
// ==/UserScript==

/* global $ */
/* global OpenLayers */
/* global GM_info */
/* global W */
/* global unsafeWindow */
/* global WazeWrap */
/* global GM_xmlhttpRequest */

const SETTINGS_STORE_NAME = 'dot_report_settings';
const ALERT_UPDATE = false;
const SCRIPT_VERSION = GM_info.script.version;
const SCRIPT_VERSION_CHANGES = [
    `${GM_info.script.name}\nv${SCRIPT_VERSION}\n\nWhat's New\n------------------------------\n`,
    '\n- Added Copy To Clipboard button on report popups.'
].join('');
const IMAGES_PATH = 'https://raw.githubusercontent.com/WazeDev/WME-State-DOT-Reports/master/images';
const DOT_INFO = {
    ID: {
        stateName: 'Idaho',
        mapType: 'cars',
        baseUrl: 'https://hb.511.idaho.gov',
        reportUrl: '/#roadReports/eventAlbum/',
        reportsFeedUrl: '/tgevents/api/eventReports'
    },
    IN: {
        stateName: 'Indiana',
        mapType: 'cars',
        baseUrl: 'https://indot.carsprogram.org',
        reportUrl: '/#roadReports/eventAlbum/',
        reportsFeedUrl: '/tgevents/api/eventReports'
    },
    IA: {
        stateName: 'Iowa',
        mapType: 'cars',
        baseUrl: 'https://hb.511ia.org',
        reportUrl: '/#allReports/eventAlbum/',
        reportsFeedUrl: '/tgevents/api/eventReports'
    },
    MN: {
        stateName: 'Minnesota',
        mapType: 'cars',
        baseUrl: 'https://hb.511mn.org',
        reportUrl: '/#roadReports/eventAlbum/',
        reportsFeedUrl: '/tgevents/api/eventReports'
    },
    NE: {
        stateName: 'Nebraska',
        mapType: 'cars',
        baseUrl: 'https://hb.511.nebraska.gov',
        reportUrl: '/#roadReports/eventAlbum/',
        reportsFeedUrl: '/tgevents/api/eventReports'
    }
};
const _columnSortOrder = ['priority', 'beginTime.time', 'eventDescription.descriptionHeader', 'icon.image', 'archived'];
let _reports = [];
let _previousZoom;
let _mapLayer = null;
let _settings = {};

function log(message) {
    console.log('DOT Reports: ', message);
}

function logDebug(message) {
    console.debug('DOT Reports:', message);
}
function logError(message) {
    console.error('DOT Reports:', message);
}

function copyToClipboard(report) {
    // create hidden text element, if it doesn't already exist
    const targetId = '_hiddenCopyText_';

    // must use a temporary form element for the selection and copy
    let target = document.getElementById(targetId);
    if (!target) {
        target = document.createElement('textarea');
        target.style.position = 'absolute';
        target.style.left = '-9999px';
        target.style.top = '0';
        target.id = targetId;
        document.body.appendChild(target);
    }
    const startTime = new Date(report.beginTime.time);
    const lastUpdateTime = new Date(report.updateTime.time);

    const $content = $('<div>').html(
        `${report.eventDescription.descriptionHeader}<br/><br/>
${report.eventDescription.descriptionFull}<br/><br/>
Start Time: ${startTime.toString('MMM d, y @ h:mm tt')}<br/>
Updated: ${lastUpdateTime.toString('MMM d, y @ h:mm tt')}`
    );

    $(target).val($content[0].innerText || $content[0].textContent);

    // select the content
    const currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    let succeed = false;
    try {
        succeed = document.execCommand('copy');
    } catch (e) {
        // do nothing
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === 'function') {
        currentFocus.focus();
    }

    target.textContent = '';
    return succeed;
}

// I believe this should return the bounds that Waze uses to load its data model.
// It's wider than the visible bounds of the map, to reduce data loading frequency.
function getExpandedDataBounds() {
    return W.controller.descartesClient.getExpandedDataBounds(W.map.calculateBounds());
}

function createSavableReport(reportIn) {
    const attributesToCopy = ['agencyAttribution', 'archived', 'beginTime', 'editorIdentifier', 'eventDescription', 'headlinePhrase',
        'icon', 'id', 'location', 'priority', 'situationUpdateKey', 'starred', 'updateTime'];

    const reportOut = {};
    attributesToCopy.forEach(attr => (reportOut[attr] = reportIn[attr]));

    return reportOut;
}
function copyToSavableReports(reportsIn) {
    const reportsOut = {};
    Object.keys(reportsIn).forEach(id => (reportsOut[id] = createSavableReport(reportsIn[id])));
    return reportsOut;
}

function saveSettingsToStorage() {
    if (localStorage) {
        const settings = {
            lastVersion: SCRIPT_VERSION,
            layerVisible: _mapLayer.visibility,
            state: _settings.state,
            hideArchivedReports: $('#hideDotArchivedReports').is(':checked'),
            hideWazeReports: $('#hideDotWazeReports').is(':checked'),
            hideNormalReports: $('#hideDotNormalReports').is(':checked'),
            hideWeatherReports: $('#hideDotWeatherReports').is(':checked'),
            hideCrashReports: $('#hideDotCrashReports').is(':checked'),
            hideWarningReports: $('#hideDotWarningReports').is(':checked'),
            hideClosureReports: $('#hideDotClosureReports').is(':checked'),
            hideRestrictionReports: $('#hideDotRestrictionReports').is(':checked'),
            hideFutureReports: $('#hideDotFutureReports').is(':checked'),
            hideCurrentReports: $('#hideDotCurrentReports').is(':checked'),
            archivedReports: _settings.archivedReports,
            starredReports: copyToSavableReports(_settings.starredReports)
        };
        localStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(settings));
        logDebug('Settings saved');
    }
}

function dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
    }
    return (a, b) => {
        const props = property.split('.');
        props.forEach(prop => {
            a = a[prop];
            b = b[prop];
        });
        let result = 0;
        if (a < b) {
            result = -1;
        } else if (a > b) {
            result = 1;
        }
        return result * sortOrder;
    };
}

function dynamicSortMultiple(...args) {
    /*
    * save the arguments object as it will be overwritten
    * note that arguments object is an array-like object
    * consisting of the names of the properties to sort by
    */
    let props = args;
    if (args[0] && Array.isArray(args[0])) {
        [props] = args;
    }
    return (obj1, obj2) => {
        let i = 0;
        let result = 0;
        const numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
        * as long as we have extra properties to compare
        */
        while (result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    };
}

function getReport(reportId) {
    return _reports.find(report => report.id === reportId);
}

function isHideOptionChecked(reportType) {
    return $(`#hideDot${reportType}Reports`).is(':checked');
}

function updateReportsVisibility() {
    hideAllReportPopovers();
    const hideArchived = isHideOptionChecked('Archived');
    const hideWaze = isHideOptionChecked('Waze');
    const hideNormal = isHideOptionChecked('Normal');
    const hideWeather = isHideOptionChecked('Weather');
    const hideCrash = isHideOptionChecked('Crash');
    const hideWarning = isHideOptionChecked('Warning');
    const hideRestriction = isHideOptionChecked('Restriction');
    const hideClosure = isHideOptionChecked('Closure');
    const hideFuture = isHideOptionChecked('Future');
    const hideCurrent = isHideOptionChecked('Current');
    let visibleCount = 0;
    _reports.forEach(report => {
        const img = report.icon.image;
        const now = Date.now();
        const start = new Date(report.beginTime.time);
        const hide = (hideArchived && report.archived)
            || (hideWaze && img.indexOf('waze') > -1)
            || (hideNormal && img.includes('driving'))
            || (hideWeather && (img.indexOf('weather') > -1 || img.indexOf('flooding') > -1))
            || (hideCrash && img.indexOf('crash') > -1)
            || (hideWarning && (img.indexOf('warning') > -1 || img.indexOf('lane_closure') > -1))
            || (hideRestriction && img.indexOf('restriction') > -1)
            || (hideClosure && img.indexOf('closure') > -1)
            || (hideFuture && start > now)
            || (hideCurrent && start <= now);
        if (hide) {
            report.dataRow.hide();
            if (report.imageDiv) { report.imageDiv.hide(); }
        } else {
            visibleCount += 1;
            report.dataRow.show();
            if (report.imageDiv) { report.imageDiv.show(); }
        }
    });
    $('.dot-report-count').text(`${visibleCount} of ${_reports.length} reports`);
}

function hideAllPopovers($excludeDiv) {
    _reports.forEach(rpt => {
        const $div = rpt.imageDiv;
        if ((!$excludeDiv || $div[0] !== $excludeDiv[0]) && $div.data('state') === 'pinned') {
            $div.data('state', '');
            $div.popover('hide');
        }
    });
}

function deselectAllDataRows() {
    _reports.forEach(rpt => rpt.dataRow.css('background-color', 'white'));
}

function toggleMarkerPopover($div, forcePin = false) {
    hideAllPopovers($div);
    if ($div.data('state') !== 'pinned' || forcePin) {
        const id = $div.data('reportId');
        const report = getReport(id);
        $div.data('state', 'pinned');
        $div.popover('show');
        _mapLayer.setZIndex(100000); // this is to help make sure the report shows on top of the turn restriction arrow layer
        if (report.archived) {
            $('.btn-archive-dot-report').text('Un-Archive');
        }
        $('.btn-archive-dot-report').click(() => { setArchiveReport(report, !report.archived, true); buildTable(); });
        $('.btn-open-dot-report').click(evt => {
            evt.stopPropagation();
            window.open($(evt.currentTarget).data('dot-report-url'), '_blank');
        });
        $('.btn-zoom-dot-report').click(evt => {
            evt.stopPropagation();
            W.map.setCenter(getReport($(evt.currentTarget).data('dot-report-id')).marker.lonlat);
            W.map.olMap.zoomTo(4);
        });
        $('.btn-copy-dot-report').click(evt => {
            evt.stopPropagation();
            copyToClipboard(getReport($(evt.currentTarget).data('dot-report-id')));
        });
        $('.reportPopover,.close-popover').click(evt => {
            evt.stopPropagation();
            hideAllReportPopovers();
        });
        // $(".close-popover").click(function() {hideAllReportPopovers();});
        $div.data('report').dataRow.css('background-color', 'beige');
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
        _settings.archivedReports[report.id] = { updateNumber: report.situationUpdateKey.updateNumber };
        report.imageDiv.addClass('dot-archived-marker');
    } else {
        delete _settings.archivedReports[report.id];
        report.imageDiv.removeClass('dot-archived-marker');
    }
    if (updateUi) {
        saveSettingsToStorage();
        updateReportsVisibility();
        hideAllReportPopovers();
    }
}

function setStarReport(report, star, updateUi) {
    report.starred = star;
    if (star) {
        if (!_settings.starredReports) { _settings.starredReports = {}; }
        _settings.starredReports[report.id] = report;
        report.imageDiv.addClass('dot-starred-marker');
    } else {
        delete _settings.starredReports[report.id];
        report.imageDiv.removeClass('dot-starred-marker');
    }
    if (updateUi) {
        saveSettingsToStorage();
        updateReportsVisibility();
        hideAllReportPopovers();
    }
}

function archiveAllReports(unarchive) {
    _reports.forEach(report => setArchiveReport(report, !unarchive, false));
    saveSettingsToStorage();
    buildTable();
    hideAllReportPopovers();
}

function addRow($table, report) {
    const $img = $('<img>', { src: report.imgUrl, class: 'table-img' });
    const $row = $('<tr> class="clickable"', { id: `dot-row-${report.id}` }).append(
        $('<td class="centered">').append(
            $('<span>', {
                class: `star ${(report.starred ? 'star-filled' : 'star-empty')}`,
                title: 'Star if you want notification when this report is removed by the DOT.\nFor instance, if a map change needs to be undone after a closure report is removed.'
            }).click(evt => {
                evt.stopPropagation();
                setStarReport(report, !report.starred, true);
                const $target = $(evt.currentTarget);
                $target.removeClass(report.starred ? 'star-empty' : 'star-filled');
                $target.addClass(report.starred ? 'star-filled' : 'star-empty');
            })
        ),
        $('<td>', { class: 'centered' }).append(
            $('<input>', {
                type: 'checkbox',
                title: 'Archive (will automatically un-archive if report is updated by DOT)',
                id: `archive-${report.id}`,
                'data-report-id': report.id
            }).prop('checked', report.archived).click(evt => {
                evt.stopPropagation();
                const $target = $(evt.currentTarget);
                const id = $target.data('reportId');
                const thisReport = getReport(id);
                setArchiveReport(thisReport, $target.is(':checked'), true);
            })
        ),
        $('<td>', { class: 'clickable' }).append($img),
        $('<td>', { class: 'centered' }).text(report.priority),
        $('<td>', { class: (report.wasRemoved ? 'removed-report' : '') }).text(report.eventDescription.descriptionHeader),
        $('<td>', { class: 'centered' }).text(new Date(report.beginTime.time).toString('M/d/y h:mm tt'))
    ).click(evt => {
        const $thisRow = $(evt.currentTarget);
        const id = $thisRow.data('reportId');
        const { marker } = getReport(id);
        const $imageDiv = report.imageDiv;

        if ($imageDiv.data('state') !== 'pinned') {
            W.map.setCenter(marker.lonlat);
        }

        toggleReportPopover($imageDiv);
    }).data('reportId', report.id);
    report.dataRow = $row;
    $table.append($row);
    $row.report = report;
}

function onClickColumnHeader(evt) {
    const obj = evt.currentTarget;
    let prop;
    switch (/dot-table-(.*)-header/.exec(obj.id)[1]) {
        case 'category':
            prop = 'icon.image';
            break;
        case 'begins':
            prop = 'beginTime.time';
            break;
        case 'desc':
            prop = 'eventDescription.descriptionHeader';
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
    const idx = _columnSortOrder.indexOf(prop);
    if (idx > -1) {
        _columnSortOrder.splice(idx, 1);
        _columnSortOrder.reverse();
        _columnSortOrder.push(prop);
        _columnSortOrder.reverse();
        buildTable();
    }
}

function buildTable() {
    logDebug('Building table');
    const $table = $('<table>', { class: 'dot-table' });
    $table.append(
        $('<thead>').append(
            $('<tr>').append(
                $('<th>', { id: 'dot-table-star-header', title: 'Favorites' }),
                $('<th>', { id: 'dot-table-archive-header', class: 'centered' }).append(
                    $('<span>', { class: 'fa fa-archive', style: 'font-size:120%', title: 'Sort by archived' })
                ),
                $('<th>', { id: 'dot-table-category-header', title: 'Sort by report type' }),
                $('<th>', { id: 'dot-table-priority-header', title: 'Sort by priority' }).append(
                    $('<span>', { class: 'fa fa-exclamation-circle', style: 'font-size:120%' })
                ),
                $('<th>', { id: 'dot-table-desc-header', title: 'Sort by description' }).text('Description'),
                $('<th>', { id: 'dot-table-begins-header', title: 'Sort by starting date' }).text('Starts')
            )
        )
    );
    _reports.sort(dynamicSortMultiple(_columnSortOrder));
    _reports.forEach(report => addRow($table, report));
    $('.dot-table').remove();
    $('#dot-report-table').append($table);
    $('.dot-table th').click(onClickColumnHeader);

    updateReportsVisibility();
}

function getUrgencyString(imagePath) {
    const i1 = imagePath.lastIndexOf('_');
    const i2 = imagePath.lastIndexOf('.');
    return imagePath.substring(i1 + 1, i2);
}

function updateReportImageUrl(report) {
    const startTime = new Date(report.beginTime.time);
    let imgName = report.icon.image;

    if (imgName.indexOf('flooding') !== -1) {
        imgName = imgName.replace('flooding', 'weather').replace('.png', '.gif');
    } else if (report.headlinePhrase.category === 5 && report.headlinePhrase.code === 21) {
        imgName = '/tg_flooding_urgent.png';
    }

    const now = new Date(Date.now());
    if (startTime > now) {
        let futureValue;
        if (startTime > now.clone().addMonths(2)) {
            futureValue = 'pp';
        } else if (startTime > now.clone().addMonths(1)) {
            futureValue = 'p';
        } else {
            futureValue = startTime.getDate();
        }
        imgName = `/tg_future_${futureValue}_${getUrgencyString(imgName)}.gif`;
    }
    report.imgUrl = IMAGES_PATH + imgName;
}

function updateReportGeometry(report) {
    const coord = report.location.primaryPoint;
    report.location.openLayers = {
        primaryPointLonLat: new OpenLayers.LonLat(coord.lon, coord.lat).transform('EPSG:4326', 'EPSG:900913')
    };
}

function processReport(report) {
    if (report.location && report.location.primaryPoint && report.icon) {
        const size = new OpenLayers.Size(report.icon.width, report.icon.height);
        const icon = new OpenLayers.Icon(report.imgUrl, size, null);
        const marker = new OpenLayers.Marker(report.location.openLayers.primaryPointLonLat, icon);
        marker.report = report;
        // marker.events.register('click', marker, onMarkerClick);
        // _mapLayer.addMarker(marker);

        const dot = DOT_INFO[_settings.state];
        const lastUpdateTime = new Date(report.updateTime.time);
        const startTime = new Date(report.beginTime.time);
        const content = $('<div>').append(
            report.eventDescription.descriptionFull,
            $('<div>', { style: 'margin-top: 10px;' }).append(
                $('<span>', { style: 'font-weight: bold; margin-right: 8px;' }).text('Start Time:'),
                startTime.toString('MMM d, y @ h:mm tt'),
            ),
            $('<div>').append(
                $('<span>', { style: 'font-weight: bold; margin-right: 8px;' }).text('Updated:'),
                `${lastUpdateTime.toString('MMM d, y @ h:mm tt')}&nbsp;&nbsp;(update #${report.situationUpdateKey.updateNumber})`
            ),
            $('<div>').append(
                $('<hr>', { style: 'margin-bottom: 5px; margin-top: 5px; border-color: gainsboro' }),
                $('<div>', { style: 'display: table; width: 100%' }).append(
                    $('<button>', {
                        class: 'btn btn-primary, btn-open-dot-report',
                        style: 'float: left;',
                        'data-dot-report-url': dot.baseUrl + dot.reportUrl + report.id
                    }).text('Open in DOT website'),
                    $('<button>', {
                        class: 'btn btn-primary, btn-zoom-dot-report',
                        style: 'float: left; margin-left: 6px;',
                        'data-dot-report-id': report.id
                    }).text('Zoom'),
                    $('<button>', {
                        class: 'btn btn-primary, btn-copy-dot-report',
                        style: 'float: left; margin-left: 6px;',
                        'data-dot-report-id': report.id
                    }).append('<span class="fa fa-copy">'),
                    $('<button>', {
                        class: 'btn btn-primary, btn-archive-dot-report',
                        style: 'float: right;',
                        'data-dot-report-id': report.id
                    }).text('Archive'),
                )
            )
        ).html();

        const title = $('<div>', { style: 'width: 100%;' }).append(
            $('<div>', { style: 'float: left; max-width: 330px; color: #5989af; font-size: 120%;' }).text(report.eventDescription.descriptionHeader),
            $('<div>', { style: 'float: right;' }).append(
                // eslint-disable-next-line no-script-url
                $('<span>', { class: 'close-popover fa fa-window-close' })
            ),
            $('<div>', { style: 'clear: both;' })
        ).html();

        const popoverTemplate = $('<div>', { class: 'reportPopover popover', style: 'max-width: 500px; width: 500px;' }).append(
            $('<div>', { class: 'arrow' }),
            $('<div>', { class: 'popover-title' }),
            $('<div>', { class: 'popover-content' })
        );

        const $imageDiv = $(marker.icon.imageDiv)
            .css('cursor', 'pointer')
            .addClass('dotReport')
            .attr({
                'data-toggle': 'popover',
                title: '',
                'data-content': content,
                'data-original-title': title
            }).popover({
                trigger: 'manual',
                html: true,
                placement: 'auto top',
                template: popoverTemplate
            }).on('click', () => toggleReportPopover($imageDiv))
            .data('reportId', report.id)
            .data('state', '')
            .data('report', report);

        if (report.agencyAttribution && report.agencyAttribution.agencyName.toLowerCase().includes('waze')) {
            $imageDiv.addClass('wazeReport');
        }
        if (report.archived) {
            $imageDiv.addClass('dot-archived-marker');
        }
        report.imageDiv = $imageDiv;
        report.marker = marker;
    }
}

function processReports(reports) {
    let settingsUpdated = false;
    _reports = [];
    _mapLayer.clearMarkers();
    logDebug('Adding reports to map...');
    reports.forEach(report => {
        // Exclude pandemic reports (e.g. required social distancing, masks, etc)
        const isPandemicReport = report.icon.image.includes('pandemic');
        if (!isPandemicReport && report.location && report.location.primaryPoint) {
            report.archived = false;
            if (_settings.archivedReports.hasOwnProperty(report.id)) {
                if (_settings.archivedReports[report.id].updateNumber < report.situationUpdateKey.updateNumber) {
                    delete _settings.archivedReports[report.id];
                } else {
                    report.archived = true;
                }
            }
            _reports.push(report);
        }
    });

    // Check saved starred reports.
    Object.keys(_settings.starredReports).forEach(reportId => {
        const starredReport = _settings.starredReports[reportId];
        const report = getReport(reportId);
        if (report) {
            report.starred = true;
            if (report.situationUpdateKey.updateNumber !== starredReport.situationUpdateKey.updateNumber) {
                _settings.starredReports[report.id] = report;
                settingsUpdated = true;
            }
        } else {
            // Report has been removed by DOT.
            if (!starredReport.wasRemoved) {
                starredReport.archived = false;
                starredReport.wasRemoved = true;
                settingsUpdated = true;
            }
            _reports.push(starredReport);
        }
    });
    _reports.forEach(report => {
        updateReportImageUrl(report);
        updateReportGeometry(report);
        processReport(report);
    });
    if (settingsUpdated) {
        saveSettingsToStorage();
    }
    buildTable();
}

// This function returns a Promise so that it can be used with async/await.
function makeRequest(url) {
    // GM_xmlhttpRequest is necessary to avoid CORS issues on some sites.
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: res => {
                if (res.status >= 200 && res.status < 300) {
                    resolve(res.responseText);
                } else {
                    reject(new Error(`(${this.status}) ${this.statusText}`));
                }
            },
            onerror: res => {
                let msg;
                if (res.status === 0) {
                    msg = 'An unknown error occurred while attempting to download DOT data.';
                } else {
                    msg = `Status code ${this.status} - ${this.statusText}`;
                }
                reject(new Error(msg));
            }
        });
    });
}

async function fetchReports() {
    const dot = DOT_INFO[_settings.state];
    let json;
    try {
        const url = dot.baseUrl + dot.reportsFeedUrl;
        const text = await makeRequest(url);
        json = $.parseJSON(text);
    } catch (ex) {
        logError(new Error(ex.message));
        json = [];
    }
    processReports(json);
}

function onLayerVisibilityChanged() {
    saveSettingsToStorage();
}

/* eslint-disable */
function installIcon() {
    OpenLayers.Icon = OpenLayers.Class({
        url: null,
        size: null,
        offset: null,
        calculateOffset: null,
        imageDiv: null,
        px: null,
        initialize: function(a, b, c, d){
            this.url=a;
            this.size=b||{w: 20, h: 20};
            this.offset=c||{x: -(this.size.w/2), y: -(this.size.h/2)};
            this.calculateOffset=d;
            a=OpenLayers.Util.createUniqueID("OL_Icon_");
            var div = this.imageDiv=OpenLayers.Util.createAlphaImageDiv(a);
            
            // LEAVE THE FOLLOWING LINE TO PREVENT WME-HARDHATS SCRIPT FROM TURNING ALL ICONS INTO HARDHAT WAZERS --MAPOMATIC
            $(div.firstChild).removeClass('olAlphaImg');
        },
        destroy: function(){ this.erase();OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);this.imageDiv.innerHTML="";this.imageDiv=null; },
        clone: function(){ return new OpenLayers.Icon(this.url, this.size, this.offset, this.calculateOffset); },
        setSize: function(a){ null!==a&&(this.size=a); this.draw(); },
        setUrl: function(a){ null!==a&&(this.url=a); this.draw(); },
        draw: function(a){
            OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, this.size, this.url, "absolute");
            this.moveTo(a);
            return this.imageDiv;
        },
        erase: function(){ null!==this.imageDiv&&null!==this.imageDiv.parentNode&&OpenLayers.Element.remove(this.imageDiv); },
        setOpacity: function(a){ OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null, null, null, null, null, a); },
        moveTo: function(a){
            null!==a&&(this.px=a);
            null!==this.imageDiv&&(null===this.px?this.display(!1): (
                this.calculateOffset&&(this.offset=this.calculateOffset(this.size)),
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, {x: this.px.x+this.offset.x, y: this.px.y+this.offset.y})
            ));
        },
        display: function(a){ this.imageDiv.style.display=a?"": "none"; },
        isDrawn: function(){ return this.imageDiv&&this.imageDiv.parentNode&&11!=this.imageDiv.parentNode.nodeType; },
        CLASS_NAME: "OpenLayers.Icon"
    });
}
/* eslint-enable */

function onStateSelectChange(evt) {
    hideAllReportPopovers();
    _settings.state = evt.currentTarget.value;
    saveSettingsToStorage();
    fetchReports();
}

function onHideReportTypeCheckChange() {
    saveSettingsToStorage();
    updateReportsVisibility();
}

function isLoading() {
    return $('.dot-refresh-reports').hasClass('fa-spin');
}
function beforeLoading() {
    const spinner = $('.dot-refresh-reports');
    spinner.addClass('fa-spin').css({ cursor: 'auto' });
    hideAllReportPopovers();
}
function afterLoading() {
    const spinner = $('.dot-refresh-reports');
    spinner.removeClass('fa-spin').css({ cursor: 'pointer' });
    WazeWrap.Alerts.success(null, 'DOT reports refreshed');
}

async function onRefreshReportsClick(evt) {
    evt.stopPropagation();
    if (!isLoading()) {
        beforeLoading();
        await fetchReports();
        afterLoading();
    }
}

function init511ReportsOverlay() {
    installIcon();
    _mapLayer = new OpenLayers.Layer.Markers('State DOT Reports', {
        displayInLayerSwitcher: true,
        uniqueName: '__stateDotReports'
    });

    W.map.addLayer(_mapLayer);
    _mapLayer.setVisibility(_settings.layerVisible);
    _mapLayer.setZIndex(100000);
    _mapLayer.events.register('visibilitychanged', null, onLayerVisibilityChanged);
}

function initSideTab() {
    $('#stateDotStateSelect').change(onStateSelectChange);
    $('[id^=hideDot]').change(onHideReportTypeCheckChange);
    $('#stateDotStateSelect').val(_settings.state);

    ['ArchivedReports', 'WazeReports', 'NormalReports', 'WeatherReports',
        'TrafficReports', 'CrashReports', 'WarningReports', 'RestrictionReports',
        'ClosureReports', 'FutureReports', 'CurrentReports'].forEach(name => {
        const settingsPropName = `hide${name}`;
        const checkboxId = `hideDot${name}`;
        if (_settings[settingsPropName]) {
            $(`#${checkboxId}`).prop('checked', true);
        }
    });

    $('<span>', {
        title: 'Click to refresh DOT reports',
        class: 'fa fa-refresh refreshIcon dot-tab-icon dot-refresh-reports',
        style: 'cursor:pointer;'
    }).appendTo($('a[href="#sidepanel-dot"]'));

    $('.dot-refresh-reports').click(onRefreshReportsClick);
}

function buildSideTab() {
    // Helper template functions to create elements
    const createCheckbox = (id, text) => $('<div>', { class: 'controls-container' }).append(
        $('<input>', { type: 'checkbox', id }),
        $('<label>', { for: id }).text(text)
    );
    const createOption = (value, text) => $('<option>', { value }).text(text);

    const panel = $('<div>').append(
        $('<div>', { class: 'side-panel-section>' }).append(
            $('<div>', { class: 'form-group' }).append(
                $('<label>', { class: 'control-label' }).text('Select your state'),
                $('<div>', { class: 'controls', id: 'state-select' }).append(
                    $('<div>').append(
                        $('<select>', { id: 'stateDotStateSelect', class: 'form-control' }).append(
                            Object.keys(DOT_INFO).map(abbr => createOption(abbr, DOT_INFO[abbr].stateName))
                        )
                    )
                ),
                $('<label style="width:100%; cursor:pointer; border-bottom: 1px solid #e0e0e0; margin-top:9px;" data-toggle="collapse" data-target="#dotSettingsCollapse"><span class="fa fa-caret-down" style="margin-right:5px;font-size:120%;"></span>Hide reports...</label>'),
                $('<div>', { id: 'dotSettingsCollapse', class: 'collapse' }).append(
                    createCheckbox('hideDotArchivedReports', 'Archived'),
                    createCheckbox('hideDotWazeReports', 'Waze (if supported by DOT)'),
                    createCheckbox('hideDotNormalReports', 'Driving conditions'),
                    createCheckbox('hideDotWeatherReports', 'Weather'),
                    createCheckbox('hideDotCrashReports', 'Crash'),
                    createCheckbox('hideDotWarningReports', 'Warning'),
                    createCheckbox('hideDotRestrictionReports', 'Restriction'),
                    createCheckbox('hideDotClosureReports', 'Closure'),
                    createCheckbox('hideDotFutureReports', 'Future'),
                    createCheckbox('hideDotCurrentReports', 'Current/Past')
                )
            )
        ),
        $('<div>', { class: 'side-panel-section>', id: 'dot-report-table' }).append(
            $('<div>').append(
                $('<span>', {
                    title: 'Click to refresh DOT reports',
                    class: 'fa fa-refresh refreshIcon dot-refresh-reports dot-table-label',
                    style: 'cursor:pointer;'
                }),
                $('<span>', { class: 'dot-table-label dot-report-count count' }),
                $('<span>', { class: 'dot-table-label dot-table-action right' }).text('Archive all').click(() => {
                    if (confirm(`Archive all reports for ${_settings.state}?`)) {
                        archiveAllReports(false);
                    }
                }),
                $('<span>', { class: 'dot-table-label right' }).text('|'),
                $('<span>', { class: 'dot-table-label dot-table-action right' }).text('Un-Archive all').click(() => {
                    if (confirm(`Un-archive all reports for ${_settings.state}?`)) {
                        archiveAllReports(true);
                    }
                })
            )
        )
    );

    new WazeWrap.Interface.Tab('DOT', panel.html(), initSideTab, null);
}

function showScriptInfoAlert() {
    /* Check version and alert on update */
    if (ALERT_UPDATE && SCRIPT_VERSION !== _settings.lastVersion) {
        alert(SCRIPT_VERSION_CHANGES);
    }
}

function initGui() {
    init511ReportsOverlay();
    buildSideTab();
    showScriptInfoAlert();

    $(`<style type="text/css">
.dot-table th,td,tr {cursor: default;}
.dot-table .centered {text-align:center;}
.dot-table th:hover,tr:hover {background-color: aliceblue;outline: -webkit-focus-ring-color auto 5px;}
.dot-table th:hover {color: blue;border-color: whitesmoke; }
.dot-table {border: 1px solid gray;border-collapse: collapse;width: 100%;font-size: 83%;margin: 0px 0px 0px 0px}
.dot-table th,td {border: 1px solid gainsboro;}
.dot-table td,th {color: black;padding: 1px 4px;}
.dot-table th {background-color: gainsboro;}
.dot-table .table-img {max-width: 24px;max-height: 24px;}
.tooltip.top > .tooltip-arrow {border-top-color: white;}
.tooltip.bottom > .tooltip-arrow {border-bottom-color: white;}
.close-popover { cursor: pointer;font-size: 20px; }
.close-popover:hover { color: #f35252; }
.refreshIcon:hover {color:blue;text-shadow: 2px 2px #aaa;}
.refreshIcon:active { text-shadow: 0px 0px; }
.dot-tab-icon { margin-left: 10px; }
.dot-archived-marker {opacity: 0.5;}
.dot-table-label {font-size: 85%;}
.dot-table-action:hover {color: blue;cursor: pointer}
.dot-table-label.right {float: right}
.dot-table-label.count {margin-left: 4px;}
.dot-table .star {cursor: pointer;width: 18px;height: 18px;margin-top: 3px;}
.dot-table .star-empty {content: url(${IMAGES_PATH}/star-empty.png);}
.dot-table .star-filled {content: url(${IMAGES_PATH}/star-filled.png);}
.dot-table .removed-report {text-decoration: line-through;color: #bbb}
</style>`).appendTo('head');

    _previousZoom = W.map.zoom;
    W.map.events.register('zoomend', null, () => {
        if (_previousZoom !== W.map.zoom) {
            hideAllReportPopovers();
        }
        _previousZoom = W.map.zoom;
    });
}

function loadSettingsFromStorage() {
    let settings = $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME));
    if (!settings) {
        settings = {
            lastVersion: null,
            layerVisible: true,
            state: 'ID',
            hideArchivedReports: true,
            archivedReports: {}
        };
    } else {
        settings.layerVisible = (settings.layerVisible === true);
        settings.state = settings.state ? settings.state : Object.keys(DOT_INFO)[0];
        if (typeof settings.hideArchivedReports === 'undefined') {
            settings.hideArchivedReports = true;
        }
        settings.archivedReports = settings.archivedReports ? settings.archivedReports : {};
        settings.starredReports = settings.starredReports ? settings.starredReports : {};
    }
    _settings = settings;
}

function addMarkers() {
    _mapLayer.clearMarkers();
    const dataBounds = getExpandedDataBounds();
    _reports.forEach(report => {
        if (dataBounds.containsLonLat(report.location.openLayers.primaryPointLonLat)) {
            _mapLayer.addMarker(report.marker);
        }
    });
}

function onMoveEnd() {
    addMarkers();
}

async function init() {
    loadSettingsFromStorage();
    W.map.events.register('moveend', null, onMoveEnd);
    unsafeWindow.addEventListener('beforeunload', saveSettingsToStorage, false);
    initGui();
    await fetchReports();
    addMarkers();
    log('Initialized');
}

function bootstrap() {
    if (W && W.loginManager
        && W.loginManager.events.register
        && W.map && W.loginManager.user
        && WazeWrap.Ready) {
        log('Initializing...');
        init();
    } else {
        log('Bootstrap failed. Trying again...');
        setTimeout(bootstrap, 1000);
    }
}

bootstrap();
