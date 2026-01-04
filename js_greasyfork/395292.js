// ==UserScript==
// @name         Canopy auto-login
// @namespace    https://www.schiff.io
// @version      0.2
// @description  Automatically login to UC Blackboard
// @author       Hayden Schiff
// @match        https://canopy.uc.edu/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/395292/Canopy%20auto-login.user.js
// @updateURL https://update.greasyfork.org/scripts/395292/Canopy%20auto-login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Bb uses $ variable, so we have to declare it only locally
    jQuery.noConflict();
    var $ = jQuery;

    GM_config.init({
        'id': 'MyConfig',
        'title': 'Canopy auto-login settings',
        'fields': {
            'username': {
                'label': 'Username',
                'type': 'text',
                'default': ''
            },
            'password': {
                'label': 'Password',
                'type': 'password',
                'default': ''
            }
        }
    });

    function login() {

        // download login page to get security nonce
        $.ajax("/webapps/login/?action=relogin", {
            dataType: 'html',
            success: function(data, jqXHR, textStatus) {
                var nonce = $(data).find("input[name='blackboard.platform.security.NonceUtil.nonce']").val();

                // post credentials to login
                $.ajax("/webapps/login/", {
                    method: 'POST',
                    data: {
                        user_id: GM_config.get('username'),
                        password: GM_config.get('password'),
                        action: 'login',
                        'blackboard.platform.security.NonceUtil.nonce': nonce
                    },
                    dataType: 'html',
                    success: function (data, jqXHR, textStatus) {
                        console.log(data,jqXHR,textStatus);
                    }
                });
            }
        });
    }

    function checkLogin(callback) {

        // check if we are currently logged in
        $.ajax("/webapps/portal/execute/tabs/tabAction", {
            method: "POST",
            dataType: "text",
            data: {
                action: "refreshAjaxModule",
                modId: "_281_1",
                tabId: "_1_1",
                tab_tab_group_id: "_1_1"
            },
            success: function (data, jqXHR, textStatus) {
                var CHECK_STRING = "<!-- Username: guest<br /> -->";
                callback(data.indexOf(CHECK_STRING) === -1);
            }
        });
    }

    checkLogin(function(isLoggedIn) {
        if (!isLoggedIn) {
            login();
            checkLogin(function(success) {
                if (success) {
                    window.location.reload();
                } else {
                    GM_config.open();
                }
            });
        }
    });

    if (window.location.search.indexOf("&autologin") !== -1) {
        GM_config.open();
    }


})();
