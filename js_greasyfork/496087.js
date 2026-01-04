// ==UserScript==
// @name         Hypeddit automator
// @namespace    http://tampermonkey.net/
// @version      2024-07-24.0.7
// @description  you must be logged in to soundcloud/spotify if the download requires those. instagram and youtube are skipped.
// @author       fan1200
// @match        https://hypeddit.com/*
// @match        https://secure.soundcloud.com/connect*
// @match        https://secure.soundcloud.com/authorize*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496087/Hypeddit%20automator.user.js
// @updateURL https://update.greasyfork.org/scripts/496087/Hypeddit%20automator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // set a real email if you wish:
    var email = '';

    // don't run if spotify required
    // if ( document.querySelector('#step_sp') ) { window.alert('spotify'); return; }

    // end configuration ------

    if (!email) {
      email = new Date().toISOString().split('T')[0] + '@hypeddit.com'
    }

    window.hypedditSettings = {
        email: email,
        name: 'a',
        comment: 'nice track!',
        auto_close: true,
        auto_close_timeout_in_ms: 5000
    }


  if (window.location.host.includes('hypeddit.com')) {
      if (!document.querySelector('#downloadProcess')) {
        console.log('no download found, abort');
        return;
      }
  }


    if (window.location.host.includes('soundcloud.com')) {
        const button = document.querySelector('button[type="submit"]');

        if (button && document.querySelector('.app-attribution')?.textContent.includes('Hypeddit') ) {
            button.click();
        } else {
            let isDone = false;
            const maxTries = 10;
            let cou = 0;

            const retryClick = () => {
                const button = document.querySelector('button[type="submit"]');

                if (button && document.querySelector('.app-attribution')?.textContent.includes('Hypeddit') ) {
                    button.click();
                    isDone = true;
                } else {
                    cou++;
                    if (cou < maxTries) {
                        setTimeout(retryClick, 200);
                    }
                }
            };

            setTimeout(retryClick, 200);
        }
    }


    window.handleFollowOptions = function(containerElementId, skipperId)
    {
        if(document.getElementById(containerElementId) !== null) {
            document.getElementById(containerElementId).querySelectorAll('a').forEach((accountItem) => {
                accountItem.classList.remove("undone");
                accountItem.classList.add("done");
            });

            document.getElementById(skipperId).click();

        }
    }

    window.handleSoundCloud = function() {

        console.log('SOUNDCLOUD');

        // some have a link to skip soundcloud
        const skip = document.querySelector('#skipper_sc');
        if (skip) {
            skip.click();
            return;
        }

        const comment = window.hypedditSettings.comment;

        if(document.getElementById("sc_comment_text") !== null) {
            document.getElementById("sc_comment_text").setAttribute('value', comment);
        }


        if(document.getElementById("step_sc") !== null) {
            document.getElementById("step_sc").querySelector('a').click();
        }
    };

    window.handleInstagram = function() {

        console.log('INSTA');
        window.handleFollowOptions("instagram_status", "skipper_ig_next");
    };

    window.handleYoutube = function() {

        console.log('YOUTUBE');
        window.handleFollowOptions("youtube_status", "skipper_yt_next");
    };

    window.handleSpotify = function() {

        console.log('SPOTIFY');
        document.getElementById("step_sp").querySelector('a').click();

    };

    window.handleDownload = function() {
        console.log("DOWNLOAD");
        document.getElementById("gateDownloadButton").click();

        if(window.hypedditSettings.auto_close) {
            const timeout = window.hypedditSettings.auto_close_timeout_in_ms;
            window.setTimeout(function() {
                close();
            }, timeout);
        }
    }

    window.handleEmail = function() {

        // some have a link to skip email
        const skip = document.querySelector('#skipper_email');
        if (skip) {
            skip.click();
            return;
        }

        const email = window.hypedditSettings.email;
        const name = window.hypedditSettings.name;

        if(document.getElementById("email_name") !== null) {
            document.getElementById("email_name").setAttribute('value', name);
        }

        if(document.getElementById("email_address") !== null) {
            document.getElementById("email_address").setAttribute('value', email);
            document.getElementById("email_address").value = email;
        }

        document.getElementById("email_to_downloads_next").click();
    }

    window.handleTikTok = function() {
        console.log("TIKTOK");
        window.handleFollowOptions("tiktok_status", "skipper_tk_next");
    }

    window.handleFacebook = function() {
        console.log("FACEBOOK");
        document.getElementById("fbCarouselSocialSection").click();
    }

    window.handleMultiPortal = function() {
        document.getElementById("step_email").previousElementSibling.click();
        window.handleEmail();
    }

    window.handleEmailSoundCloud = function() {
        document.getElementById("step_email").previousElementSibling.click();
        window.handleEmail();
    }

    window.handleSoundCloudYoutube = function() {
        document.getElementById("step_yt").previousElementSibling.click();
        window.handleYoutube();
    }

    window.handleDonate = function() {
        document.getElementById("step_dn").previousElementSibling.click();
        document.getElementById("donation_next").click();
    }

    window.handleMixcloud = function () {
        console.log("Mixcloud")
        document.getElementById("skipper_mc").click()
    }

    window.handleBandCamp = function() {
        document.getElementById("skipper_bc").click()
    }

    const targetNode = document.getElementById("myCarousel");

    const config = { attributes: true, childList: true, subtree: true };


    let prevStepContent = null;
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {

            if (mutation.type === "attributes") {
                const stepContent = document.querySelector('.fangate-slider-content:not(.move-left)');

                if(stepContent !== prevStepContent) {

                    const stepClassList = stepContent.classList;

                    if (stepClassList.contains("tk|ig")) {
                        window.handleTikTok()
                    }

                    if(stepClassList.contains("sp|ig|email")) {
                        window.handleMultiPortal();
                    }

                    if(stepClassList.contains("email|sc")) {
                        window.handleEmailSoundCloud();
                    }

                    if(stepClassList.contains("sc|yt")) {
                        window.handleSoundCloudYoutube();
                    }

                    if(stepClassList.contains("dn")) {
                        window.handleDonate();
                    }

                    if (stepClassList.contains("sc")) {
                        window.handleSoundCloud();
                    }

                    if (stepClassList.contains("ig")) {
                        window.handleInstagram();
                    }

                    if (stepClassList.contains("dw")) {
                        window.handleDownload();
                    }

                    if (stepClassList.contains("yt")) {
                        window.handleYoutube();
                    }

                    if (stepClassList.contains("sp")) {
                        window.handleSpotify();
                    }

                    if (stepClassList.contains("email")) {
                        window.handleEmail();
                    }

                    if (stepClassList.contains("tk")) {
                        window.handleTikTok();
                    }

                    if (stepClassList.contains("fb")) {
                        window.handleFacebook();
                    }

                    if (stepClassList.contains("mc")) {
                        window.handleMixcloud()
                    }

                    if (stepClassList.contains("bc")) {
                       window.handleBandCamp()
                    }

                }

                prevStepContent = stepContent;
            }
        }
    };


    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);

    const _start = () => {
        if(document.getElementById("downloadProcess") !== null) {
            document.getElementById("downloadProcess").click();
        }
    };

    window.setTimeout(_start, 800);

})();