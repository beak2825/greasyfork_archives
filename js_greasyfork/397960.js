// ==UserScript==
// @name         Discogs/Release/YoutubeSearch
// @namespace    https://greasyfork.org/en/scripts/397960
// @version      0.3
// @description  if no yt present, search for possibilities
// @author       denlekke
// @match        http*://www.discogs.com/*release/*
// @match        http*://www.discogs.com/*master/*
// @exclude      http*://www.discogs.com/*/stats/*
// @exclude      http*://www.discogs.com/sell/release/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397960/DiscogsReleaseYoutubeSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/397960/DiscogsReleaseYoutubeSearch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var youtubePresent = false;
    var youtubeFrame = document.getElementById('youtube_player_wrapper');
    if(youtubeFrame == null){
        //there is no youtube, frame, replace it

        //get release album name
        var pTitle=document.getElementById('profile_title');
        var albumNodes = pTitle.childNodes;
        var album=albumNodes[albumNodes.length-1].textContent.trim();
        if(album===""){
            album=albumNodes[albumNodes.length-2].textContent.trim();
        }
        album = album.replace('/','""');

        var span=pTitle.getElementsByTagName('a')[0].parentNode;
        var artist=span.getAttribute('title').replace(/\(.*\)/g, '');


        //construct the new youtube section
        var videoDiv = document.getElementById('video');
        var youtubeClassSection = document.createElement('div');
        youtubeClassSection.class="section_content toggle_section_content";
        var youtubePlayerWrapper = document.createElement('div');
        youtubePlayerWrapper.id = 'youtube_player_wrapper';
        var youtubeIframe = document.createElement('iframe');
        //youtubeIframe.id = 'youtube_player_placeholder';
        youtubeIframe.setAttribute('id', 'youtube_player_placeholder');
        youtubeIframe.style = '100%; 330px;';
        youtubeIframe.width = '100%';
        youtubeIframe.height = '100%';
        youtubeIframe.src = 'https://www.youtube.com/embed?listType=search&list='+'%22'+encodeURIComponent(artist.trim())+'%22'+'%22'+encodeURIComponent(album.trim())+'%22';

        //on iframe load, show the playlist menu
        //requires cross domain permissions
        /*
        youtubeIframe.addEventListener("load", ev => {
            var iframeDocument = document.getElementById('youtube_player_placeholder');
            console.log("iframedoc"+iframeDocument);
            iframeDocument = iframeDocument.contentWindow;
            console.log("iframedoc"+iframeDocument);
            //var playlistClass = document.querySelector('[aria-label="YouTube Video Player"]');
            //console.log(playlistClass);
            //playlistClass.className = playlistClass.className+' ytp-menu-shown';
            //console.log("class"+playlistClass.className);
        })
*/

        youtubePlayerWrapper.appendChild(youtubeIframe);
        youtubeClassSection.appendChild(youtubePlayerWrapper)
        videoDiv.appendChild(youtubeClassSection);
    }
    else{
        //there is a youtube frame, do nothing
        console.log("yt present");
    }

})();