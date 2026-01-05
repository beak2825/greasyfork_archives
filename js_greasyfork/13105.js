// ==UserScript==
// @name        Stop Automatic Recommendations on Soundcloud
// @namespace   soundcloud-no-autoplay
// @author      Veeno
// @contributor Kai Kuehner
// @contributor Technowise
// @contributor Andreas J. Schwarz
// @description Stops the automatic playing of recommended tracks on Soundcloud.
// @include     http://www.soundcloud.com/*
// @include     https://www.soundcloud.com/*
// @include     http://soundcloud.com/*
// @include     https://soundcloud.com/*
// @grant       none
// @version     2.1
// @downloadURL https://update.greasyfork.org/scripts/6988/Stop%20Automatic%20Recommendations%20on%20Soundcloud.user.js
// @updateURL https://update.greasyfork.org/scripts/6988/Stop%20Automatic%20Recommendations%20on%20Soundcloud.meta.js
// ==/UserScript==

(function(){
    var playingRecommended = false,

        trackInfoContainer = "div.playbackSoundBadge",
        trackArtistElementClass = "playbackSoundBadge__lightLink",
        trackArtistAttribute = "title",
        trackTitleElementClass = "playbackSoundBadge__titleLink",
        trackTitleAttribute = "title",

        recommendedContainer = "article.relatedSoundsModule",
        recommendedArtistElementClass = "soundTitle__usernameText",
        recommendedArtistAttribute = "innerHTML",
        recommendedTitleElementClass = "soundTitle__title",
        recommendedTitleAttribute = "title",

        buttonElement = "button.playControl";

    function isRecommendedTrack(){
        var trackArtist = trackInfoContainer.getElementsByClassName(trackArtistElementClass)[0],
            trackTitle = trackInfoContainer.getElementsByClassName(trackTitleElementClass)[0],
            recommendedArtist = recommendedContainer.getElementsByClassName(recommendedArtistElementClass)[0],
            recommendedTitle = recommendedContainer.getElementsByClassName(recommendedTitleElementClass)[0];
        
        if(trackArtist && trackTitle && recommendedArtist && recommendedTitle){
            return (
                trackArtist[trackArtistAttribute].trim().toLowerCase() === recommendedArtist[recommendedArtistAttribute].trim().toLowerCase() &&
                trackTitle[trackTitleAttribute].trim().toLowerCase() === recommendedTitle[recommendedTitleAttribute].trim().toLowerCase()
            );
        }
        
        return null;
    }

    var trackInfoObserver = new MutationObserver(function(){
        var currentIsRecommended = isRecommendedTrack();
        if(typeof currentIsRecommended === "boolean"){
            if(!playingRecommended && currentIsRecommended) buttonElement.click();
            playingRecommended = currentIsRecommended;
        }
    });

    function start(){
        var _trackInfoContainer = document.querySelector(trackInfoContainer),
            _recommendedContainer = document.querySelector(recommendedContainer),
            _buttonElement = document.querySelector(buttonElement);
        
        if(!_trackInfoContainer || !_recommendedContainer || !_buttonElement){
            setTimeout(start, 20);
            return;
        }
        
        trackInfoContainer = _trackInfoContainer;
        recommendedContainer = _recommendedContainer;
        buttonElement = _buttonElement;
        trackInfoObserver.observe(trackInfoContainer, {childList: true, subtree: true});
    }

    start();
})();