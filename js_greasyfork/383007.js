// ==UserScript==
// @name			DSA Endpoint Healthcheck
// @namespace		COMDSPDSA
// @author			Dan Overlander
// @icon            https://www.dorkforce.com/dsa/icons8-dell-64.png
// @version			1.2
// @description		Queries EMS or DAP endpoint healthcheck, indicates any sickness via UI
// @include         *sales.dell.com*
// @include	        *olqa.preol.dell.com*
// @include         *localhost.dell.com*
// @include	        *localhost:36865*
// @exclude         */swagger/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=698066
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @require         https://greasyfork.org/scripts/40055-libraryjquerygrowl/code/libraryJQueryGrowl.js
// @grant           GM_setValue
// @grant           GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/383007/DSA%20Endpoint%20Healthcheck.user.js
// @updateURL https://update.greasyfork.org/scripts/383007/DSA%20Endpoint%20Healthcheck.meta.js
// ==/UserScript==

// Since v01.1: Turned off debug mode. Updates.
// Since v01.0: Adjusting down the z-index of growl window. Bug fixes.
// Since v00.0: init, copying from SwaggerKeys script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    'use strict';

    var TIMEOUT = 750,
        global = {
            ids: {
                scriptName: 'DSA Endpoint Healthcheck',
                prefsName: 'DSAEndHealthPrefs',
                triggerElements: ['.icon-ui-dell']
            },
            states: {
                debugMode: false,
                areClassesAdded: false,
                isMouseMoved: false,
                growlTimedOut: true
            },
            prefs: undefined
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.setPrefs();
                    tm.setTamperIcon(global.ids.scriptName, global.ids.prefsName, global.prefs);
                    page.addClasses();
                    page.queryEndpoints();
                    page.parseData();
                }, TIMEOUT);
            },
            setPrefs: function() {
                global.prefs = GM_getValue(global.ids.prefsName) != null ? JSON.parse(GM_getValue(global.ids.prefsName)) : {};
                global.prefs.urls = global.prefs.urls != null ? global.prefs.urls : 'GetEstimatedDeliveryDate, AccountService, ContractPricingService, epicsearchservice, configservice';
                global.prefs.delay = global.prefs.delay != null ? global.prefs.delay : 60;
                tm.savePreferences(global.ids.prefsName, global.prefs);
            },
            addClasses: function () {
                if (!global.states.areClassesAdded) {
                    global.states.areClassesAdded = true;

                    // generic
                    // tm.addGlobalStyle('.fingery { margin:0px 13px; cursor:pointer; }');

                    //*-jQuery-Growl-*-MIT License-Copyright-2015-Kevin-Sylvestre-*-1.3.5-*/-
                    tm.addGlobalStyle('.ontop, #growls-default, #growls-tl, #growls-tr, #growls-bl, #growls-br, #growls-tc, #growls-bc, #growls-cc, #growls-cl, #growls-cr {z-index: 99999999; position: fixed; }');
                    tm.addGlobalStyle('#growls-default {top: 10px;right: 10px; }');
                    tm.addGlobalStyle('#growls-tl {top: 10px;left: 10px; }');
                    tm.addGlobalStyle('#growls-tr {top: 10px;right: 10px; }');
                    tm.addGlobalStyle('#growls-bl {bottom: 10px;left: 10px; }');
                    tm.addGlobalStyle('#growls-br {bottom: 10px;right: 10px; }');
                    tm.addGlobalStyle('#growls-tc {top: 10px;right: 10px;left: 10px; }');
                    tm.addGlobalStyle('#growls-bc {bottom: 10px;right: 10px;left: 10px; }');
                    tm.addGlobalStyle('#growls-cc {top: 50%;left: 50%;margin-left: -125px; }');
                    tm.addGlobalStyle('#growls-cl {top: 50%;left: 10px; }');
                    tm.addGlobalStyle('#growls-cr {top: 50%;right: 10px; }');
                    tm.addGlobalStyle('#growls-tc .growl, #growls-bc .growl {margin-left: auto;margin-right: auto; }');
                    tm.addGlobalStyle('.growl {opacity: 0.8;filter: alpha(opacity=80);position: relative;border-radius: 4px;-webkit-transition: all 0.4s ease-in-out;-moz-transition: all 0.4s ease-in-out;transition: all 0.4s ease-in-out; }');
                    tm.addGlobalStyle('.growl.growl-incoming {opacity: 0;filter: alpha(opacity=0); }');
                    tm.addGlobalStyle('.growl.growl-outgoing {opacity: 0;filter: alpha(opacity=0); }');
                    tm.addGlobalStyle('.growl.growl-small {width: 200px;padding: 5px;margin: 5px; }');
                    tm.addGlobalStyle('.growl.growl-medium {width: 250px;padding: 10px;margin: 10px; }');
                    tm.addGlobalStyle('.growl.growl-large {width: 700px;padding: 15px;margin: 15px; }');
                    tm.addGlobalStyle('.growl.growl-default {color: #FFF;background: #7f8c8d; }');
                    tm.addGlobalStyle('.growl.growl-error {color: #FFF;background: #C0392B; }');
                    tm.addGlobalStyle('.growl.growl-notice {color: #FFF;background: #2ECC71; }');
                    tm.addGlobalStyle('.growl.growl-warning {color: #FFF;background: #F39C12; }');
                    tm.addGlobalStyle('.growl .growl-close {cursor: pointer;float: right;font-size: 14px;line-height: 18px;font-weight: normal;font-family: helvetica, verdana, sans-serif; }');
                    tm.addGlobalStyle('.growl .growl-title {font-size: 18px;line-height: 24px; }');
                    tm.addGlobalStyle('.growl .growl-message {font-size: 12px;line-height: 16px; }');

                }
            },
            queryEndpoints: function () {
                if (global.endData == null) {
                    if (global.states.debugMode) tm.log('Querying Endpoints...');
                    $.ajax({
                        type : "POST",
                        contentType: "application/json",
                        dataType : "json",
                        url: 'https://dap.dell.com/api/sample',
                    })
                        .done(function(data) {
                        global.endData = data;
                        tm.savePreferences(global.ids.prefsName, global.prefs);
                    })
                        .fail(function() {
                        if (global.states.debugMode) tm.log(global.ids.scriptName + ' failed to fetch data');
                        global.endData = 'fail';
                        $.growl.error({
                            title: 'Healthcheck Failure',
                            duration: 3200,
                            message: 'Unable to reach healthcheck URL!',
                            size: 'small',
                            delayOnHover: true
                        });
                    })
                } else {
                    var now = moment(),
                        delay = Number(global.prefs.delay);
                    if (!global.growlTimer) global.growlTimer = now;

                    if (now.diff(global.growlTimer, 'seconds') >= delay) {
                        global.growlTimer = null;
                        global.states.growlTimedOut = true;
                    }
                }
            },
            parseData: function() {
                if (global.states.growlTimedOut && global.endData != null) {
                    global.states.growlTimedOut = false;
                    // scan data for errors about which to notify
                    var env = 'g2',
                        envs = Object.freeze({'g1':0, 'g2':1, 'g3':2, 'g4':3}),
                        selections = global.prefs.urls != null ? global.prefs.urls.replace(/ */g, '').split(',') : [],
                        report = '';
                    _.each(global.endData[envs[env]].ReportRows, (endpoint) => {
                        _.each(selections, (selection) => {
                            if (endpoint.RowData[2].toLowerCase().indexOf(selection.toLowerCase()) > -1 &&
                                (endpoint.Status.toLowerCase() != 'ok' || endpoint.RowData[3].indexOf('error') > -1)) {
                                report +=
                                    endpoint.RowData[1] + '<br>' +
                                    endpoint.RowData[2] + '<br>' +
                                    endpoint.RowData[3] + ' / ' +
                                    endpoint.Status + '<br><br>';
                            }
                        });
                    });
                    if (report != '') {
                        $.growl.error({
                            title: 'Endpoint Failure(s)!',
                            duration: 3200,
                            message: report,
                            size: 'large',
                            delayOnHover: true
                        });
                        global.prefs.errors = report;
                        tm.savePreferences(global.ids.prefsName, global.prefs);
                    }
                    global.endData = null;
                }
            }
        },
        utils = {
            initScript: function () {
                _.each(global.ids.triggerElements, (trigger) => {
                    tm.getContainer({
                        'el': trigger,
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        page.initialize();
                    });
                });
            }
        };

    (function() { // Global Functions
        if (global.states.debugMode) tm.log('Global initialization of ' + global.ids.scriptName);
        utils.initScript();
        $(document).mousemove(function(e) {
            if (!global.states.isMouseMoved) {
                global.states.isMouseMoved = true;
                setTimeout(function() {
                    global.states.isMouseMoved = false;
                }, TIMEOUT * 2);
                utils.initScript();
            }
        });
    })(); // Global Functions

})();