// ==UserScript==
// @name            Waze LiveMap Options
// @namespace       WazeDev
// @version         2021.10.04
// @description     Adds options to LiveMap to alter the Waze-suggested routes.
// @author          MapOMatic & J0N4S13
// @include         /^https:\/\/www.waze.com\/.*live-map/
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @license         GNU GPL v3
// @grant           none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/428477/Waze%20LiveMap%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/428477/Waze%20LiveMap%20Options.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */

const $ = jQuery.noConflict(true);
const EXPANDED_MAX_HEIGHT = '200px';
const TRANS_TIME = '0.2s';

const CSS = [
    '.lmo-options-header { padding-left: 27px; margin-top: 4px; cursor: pointer; color: #59899e; font-size: 11px; font-weight: 600; }',
    '.lmo-options-header i { margin-left: 5px; }',
    // eslint-disable-next-line max-len
    `.lmo-options-container { padding-left: 27px; padding-right: 27px; max-height: 500px; overflow: hidden; margin-bottom: 10px; transition: max-height ${TRANS_TIME}; -moz-transition: max-height ${TRANS_TIME}; -webkit-transition: max-height ${TRANS_TIME}; -o-transition: max-height ${TRANS_TIME}; }`,
    '.lmo-table { margin-top: 4px; font-size: 12px; border-collapse: collapse; }',
    '.lmo-table td { border: 1px solid #ddd; border-radius: 6px; }',
    '.lmo-table-header-text { margin: 0px; font-weight: 600; }',
    '.lmo-control-container { margin-right: 8px; }',
    '.lmo-control-container label { line-height: 18px; vertical-align: text-bottom; }',
    '.lmo-table input[type="checkbox"] { margin-right: 2px; }',
    '.lmo-table td.lmo-header-cell { padding-left: 4px; padding-right: 4px; }',
    '#lmo-header-avoid { color: #c55; }'
].join('\n');

const _settings = {
    'lmo-tolls': { checked: false },
    'lmo-freeways': { checked: false },
    'lmo-ferries': { checked: false },
    'lmo-difficult-turns': { checked: false },
    'lmo-unpaved-roads': { checked: true },
    'lmo-long-unpaved-roads': { checked: false },
    'lmo-u-turns': { checked: false, opposite: true },
    'lmo-hov': { checked: false, opposite: true },
    'lmo-vehicle-type': { value: 'private' },
    'lmo-routing': { value: 'production' },
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

function onControlChanged() {
    const { id } = this;
    const isChecked = checked(id);
    if (this.type === 'checkbox') {
        _settings[id].checked = isChecked;
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
    } else if (this.type === 'radio') {
        if (this.name === 'lmo-vehicle-type')
            _settings['lmo-vehicle-type'].value = this.value;
        if (this.name === 'lmo-routing')
            _settings['lmo-routing'].value = this.value;
    }
}

function addOptions() {
    if (!$('#lmo-table').length) {
        $('.wm-routing-schedule').after(
            $('<div>', { class: 'lmo-options-header' }).append(
                $('<span>').text('Change routing options'),
                $('<i>', { class: 'fa fa.fa-angle-down fa.fa-angle-up' }).addClass(_settings.collapsed ? 'fa-angle-down' : 'fa-angle-up')
            ),
            $('<div>', { class: 'lmo-options-container' }).css({ maxHeight: _settings.collapsed ? '0px' : EXPANDED_MAX_HEIGHT }).append(
                $('<table>', { class: 'lmo-table' }).append(
                    [
                        ['Avoid:', ['Tolls', 'Freeways', 'Ferries', 'HOV', 'Unpaved roads', 'Long unpaved roads', 'Difficult turns', 'U-Turns']],
                        ['Vehicle Type:', ['Private', 'Taxi', 'Motorcycle', 'EV']],
                        ['Routing:', ['Production', 'Beta']]
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
                                    if (rowID === 'routing') {
                                        return $('<span>', { class: 'lmo-control-container' }).append(
                                            $('<input>', {
                                                id,
                                                type: 'radio',
                                                class: 'lmo-control',
                                                name: 'lmo-routing',
                                                value: idName.toLowerCase()
                                            }).prop('checked', _settings['lmo-routing'].value === idName.toLowerCase()), $('<label>', { for: id }).text(text)
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

        // Set up events
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
            if (url.indexOf('/live-map/api/routing/') !== -1) {
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
                //options.push("FIX_REVERSE_ROUTE:t");
                url = baseData + encodeURIComponent(options.join(',')) + otherBits;
                const vehicleType = _settings['lmo-vehicle-type'].value;
                if (vehicleType !== 'private') {
                    url += `&vehicleType=${vehicleType.toUpperCase()}`;
                }
                const routing = _settings['lmo-routing'].value;
                if (routing !== 'production') {
                    url += `&id=${routing}`;
                }

                //url = url.replace('live-map/api/routing/?', 'row-RoutingManager/routingRequest?');

                //url = url.replace('reverse=true', '');

                args[0] = url;

                return new Promise((resolve, reject) => {
                    origFetch.apply(this, args)
                        .then((response) => {
                        /*var teste = response.clone();
                        if(response.url.indexOf("row-RoutingManager/routingRequest") > -1){
                            teste.json()
                                .then(function(data) {
                                var penalidade = [0, 0, 0];
                                if (typeof data["alternatives"] === 'undefined')
                                {
                                    data["response"]["results"].forEach(node => {
                                        penalidade[0] = penalidade[0] + node.penalty;
                                    });
                                }
                                else
                                {
                                    if (typeof data["alternatives"][0] !== 'undefined')
                                        data["alternatives"][0]["response"]["results"].forEach(node => {
                                            penalidade[0] = penalidade[0] + node.penalty;
                                        });
                                    if (typeof data["alternatives"][1] !== 'undefined')
                                        data["alternatives"][1]["response"]["results"].forEach(node => {
                                            penalidade[1] = penalidade[1] + node.penalty;
                                        });
                                    if (typeof data["alternatives"][2] !== 'undefined')
                                        data["alternatives"][2]["response"]["results"].forEach(node => {
                                            penalidade[2] = penalidade[2] + node.penalty;
                                        });
                                }
                                setTimeout(function(){
                                    $('.wm-routes-item-desktop__details')[0].append(penalidade[0]);
                                    $('.wm-routes-item-desktop__details')[1].append(penalidade[1]);
                                    $('.wm-routes-item-desktop__details')[2].append(penalidade[2]);
                                }, 1000);
                            });
                            // do something for specificconditions
                        }*/
                        resolve(response);
                    })
                })
            }
            /*else if (url.indexOf('/row-rtserver/web/TGeoRSS') !== -1) {
                url = url.replace('mu=20', 'mu=5000');
                url = url + "&tk=community&format=JSON";
                args[0] = url;
                return origFetch.apply(this, args);
            }*/
            else
                return origFetch.apply(this, args);
        };
    })(window.fetch);
}

function init() {
    $('head').append($('<style>', { type: 'text/css' }).html(CSS));

    // Add the xmlhttp request interceptor, so we can insert our own options into the routing requests.
    installHttpRequestInterceptor();

    // Add all of the DOM stuff for this script.
    setTimeout(function(){ addOptions(); }, 1000);
}

// Run the script.
function bootstrap(tries = 1) {
    if ($ && $('.wm-card').length) {
        init();
    } else if (tries < 1000) {
        setTimeout(() => { bootstrap(tries + 1); }, 200);
    }
}
bootstrap();