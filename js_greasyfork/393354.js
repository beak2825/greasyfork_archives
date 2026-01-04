// ==UserScript==
// @name         Plex Subtitle
// @namespace    https://gist.github.com/loveely7/00276ca659664d8692db2a5463902522
// @version      0.1
// @description  Customize Plex Subtitle Font!
// @author       loveely7
// @match        http://10.0.0.5:32400/web/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393354/Plex%20Subtitle.user.js
// @updateURL https://update.greasyfork.org/scripts/393354/Plex%20Subtitle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var config = { attributes: true, childList: true, subtree: true  };

    let PlayerView = document.querySelector(`[class^=AudioVideoPlayerView-container]`);;
    let FullPlayerContainer = document.querySelector(`[class^=Player-fullPlayerContainer]`);;
    let FullPlayerView = document.querySelector(`[class^=AudioVideoFullPlayer-fullPlayer]`);
    let SubtitleContainer = document.querySelector(`[class^=Subtitles-renderer]`);
    let libjasssubs = document.querySelector(`.libjass-subs`);
    let SubtitleLayer = document.querySelector(`.layer0`);


    let PlayerView_observer = null;
    let FullPlayerContainer_observer = null;
    let FullPlayerView_observer = null;
    let SubtitleContainer_observer = null;
    let libjasssubs_observer = null;
    let SubtitleLayer_observer = null;
    let SubtitleElement_observer = null;

    let RefreshObserver = function() {
        PlayerView = document.querySelector(`[class^=AudioVideoPlayerView-container]`);;
        FullPlayerContainer = document.querySelector(`[class^=Player-fullPlayerContainer]`);;
        FullPlayerView = document.querySelector(`[class^=AudioVideoFullPlayer-fullPlayer]`);
        SubtitleContainer = document.querySelector(`[class^=Subtitles-renderer]`);
        libjasssubs = document.querySelector(`.libjass-subs`);
        SubtitleLayer = document.querySelector(`.layer`);

        try
        {
            if (PlayerView_observer != null )
            {
                PlayerView_observer.observe(PlayerView, config);
            }

            if (FullPlayerContainer_observer != null)
            {
                FullPlayerContainer_observer.observe(FullPlayerContainer, config);
            }

            if (FullPlayerView_observer != null)
            {
                FullPlayerView_observer.observe(FullPlayerView, config);
            }

            if (SubtitleContainer_observer != null)
            {
                SubtitleContainer_observer.observe(SubtitleContainer, config);
            }

            if (libjasssubs_observer != null)
            {
                libjasssubs_observer.observe(libjasssubs, config);
            }

            if (SubtitleLayer_observer != null)
            {
                SubtitleLayer_observer.observe(SubtitleLayer, config);
            }

            document.querySelector(`.an2`).setAttribute("style", `margin-bottom: 80px;` );

            let lineheight = "60px";
            let SubtitleElements = document.querySelectorAll(`.layer div div span span`);
            SubtitleElements.forEach(ele =>
            {
                let fontSize = ele.style.fontSize
                let color = ele.style.color
                lineheight = parseInt(fontSize.substring(0, fontSize.length - 2)) + 15 + "px"
                ele.setAttribute("style", `line-height: ${lineheight}; font-family: "Arial Unicode MS"; font-size: ${fontSize}; color: ${color}; text-shadow: 0 2px black, 2px 0 black, -2px 0 black, 0 -2px black, 1.4px 1.4px black, -1.4px 1.4px black, 1.4px -1.4px black, -1.4px -1.4px black;`)
            });
            document.querySelectorAll(`.layer\div\div\span`).forEach(ele => ele.setAttribute("style", "line-height: ${lineheight};"))
            //SubtitleElements.setAttribute("style", `font-family: "Arial Unicode MS"; font-size: 55px; -webkit-text-stroke: 2px black;`);

        }
        catch (e)
        {
            console.log(e);
        }
    }

    let callback = function(mutationsList) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                RefreshObserver();
            }
        }
    };

    PlayerView_observer = new MutationObserver(callback);
    FullPlayerContainer_observer = new MutationObserver(callback);
    FullPlayerView_observer = new MutationObserver(callback);
    SubtitleContainer_observer = new MutationObserver(callback);
    libjasssubs_observer = new MutationObserver(callback);
    SubtitleLayer_observer = new MutationObserver(callback);

    try
    {
        PlayerView_observer.observe(PlayerView, config);
        FullPlayerContainer_observer.observe(FullPlayerContainer, config);
        FullPlayerView_observer.observe(FullPlayerView, config);
        SubtitleContainer_observer.observe(SubtitleContainer, config);
        libjasssubs_observer.observe(libjasssubs, config);
        SubtitleLayer_observer.observe(SubtitleLayer, config);
    }
    catch (e)
    {
        console.log(e);
    }

})();