// ==UserScript==
// @name         Twitch videos and clips -links
// @namespace    https://wiretuts.com/
// @version      0.3
// @description  Adds videos and clips -links next to Twitch streamer name.
// @author       Raiwo @ Twitch
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/405804/Twitch%20videos%20and%20clips%20-links.user.js
// @updateURL https://update.greasyfork.org/scripts/405804/Twitch%20videos%20and%20clips%20-links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    if (MutationObserver) console.log('TwitchLinks: Initialized');
    
    let tempUrl = "";
    let currentUrl = "";
    let channelName = "";

    let observer = new MutationObserver(e => {
      currentUrl = window.location.href;
      
      https://www.twitch.tv/beddle
      
      if(currentUrl.split("/")[4] == "videos")
      {
        // Videos page
      } 
      else if(currentUrl.split("/")[3] == "videos")
      {
        // Single video page
        let href = document.querySelectorAll("[data-a-target='watch-mode-to-home']");
        
        if(href)  {
          channelName = href[0].toString().split("/")[3];

          addLinks(channelName);
        }
      } 
      else if(document.querySelector('.metadata-layout__support'))
      {
        // Streamers page
        let urlSplit = window.location.href.split("/")[3];
        let question = urlSplit.indexOf('?');
 
        if(question == -1) 
        {
          channelName = urlSplit;
          
        } 
        else 
        {
          channelName = urlSplit.split("?")[0];
        }

        addLinks(channelName);
      }
    });

    function addLinks(channelName) 
    {
      let videoLinksDiv = document.querySelector('#twitch_links_div');
      let videoHref = document.querySelector('#twitch_videos_href');
      
      let currentUrl = window.location.href;
      let divHtml = '&nbsp (<a href="https://www.twitch.tv/'+channelName+'/videos?filter=all&sort=time" id="twitch_videos_href">Videos</a> / <a href="https://www.twitch.tv/'+channelName+'/clips?filter=clips&range=24hr" id="twitch_clips_href">Clips</a>)';

      if(!videoHref || tempUrl != currentUrl) 
      {
        
        if(videoLinksDiv) 
        {
          videoLinksDiv.innerHTML = divHtml;
          document.querySelector(".metadata-layout__support > div").append(videoLinksDiv);
          
        } 
        else 
        {
          let div = document.createElement("DIV");
          div.setAttribute("id", "twitch_links_div");
          div.innerHTML = divHtml;
          document.querySelector(".metadata-layout__support > div").append(div);
        }
 
        tempUrl = currentUrl;
      }
    }

    observer.observe(document.body, {childList: true, subtree: true});
})();
