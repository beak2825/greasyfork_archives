// ==UserScript==
// @name         TAGG Toolkit
// @namespace    https://www.playtagg.com/
// @version      0.1
// @author       You
// @include https://*.playtagg.com/*
// @icon http://playtagg.com/favicon.ico
// @description:en TAGG dev tool
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_log
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_info
// @grant GM_getMetadata
// @run-at document-end
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require https://cdn.jsdelivr.net/alertifyjs/1.9.0/alertify.min.js
// @resource alertify_css https://cdn.jsdelivr.net/alertifyjs/1.9.0/css/alertify.min.css
// @resource alertify_bootstrap https://cdn.jsdelivr.net/alertifyjs/1.9.0/css/themes/bootstrap.min.css
// @connect *
// @description TAGG dev tool
// @downloadURL https://update.greasyfork.org/scripts/28755/TAGG%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/28755/TAGG%20Toolkit.meta.js
// ==/UserScript==
/*global unsafeWindow, GM_addStyle, GM_getValue, GM_setValue, GM_xmlhttpRequest, GM_registerMenuCommand, GM_deleteValue, GM_listValues, GM_getResourceText, GM_getResourceURL, GM_log, GM_openInTab, GM_setClipboard, GM_info, GM_getMetadata, $, document, console, location, setInterval, setTimeout, clearInterval*/

// ==/UserScript==

(function () {
    'use strict';
    var cssTxt = GM_getResourceText("alertify_css");
    var cssTxt1 = GM_getResourceText("alertify_bootstrap");
    GM_addStyle(cssTxt);
    GM_addStyle(cssTxt1);
    var localUserObj, localUserTraits, localSession;

    var userFound = false;
    var ajsFound = false;
    var userSession = false;


    function checkLS(appLSName, trackLSName, sessionKey) {

        localUserObj = JSON.parse(localStorage.getItem(appLSName + "")) === null ? {} : JSON.parse(localStorage.getItem(appLSName + ""));

        localUserTraits = JSON.parse(localStorage.getItem(trackLSName + "")) === null ? {} : JSON.parse(localStorage.getItem(trackLSName + ""));

        localSession = JSON.parse(localStorage.getItem(sessionKey + "")) === null ? {} : JSON.parse(localStorage.getItem(sessionKey + ""));

        if (Object.keys(localUserObj).length !== 0) {
            userFound = true;
        } else {
            userFound = false;
        }

        if (Object.keys(localUserTraits).length !== 0) {
            ajsFound = true;
        } else {
            ajsFound = false;
        }

        if (Object.keys(localSession).length !== 0) {
            userSession = true;
        } else {
            analytics.reset();
            drift.reset();
            userSession = false;

        }
    }

    var pageReady = false;
    document.onreadystatechange = function () {
        if (pageReady) {
            return;
        }
        // interactive = DOMContentLoaded & complete = window.load
        if (document.readyState == 'complete') {
            alertify.message('Page Loaded!', 1);
            pageReady = true;
            checkLS('ls.user', 'ajs_user_traits', 'ls.sessionKey');
            alertify.message('<span style="font-size:10px;">ls.user  -> '+ localStorage.getItem('ls.user')+ '</span>', 8);
            alertify.message('<span style="font-size:10px;">ajs_user_traits  -> '+ localStorage.getItem('ajs_user_traits')+ '</span>', 8);
            alertify.message('<span style="font-size:10px;">ls.sessionKey  -> '+ localStorage.getItem('ls.sessionKey')+ '</span>', 8);
            // init core code here


            //***START***
            //Debug menu injection
            //


            $('<li class="dropdown" id="patch1"><a href="#" class="dropdown-toggle font-weight-500" style="color:#FF0000">Toolbox</a><ul class="dropdown-menu default">' +
                '<li><a href="javascript:void(0);" id="debugMenu1">&nbsp;&nbsp; Check localStorage</a></li>' +
                '<li><a href="javascript:void(0);" id="debugMenu2">&nbsp;&nbsp; Attempt to identify user</a></li>' +
                '<li><a href="javascript:void(0);" id="debugMenu3">&nbsp;&nbsp; Reset analytics & drift</a></li>' +
                '<li><a href="javascript:void(0);" id="debugMenu4">&nbsp;&nbsp; Reset localStorage ls.user</a></li>' +
                '</ul>' +
                '</li>').insertBefore('body > header > div > nav > div > ul > li:nth-child(1)');
            //
            //Debug menu injection
            //***END***

            //***START***
            //preserve navigation ui effects
            //
            $('nav .dropdown > a').click(function () {
                return false;
            });

            $('nav .dropdown-submenu > a').click(function () {
                return false;
            });

            $('nav ul li.dropdown').hover(function () {
                $(this).addClass('open');
                var effect = $(this).data("effect");
                if (effect) {
                    $(this).find('.dropdown-menu').addClass('animated ' + effect + '');
                } else {
                    $(this).find('.dropdown-menu').addClass("animated fast fadeIn");
                }
            }, function () {
                $(this).removeClass('open');
                var effect = $(this).data("effect");
                if (effect) {
                    $(this).find('.dropdown-menu').removeClass('animated ' + effect + '');
                } else {
                    $(this).find('.dropdown-menu').removeClass("animated fast fadeIn");
                }
            });

            $('nav .dropdown-submenu').hover(function () {
                $(this).addClass('open');
            }, function () {
                $(this).removeClass('open');
            });
            //
            //preserve navigation ui effects
            //***END***

            //***START***
            //adding click hooks to injected menu
            //

            $('#debugMenu1').click(function () {
                if (Object.keys(localUserObj).length !== 0) {
                    alertify.success('<span style="color:white !important;"><b>' + localUserObj.screenName + '</b> found in ls.user!</span>', 2);

                } else {
                    alertify.error('ls.user is empty!', 2);
                }

                if (Object.keys(localUserTraits).length !== 0) {
                    alertify.success('<span style="color:white !important;"><b>' + localUserTraits.screenName + '</b> found in ajs_user_traits!</span>', 2);

                } else {
                    alertify.error('ajs_user_traits is empty!', 2);
                }
            });

            $('#debugMenu2').click(function () {
                console.log('userFound: ' + userFound);
                console.log('ajs: ' + ajsFound);
                if (!userFound) {
                    if (ajsFound) {
                        alertify.error('<span><b>Resetting Segment!</b></span>', 2, function () {
                            analytics.reset();
                        });
                        alertify.error('<span><b>Resetting Drift!</b></span>', 2, function () {
                            drift.reset();
                        });
                    } else {
                        alertify.warning('User already identified...', 2, function () {});
                    }
                } else {
                    alertify.success('<span style="color:white !important;"><b>Identifying ' + localUserObj.screenName + '</b>!</span>', 2, function () {
                        analytics.identify(localUserObj.screenName, localUserObj);
                    });
                }
            });

            $('#debugMenu3').click(function () {
                alertify.error('<span style="text-align:center;"><b>Resetting Segment!</b></span>', 2, function () {
                    analytics.reset();
                });
                alertify.error('<span style="text-align:center;"><b>Resetting Drift!</b></span>', 2, function () {
                    drift.reset();
                });
            });

            $('#debugMenu4').click(function () {
                alertify.error('<span style="text-align:center;"><b>Resetting ls.user!</b></span>', 2, function () {
                    //localStorage.removeItem('ls.user');
                    localStorage.setItem('ls.user', '{}');
                    localStorage.setItem('ls.walletObj', '{}');
                });
            });
            /**
                $('#debugMenu2').click(function(){ //DOM userObj check
                    if(menuToggle2 > 0){alert("execute more code here");menuToggle2 = 0;}else{menuToggle2++;}
                });

          
            **/

            //
            //adding click hooks to injected menu
            //***END***

        }
    };
})();