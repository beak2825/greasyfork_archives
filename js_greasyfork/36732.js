// ==UserScript==
// @name         AutoPlay Disabled for youtube
// @namespace    xeonx1
// @version      1.83
// @description  Prevents auto-play HTML5 videos in new tabs on [just] YouTube. This auto play blocker is an alternative to Click-to-Play / click to play. On some times like YouTube, click twice to begin first playback — From Dan Moorehead (xeonx1), developer of PowerAccess™ (http://PowerAccessDB.com)
// @author       Dan Moorehead (xeonx1), developer of PowerAccess™ (http://PowerAccessDB.com) (https://twitter.com/PowerAccessDB) and
// @include      *youtube.com*
// @include      *mako.co.il*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36732/AutoPlay%20Disabled%20for%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/36732/AutoPlay%20Disabled%20for%20youtube.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ******** User Preferences ********
    // Whether to pause videos when leaving a tab they are playing on
    var pauseOnLeaveTab = false;

     // Number of milliseconds after clicking where a video is allowed to autoplay.
    var allowAutoPlayWithinMillisecondsOfClick = 500;

    // For websites you won't to disable this script on, you can add domains (with or without subdomain, must not include http://, etc.) to always allow auto-play (doesn't affect pause on leave tab)
    var autoPlaySitesWhitelist = [
        // "youtube.com"
    ];
    // For video hosting sources (eg. YouTube used for videos embedded on other sites), you can add domains (with or without subdomain, must not include http://, etc.) to always allow auto-play (doesn't affect pause on leave tab)
    var autoPlaySourcesWhitelist = [
        // "youtube.com"
    ];
  
    //Advanced preferences from controlling side compatibility / testing:
    //seems required for: 
    var handlePlayingInAdditionToPlayEvent = false;
    var allowPauseAgainAfterFirstFound = false;
    var treatPlayingLikeOnPlay = false;
  
    // ******** End Preferences ********

    /* Test Pages:
       https://www.youtube.com/watch?v=OMOVFvcNfvE
       http://www.imdb.com/title/tt2527336/videoplayer/vi1488632089
       https://trailers.apple.com/trailers/lucasfilm/star-wars-the-last-jedi/
       https://www.theguardian.com/film/video/2017/apr/14/star-wars-last-jedi-trailer-film-current-sequel-trilogy-video
       http://www.politico.com/video
       http://www.nfl.com/videos
       
       Known Issues:
         Have to click twice the first time to start:
             https://www.youtube.com/watch?v=OMOVFvcNfvE
             https://www.theguardian.com/film/video/2017/apr/14/star-wars-last-jedi-trailer-film-current-sequel-trilogy-video
         Clicking anywhere except Play button causes to pause (so seeking, or click on video itself to unpause)
             https://www.usatoday.com/story/life/movies/2017/04/14/star-wars-the-last-jedi-trailer-analysis/100466154/
         
       Still Auto Plays:
           http://www.cnn.com/videos  (eventually auto-plays, stops for long time first, seems to switch between a few videos)
        
         
       Test JS Snippets:
       document.querySelector("video.html5-main-video").pause()  //for pause on YouTube
       
       TODO (MAYBE):
         Allow pressing play after pressing spacebar?
         Delay YouTube pausing to avoid having to double click first time to play?
    */
  
    //TODO-MAYBE: We could add support for click anywhere on video to play/pause, but some video players may not update their play button status and therefore could be out-of-sync and many of them already support that (though not Apple Trailers, etc.)
  
    var hasAutoPlaySourcesWhitelist = autoPlaySourcesWhitelist.length > 0;
    var hasAutoPlaySitesWhitelist = autoPlaySitesWhitelist.length > 0;
    var lastClickTimeMs = 0;
  
  
    function isUrlMatch(url, pattern) {
        var regex = "https?\:\/\/[a-zA-Z0-9\.\-]*?\.?" + pattern.replace(/\./, "\.") + "\/";
        var reg = new RegExp(regex, "i");
        return url.match(reg) !== null;
    }
  
    //returns true if auto-play is always allowed for the *website* video is shown on (not source its hosted on)
    function isAutoPlayAllowedForSite(url) { // Check if video src is whitelisted.

        if (hasAutoPlaySitesWhitelist) {
            for (var i = 0; i < autoPlaySitesWhitelist.length; i++) {
                if (isUrlMatch(url, autoPlaySitesWhitelist[i]))
                  return true;
            }
        }
        return false;
    }
  
    //exit, if the page shown in tab is whitelisted (regardless of where video is hosted / embedded from)
    if (isAutoPlayAllowedForSite(document.url)) {
        return;
    }

    //determine name of event for switched away from tab, based on the browser
    var tabHiddenPropertyName, tabVisibleChangedEventName;

    if ("undefined" !== typeof document.hidden) {
        tabHiddenPropertyName = "hidden";
        tabVisibleChangedEventName = "visibilitychange";
    } else if ("undefined" !== typeof document.webkitHidden) {
        tabHiddenPropertyName = "webkitHidden";
        tabVisibleChangedEventName = "webkitvisibilitychange";
    }  else if ("undefined" !== typeof document.msHidden) {
        tabHiddenPropertyName = "msHidden";
        tabVisibleChangedEventName = "msvisibilitychange";
    }

    function safeAddHandler(element, event, handler) {
        element.removeEventListener(event, handler);
        element.addEventListener(event, handler);
    }
    function getVideos() {
        //OR: Can also add audio elements
        return document.getElementsByTagName("video");
    }

    function isPlaying(vid) {
        return !!(vid.currentTime > 0 && !vid.paused && !vid.ended && vid.readyState > 2);
    }

    function onTabVisibleChanged() {

        //console.log("Tab visibility changed for Video auto-player disabling user script. Document is hidden status: ", document[tabHiddenPropertyName]);

        var videos = getVideos();

        //if doc is hidden (switched away from that tab), then pause all its videos
        if (document[tabHiddenPropertyName]) {

            //remember had done this
            document.wasPausedOnChangeTab = true;

            //pause all videos, since
            for (var i = 0; i < videos.length; i++) {
                var vid = videos[i];
                
                pauseVideo(vid, true);
            }
        }
        //document is now the active tab
        else { 
            document.wasPausedOnChangeTab = false; //reset state (unless need to use this field or delay this)
            
            //TODO-MAYBE: if want to auto-play once switch back to a tab if had paused before, then uncomment below, after changing from forEach() to for loop
            // getVideos().forEach( function(vid) {
            //     if (vid.wasPausedOnChangeTab == true) {
            //         vid.wasPausedOnChangeTab = false;
            //         vid.play();
            //     }
            // } ); 
        }
    }

    //handle active tab change events for this document/tab
    if (pauseOnLeaveTab) {
        safeAddHandler(document, tabVisibleChangedEventName, onTabVisibleChanged);
    }
    
    
    //returns true if auto-play is always allowed for the *website* video is shown on (not source its hosted on)
    //so YouTube videos embedded onto other sites will be blocked if YouTube is blocked here
    function isAutoPlayAllowedForSource(url) { // Check if video src is whitelisted.
        //NOTE: URL can start with blob: like on YouTube
        if (hasAutoPlaySourcesWhitelist) {
            for (var i = 0; i < autoPlaySitesWhitelist.length; i++) {
                if (isUrlMatch(url, hasAutoPlaySourcesWhitelist[i]))
                  return true;
            }
        }
        return false;
    }
  
    //on pause or ended/finished, change playing state back to not-playing, so know to start preventing playback again unless after a click
    function onPaused(e)
    {
        e.target.isPlaying = false;
    }
  
    function pauseVideo(vid, isLeavingTab) {
        
        var eventName = "auto-play";
      
        if (isLeavingTab == true) //also handle undefind/unknown states
        {
            //OR: if wan't to avoid logging in some cases if not sure if playing:
            //if {vid.isPlaying != false) console.log("Paused video playback because switched away from this tab for video with source: ", vid.currentSrc); else logIt = false; 
          
            vid.wasPausedOnChangeTab = true;
          
            eventName = "on leaving tab";
            //console.log("Paused video playback because switched away from this tab for video with source: ", vid.currentSrc);
        
        }
        
        console.log("Paused video " + eventName + " from source: ", vid.currentSrc);
        
        //remember video is no longer playing -  just in case, though event handler for pause should also set this
        vid.isPlaying = false;
      
        //always pause regardless of isPlaying or isVideoPlaying() since aren't always reliable
        vid.pause();
            
    }
  
    function onPlay(e)
    {
        onPlayOrLoaded(e, true);
    }
    function onPlaying(e)
    {
        onPlayOrLoaded(e, false);
    }
    function onPlayOrLoaded(e, isPlayConfirmed) { // React when a video begins playing

        var msSinceLastClick = Date.now() - lastClickTimeMs;
        var vid = e.target;

        //exit, do nothing if is already playing (but not if undefined/unknown), in case clicked on seekbar, volume, etc. - don't toggle to paused state on each click
        if(vid.isPlaying == true) {
           //return;
        }

        //if haven't clicked recently on video, consider it auto-started, so prevent playback by pausing it (unless whitelisted source domain to always play from)
        if (msSinceLastClick > allowAutoPlayWithinMillisecondsOfClick && !isAutoPlayAllowedForSource(vid.currentSrc)) {

           pauseVideo(vid);
        } else
        {
           vid.isPlaying = isPlayConfirmed || treatPlayingLikeOnPlay;
        }
    }
  
    
    function addListenersToVideo(vid, srcChanged)
    { 
        var pauseNow = false;
        //if this is first time found this video
        if (vid.hasAutoPlayHandlers != true) {
            vid.hasAutoPlayHandlers = true;

            safeAddHandler(vid, "play", onPlay);
            //NOTE: Seems playing is needed in addition to play event, but isn't this just supposed to occur whenever play, plus after play once buffering is finished?
            if  (handlePlayingInAdditionToPlayEvent)
              safeAddHandler(vid, "playing", onPlaying);
            

            safeAddHandler(vid, "pause", onPaused);
            safeAddHandler(vid, "ended", onPaused);
            
            pauseNow = true;
        }
       //if video source URL has NOT changed and had already hooked up and paused this video before, then exit, don't pause again (in case user had clicked to play it earlier but another video injected into the page caused inspecting all videos again)
      //else if (srcChanged != true) 
      //      return; //exit, don't pause it again
      
       //pause the video since this is the first time was found OR src attribute had changed
      if (pauseNow || srcChanged == true) {
        
          pauseVideo(vid);
      
          if (allowPauseAgainAfterFirstFound) {
            vid.isPlaying = false; //allow upcoming first play event to cause pausing too this first time
          }
      }
    }
    function addListeners() {

        var videos = getVideos();
        //OR: Can get audio elements too

        for (var i = 0; i < videos.length; i++) {
            // Due to the way some sites dynamically add videos, the "playing" event is not always sufficient.
            // Also, in order to handle dynamically added videos, this function may be called on the same elements.
            // Must remove any existing instances of this event listener before adding. Prevent duplicate listeners.
            var vid = videos[i];

            addListenersToVideo(vid);
        }
    }

    //handle click event so can limit auto play until X time after a click
    safeAddHandler(document, "click", function () {
        lastClickTimeMs = Date.now();
    });

    var observer = new MutationObserver(function(mutations) {
        // Listen for elements being added. Add event listeners when video elements are added.
        mutations.forEach(function(mutation) {

            if (mutation.type == "attributes" && mutation.target.tagName == "VIDEO") { //&& mutation.attributeName == "src" 

                videoAdded = true;

                addListenersToVideo(mutation.target, true);
            }

            if (mutation.addedNodes.length > 0) {

                addListeners();

                //faster to use getElementsByTagName() for rarely added types vs. iterating over all added elements, checking tagName
                // for (var i = 0; i < mutation.addedNodes.length; i++) {
                //     var added = mutation.addedNodes[i];
                //     if (added.nodeType == 1 && added.tagName == "VIDEO") {
                //         videoAdded = true;
                //     }
                // }
            }
        });
    });

    //subscribe to documents events for node added and src attribute changed via MutatorObserver, limiting to only src attribute changes
    observer.observe(document, { attributes: true, childList: true, subtree: true, characterData: false, attributeFilter: ['src'] });

    //don't also need to handle "spfdone" event

    //hookup event handlers for all videos that exist now (will still add to any that are inserted later)
    addListeners();

})();