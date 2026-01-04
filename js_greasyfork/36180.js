// ==UserScript==
// @name            Waze LiveMap Options
// @namespace       WazeDev
// @version         2019.07.06.001
// @description     Adds options to LiveMap to alter the Waze-suggested routes.
// @author          MapOMatic
// @include         /^https:\/\/www.waze.com\/.*livemap/
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @license         GNU GPL v3
// @grant           none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/47436/Waze%20LiveMap%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/47436/Waze%20LiveMap%20Options.meta.js
// ==/UserScript==

/* global W */
/* global Node */
/* global jQuery */
/* global MutationObserver */

const $ = jQuery.noConflict(true);
const EXPANDED_MAX_HEIGHT = '200px';
const TRANS_TIME = '0.2s';
const CSS = [
    '.lmo-options-header { padding-left: 27px; margin-top: 4px; cursor: pointer; color: #59899e; font-size: 11px; font-weight: 600; }',
    '.lmo-options-header i { margin-left: 5px; }',
    // eslint-disable-next-line max-len
    `.lmo-options-container { padding-left: 27px; padding-right: 27px; max-height: 500px; overflow: hidden; margin-bottom: 10px; transition: max-height ${TRANS_TIME}; -moz-transition: max-height ${TRANS_TIME}; -webkit-transition: max-height ${TRANS_TIME}; -o-transition: max-height ${TRANS_TIME}; }`,
    '.lmo-table { margin-top: 4px; font-size: 12px; border-collapse: collapse; }',
    '.lmo-table td { padding: 4px 10px 4px 10px; border: 1px solid #ddd; border-radius: 6px; }',
    '.lmo-table-header-text { margin: 0px; font-weight: 600; }',
    '.lmo-control-container { margin-right: 8px; }',
    '.lmo-control-container label { line-height: 18px; vertical-align: text-bottom; }',
    '.lmo-table input[type="checkbox"] { margin-right: 2px; }',
    '.lmo-table td.lmo-header-cell { padding-left: 4px; padding-right: 4px; }',
    '#lmo-header-avoid { color: #c55; }'
].join('\n');

let _fitBounds;
const _settings = {
    'lmo-tolls': { checked: false },
    'lmo-freeways': { checked: false },
    'lmo-ferries': { checked: false },
    'lmo-difficult-turns': { checked: false },
    'lmo-unpaved-roads': { checked: true },
    'lmo-long-unpaved-roads': { checked: false },
    'lmo-u-turns': { checked: false, opposite: true },
    'lmo-hov': { checked: false, opposite: true },
    'lmo-hide-traffic': { checked: false },
    'lmo-vehicle-type': { value: 'private' },
    'lmo-allow-all-passes': { checked: false },
    'lmo-day': 'today',
    'lmo-hour': 'now',
    collapsed: false
};

function checked(id, optionalSetTo) {
    const $elem = $(`#${id}`);
    if (typeof optionalSetTo !== 'undefined') {
        $elem.prop('checked', optionalSetTo);
        return optionalSetTo;
    }
    return $elem.prop('checked');
}

function getDateTimeOffset() {
    let hour = $('#lmo-hour').val();
    let day = $('#lmo-day').val();
    if (hour === '---') hour = 'now';
    if (day === '---') day = 'today';
    if (hour === '') hour = 'now';
    if (day === '') day = 'today';

    const t = new Date();
    const thour = (t.getHours() * 60) + t.getMinutes();
    const tnow = (t.getDay() * 1440) + thour;
    let tsel = tnow;

    if (hour === 'now') {
        if (day !== 'today') tsel = (parseInt(day, 10) * 1440) + thour;
    } else {
        tsel = (day === 'today' ? t.getDay() * 1440 : parseInt(day, 10) * 1440) + parseInt(hour, 10);
    }

    let diff = tsel - tnow;
    if (diff < -3.5 * 1440) {
        diff += 7 * 1440;
    } else if (diff > 3.5 * 1440) {
        diff -= 7 * 1440;
    }

    return diff;
}

function getRouteTime(routeIdx) {
    let sec = W.app.routing.controller.store.state.routes[routeIdx].seconds;
    const hours = Math.floor(sec / 3600);
    sec -= hours * 3600;
    const min = Math.floor(sec / 60);
    sec -= min * 60;
    return `${(hours > 0 ? `${hours} h ` : '') + (min > 0 ? `${min} min ` : '') + sec} sec`;
}

function updateTimes() {
    const $routeTimes = $('.wm-route-item__time');
    for (let idx = 0; idx < $routeTimes.length; idx++) {
        const time = getRouteTime(idx);
        const $routeTime = $routeTimes.eq(idx);
        const contents = $routeTime.contents();
        contents[contents.length - 1].remove();
        $routeTime.append(` ${time}`);
    }
}

function fetchRoutes() {
    const { state } = W.app.routing.controller.store;
    // Does nothing if "from" and "to" haven't been specified yet.
    if (state && state.from && state.to) {
        // HACK - Temporarily remove the onAfterItemAdded function, to prevent map from moving.
        W.app.map.fitBounds = function fakeFitBounds() { };

        // Trigger the route search.
        W.app.routing.controller.findRoutes();
    }
}

function onOptionsHeaderClick() {
    const $container = $('.lmo-options-container');
    const collapsed = $container.css('max-height') === '0px';
    $('.lmo-options-header i').removeClass(collapsed ? 'fa-angle-down' : 'fa-angle-up').addClass(collapsed ? 'fa-angle-up' : 'fa-angle-down');
    $container.css({ maxHeight: collapsed ? EXPANDED_MAX_HEIGHT : '0px' });
    _settings.collapsed = !collapsed;
}

function onControlChanged() {
    const { id } = this;
    if (id === 'lmo-hour' || id === 'lmo-day') {
        fetchRoutes();
    } else {
        const isChecked = checked(id);
        if (this.type === 'checkbox') {
            _settings[id].checked = isChecked;
            if (id === 'lmo-hide-traffic') {
                if (isChecked) {
                    W.app.geoRssLayer._jamsLayer.remove();
                } else {
                    W.app.geoRssLayer._jamsLayer.addTo(W.app.map);
                }
            } else {
                if (id === 'lmo-long-unpaved-roads') {
                    if (isChecked) {
                        checked('lmo-unpaved-roads', false);
                        _settings['lmo-unpaved-roads'].checked = false;
                    }
                } else if (id === 'lmo-unpaved-roads') {
                    if (isChecked) {
                        checked('lmo-long-unpaved-roads', false);
                        _settings['lmo-long-unpaved-roads'].checked = false;
                    }
                }
                fetchRoutes();
            }
        } else if (this.type === 'radio') {
            _settings['lmo-vehicle-type'].value = this.value;
            fetchRoutes();
        }
    }
}

function addOptions() {
    if (!$('#lmo-table').length) {
        $('.wm-routing__top').after(
            $('<div>', { class: 'lmo-options-header' }).append(
                $('<span>').text('Change routing options'),
                $('<i>', { class: 'fa fa.fa-angle-down fa.fa-angle-up' }).addClass(_settings.collapsed ? 'fa-angle-down' : 'fa-angle-up')
            ),
            $('<div>', { class: 'lmo-options-container' }).css({ maxHeight: _settings.collapsed ? '0px' : EXPANDED_MAX_HEIGHT }).append(
                $('<table>', { class: 'lmo-table' }).append(
                    [
                        ['Avoid:', ['Tolls', 'Freeways', 'Ferries', 'HOV', 'Unpaved roads', 'Long unpaved roads', 'Difficult turns', 'U-Turns']],
                        ['Vehicle Type:', ['Private', 'Taxi', 'Motorcycle']],
                        ['Passes:', ['Allow all passes']],
                        ['Options:', ['Hide traffic']]
                    ].map(rowItems => {
                        const rowID = rowItems[0].toLowerCase().replace(/[:]/g, '').replace(/ /g, '-');
                        return $('<tr>', { id: `lmo-row-${rowID}` }).append(
                            $('<td>', { class: 'lmo-header-cell' }).append(
                                $('<span>', { id: `lmo-header-${rowID}`, class: 'lmo-table-header-text' }).text(rowItems[0])
                            ),
                            $('<td>', { class: 'lmo-settings-cell' }).append(
                                rowItems[1].map(text => {
                                    const idName = text.toLowerCase().replace(/ /g, '-');
                                    const id = `lmo-${idName}`;
                                    if (rowID === 'vehicle-type') {
                                        return $('<span>', { class: 'lmo-control-container' }).append(
                                            $('<input>', {
                                                id,
                                                type: 'radio',
                                                class: 'lmo-control',
                                                name: 'lmo-vehicle-type',
                                                value: idName.toLowerCase()
                                            }).prop('checked', _settings['lmo-vehicle-type'].value === idName.toLowerCase()), $('<label>', { for: id }).text(text)
                                        );
                                    }
                                    return $('<span>', { class: 'lmo-control-container' }).append(
                                        $('<input>', { id, type: 'checkbox', class: 'lmo-control' })
                                            .prop('checked', _settings[id].checked), $('<label>', { for: id }).text(text)
                                    );
                                })
                            )
                        );
                    })
                )
            )
        );

        $('label[for="lmo-u-turns"').attr('title', 'Note: this is not an available setting in the app');

        const timeArray = [['Now', 'now']];
        for (let i = 0; i < 48; i++) {
            const t = i * 30;
            const min = t % 60;
            const hr = Math.floor(t / 60);
            const str = `${(hr < 10 ? ('0') : '') + hr}:${min === 0 ? '00' : min}`;
            timeArray.push([str, t.toString()]);
        }
        $('#lmo-row-options td.lmo-settings-cell').append(
            $('<div>', { class: 'lmo-date-time' }).append(
                $('<label>', { for: 'lmo-day', style: 'font-weight: normal;' }).text('Day'),
                $('<select>', { id: 'lmo-day', class: 'lmo-control', style: 'margin-left: 4px; margin-right: 8px; padding: 0px; height: 22px;' }).append(
                    [
                        ['Today', 'today'],
                        ['Monday', '1'],
                        ['Tuesday', '2'],
                        ['Wednesday', '3'],
                        ['Thursday', '4'],
                        ['Friday', '5'],
                        ['Saturday', '6'],
                        ['Sunday', '0']
                    ].map(val => $('<option>', { value: val[1] }).text(val[0]))
                ),
                $('<label>', { for: 'lmo-hour', style: 'font-weight: normal;' }).text('Time'),
                $('<select>', { id: 'lmo-hour', class: 'lmo-control', style: 'margin-left: 4px; margin-right: 8px; padding: 0px; height: 22px;' }).append(
                    timeArray.map(val => $('<option>', { value: val[1] }).text(val[0]))
                )
            )
        );

        // Set up events
        $('.lmo-options-header').click(onOptionsHeaderClick);
        $('.lmo-control').change(onControlChanged);
    }
}

function installHttpRequestInterceptor() {
    // Special thanks to Twister-UK for finding this code example...
    // original code from https://stackoverflow.com/questions/42578452/can-one-use-the-fetch-api-as-a-request-interceptor
    // eslint-disable-next-line wrap-iife
    window.fetch = (function fakeFetch(origFetch) {
        return function myFetch(...args) {
            let url = args[0];
            if (url.indexOf('/routingRequest?') !== -1) {
                // Remove all options from the request (everything after '&options=')
                let baseData = url.replace(url.match(/&options=(.*)/)[1], '');
                // recover stuff after the &options bit...
                const otherBits = `&returnGeometries${url.split('&returnGeometries')[1]}`;
                const options = [];
                [
                    ['tolls', 'AVOID_TOLL_ROADS'],
                    ['freeways', 'AVOID_PRIMARIES'],
                    ['ferries', 'AVOID_FERRIES'],
                    ['difficult-turns', 'AVOID_DANGEROUS_TURNS'],
                    ['u-turns', 'ALLOW_UTURNS'],
                    ['hov', 'ADD_HOV_ROUTES']
                ].forEach(optionInfo => {
                    const id = `lmo-${optionInfo[0]}`;
                    let enableOption = checked(id);
                    if (_settings[id].opposite) enableOption = !enableOption;
                    options.push(`${optionInfo[1]}:${enableOption ? 't' : 'f'}`);
                });
                if (checked('lmo-long-unpaved-roads')) {
                    options.push('AVOID_LONG_TRAILS:t');
                } else if (checked('lmo-unpaved-roads')) {
                    options.push('AVOID_TRAILS:t');
                } else {
                    options.push('AVOID_LONG_TRAILS:f');
                }
                baseData = baseData.replace(/\?at=0/, `?at=${getDateTimeOffset()}`);
                url = baseData + encodeURIComponent(options.join(',')) + otherBits;
                if (checked('lmo-allow-all-passes')) {
                    url += '&subscription=*';
                }
                const vehicleType = _settings['lmo-vehicle-type'].value;
                if (vehicleType !== 'private') {
                    url += `&vehicleType=${vehicleType.toUpperCase()}`;
                }
                args[0] = url;
            }
            return origFetch.apply(this, args);
        };
    })(window.fetch);
}

function init() {
    // Insert CSS styling.
    $('head').append($('<style>', { type: 'text/css' }).html(CSS));

    // Add the xmlhttp request interceptor, so we can insert our own options into the routing requests.
    installHttpRequestInterceptor();

    // Add all of the DOM stuff for this script.
    addOptions();

    // Watch for the "waiting" spinner so we can disable and enable things while LM is fetching routes.
    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') {
                const waitingSpinner = !$(mutation.target).hasClass('wm-hidden');
                $('.lmo-control').prop('disabled', waitingSpinner);
                if (!waitingSpinner) {
                    W.app.map.fitBounds = _fitBounds;
                }
            }
        });
    });
    observer.observe($('.wm-route-search__spinner')[0], { childList: false, subtree: false, attributes: true });


    // Watch for routes being displayed, so we can update the displayed times.
    observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
                const addedNode = mutation.addedNodes[i];
                if (addedNode.nodeType === Node.ELEMENT_NODE && $(addedNode).hasClass('wm-route-list__routes')) {
                    updateTimes();
                }
            }
        });
    });
    observer.observe($('.wm-route-list')[0], { childList: true, subtree: true });

    // Remove the div that contains the native LiveMap options for setting departure time.
    $('div.wm-route-schedule').remove();

    // Remove the routing tip (save some space).
    $('div.wm-routing__tip').remove();

    // Store the fitBounds function.  It is removed and re-added, to prevent the
    // LiveMap api from moving the map to the boundaries of the routes every time
    // an option is checked.
    _fitBounds = W.app.map.fitBounds;
}

// Run the script.
function bootstrap(tries = 1) {
    if ($ && $('.wm-route-search__spinner').length) {
        init();
    } else if (tries < 1000) {
        setTimeout(() => { bootstrap(tries + 1); }, 200);
    }
}
bootstrap();
