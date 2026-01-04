// ==UserScript==
// @name        CSW-Submit-Button-Tools
// @namespace   local crowdsurfwork
// @description Add function to save transcription to browser and a button recover
// @include     https://ops.cielo24.com/mediatool/transcription/jobs/*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40210/CSW-Submit-Button-Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/40210/CSW-Submit-Button-Tools.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let verbose = false;

    function log(message)
    { if (verbose) console.log('SBT:', message); }

    let $pte = $('#plaintext_edit');
    let $ce  = $('#clear_eveything'); // (sic)
    let $submitButton = $('#approve_button');
    if ($pte.length === 0) log('don\'t have #plaintext_edit');
    if ($ce.length === 0) log ('don\'t have #clear_eveything');
    if ($submitButton.length === 0) log('don\'t have submit button');

    let backupText = sessionStorage.getItem('sbt_transcription_backup');
    //log('backupText=' + backupText);

    function createButton(config)
    {
        let button = document.createElement('button');
        if (button)
        {
            button.innerHTML = config.innerHTML;
            if (config.hasOwnProperty('cssClass'))
                button.classList.add(config.cssClass);

            button.addEventListener(
                'click',
                config.onClick);
            return button;
        }

        log('failed to create button!?');
        return null;
    }

    function addRecoverButton()
    {
        let recoverButton = createButton({
            innerHTML: 'Recover',
            cssClass : 'btn',
            onClick  : function() {
                //log('backup value is ' + backupText);
                if (typeof backupText === 'string')
                    $pte.val(backupText);
            },
        });

        $ce.replaceWith(recoverButton);
    }

    function addBackupListener()
    {
        $submitButton.click(function () {
            log('backing up ' + $pte.val());
            sessionStorage.setItem('sbt_transcription_backup', $pte.val());
        });
    }

    $(document).on('readystatechange', function() {
        try
        {
            addRecoverButton();
            addBackupListener();
            log('added recover button and backup listener');
        }
        catch(e)
        {
            log('caught exception ' + e);
        }
    });
})();
