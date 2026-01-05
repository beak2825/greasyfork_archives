// ==UserScript==
// @name         KatTrak
// @namespace    pxgamer
// @version      1.0.0
// @description  A Trakt system for integrating with Kickass Torrents.
// @author       pxgamer
// @include      *kat.cr/*
// @include      *pxstat.us/trakt*
// @include      *pxgamer.github.io/PX-Scripts/KatTrak/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/19828/KatTrak.user.js
// @updateURL https://update.greasyfork.org/scripts/19828/KatTrak.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    // NOTE: To set this up, run through the auth process here: https://pxgamer.github.io/PX-Scripts/KatTrak/
    // No, I'm not going to steal your data or anything. This is just a project to add what you download to your Trakt.tv Collection.

    var authCode = GM_getValue('katTrakAuth', '');
    var info = {
        currentV: parseFloat(GM_info.script.version),
        latestV: 0.0,
        browser: getBrowser(),
        scriptManager: getScriptManager()
    };
    var settings = {
        debug: true,
        logEvents: false,
        logHTTP: true,
        logAuth: false,
        logInfo: false
    };
    var KatTrak = {
        ready : function (callback) {
            KatTrak.onEvent(window, 'load', callback);
        },
        onEvent : function (element, type, listener, bubbles) {
            if (window.addEventListener) { // For all major browsers, except IE 8 and earlier
                (element || window).addEventListener(type, listener, bubbles || false);
            } else { // For IE 8 and earlier versions
                (element || window).attachEvent('on' + type, listener);
            }
            return arguments;
        },
        commands : [{
            caption : 'Homepage',
            execute : function () {
                location.href = 'https://pxgamer.github.io/PX-Scripts/KatTrak/';
            }
        }, {
            caption : 'Settings',
            execute : function () {
                location.href = 'https://pxgamer.github.io/PX-Scripts/KatTrak/#settings';
            }
        }, {
            caption : 'Update',
            execute : function () {
                location.href = 'https://pxgamer.github.io/PX-Scripts/KatTrak/#install';
            }
        }
                   ],
        addCommands : function (cmd) {
            if (typeof GM_getValue != 'undefined' && (parent == self) && typeof GM_registerMenuCommand != 'undefined') {
                GM_registerMenuCommand(['KatTrak', cmd.caption].join(' '), cmd.execute);
            }
        },
        registerCommands : function () {
            KatTrak.ready(function () {
                KatTrak.commands.forEach(function (cmd) {
                    KatTrak.addCommands(cmd);
                });
            });
        },
        initialize : function () {
            KatTrak.registerCommands(); // add commands to menu
        }
    };

    // Config Params
    // ---------------------------
    //GM_setValue('katTrakAuth', ''); location.reload(); // Uncomment to reset the authCode.


    // DO NOT EDIT BELOW THIS LINE
    // ---------------------------

    function getQV(variable)
    {
        if (settings.debug && settings.logEvents){console.info('EVENT Getting Query Variable');}
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    var getURL = location.href.toLowerCase();
    var sendData;

    if (getURL.indexOf('pxstat.us/trakt/?kattrakauth') > -1) {
        if (settings.debug && settings.logEvents){console.info('EVENT Redirecting KatTrak');}
        GM_setValue('katTrakAuth', getQV('katTrakAuth'));

        if (getQV('ret') == 'ktInstall') {
            location.href = 'https://pxgamer.github.io/PX-Scripts/KatTrak/#checkup';
        }
        else {
            location.href = 'https://kat.cr/';
        }
    }
    if (getURL.indexOf('pxgamer.github.io') > -1) {
        if (settings.debug && settings.logEvents){console.info('EVENT Running on Home Page');}
        var logged_in_valid = false;
        $('.unauthKt').parent().replaceWith($('.unauthKt').parent().html());
        if (settings.debug && settings.logHTTP){console.info('GET https://api-v2launch.trakt.tv/sync/last_activities');}
        $.ajax({
            beforeSend: function (request)
            {
                request.setRequestHeader("Content-type", "application/json");
                request.setRequestHeader("trakt-api-key", "9efcadc5be0011a406fa0819192bd3aef0b3b2d9fa6ba90f3ffd3907138195d3");
                request.setRequestHeader("trakt-api-version", 2);
                request.setRequestHeader("Authorization", "Bearer "+authCode+"");
            },
            type: "GET",
            async: false,
            url: "https://api-v2launch.trakt.tv/sync/last_activities",
            success: function (data) {
                if (data.all !== '') {
                    logged_in_valid = true;
                }
            },
            returnData: "json"
        });
        if (authCode !== '' && logged_in_valid) {
            $('.checkup-box').html('<table style="margin-left: 20%;"><tr style="text-align: left;"><td>Status:</td><td style="padding: 15px"></td><td>Success</td></tr><tr style="text-align: left;"><td>Auth Code:</td><td style="padding: 15px"></td><td>' + authCode + '</td></tr></table>');
            $('.unauthKt').replaceWith('<button class="btn btn-lg btn-danger unauthKt" type="button">Unauthorise KatTrak</button>');
            $('.unauthKt').on('click', function() {
                GM_setValue('katTrakAuth', '');
                location.reload();
            });
        }
        else if (authCode !== '') {
            $('.checkup-box').html('<table style="margin-left: 20%;"><tr style="text-align: left;"><td>Status:</td><td style="padding: 15px"></td><td>Failed: Invalid Auth Code</td></tr><tr style="text-align: left;"><td>Auth Code:</td><td style="padding: 15px"></td><td>' + authCode + '</td></tr></table>');
            $('.unauthKt').replaceWith('<button class="btn btn-lg btn-primary unauthKt" type="button">Re-Authorise KatTrak</button>');
            $('.unauthKt').on('click', function() {
                GM_setValue('katTrakAuth', '');
                location.href = 'https://trakt.tv/oauth/authorize?client_id=9efcadc5be0011a406fa0819192bd3aef0b3b2d9fa6ba90f3ffd3907138195d3&redirect_uri=https%3A%2F%2Fpxstat.us%2Ftrakt%2F&response_type=code';
            });
        }
        else {
            $('.checkup-box').html('<table style="margin-left: 20%;"><tr style="text-align: left;"><td>Status:</td><td style="padding: 15px"></td><td>Failed: No Code Provided</td></tr><tr style="text-align: left;"><td>Auth Code:</td><td style="padding: 15px"></td><td>' + authCode + '</td></tr></table>');
            $('.unauthKt').replaceWith('<button class="btn btn-lg btn-primary unauthKt" type="button">Authorise KatTrak</button>');
            $('.unauthKt').on('click', function() {
                GM_setValue('katTrakAuth', '');
                location.href = 'https://trakt.tv/oauth/authorize?client_id=9efcadc5be0011a406fa0819192bd3aef0b3b2d9fa6ba90f3ffd3907138195d3&redirect_uri=https%3A%2F%2Fpxstat.us%2Ftrakt%2F&response_type=code';
            });
        }
        if (settings.debug && settings.logHTTP){console.info('GET https://pxstat.us/misc/ktcheck/');}
        $.ajax({
            type: "GET",
            async: false,
            url: 'https://pxstat.us/misc/ktcheck/',
            success: function (data) {
                var ss = /\/\/ @version      ([0-9.]+)\n\/\//g;
                info.latestV = parseFloat(ss.exec(data)[1]);
            },
            dataType: "html"
        });
        if (info.latestV > info.currentV) { $('.installBtn').replaceWith('<button class="btn btn-lg btn-warning installBtn" type="button">Update Available</button>'); }
        else if (info.latestV == info.currentV) { $('.installBtn').replaceWith('<button class="btn btn-lg btn-success installBtn" type="button">Up to Date</button>'); }
        else { $('.installBtn').replaceWith('<button class="btn btn-lg btn-danger installBtn" type="button">Unable to Check Version</button>'); }

        $('#settings-config').html('Version: ' + info.currentV + ' <br>Success: '+logged_in_valid+' <br>Browser: ' + info.browser + ' <br>ScriptManager: ' + info.scriptManager);
        if (settings.debug && settings.logEvents){console.info('EVENT Finished');}
    }
    if (getURL.indexOf('kat.cr') > -1 && getURL.indexOf('.html') > -1) {
        if (settings.debug && settings.logEvents){console.info('EVENT Running on Kickass Torrents');}
        var category = $('span[id^="cat_"] strong a[href]:first').text();
        $('a.kaGiantButton[href^="/torrents/"][data-download]').attr('target', '_blank');
        var imdbId = "tt" + $('a.plain[href^="http://www.imdb.com/title/tt"]').text();
        if (category == 'Movies') {
            sendData = {
                "movies": [
                    {
                        "ids": {
                            "imdb": imdbId
                        }
                    }
                ]
            };
        }
        else if (category == 'TV') {
            sendData = {
                "shows": [
                    {
                        "ids": {
                            "imdb": imdbId
                        }
                    }
                ]
            };
        }

        $('a.kaGiantButton[href^="/torrents/"][data-download]').on('click', function() {
            if (settings.debug && settings.logHTTP){console.info('POST https://api-v2launch.trakt.tv/sync/collection');}
            $.ajax({
                beforeSend: function (request)
                {
                    request.setRequestHeader("Content-type", "application/json");
                    request.setRequestHeader("trakt-api-key", "9efcadc5be0011a406fa0819192bd3aef0b3b2d9fa6ba90f3ffd3907138195d3");
                    request.setRequestHeader("trakt-api-version", 2);
                    request.setRequestHeader("Authorization", "Bearer "+authCode+"");
                },
                type: "POST",
                url: "https://api-v2launch.trakt.tv/sync/collection",
                data: JSON.stringify(sendData),
                success: function (data) {
                    console.log(data);
                },
                returnData: "json"
            });
        });
        $('a.kaGiantButton[href^="magnet:?xt"][data-nop]').on('click', function() {
            if (settings.debug && settings.logHTTP){console.info('POST https://api-v2launch.trakt.tv/sync/collection');}
            $.ajax({
                beforeSend: function (request)
                {
                    request.setRequestHeader("Content-type", "application/json");
                    request.setRequestHeader("trakt-api-key", "9efcadc5be0011a406fa0819192bd3aef0b3b2d9fa6ba90f3ffd3907138195d3");
                    request.setRequestHeader("trakt-api-version", 2);
                    request.setRequestHeader("Authorization", "Bearer "+authCode+"");
                },
                type: "POST",
                url: "https://api-v2launch.trakt.tv/sync/collection",
                data: JSON.stringify(sendData),
                success: function (data) {
                    console.log(data);
                },
                returnData: "json"
            });
        });
        if (settings.debug && settings.logEvents){console.info('EVENT Finished');}
    }
    if (settings.debug && settings.logAuth) {console.info('Auth Code: ' + authCode);}
    if (settings.debug && settings.logInfo) {console.info(info);}
    KatTrak.initialize();
})();

function contains(string, search) {
    return string.indexOf(search) != -1;
}
function getBrowser() {
    var ua = navigator.userAgent;
    if (contains(ua, 'Firefox')) {
        return "Firefox";
    } else if (contains(ua, 'Sleipnir')) {
        return "Sleipnir"; // Mobile
    } else if (contains(ua, 'UCBrowser')) {
        return "UCBrowser"; // Mobile
    } else if (contains(ua, 'Dolfin')) {
        return "Dolphin"; // Mobile
    } else if (contains(ua, 'MSIE')) {
        return "InternetExplorer";
    } else if (contains(ua, 'Midori')) {
        return "Midori";
    } else if (contains(ua, 'Opera') || contains(ua, 'OPR')) {
        return "Opera";
    } else if (contains(ua, 'Chrome')) {
        return "Chrome";
    } else if (contains(ua, 'Safari')) {
        return "Safari";
    } else if (contains(ua, 'Konqueror')) {
        return "Konqueror";
    } else if (contains(ua, 'PaleMoon')) {
        return "PaleMoon"; // fork firefox
    } else if (contains(ua, 'Cyberfox')) {
        return "Cyberfox"; // fork firefox
    } else if (contains(ua, 'SeaMonkey')) {
        return "SeaMonkey"; // fork firefox
    } else if (contains(ua, 'Iceweasel')) {
        return "Iceweasel"; // fork firefox
    } else {
        return ua;
    }
}
function getScriptManager() {
    if (typeof GM_info == 'object') {
        // Greasemonkey (Firefox)
        if (typeof GM_info.uuid != 'undefined') {
            return 'Greasemonkey';
        } // Tampermonkey (Chrome/Opera)
        else if (typeof GM_info.scriptHandler != 'undefined') {
            return 'Tampermonkey';
        }
    } else {
        // Scriptish (Firefox)
        if (typeof GM_getMetadata == 'function') {
            return 'Scriptish';
        } // NinjaKit (Safari/Chrome)
        else if (typeof GM_setValue != 'undefined' &&
                 typeof GM_getResourceText == 'undefined' &&
                 typeof GM_getResourceURL == 'undefined' &&
                 typeof GM_openInTab == 'undefined' &&
                 typeof GM_setClipboard == 'undefined') {
            return 'NinjaKit';
        } else { // Native
            return 'Native';
        }
    }
}
