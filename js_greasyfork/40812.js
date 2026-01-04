// ==UserScript==
// @name           YouTube dark at night
// @version        0.3.1
// @description    Auto turn on YouTube dark theme at night.
// @description:ru Автоматически включает тёмную тему YouTube ночью.
// @author         gvvad
// @run-at         document-end
// @include        http*://www.youtube.com/*
// @include        http*://youtube.com/*
// @grant          none
// @license        MIT; https://opensource.org/licenses/MIT
// @copyright      2021, gvvad
// @namespace      https://greasyfork.org/users/100160
// @downloadURL https://update.greasyfork.org/scripts/40812/YouTube%20dark%20at%20night.user.js
// @updateURL https://update.greasyfork.org/scripts/40812/YouTube%20dark%20at%20night.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //******************************************/
    //* You can customize settings as you like */
    //* night time (22:00 - 6:59 default)      */
    //* check interval (5 minutes default)     */
    //******************************************/
    const STORAGE_NAME = "yt_dark_night";

    let scope = {
        nightHour: 22,
        dayHour: 7,
        interval: 5 * 60 * 1000,
        ytdApp: document.querySelector("ytd-app"),
        getYtdThemeToggle: function() {
            const TT_NODE = "ytd-toggle-theme-compact-link-renderer";
            return this.ytdApp.querySelector(TT_NODE) || document.createElement(TT_NODE);
        },
        get _onDarkModeToggleAction() {
            return this.ytdApp.onDarkModeToggledAction || this.ytdApp.onDarkModeToggledAction_;
        },
        get isDark() {
            return localStorage[STORAGE_NAME] == "1";
        },
        set isDark(v) {
            localStorage[STORAGE_NAME] = (v)? "1" : "0";
        },
        switchTheme: function() {
            this._turnDarkTheme(this.isDark);
        },
        _turnDarkTheme: function(v) {
            try {
                if ((this.ytdApp.isAppDarkTheme || this.ytdApp.isAppDarkTheme_).call(this.ytdApp) != v) {
                    if (!this._onDarkModeToggleAction) {
                        let ytdTt = this.getYtdThemeToggle();
                        if (v) {
                            (ytdTt.handleSignalActionToggleDarkThemeOn || ytdTt.handleSignalActionToggleDarkThemeOn_).call(ytdTt);
                        } else {
                            (ytdTt.handleSignalActionToggleDarkThemeOff || ytdTt.handleSignalActionToggleDarkThemeOff_).call(ytdTt);
                        }
                    }
                    this._onDarkModeToggleAction.call(this.ytdApp);
                }
            } catch(e) {
                console.log(`YTDark e:${e.message}`);
            }
        }
    };

    window.addEventListener("storage", function(ev) {
        if (ev.key == STORAGE_NAME) {
            this.switchTheme();
        }
    }.bind(scope));

    let dispatcher = function() {
        let hrs = (new Date()).getHours();
        this.isDark = (hrs >= this.nightHour || hrs < this.dayHour);
        this.switchTheme();
    }.bind(scope);

    scope.observer = new MutationObserver(function(mRecord) {
        if (!!(this.ytdApp.isAppDarkTheme || this.ytdApp.isAppDarkTheme_)) {
            dispatcher();
            this.observer.disconnect();
            delete this.observer;
        }
    }.bind(scope));
    scope.observer.observe(scope.ytdApp, {attributes: false, childList: true, characterData: false});

    setInterval(dispatcher, scope.interval);
})();