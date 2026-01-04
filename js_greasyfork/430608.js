// ==UserScript==
// @name         Not so fast!
// @namespace    kiwicolin
// @version      0.7
// @description  Prevents hitting the enter key too quickly during reviews!
// @author       You
// @match        https://www.wanikani.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/430608/Not%20so%20fast%21.user.js
// @updateURL https://update.greasyfork.org/scripts/430608/Not%20so%20fast%21.meta.js
// ==/UserScript==

(function(wkof) {
    'use strict';

    if (!wkof) {
        alert('[Your script name here] script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }

    var enterDelay = 2; // seconds between any key and an enter press
    var triggerCount = 2; // number of early enter keys before we get annoyed

    const complaintMalePath = 'https://cdn.wanikani.com/audios/19998-subject-2942.mp3';
    const complaintFemalePath = 'https://cdn.wanikani.com/audios/39915-subject-2942.mp3'

    // Install a link in the Wanikani menu for opening our settings.
    // Then load our saved settings.
    wkof.include('Menu,Settings');
    wkof.ready('Menu,Settings')
        .then(install_menu)
        .then(load_settings)
        .then(startup);

    // Install our link under [Scripts -> Demo -> Settings Demo]
    function install_menu() {
        wkof.Menu.insert_script_link({
            name:      'not_so_fast',
            submenu:   'Settings',
            title:     'Not So Fast!',
            on_click:  open_settings
        });
    }

    // Load our saved settings from storage.
    function load_settings() {
        // We 'return' the Promise from wkof.Settings.load(), so
        // init_settings() will wait until the settings are loaded.
        console.log('Loading settings...');
        return wkof.Settings.load('not_so_fast');
    }

    // This is called after our settings are loaded.
    function startup() {
        console.log('Settings are loaded!  Initializing...');
        console.log('delay is ' + wkof.settings.not_so_fast.delay);
        console.log('triggerCount is ' + wkof.settings.not_so_fast.triggerCount);
        if (!wkof.settings.not_so_fast.delay) {
            wkof.settings.not_so_fast.delay = 2;
            console.log('set delay is ' + wkof.settings.not_so_fast.delay);
        }
        if (!wkof.settings.not_so_fast.triggerCount) {
            wkof.settings.not_so_fast.triggerCount = 2;
            console.log('set triggerCount is ' + wkof.settings.not_so_fast.triggerCount);

        }
        enterDelay = wkof.settings.not_so_fast.delay * 1000;
        triggerCount = wkof.settings.not_so_fast.triggerCount;
    }

    // This is called when the user clicks the "Settings Demo" link in the menu.
    function open_settings() {
        var config = {
            script_id: 'not_so_fast',
            title: 'Not So Fast!',
            on_save: update_settings,
            content: {
                delay: {
                    type: 'number',
                    label: 'Enter Delay (seconds)',
                    default: 2,
                    hover_tip: 'The number of seconds to delay accepting an enter keystroke.',
                },
                triggerCount: {
                    type: 'number',
                    label: 'Complaint Threshold',
                    default: 2,
                    hover_tip: "The number of enter key's pressed before complaints start.",
                },
            }
        }
        var dialog = new wkof.Settings(config);
        dialog.open();
    }

    // Called when the user clicks the Save button on the Settings dialog.
    function update_settings() {
        console.log('Settings saved!');
        console.log('New delay is ' + wkof.settings.not_so_fast.delay);
        console.log('New triggerCount is ' + wkof.settings.not_so_fast.triggerCount);
        enterDelay = wkof.settings.not_so_fast.delay * 1000;
        triggerCount = wkof.settings.not_so_fast.triggerCount;
    }


    console.log("Creating object sounds");
    var complaintMaleSound = new Audio(complaintMalePath);
    var complaintFemaleSound = new Audio(complaintFemalePath);
    var complaint = [complaintFemaleSound, complaintMaleSound];

    var lastTimestamp = 0;
    var enterCount = 0;

    document.addEventListener('keydown', function(event) {
        var denied = false;
        if (event.key == 'Enter') {
            enterCount += 1;
            var currentDelay = event.timeStamp - lastTimestamp;
            console.log("Enter " + enterCount + ", delay of " + currentDelay + "ms");

            if (currentDelay < enterDelay) {
                // this enter is too soon
                console.log('preventing propagation of early enter');
                event.preventDefault();
                event.stopImmediatePropagation();

                denied = true;

                // user is getting trigger-happy!
                if (enterCount >= triggerCount) {
                    console.log("User is too eager");
                    let soundIndex = (enterCount - triggerCount) % complaint.length;
                    console.log("complaint index is " + soundIndex);
                    complaint[soundIndex].play();
                }
            }
        }
        console.log("enterCount: " + enterCount);

        if (!denied) {
            enterCount = 0;
            lastTimestamp = event.timeStamp;
        }
    }, true);
})(window.wkof);