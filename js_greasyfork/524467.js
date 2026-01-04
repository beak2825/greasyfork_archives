// ==UserScript==
// @name         PlugShareAnonymous
// @namespace    https://greasyfork.org/en/users/1365511-robosphinx
// @version      2025.01.21.001
// @description  Allows using PlugShare without an account.
// @author       robosphinx_, callumhume
// @match        *://*.plugshare.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/524467/PlugShareAnonymous.user.js
// @updateURL https://update.greasyfork.org/scripts/524467/PlugShareAnonymous.meta.js
// ==/UserScript==

(function main() {
    'use strict';

    const SCRIPT_LONG_NAME = GM_info.script.name;
    const SCRIPT_SHORT_NAME = "PSA";
    const SCRIPT_VERSION = GM_info.script.version;

    const LOGIN_DIALOG_CLASS = '.md-dialog-container';
    const ANTI_CLICK_BACKGROUND_1_ID = '#toast-container';
    const ANTI_CLICK_BACKGROUND_2_ID = '.md-dialog-backdrop';
    const LOAD_MAP_BUTTON = '.load';

    let successfulStartup = false;

    function log(tag, message) {
        if (tag == "ERROR") {
            console.error(SCRIPT_SHORT_NAME + ": " + tag + ": " + message);
        }
        else {
            console.log(SCRIPT_SHORT_NAME + ": " + tag + ": " + message);
        }
    }

    function removeLoginWindow() {
        // Heirarchy follows
        // ID layer-switcher-region
        // class layer-switcher
        // class menu
        // class scrollable
        // class list-unstyled togglers
        // class group
        // class md-dialog-container ng-scope
        try {
            log("INFO", "Looking for div ids to nuke...");
            let loginDialog = document.querySelector(LOGIN_DIALOG_CLASS); // Grab element by class name
            if (loginDialog != null) {
                log("INFO", "Found login dialog: " + loginDialog);
                loginDialog.remove();
                let toastContainer = document.querySelector(ANTI_CLICK_BACKGROUND_1_ID); // Grab element by ID
                if (toastContainer != null) {
                    log("INFO", "Found toast container: " + toastContainer);
                    toastContainer.remove();
                    let dialogBackdrop = document.querySelector(ANTI_CLICK_BACKGROUND_2_ID); // Grab element by class
                    if (dialogBackdrop != null) {
                        log("INFO", "Found dialog backdrop: " + dialogBackdrop);
                        dialogBackdrop.remove();
                        let loadMapButton = document.querySelector(LOAD_MAP_BUTTON); // Grab element by class
                        if (loadMapButton != null) {
                            log("INFO", "Found map load button: " + loadMapButton);
                            loadMapButton.click();
                            successfulStartup = true;
                        }
                        else {
                            log("ERROR", "Could not find element with class " + LOAD_MAP_BUTTON);
                            successfulStartup = false;
                        }
                    }
                    else {
                        log("ERROR", "Could not find element with class " + ANTI_CLICK_BACKGROUND_2_ID);
                        successfulStartup = false;
                    }
                }
                else {
                    log("ERROR", "Could not find element with class " + ANTI_CLICK_BACKGROUND_1_ID);
                    successfulStartup = false;
                }
            }
            else {
                log("ERROR", "Could not find element with class " + LOGIN_DIALOG_CLASS);
                successfulStartup = false;
            }
        }
        catch (err) {
            log("ERROR", "Looking for div ids to nuke returned error " + err);
            successfulStartup = false;
        }
    };

    function init() {
        log("INFO", SCRIPT_LONG_NAME + " " + SCRIPT_VERSION + " started");
        removeLoginWindow();
        if (successfulStartup) {
            log("INFO", SCRIPT_LONG_NAME + " initialized!");
        }
        else {
            log("ERROR", SCRIPT_LONG_NAME + " could not initialize.");
        }
    }

    function bootstrap() {
        let loginDialog = document.querySelector(LOGIN_DIALOG_CLASS); // Grab element by class name
        if (loginDialog != null) {
            init();
        } else {
            setTimeout(bootstrap, 100);
        }
    }

    bootstrap();
})();
