// ==UserScript==
// @name            Flickr - AUTO More (Merged) all "Auto" at once
// @version         1.02
// @description	    in Photo page : Auto Load More Comments / Groups / Galleries / Video Play and Replay
// @author          decembre
// @icon            https://external-content.duckduckgo.com/ip3/blog.flickr.net.ico
// @namespace       https://greasyfork.org/fr/users/8-decembre
// @include         http*://www.flickr.com/photos/*
// @exclude         http*://*flickr.com/photos/*/map*
// @exclude         http*://*flickr.com/photos/*/page*
// @exclude         http*://*flickr.com/groups/*/pool/*
// @exclude         http*://*flickr.com/photos/*/favorites*
// @exclude         http*://*flickr.com/photos/*/albums*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant           GM_addStyle
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/529975/Flickr%20-%20AUTO%20More%20%28Merged%29%20all%20%22Auto%22%20at%20once.user.js
// @updateURL https://update.greasyfork.org/scripts/529975/Flickr%20-%20AUTO%20More%20%28Merged%29%20all%20%22Auto%22%20at%20once.meta.js
// ==/UserScript==

(function () {
    // Use jQuery directly instead of $
    const $ = window.jQuery;

    // 0 - Fo GM "Utags" - Function to check if the modal is open
    function isModalOpen() {
        return $('.browser_extension_settings_container:visible, .utags_modal:visible').length > 0;
    }

    function waitForKeyElements(
        selectorTxt,
        actionFunction,
        bWaitOnce,
        iframeSelector
    ) {
        if (isModalOpen()) {
            setTimeout(function() {
                waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
            }, 100);
            return;
        }

        var targetNodes, btargetsFound;

        if (typeof iframeSelector === "undefined") {
            targetNodes = $(selectorTxt);
        } else {
            targetNodes = $(iframeSelector).contents().find(selectorTxt);
        }

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound) {
                        btargetsFound = false;
                    } else {
                        jThis.data('alreadyFound', true);
                    }
                }
            });
        } else {
            btargetsFound = false;
        }

        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        if (btargetsFound && bWaitOnce && timeControl) {
            clearInterval(timeControl);
            delete controlObj[controlKey];
        } else {
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
                }, 300);
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }



    // 1 - PHOTO pages - AUTO MORE Comments
    function actionMoreCommnents(node){
        if (isModalOpen()) {
            return false;
        }
        console.log ("Found More Comments Button. Clicking it!");
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent ('click', true, true);
        node[0].dispatchEvent (clickEvent);
        return true;
    }
    console.log ("Waiting for More Comments Button");
    waitForKeyElements(".sub-photo-content-container .photo-comments.with-emoji-picker a.load-more-button:not(.hidden)", actionMoreCommnents);


    // 2 - PHOTO pages - AUTO MORE Groups
    function actionMorePools(node){
        if (isModalOpen()) {
            return false;
        }
        console.log ("Found More Pools Button. Clicking it!");
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent ('click', true, true);
        node[0].dispatchEvent (clickEvent);
        return true;
    }
    console.log ("Waiting for More Pools Button");
    waitForKeyElements(".sub-photo-contexts-view .sub-photo-context.sub-photo-context-groups .view-all-contexts-of-type a", actionMorePools);



    // 3 - PHOTO pages - AUTO MORE Galleries
    function actionMoreGall(node){
        if (isModalOpen()) {
            return false;
        }
        console.log ("Found More Galleries Button. Clicking it!");
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent ('click', true, true);
        node[0].dispatchEvent (clickEvent);
        return true;
    }
        console.log ("Waiting for More Galleries Button");
    waitForKeyElements(".sub-photo-galleries-view:not(.empty) .sub-photo-context.sub-photo-context-galleries .view-all-contexts-of-type a", actionMoreGall);


    // 4 - PHOTO pages - AUTO MORE Previews in Mini Thumbnail
    function actionNEXT(node) {
        if (isModalOpen()) {
            return false;
        }
        console.log("Found More thumbnail next arrow. Clicking it!");
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('click', true, true);
        node[0].dispatchEvent(clickEvent);
        return true;
    }

    console.log("Waiting for More thumbnail next arrow");
    waitForKeyElements(".context-slider-scrappy-view.hover .context-slider.big-slider > .nav-r", actionNEXT);

    // ONLY PREV arrow
    function actionOnlyPrev(node) {
        if (isModalOpen()) {
            return false;
        }
        console.log("Found More thumbnail only PREV arrow. Clicking it!");
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('click', true, true);
        node[0].dispatchEvent(clickEvent);
        return true;
    }

    console.log("Waiting for More thumbnail ONLY PREV arrow");
    waitForKeyElements(".context-slider-scrappy-view .context-slider.hover:has(.nav-l):has(.nav-r[style='display: none;']):has(.nav-r[hidden]) > .nav.nav-l span", actionOnlyPrev);

    // 4 - AUTO Video Play - PHOTO pages
    function loadScript(url, callback) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    loadScript('https://code.jquery.com/jquery-3.6.0.min.js', function() {
        (function($) {
            'use strict';

            console.log('Script loaded');

            // Wait for the video element to be loaded
            var videoElement = document.querySelector('.fluid.html-photo-page-scrappy-view video#video_1_html5_api');
            if (videoElement) {
                console.log('Video element found');
                // Set the video to auto play and loop
                videoElement.autoplay = true;
                videoElement.loop = true;
                videoElement.muted = true; // Mute the video
                videoElement.volume = 0.5;

                console.log('Auto-play and loop properties set');

                // Add an event listener to play the video when the user interacts with it
                videoElement.addEventListener('click', function() {
                    if (!isModalOpen()) {
                        this.play();
                    }
                });

                // Add an event listener to replay the video when it ends
                videoElement.addEventListener('ended', function() {
                    if (!isModalOpen()) {
                        this.play();
                    }
                });

                // Add an event listener to handle volume control
                videoElement.addEventListener('volumechange', function() {
                    this.muted = false;
                });

                // Play the video
                if (!isModalOpen()) {
                    videoElement.play();
                }

                console.log('Video played');
            } else {
                console.log('Video element not found');

                // If the video element is not found, wait for it to be loaded
                var intervalId = setInterval(function() {
                    if (isModalOpen()) {
                        return;
                    }
                    var videoElement = document.querySelector('.fluid.html-photo-page-scrappy-view video#video_1_html5_api');
                    if (videoElement) {
                        console.log('Video element found after interval');

                        // Set the video to auto play and loop
                        videoElement.autoplay = true;
                        videoElement.loop = true;
                        videoElement.muted = true; // Mute the video
                        videoElement.volume = 0.5;

                        console.log('Auto-play and loop properties set after interval');

                        // Add an event listener to play the video when the user interacts with it
                        videoElement.addEventListener('click', function() {
                            if (!isModalOpen()) {
                                this.play();
                            }
                        });

                        // Add an event listener to replay the video when it ends
                        videoElement.addEventListener('ended', function() {
                            if (!isModalOpen()) {
                                this.play();
                            }
                        });

                        // Add an event listener to handle volume control
                        videoElement.addEventListener('volumechange', function() {
                            this.muted = false;
                        });

                        // Play the video
                        if (!isModalOpen()) {
                            videoElement.play();
                        }

                        console.log('Video played after interval');

                        // Clear the interval
                        clearInterval(intervalId);
                    }
                }, 100);
            }
        })(null);
    });
})();

